"use client";

import { useEffect, useRef } from "react";
import SafeHtmlShadow from "./SafeHtmlShadow";

export default function TocClient({ html, headerOffset = 90 }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const handler = (e) => {
      const a = e.target.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      // We handle any link that has a hash, even absolute URLs
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      // ✅ stop navigation no matter what
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();

      const hash = href.slice(hashIndex + 1);
      const id = decodeURIComponent(hash.replace(/\+/g, " ")).trim();
      if (!id) return;

      const el = document.getElementById(id);
      if (!el) return;

      const top =
        el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });
    };

    // ✅ capture phase ensures we catch before browser navigation
    root.addEventListener("click", handler, { capture: true });

    return () => {
      root.removeEventListener("click", handler, { capture: true });
    };
  }, [headerOffset]);

  return (
    <div ref={ref} className="prose prose-slate prose-sm max-w-none">
      <SafeHtmlShadow html={html} />
    </div>
  );
}
