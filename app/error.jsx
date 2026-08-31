"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Home, RotateCw } from "lucide-react";

/**
 * Route-level error boundary.
 *
 * Without this file, an unhandled failure in a server component (a 500 from
 * the API, a network drop) surfaced as a blank or half-rendered page in
 * production. Now it renders a branded page and, importantly, still responds
 * with a 5xx status so crawlers treat the failure as temporary.
 *
 * This is deliberately NOT the 404 page: a 404 tells Google the URL is gone
 * and is a fast route to losing the page from the index. Genuinely missing
 * records call notFound() instead, which is the correct 404.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Keeps the real cause in the server/browser log for debugging without
    // putting anything technical in front of a customer.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-blue-100 opacity-50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-100 opacity-50 blur-3xl"
      />

      <div className="relative z-10 max-w-xl text-center">
        <span className="cs-badge cs-badge--brand">Temporary problem</span>

        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] font-bold tracking-tight text-slate-900">
          This page didn&apos;t load
        </h1>

        <p className="mt-4 leading-relaxed text-slate-600">
          Something on our side failed to respond. Nothing is wrong with your
          request — please try again in a moment.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="cs-btn cs-btn--primary cs-btn--lg"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>

          <Link href="/" className="cs-btn cs-btn--secondary cs-btn--lg">
            <Home className="h-4 w-4" />
            Go to homepage
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-[14px] text-slate-600">
          <p>
            Need this urgently? Call{" "}
            <a
              href="tel:+917558640644"
              className="font-semibold text-blue-700 hover:underline"
            >
              +91 75586 40644
            </a>{" "}
            or{" "}
            <Link
              href="/contact-us"
              className="font-semibold text-blue-700 hover:underline"
            >
              contact us
            </Link>
            .
          </p>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
