"use client";

import { useEffect, useRef } from "react";
import SafeHtmlShadow from "./SafeHtmlShadow";

export default function BlogContentClient({ html }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const raw = hash.slice(1); // remove #
    const decoded = decodeURIComponent(raw).trim();

    if (!decoded) return;

    const headerOffset = 90;

    const tryScroll = () => {
      if (!hostRef.current) return false;

      const shadow = hostRef.current.shadowRoot;
      if (!shadow) return false;

      const el = shadow.querySelector(`[id="${CSS.escape(decoded)}"]`);

      if (!el) return false;

      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });

      return true;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (tryScroll() || attempts > 50) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [html]);

  return <SafeHtmlShadow ref={hostRef} html={html} />;
}
