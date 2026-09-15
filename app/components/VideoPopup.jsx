"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export default function VideoPopup({
  videoUrl,
  videoText = "Watch Video",
  isService = false,
}) {
  const [open, setOpen] = useState(false);

  const isYoutube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const urlObj = new URL(url);

      if (url.includes("/embed/")) return url;

      if (url.includes("youtu.be")) {
        const id = urlObj.pathname.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
      }

      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = isYoutube ? getYoutubeEmbedUrl(videoUrl) : videoUrl;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isService
            ? "inline-flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer"
            : "inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 cursor-pointer"
        }
      >
        <PlayCircle className="h-5 w-5 text-blue-600" />
        {videoText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl rounded-xl bg-black p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X size={18} />
            </button>

            {isYoutube ? (
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-[250px] w-full rounded-lg sm:h-[350px] md:h-[450px]"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="h-[250px] w-full rounded-lg object-contain sm:h-[350px] md:h-[450px]"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
