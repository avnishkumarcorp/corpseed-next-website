"use client";

import { useRef, useState } from "react";
import { PlayCircle, X, Maximize } from "lucide-react";

export default function VideoPopup({
  videoUrl,
  videoText = "Watch Video",
}) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  const openModal = () => setOpen(true);

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setOpen(false);
  };

  const openFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  return (
    <>
      {/* Trigger Button */}
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
          
          {/* Modal Card */}
          <div className="relative w-[90%] max-w-3xl rounded-xl bg-black p-3">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={openFullscreen}
              className="absolute right-14 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black cursor-pointer"
            >
              <Maximize size={18} />
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              className="h-[250px] w-full rounded-lg sm:h-[350px] md:h-[450px] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
