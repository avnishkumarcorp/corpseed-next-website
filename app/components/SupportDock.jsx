"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Audit #5 + #17 — a persistent, compact consultation route that stays out
 * of the way. Collapsed to a single pill by default; expands on click into
 * call / WhatsApp / callback. Desktop only: mobile already has its own
 * sticky action bar, and stacking both would cover content.
 */
export default function SupportDock({
  phone = "917558640644",
  message = "Hi Corpseed, I would like to discuss a compliance requirement.",
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Defer past first paint so the dock never competes with the hero.
    const t = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] hidden md:block print:hidden">
      {open ? (
        <div
          role="dialog"
          aria-label="Contact Corpseed"
          className="mb-3 w-[290px] origin-bottom-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_60px_-24px_rgba(15,23,42,0.45)]"
          style={{ animation: "csFadeUp .22s cubic-bezier(.22,1,.36,1)" }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">
                Talk to an expert
              </p>
              <p className="mt-0.5 text-[12.5px] text-slate-500">
                Mon–Sat, 9am–6pm IST
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close contact options"
              className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2 p-3">
            <DockAction
              href={`tel:+${phone}`}
              label="Call now"
              sub={`+${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`}
              tone="blue"
              icon={
                <path
                  d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1l-2.2 2.2Z"
                  fill="currentColor"
                />
              }
            />

            <DockAction
              href={waUrl}
              external
              label="WhatsApp"
              sub="Usually replies in minutes"
              tone="green"
              icon={
                <path
                  d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1a12 12 0 0 1-5.9-5.1c-.6-.9-1-2-1-3 0-.9.4-1.3.7-1.6.2-.2.4-.2.6-.2h.5c.2 0 .4 0 .6.4l.8 2c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.9 1.1 1.6 1.9 2.2.4.3.6.2.8 0l.7-.8c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.5 0 .8Z"
                  fill="currentColor"
                />
              }
            />

            <DockAction
              href="/book-meeting"
              label="Book a meeting"
              sub="Pick a 30-minute slot"
              tone="slate"
              icon={
                <>
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="15"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3.5 9.5h17M8 3.5v3M16 3.5v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </>
              }
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Hide contact options" : "Talk to an expert"}
        className={[
          "ml-auto flex items-center gap-2.5 rounded-full bg-blue-600 py-3 pl-4 pr-5 text-white",
          "shadow-[0_18px_40px_-16px_rgba(37,99,235,0.85)] transition duration-200",
          "hover:bg-blue-700 hover:shadow-[0_22px_48px_-16px_rgba(29,78,216,0.9)]",
        ].join(" ")}
      >
        <span className="flex h-6 w-6 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1l-2.2 2.2Z"
                fill="currentColor"
              />
            )}
          </svg>
        </span>

        <span className="text-[14px] font-semibold">
          {open ? "Close" : "Talk to an expert"}
        </span>
      </button>
    </div>
  );
}

const TONES = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-100 text-slate-700",
};

function DockAction({ href, external, label, sub, icon, tone }) {
  // Internal routes must go through <Link>, or the click triggers a full page
  // reload — the browser tears down the app and re-downloads everything.
  // tel:/https: targets stay plain anchors.
  const isRoute = !external && href.startsWith("/");
  const Tag = isRoute ? Link : "a";

  return (
    <Tag
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {icon}
        </svg>
      </span>

      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-slate-900">
          {label}
        </span>
        <span className="block text-[12.5px] text-slate-500">{sub}</span>
      </span>
    </Tag>
  );
}
