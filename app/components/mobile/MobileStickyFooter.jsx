"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import EnquiryDrawer from "./EnquiryDrawer";

export default function MobileStickyFooter() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const phoneNumber = "919311255283";

  const callNumber = "917558640644";

  const handleCall = () => {
    window.location.href = `tel:+${callNumber}`;
  };

  const handleWhatsApp = () => {
    const slug =
      pathname === "/"
        ? ""
        : pathname.split("/").pop()?.replaceAll("-", " ")?.toUpperCase();

    const msg = slug
      ? `Hi Corpseed, I am looking for ${slug}. I want to know more about it.`
      : "Hi Corpseed, I want to know about Corpseed and its services.";

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <>
      {/* footer (hide while drawer open, optional) */}

      {/* Audit #19 — full-width labelled targets instead of bare icons, so
          the primary actions are both obvious and easy to hit one-handed. */}
      <nav
        aria-label="Quick contact"
        className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden print:hidden"
      >
        <div className="border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.5)] backdrop-blur">
          <div className="grid grid-cols-3">
            <StickyAction
              onClick={handleCall}
              label="Call"
              tint="text-blue-700"
              icon={
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 1C10.07 22 2 13.93 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
              }
            />

            <StickyAction
              onClick={handleWhatsApp}
              label="WhatsApp"
              tint="text-[#128C43]"
              icon={
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1a12 12 0 0 1-5.9-5.1c-.6-.9-1-2-1-3 0-.9.4-1.3.7-1.6.2-.2.4-.2.6-.2h.5c.2 0 .4 0 .6.4l.8 2c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.9 1.1 1.6 1.9 2.2.4.3.6.2.8 0l.7-.8c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.5 0 .8Z" />
              }
            />

            <StickyAction
              onClick={() => setOpen(true)}
              label="Enquire"
              tint="text-blue-700"
              icon={
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H9l-5 4V5.5Zm4 3.5h8v1.6H8V9Zm0 3.4h5V14H8v-1.6Z" />
              }
            />
          </div>
        </div>
      </nav>

      {/* ✅ Always mounted drawer */}
      <EnquiryDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function StickyAction({ onClick, label, icon, tint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 transition active:bg-slate-100"
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={tint}
      >
        {icon}
      </svg>
      <span className="text-[11.5px] font-semibold text-slate-700">{label}</span>
    </button>
  );
}
