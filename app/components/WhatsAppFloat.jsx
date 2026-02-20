"use client";

import { useEffect, useMemo, useState } from "react";

export default function WhatsAppFloat({
  phone = "917558640644",
  message = "Welcome to Corpseed. Please type your query, and we shall provide immediate assistance.",
  showDelayMs = 600,
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), showDelayMs);
    return () => clearTimeout(t);
  }, [showDelayMs]);

  const waUrl = useMemo(() => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [phone, message]);

  if (!mounted) return null;

  return (
    /* ✅ Desktop only */
    <div className="hidden md:flex fixed bottom-6 right-6 z-[9999]">
      <div className="relative flex items-center gap-4">
        {/* Popup */}
        {open && (
          <div className="group relative">
            <div
              className="
                relative w-[320px]
                rounded-2xl bg-white px-5 py-4
                text-sm text-gray-700 leading-relaxed
                border border-gray-100
                shadow-[0_20px_50px_rgba(0,0,0,0.22)]
              "
            >
              {message}

              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="
                  absolute -left-3 top-1/2 -translate-y-1/2
                  h-6 w-6 rounded-full bg-gray-500 text-white
                  flex items-center justify-center
                  text-sm font-bold
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  hover:bg-gray-700 cursor-pointer
                  shadow-md
                "
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          // className="
          //   h-16 w-16 rounded-full bg-[#25D366]
          //   flex items-center justify-center
          //   shadow-[0_18px_45px_rgba(37,211,102,0.55)]
          //   hover:scale-105 active:scale-95
          //   transition-transform cursor-pointer
          // "
        >
          {/* ✅ Correct WhatsApp Icon */}
          <svg width="50" viewBox="0 0 24 24">
            <defs />
            <path
              fill="#eceff1"
              d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z"
            />
            <path
              fill="#4caf50"
              d="M12 21.8c-3.1 0-5.2-1.6-5.4-1.6l-3.7 1 1-3.7-.3-.4A9.9 9.9 0 012.1 12a10 10 0 0117-7 9.9 9.9 0 01-7 16.9z"
            />
            <path
              fill="#fafafa"
              d="M17.5 14.3c-.3 0-1.8-.8-2-.9-.7-.2-.5 0-1.7 1.3-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5a9 9 0 01-1.7-2c-.3-.6.4-.6 1-1.7l-.1-.5-1-2.2c-.2-.6-.4-.5-.6-.5-.6 0-1 0-1.4.3-1.6 1.8-1.2 3.6.2 5.6 2.7 3.5 4.2 4.2 6.8 5 .7.3 1.4.3 1.9.2.6 0 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
