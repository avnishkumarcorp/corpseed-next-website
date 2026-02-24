"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { normalizeGroups, useDebouncedValue } from "./helpers";

/** ✅ Google-like Voice Popup */
function VoicePopup({ open, listening, interim, error, onClose, popupRef }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 px-2">
        <div
          ref={popupRef}
          onMouseDown={(e) => e.stopPropagation()} // ✅ important
          onClick={(e) => e.stopPropagation()} // ✅ important
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {listening ? "Listening…" : "Voice search"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Speak now. It will stop automatically after 8 seconds of
                silence.
              </p>
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Close voice search"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : interim ? (
              <p className="text-sm text-slate-900">{interim}</p>
            ) : (
              <p className="text-sm text-slate-500">
                {listening ? "Say something…" : "Starting…"}
              </p>
            )}
          </div>

          {/* NOTE: If you want mic clickable INSIDE popup, make it a button */}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * ✅ Voice engine that works across browsers:
 * 1) Try WebSpeech SpeechRecognition (Safari + some Chrome desktops)
 * 2) Fallback: MediaRecorder + /api/speech-to-text (Android Chrome reliable)
 * Auto-stop if no speech for 8s + always stop when popup closes.
 */
function useVoiceSearch({ onText, lang = "en-IN" }) {
  const recognitionRef = useRef(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [interim, setInterim] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setError("");
      setInterim("");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (e) => {
      setListening(false);

      const msg =
        e.error === "not-allowed"
          ? "Microphone permission denied."
          : e.error === "no-speech"
          ? "No speech detected."
          : "Voice search failed.";

      setError(msg);
    };

    recognition.onresult = (event) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }

      setInterim(interimText);

      if (finalText.trim()) {
        onText?.(finalText.trim());
        recognition.stop();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [lang, onText]);

  const start = () => {
    if (!recognitionRef.current) return;

    setError("");

    try {
      recognitionRef.current.start();
    } catch {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.start();
      } catch {}
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { supported, listening, error, interim, start, stop };
}

export default function SearchPanel({ open, onClose, topOffset = 72 }) {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [err, setErr] = useState("");

  const abortRef = useRef(null);
  const panelRef = useRef(null);
  const popupRef = useRef(null);

  const [mounted, setMounted] = useState(false);

  // ✅ voice popup state
  const [voiceOpen, setVoiceOpen] = useState(false);

  const voice = useVoiceSearch({
    silenceMs: 8000,
    onText: (text) => {
      setQ(text); // fill search input
      setVoiceOpen(false);
    },
  });

  useEffect(() => setMounted(true), []);

  // Close on ESC + outside click
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();

    const onMouse = (e) => {
      // ✅ if voice popup is open and click is inside popup -> DON'T close panel
      if (voiceOpen && popupRef.current?.contains(e.target)) return;

      // ✅ normal outside click close for panel
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouse, true); // ✅ capture helps
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouse, true);
    };
  }, [open, onClose, voiceOpen]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQ("");
      setApiData(null);
      setErr("");
      setLoading(false);
      abortRef.current?.abort?.();
      // ✅ stop voice + close popup
      setVoiceOpen(false);
      voice.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const closeVoicePopup = () => {
    setVoiceOpen(false);
    voice.stop(); // ✅ ALWAYS stop when popup closes
  };

  const openVoicePopupAndStart = async () => {
    voice.setError?.("");
    setVoiceOpen(true);
    await voice.start();
  };

  // Fetch on query
  useEffect(() => {
    if (!open) return;

    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      return;
    }

    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `/api/search/service-industry-blog/${encodeURIComponent(
          query,
        )}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const json = await res.json();
        setApiData(json);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setErr("Something went wrong while searching. Please try again.");
        setApiData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [dq, open]);

  const groups = useMemo(() => normalizeGroups(apiData), [apiData]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={[
        "fixed left-0 right-0 z-[9999]",
        "origin-top transition-all duration-200 ease-out",
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
      ].join(" ")}
      style={{ top: topOffset }}
    >
      {/* ✅ Voice Popup */}
      <VoicePopup
        open={voiceOpen}
        listening={voice.listening}
        interim={voice.interim}
        error={voice.error}
        onClose={closeVoicePopup}
        popupRef={popupRef}
      />

      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div
          ref={panelRef}
          className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

          <div className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search services, knowledge, updates… (e.g., IMEI, EPR, BIS)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm
                             outline-none transition
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {/* 🎤 MIC BUTTON -> opens popup */}
                <button
                  type="button"
                  onClick={() => {
                    if (voiceOpen) closeVoicePopup();
                    else openVoicePopupAndStart();
                  }}
                  disabled={!voice.supported}
                  title={
                    !voice.supported
                      ? "Voice search not supported"
                      : "Search by voice"
                  }
                  aria-label="Search by voice"
                  className={[
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                    "border border-slate-200 bg-white text-slate-700 shadow-sm",
                    "hover:bg-slate-50 cursor-pointer",
                    voiceOpen ? "ring-2 ring-blue-300" : "",
                    !voice.supported ? "opacity-40 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 11a7 7 0 0 1-14 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 18v3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
                             text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold
                             text-white hover:bg-blue-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* status line */}
            <div className="mt-2 text-xs text-slate-600">
              {voice.error ? (
                <span className="text-red-600">{voice.error}</span>
              ) : voiceOpen && voice.listening ? (
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  </span>
                  Listening…
                </span>
              ) : loading ? (
                "Searching…"
              ) : q.trim() ? (
                groups.length ? (
                  `Showing results for “${q.trim()}”`
                ) : (
                  `No results found for “${q.trim()}”`
                )
              ) : (
                "Tip: try “IMEI”, “EPR”, “BIS”, “Pollution NOC”…"
              )}
            </div>
          </div>

          <div className="max-h-[68vh] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] p-5">
            {err ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {err}
              </div>
            ) : !q.trim() ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Start typing to search
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll show Services, Knowledge Center, Department Updates,
                  Industries and more.
                </p>
              </div>
            ) : loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-52 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : groups.length ? (
              <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {groups?.map(([groupTitle, list]) => (
                  <div key={groupTitle} className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-blue-600 tracking-tight">
                        {groupTitle}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {list.length}
                      </span>
                    </div>

                    <ul className="space-y-2 pl-1">
                      {list.slice(0, 7).map((x) => (
                        <li key={x?.url || x?.slug || x?.name}>
                          <Link
                            href={ensureInternalHref(x?.url || "#")}
                            className="block rounded-lg px-2 text-[13px] leading-5
                                       text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                            onClick={onClose}
                          >
                            <div className="font-medium">{x?.name}</div>
                            {/* {x?.track ? (
                              <div className="text-[12px] text-slate-500">
                                {x.track}
                              </div>
                            ) : null} */}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {list.length > 7 ? (
                      <div className="mt-3">
                        <Link
                          href="/service"
                          className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={onClose}
                        >
                          View more →
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-900">
                  No results found.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Try different keywords like{" "}
                  <span className="font-semibold">EPR</span>,{" "}
                  <span className="font-semibold">BIS</span>,{" "}
                  <span className="font-semibold">NOC</span>.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                Press <span className="font-semibold">Esc</span> to close
              </p>
              <Link
                href="/category/all"
                onClick={onClose}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Go to Services Catalogue →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ensureInternalHref(url) {
  if (!url) return "#";
  try {
    const u = new URL(url, "https://www.corpseed.com");
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return url;
  }
}
