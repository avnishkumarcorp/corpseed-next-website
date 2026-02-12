// app/components/header/MobileDrawer.jsx
"use client";

import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import logo from "../../assets/CORPSEED.webp";
import {
  Chevron,
  isGroupObject,
  isLinksArray,
  normalizeGroups,
  useDebouncedValue,
} from "./helpers";

/* ----------------------------- Voice Popup UI ----------------------------- */

function MicIcon({ active = false }) {
  return (
    <div
      className={[
        "flex h-16 w-16 items-center justify-center rounded-full border bg-white shadow-sm",
        active ? "border-blue-300 ring-4 ring-blue-100" : "border-slate-200",
      ].join(" ")}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    </div>
  );
}

function VoicePopup({
  open,
  listening,
  error,
  onClose,
  onStop,
  title = "Voice search",
  subtitle = "Speak now. It will stop automatically after 8 seconds of silence.",
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={() => {
          onStop?.();
          onClose?.();
        }}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-[12px] text-slate-600">{subtitle}</p>
            </div>

            <button
              type="button"
              aria-label="Close voice search"
              className="rounded-xl px-2 py-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
              onClick={() => {
                onStop?.();
                onClose?.();
              }}
            >
              ✕
            </button>
          </div>

          <div className="px-5 py-6">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
                <div className="mt-1 text-[12px] text-red-600">
                  Tip: On Android Chrome, ensure <b>HTTPS</b> and allow Microphone permission for your site.
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {listening ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                    </span>
                    Listening…
                  </span>
                ) : (
                  "Starting…"
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center">
              <MicIcon active={listening} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                onClick={() => {
                  onStop?.();
                  onClose?.();
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                onClick={() => {
                  onStop?.();
                  onClose?.();
                }}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ----------------------------- Voice Helpers ----------------------------- */

function useVoiceSearch({ onText, silenceMs = 8000 }) {
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const streamRef = useRef(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  };

  const armSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = window.setTimeout(() => {
      // auto-stop after silence
      stop();
    }, silenceMs);
  };

  const stopTracks = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch {}
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setSupported(Boolean(SpeechRecognition));
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onstart = () => {
      setError("");
      setListening(true);
      setPopupOpen(true);
      armSilenceTimer(); // start silence timer as soon as listening begins
    };

    rec.onend = () => {
      setListening(false);
      clearSilenceTimer();
      stopTracks();
    };

    rec.onerror = (e) => {
      const msg =
        e?.error === "not-allowed"
          ? "Mic permission denied. Allow microphone access."
          : e?.error === "service-not-allowed"
          ? "Mic blocked by browser. Check site permissions."
          : e?.error === "no-speech"
          ? "No speech detected."
          : e?.error === "network"
          ? "Voice service unavailable. Check internet."
          : "Voice search failed.";

      setError(msg);
      setListening(false);
      clearSilenceTimer();
      stopTracks();
      setPopupOpen(true);
    };

    // some browsers fire these
    rec.onspeechstart = () => armSilenceTimer();
    rec.onspeechend = () => armSilenceTimer();
    rec.onsoundstart = () => armSilenceTimer();
    rec.onsoundend = () => armSilenceTimer();

    rec.onresult = (event) => {
      // any result means "activity" => reset silence timer
      armSilenceTimer();

      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }

      const next = (finalText || interim).trim();
      if (next) onText?.(next);
    };

    recognitionRef.current = rec;

    return () => {
      clearSilenceTimer();
      stopTracks();
      try {
        rec.onstart = rec.onend = rec.onerror = rec.onresult = null;
        rec.stop();
      } catch {}
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onText, silenceMs]);

  const start = async () => {
    setError("");

    // ✅ Chrome/Android needs HTTPS (or localhost)
    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setError("Voice search requires HTTPS on Android Chrome.");
      setPopupOpen(true);
      return;
    }

    if (!supported || !recognitionRef.current) {
      setError("Voice search not supported in this browser.");
      setPopupOpen(true);
      return;
    }

    // ✅ Preflight permission prompt (fixes many Chrome “not-allowed” cases)
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        // stop immediately; we only wanted to trigger permission prompt
        stopTracks();
      }
    } catch (e) {
      setError("Mic permission denied. Allow microphone access.");
      setPopupOpen(true);
      return;
    }

    setPopupOpen(true);

    // ✅ Must be user gesture (button click)
    try {
      recognitionRef.current.start();
    } catch (e) {
      // if already running, restart
      try {
        recognitionRef.current.stop();
        recognitionRef.current.start();
      } catch {}
    }
  };

  const stop = () => {
    clearSilenceTimer();
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
    stopTracks();
  };

  const closePopup = () => {
    // Closing popup MUST stop listening
    stop();
    setPopupOpen(false);
  };

  return {
    supported,
    listening,
    error,
    setError,
    start,
    stop,
    popupOpen,
    setPopupOpen,
    closePopup,
  };
}

/* ----------------------------- Search Inline ----------------------------- */

function MobileSearchInline({ onNavigate }) {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [err, setErr] = useState("");

  const abortRef = useRef(null);
  const groups = useMemo(() => normalizeGroups(apiData), [apiData]);

  const voice = useVoiceSearch({
    onText: (text) => {
      setQ(text);
    },
    silenceMs: 8000,
  });

  // Fetch search results
  useEffect(() => {
    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `/api/search/service-industry-blog/${encodeURIComponent(query)}`;
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
  }, [dq]);

  return (
    <>
      {/* ✅ Popup (NO mouth icon) */}
      <VoicePopup
        open={voice.popupOpen}
        listening={voice.listening}
        error={voice.error}
        onStop={voice.stop}
        onClose={voice.closePopup}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              voice.setError("");
            }}
            placeholder="Search services, updates, blogs…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm
                       outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* 🎤 Mic button */}
          <button
            type="button"
            onClick={voice.listening ? voice.stop : voice.start}
            disabled={!voice.supported}
            title={
              !voice.supported
                ? "Voice search not supported"
                : voice.listening
                ? "Stop voice"
                : "Search by voice"
            }
            aria-label={voice.listening ? "Stop voice search" : "Search by voice"}
            className={[
              "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm",
              "text-slate-700 hover:bg-slate-50 cursor-pointer",
              voice.listening ? "ring-2 ring-blue-300" : "",
              !voice.supported ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                voice.setError("");
              }}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm
                         text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="mt-2 text-xs text-slate-600">
          {loading
            ? "Searching…"
            : q.trim()
            ? groups.length
              ? `Results for “${q.trim()}”`
              : `No results for “${q.trim()}”`
            : "Tip: try “EPR”, “BIS”, “IMEI”, “NOC”…"}
        </div>

        {err ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : !q.trim() ? null : loading ? (
          <div className="mt-3 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : groups.length ? (
          <div className="mt-3 space-y-4">
            {groups.slice(0, 4).map(([groupTitle, list]) => (
              <div key={groupTitle} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-700">{groupTitle}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {list.length}
                  </span>
                </div>

                <ul className="mt-2 space-y-1">
                  {list.slice(0, 4).map((x) => (
                    <li key={x?.url || x?.slug || x?.name}>
                      <Link
                        href={x?.url || "#"}
                        onClick={onNavigate}
                        className="block rounded-lg px-2 py-2 text-[13px] leading-5
                                   text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer"
                      >
                        <div className="font-medium">{x?.name}</div>
                        {x?.track ? (
                          <div className="text-[12px] text-slate-500">{x.track}</div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-2">
                  <Link
                    href="/service"
                    onClick={onNavigate}
                    className="text-[12px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

/* ------------------------------ UI Helpers ------------------------------ */
/* (Keep your MobileMenuSection, MobileCategoryAccordion, MobileDrawer as-is)
   Just ensure MobileSearchInline remains the updated one above. */

function MobileMenuSection({ title, children, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left cursor-pointer"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">Tap to expand</p>
        </div>
        <Chevron open={open} />
      </button>

      <div
        className={[
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden px-4 pb-4" style={{ marginBottom: "4px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileCategoryAccordion({ categoryTitle, value, onNavigate, open, onToggle }) {
  const renderGroup = (groupTitle, list) => {
    const items = Array.isArray(list) ? list : [];
    const visible = items.slice(0, 6);
    return (
      <div key={groupTitle} className="rounded-xl bg-slate-50 p-3">
        <p className="text-sm font-semibold text-blue-700">{groupTitle}</p>
        <ul className="mt-2 space-y-1">
          {visible.map((x) => (
            <li key={x?.url || x?.slug || x?.name}>
              <Link
                href={x?.url || "#"}
                onClick={onNavigate}
                className="block rounded-lg px-2 py-2 text-[13px] leading-5 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer"
              >
                {x?.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden" style={{ margin: "4px 0px" }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-white cursor-pointer"
      >
        <p className="text-sm font-semibold text-slate-800">{categoryTitle}</p>
        <Chevron open={open} />
      </button>

      <div
        className={[
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden bg-white px-4 pb-4">
          {isLinksArray(value) ? (
            <ul className="space-y-1">
              {value.slice(0, 10).map((x) => (
                <li key={x?.url || x?.slug || x?.name}>
                  <Link
                    href={x?.url || "#"}
                    onClick={onNavigate}
                    className="block rounded-lg px-2 py-2 text-[13px] leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    {x?.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : isGroupObject(value) ? (
            <div className="space-y-3" style={{ paddingBottom: "4px" }}>
              {Object.keys(value || {}).map((groupTitle) => renderGroup(groupTitle, value[groupTitle]))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, menuMap, loading, navItems }) {
  const [mounted, setMounted] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState(null);
  const [openCatByNav, setOpenCatByNav] = useState({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={["fixed inset-0 z-[9999]", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")} aria-hidden={!open}>
      <div
        className={[
          "absolute inset-0 bg-black/40 backdrop-blur-[1px]",
          "transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "absolute right-0 top-0 h-full w-full bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4">
            <Link href="/" onClick={onClose} className="cursor-pointer">
              <Image
                src={logo}
                alt="Corpseed"
                width={130}
                height={52}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose?.();
              }}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="px-4 pb-4">
            <MobileSearchInline onNavigate={onClose} />
          </div>
        </div>

        <div className="h-[calc(100%-124px)] overflow-y-auto px-4 pb-8">
          {/* your rest content unchanged */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/service" onClick={onClose} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer">
              <p className="text-sm font-semibold text-slate-900">Services</p>
              <p className="mt-1 text-xs text-slate-600">Browse catalogue</p>
            </Link>
            <Link href="/knowledge-centre" onClick={onClose} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer">
              <p className="text-sm font-semibold text-slate-900">Knowledge Centre</p>
              <p className="mt-1 text-xs text-slate-600">Guides & updates</p>
            </Link>
          </div>

          <div className="mt-4 rounded-2xl overflow-hidden">
            <div className="p-2 my-1">
              {navItems.map((nav) => {
                const item = menuMap?.[nav.key];
                const categoryMap = item?.categoryMap;
                const sideKeys = Object.keys(categoryMap || {});

                return (
                  <div key={nav.key} id={`mobile-section-${nav.key}`} className="scroll-mt-28" style={{ margin: "3px 0px" }}>
                    <MobileMenuSection
                      title={nav.label}
                      open={activeNavKey === nav.key}
                      onToggle={() => setActiveNavKey((k) => (k === nav.key ? null : nav.key))}
                    >
                      {sideKeys.map((cat) => (
                        <MobileCategoryAccordion
                          key={cat}
                          categoryTitle={cat}
                          value={categoryMap?.[cat]}
                          open={openCatByNav[nav.key] === cat}
                          onToggle={() =>
                            setOpenCatByNav((p) => ({
                              ...p,
                              [nav.key]: p[nav.key] === cat ? null : cat,
                            }))
                          }
                          onNavigate={onClose}
                        />
                      ))}
                    </MobileMenuSection>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Need help choosing a service?</p>
            <p className="mt-1 text-sm text-slate-600">Use search above or open the Services catalogue.</p>
            <div className="mt-3 flex gap-2">
              <Link href="/service" onClick={onClose} className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
                Explore Services
              </Link>
              <Link href="/contact-us" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                Contact
              </Link>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MobileDrawer;
