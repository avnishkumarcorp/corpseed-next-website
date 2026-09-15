"use client";

import { useEffect } from "react";

export default function SecurityLayer() {
  useEffect(() => {
    const block = (e) => e.preventDefault();

    // disable right click
    document.addEventListener("contextmenu", block);

    // disable copy / cut
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("selectstart", block);

    // disable inspect shortcuts
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
