"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export default function VideoPopup({ videoUrl, videoText = "Watch Video" }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  // 🔹 Detect YouTube
  const isYoutube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  // 🔹 Convert to embed format
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const urlObj = new URL(url);

      // Already embed URL
      if (url.includes("/embed/")) {
        return url;
      }

      // Short URL (youtu.be)
      if (url.includes("youtu.be")) {
        const id = urlObj.pathname.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
      }

      // Standard watch URL
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
      {/* Trigger */}
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <PlayCircle className="h-5 w-5 text-blue-600" />
        {videoText}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl rounded-xl bg-black p-3">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X size={18} />
            </button>

            {/* 🔹 YouTube iframe OR MP4 video */}
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
                className="h-[250px] w-full rounded-lg sm:h-[350px] md:h-[450px] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
