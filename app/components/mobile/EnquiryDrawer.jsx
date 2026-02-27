"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import EnquiryForm from "../enquiry-form/EnquiryForm";

export default function EnquiryDrawer({ open, onClose }) {
  // ✅ hard boolean
  const isOpenProp = open === true || open === 1;

  // ✅ mount/unmount
  const [mounted, setMounted] = useState(false);

  // ✅ internal class toggle (to avoid sudden open)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpenProp) {
      setMounted(true);

      // ✅ ensure first paint happens in "closed" state, then animate to open
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpenProp]);

  // lock scroll only when open
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // ESC close
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, onClose]);

  if (!mounted) return null;

  return (
    <div className={`antdDrawerRoot ${visible ? "isOpen" : ""}`}>
      <div className="antdDrawerMask" onClick={onClose} />

      <div className="antdDrawerWrap">
        <div
          className="antdDrawerPanelFit"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="antdDrawerHeaderFit">
            <h3 className="antdDrawerTitle">Schedule a Call Back</h3>

            <button
              onClick={onClose}
              className="antdDrawerCloseBtn"
              style={{ cursor: "pointer" }}
              aria-label="Close"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <div className="antdDrawerBodyFit">
            <EnquiryForm page={"www.corpseed.com"} type={"global"} />
          </div>
        </div>
      </div>
    </div>
  );
}
