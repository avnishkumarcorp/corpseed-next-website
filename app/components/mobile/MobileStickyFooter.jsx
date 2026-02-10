"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Phone, Info } from "lucide-react";
import EnquiryDrawer from "./EnquiryDrawer";

export default function MobileStickyFooter() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const phoneNumber = "917558640644";

  const handleCall = () => {
    window.location.href = `tel:+${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    const slug =
      pathname === "/"
        ? ""
        : pathname
            .split("/")
            .pop()
            ?.replaceAll("-", " ")
            ?.toUpperCase();

    const msg = slug
      ? `Hi Corpseed, I am looking for ${slug}. I want to know more about it.`
      : "Hi Corpseed, I want to know about Corpseed and its services.";

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* footer (hide while drawer open, optional) */}

        <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden">
          <div className="border-t border-slate-300 bg-white/95 backdrop-blur-md">
            <div className="grid grid-cols-3 items-center py-2">
              <button
                onClick={handleCall}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow"
                style={{ cursor: "pointer" }}
              >
                <Phone size={20} />
              </button>

              <button
                onClick={handleWhatsApp}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow"
                style={{ cursor: "pointer" }}
              >
                <WhatsAppIcon size={22} className="text-white" />
              </button>

              <button
                onClick={() => setOpen(true)}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow"
                style={{ cursor: "pointer" }}
              >
                <Info size={20} />
              </button>
            </div>
          </div>
        </div>

      {/* ✅ Always mounted drawer */}
      <EnquiryDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}



export function WhatsAppIcon({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M19.11 17.6c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.38-.78-1.89-.2-.48-.4-.41-.57-.42-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.69.32-.23.25-.9.88-.9 2.14 0 1.25.92 2.46 1.05 2.63.13.17 1.8 2.74 4.36 3.85.61.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.21.21-.6.21-1.12.15-1.21-.06-.1-.23-.16-.48-.29Z"
      />
      <path
        fill="currentColor"
        d="M16.02 3.2C9.26 3.2 3.78 8.68 3.78 15.44c0 2.14.56 4.22 1.62 6.05L3.2 28.8l7.49-1.97c1.77.97 3.77 1.48 5.83 1.48h.01c6.76 0 12.24-5.48 12.24-12.24S22.78 3.2 16.02 3.2Zm0 22.02h-.01c-1.87 0-3.7-.52-5.29-1.5l-.38-.23-4.45 1.17 1.19-4.34-.25-.4a9.95 9.95 0 0 1-1.53-5.28c0-5.52 4.49-10 10.02-10a9.95 9.95 0 0 1 7.08 2.93 9.95 9.95 0 0 1 2.94 7.08c0 5.53-4.49 10-10.02 10Z"
      />
    </svg>
  );
}