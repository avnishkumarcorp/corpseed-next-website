"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const PDF_URL =
  "https://erp-corpseed.s3.ap-south-1.amazonaws.com/1771321684648Corpseed_guide.pdf";

/* ---------------- Small SVG Icons (no dependency) ---------------- */

function IconPdf({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4a1 1 0 0 0 1 1h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 13h2.2c1.1 0 1.8.7 1.8 1.7S11.3 16.4 10.2 16.4H8V13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13 16.4V13h1.9c1.2 0 2.1.8 2.1 1.7s-.9 1.7-2.1 1.7H13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShare({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M16 8a3 3 0 1 0-2.82-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 13l8-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 21a3 3 0 1 0-2.82-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 11l8 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconFacebook({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.8-.1-1.8-.3-3-.3-2.9 0-4.9 1.8-4.9 5V11H6.2v3h2.6v8h4.7Z" />
    </svg>
  );
}

function IconWhatsapp({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 22a9.7 9.7 0 0 1-5-1.4L3 21l1.4-3.8A9.8 9.8 0 1 1 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.6c.2-.4.4-.4.6-.4h.6c.2 0 .4 0 .5.3l.8 1.8c.1.2.1.4 0 .6l-.5.6c-.2.2-.1.5 0 .7.6 1.2 1.6 2.1 2.8 2.8.2.1.5.1.7 0l.6-.5c.2-.1.4-.1.6 0l1.8.8c.3.1.3.3.3.5v.6c0 .2 0 .4-.4.6-.5.3-1.5.6-2 .6-1.2 0-4.3-1.6-6.1-3.4-1.8-1.8-3.4-4.9-3.4-6.1 0-.5.3-1.5.6-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLinkedin({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 23.6h4.2V7.8H.4v15.8ZM8.1 7.8h4V10c.6-1.1 2.1-2.5 4.4-2.5 4.7 0 5.6 3.1 5.6 7.1v9h-4.2v-8c0-1.9 0-4.2-2.6-4.2-2.6 0-3 2-3 4.1v8.1H8.1V7.8Z" />
    </svg>
  );
}

function IconEmail({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m4 8 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCopy({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 9h10v12H9V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Backdrop Modal ---------------- */



function BackdropModal({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  // Mount guard for portal (avoids SSR hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <p className="text-[15px] font-semibold text-slate-900">{title}</p>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
              type="button"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}


/* ---------------- Main Component ---------------- */

export default function PdfShareBar({
  pdfUrl = PDF_URL,
  label = "Download guide",
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.setAttribute("download", "Corpseed_guide.pdf");
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback
      const t = document.createElement("textarea");
      t.value = pageUrl;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      pageUrl,
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(pageUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      pageUrl,
    )}`,
    email: `mailto:?subject=${encodeURIComponent(
      "Check this page",
    )}&body=${encodeURIComponent(pageUrl)}`,
  };

  return (
    <>
      {/* compact action row (2 icons) */}
      <div className="flex items-center gap-2">
        {/* PDF */}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 cursor-pointer"
          type="button"
          aria-label="Download PDF"
        >
          <span className="text-red-600">
            <IconPdf />
          </span>
          <span className="hidden sm:inline">{label}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 cursor-pointer"
          type="button"
          aria-label="Share"
        >
          <span className="text-blue-600">
            <IconShare />
          </span>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Center Share Modal */}
      <BackdropModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share this page"
      >
        <div className="space-y-2">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-slate-800">
              <IconFacebook />
            </span>
            Facebook
          </a>

          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-green-600">
              <IconWhatsapp />
            </span>
            WhatsApp
          </a>

          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-slate-800">
              <IconLinkedin />
            </span>
            LinkedIn
          </a>

          <a
            href={shareLinks.email}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-slate-800">
              <IconEmail />
            </span>
            Email
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-slate-800">
              <IconCopy />
            </span>
            {copied ? (
              <span className="font-semibold text-green-600">Copied!</span>
            ) : (
              "Copy Link"
            )}
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </BackdropModal>
    </>
  );
}
