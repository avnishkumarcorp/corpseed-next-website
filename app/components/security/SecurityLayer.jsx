"use client";

import { useEffect } from "react";

const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

/** True when the event originated inside something the user is meant to type in. */
function isEditableTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest(EDITABLE));
}

export default function SecurityLayer() {
  useEffect(() => {
    // Content protection stays, but it must never reach form fields —
    // otherwise users cannot select, copy or paste inside their own
    // enquiry, search and subscribe inputs.
    const block = (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("selectstart", block);

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("selectstart", block);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
