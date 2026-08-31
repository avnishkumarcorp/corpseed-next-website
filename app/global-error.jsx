"use client";

/* eslint-disable @next/next/no-html-link-for-pages --
   The root layout has failed by the time this renders, so the client router
   cannot be relied on. A plain anchor (full document load) is the only
   dependable way out of here; <Link> would be the wrong call. */

import { useEffect } from "react";

/**
 * Last-resort boundary for failures in the root layout itself (header, footer,
 * fonts, providers). error.jsx cannot catch those because it renders *inside*
 * the layout, so without this file such a failure shows the browser's own
 * error screen.
 *
 * It must render its own <html>/<body>: at this point the layout is gone.
 * Styles are inline for the same reason — the stylesheet may be what failed.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: "34rem", textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Corpseed is temporarily unavailable
          </h1>

          <p
            style={{
              marginTop: "0.875rem",
              lineHeight: 1.7,
              color: "#475569",
            }}
          >
            We hit an unexpected problem loading the site. Please try again in a
            moment.
          </p>

          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                minHeight: 44,
                padding: "0 1.5rem",
                border: 0,
                borderRadius: 12,
                background: "#2563eb",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>

            <a
              href="/"
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 1.5rem",
                border: "1px solid #cbd5e1",
                borderRadius: 12,
                background: "#fff",
                color: "#0f172a",
                fontSize: "0.9375rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go to homepage
            </a>
          </div>

          <p style={{ marginTop: "1.75rem", fontSize: "0.875rem", color: "#64748b" }}>
            Urgent? Call{" "}
            <a href="tel:+917558640644" style={{ color: "#1d4ed8", fontWeight: 600 }}>
              +91 75586 40644
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
