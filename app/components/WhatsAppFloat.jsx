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
          className="
            h-16 w-16 rounded-full bg-[#25D366]
            flex items-center justify-center
            shadow-[0_18px_45px_rgba(37,211,102,0.55)]
            hover:scale-105 active:scale-95
            transition-transform cursor-pointer
          "
        >
          {/* ✅ Correct WhatsApp Icon */}
          <svg
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="white"
          >
            <path d="M12.04 2C6.58 2 2.15 6.42 2.15 11.89c0 1.94.56 3.84 1.63 5.48L2 22l4.78-1.73a9.8 9.8 0 0 0 5.26 1.53h.01c5.46 0 9.9-4.42 9.9-9.89C21.95 6.42 17.5 2 12.04 2zm5.63 13.86c-.24.68-1.4 1.33-1.95 1.41-.52.08-1.18.11-1.9-.12-.44-.14-1.01-.33-1.75-.65-3.07-1.32-5.08-4.41-5.24-4.63-.16-.22-1.25-1.67-1.25-3.19 0-1.52.8-2.27 1.09-2.58.29-.31.63-.39.84-.39h.6c.19 0 .45-.07.7.54.24.61.82 2.1.89 2.26.07.16.12.35.02.57-.1.22-.15.35-.3.54-.15.19-.32.42-.46.56-.15.15-.3.31-.13.61.17.31.75 1.23 1.61 1.99 1.1.98 2.03 1.28 2.34 1.42.31.14.49.12.67-.07.19-.19.77-.89.97-1.2.2-.31.41-.25.68-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.12.07.7-.17 1.38z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
