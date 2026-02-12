"use client";
import { useState, useRef, useEffect } from "react";
import {
  Share2,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";

export default function SocialRail({ pageUrl, title }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: pageUrl,
        });
      } catch (err) {
        console.error("Share cancelled:", err);
      }
    } else {
      setOpen((prev) => !prev);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(pageUrl);
    alert("Link copied to clipboard!");
    setOpen(false);
  };

  return (
    <div className="hidden lg:block">
      <div className="sticky top-28">
        <div className="flex flex-col items-center gap-3 relative" ref={dropdownRef}>

          {/* SHARE BUTTON */}
          <button
            onClick={handleNativeShare}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
            title="Share"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>

          {/* Custom Dropdown (fallback + desktop enhancement) */}
          {open && (
            <div className="absolute left-14 top-0 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-3 space-y-2 z-50">

              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + " " + pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Telegram
              </a>

              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                X (Twitter)
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Facebook
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                LinkedIn
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(pageUrl)}`}
                className="block text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Email
              </a>

              <button
                onClick={copyToClipboard}
                className="block w-full text-left text-sm rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                Copy Link
              </button>
            </div>
          )}

          <div className="h-px w-8 bg-slate-200" />

          {/* Direct Icons (optional – keep if you want always visible) */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Facebook className="h-5 w-5" />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Linkedin className="h-5 w-5" />
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(pageUrl)}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Mail className="h-5 w-5" />
          </a>

        </div>
      </div>
    </div>
  );
}
