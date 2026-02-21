"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import EnquiryDrawer from "./EnquiryDrawer";

export default function MobileStickyFooter() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const phoneNumber = "919311255283";

  const handleCall = () => {
    window.location.href = `tel:+${phoneNumber}`;
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

      <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden">
        <div className="border-t border-slate-200 bg-white">
          <div className="grid grid-cols-3 items-center">
            {/* CALL */}
            <button onClick={handleCall} className="flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 transition active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 1C10.07 22 2 13.93 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
                </svg>
              </div>
            </button>

            {/* WHATSAPP (CENTERED & CLEAN) */}
            <button
              onClick={handleWhatsApp}
              className="flex justify-center mobile-contact"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] transition active:scale-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-whatsapp"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                </svg>
              </div>
            </button>

            {/* INFO */}
            <button
              onClick={() => setOpen(true)}
              className="flex justify-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 transition active:scale-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  id="Info"
                  height="18"
                  width="18"
                >
                  <path
                    d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
                    fill="#ffffff"
                    className="color000000 svgShape"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Always mounted drawer */}
      <EnquiryDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

