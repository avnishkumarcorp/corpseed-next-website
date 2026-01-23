"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function SafeHtmlShadow({ html }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const clean = DOMPurify.sanitize(html || "", {
      USE_PROFILES: { html: true },
    });

    const shadowRoot =
      hostRef.current.shadowRoot ||
      hostRef.current.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
      <style>
        @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css");
      </style>
      <div class="bootstrap-scope">
        ${clean}
      </div>
    `;
  }, [html]);

  return <div ref={hostRef} />;
}
