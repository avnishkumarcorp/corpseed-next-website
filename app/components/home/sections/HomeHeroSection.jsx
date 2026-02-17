// ✅ Drop-in update: adds a Google-like voice popup + auto-stop after 8s of silence
// - Starts listening only when you open popup (mic click)
// - If no speech for 8s => auto stop + close popup
// - Closing popup manually => stops listening immediately
// - Works with SpeechRecognition (Safari, some Chrome) + fallback recorder (Android Chrome) via /api/speech-to-text

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Star } from "lucide-react";

// icons
import industryImg from "../../../../public/home/Industry_Setup_Solutions_Image-02.png";
import sustainabilityImg from "../../../../public/home/Sustainability-02.png";
import regulatoryImg from "../../../../public/home/Regulatory_Compliance_Image-02.png";
import environmentalImg from "../../../../public/home/Sustainability-02.png";
import importExportImg from "../../../../public/home/Import_Export_Image-02.png";
import productComplianceImg from "../../../../public/home/Product_Compliance-02.png";

// center mock images
import envBgLeft from "../../../../public/home/Environmental1_Image-03.png";
import envBgMid from "../../../../public/home/Environmental_main_image-03.png";
import envBgRight from "../../../../public/home/Environmental2_Image-03-03.png";

const DEFAULT_ITEMS = [
  {
    key: "industry",
    title: "Industry Setup Solution",
    desc: "Bio-fuels / Medical / Electronics\nWaste Management / Renewable",
    href: "/service/industry-setup-solution",
    img: industryImg,
    pos: "topLeft",
  },
  {
    key: "sustainability",
    title: "Sustainability",
    desc: "ESG / ESDD / ESMS / Net Zero\nWaste Channelization / Carbon Credits",
    href: "/service/sustainability",
    img: sustainabilityImg,
    pos: "topRight",
  },
  {
    key: "regulatory",
    title: "Regulatory\nCompliance",
    desc: "Factory / Fire / Trade\nFSSAI / CGWA / Labour\n& Other Compliance",
    href: "/service/regulatory-compliance",
    img: regulatoryImg || sustainabilityImg,
    pos: "midLeft",
  },
  {
    key: "environmental",
    title: "Environmental",
    desc: "EPR / EIA / CTO / CTE\nEC / BWM / PWM / EWM\nHWM / FSC / Wildlife",
    href: "/service/environmental",
    img: environmentalImg,
    featured: true,
    pos: "midCenter",
  },
  {
    key: "importexport",
    title: "Import Export",
    desc: "IEC / DGFT / CHA\nCDSCO / BIS / LMPC\nEPR / Custom Clearance",
    href: "/service/import-export",
    img: importExportImg || sustainabilityImg,
    pos: "midRight",
  },
  {
    key: "product",
    title: "Product Compliance",
    desc: "ISI / BIS / ISO / BEE / FDA / Meity\nCDSCO / TEC / WPC / OSP / etc.",
    href: "/service/product-compliance",
    img: productComplianceImg || sustainabilityImg,
    pos: "bottomCenter",
  },
];

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useTypewriterPlaceholders(items, delay = 1800) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!items?.length) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), delay);
    return () => clearInterval(t);
  }, [items, delay]);
  return items?.[idx] || "";
}

const GRID_KEYS_ORDER = [
  "Services",
  "Product Based Services",
  "Knowledge Center",
  "Knowledge Centre",
  "Department Updates",
  "Compliance Updates",
  "Industries",
];

function normalizeGroups(apiData) {
  if (!apiData || typeof apiData !== "object") return [];
  const entries = Object.entries(apiData).map(([k, v]) => [
    k,
    Array.isArray(v) ? v : [],
  ]);

  const known = [];
  const unknown = [];

  for (const [k, arr] of entries) {
    if (!arr.length) continue;
    if (GRID_KEYS_ORDER.includes(k)) known.push([k, arr]);
    else unknown.push([k, arr]);
  }

  known.sort(
    (a, b) => GRID_KEYS_ORDER.indexOf(a[0]) - GRID_KEYS_ORDER.indexOf(b[0]),
  );
  unknown.sort((a, b) => a[0].localeCompare(b[0]));
  return [...known, ...unknown];
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

/** ✅ Voice popup (Google-like) */
function VoicePopup({
  open,
  listening,
  interim,
  error,
  onClose,
  onMicClick,
  popupRef,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 px-2">
        <div
          ref={popupRef}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
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
                {listening ? "Say something…" : "Press mic to start"}
              </p>
            )}
          </div>

          {/* ✅ Mic button (THIS was missing) */}
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMicClick?.();
              }}
              className={[
                "flex h-14 w-14 items-center justify-center rounded-full border cursor-pointer",
                listening
                  ? "border-blue-300 bg-blue-50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
              aria-label={listening ? "Stop voice" : "Start voice"}
              title={listening ? "Stop" : "Start"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
        </div>
      </div>
    </div>
  );
}

/**
 * ✅ Voice engine with "silence auto-stop"
 * - Works with SpeechRecognition if available
 * - Fallback to MediaRecorder if not (Android Chrome)
 * - Auto-stops if no speech for `silenceMs` (default 8000)
 */
function useVoiceSearch({ onText, silenceMs = 8000, lang = "en-IN" }) {
  const recRef = React.useRef(null);

  const mediaRef = React.useRef({
    stream: null,
    recorder: null,
    chunks: [],
  });

  const silenceTimerRef = React.useRef(null);

  const [supported, setSupported] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState("");
  const [interim, setInterim] = React.useState("");

  const resetSilenceTimer = React.useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      // ✅ 8 sec no speech => stop
      stop();
      setError("Stopped (no speech detected).");
    }, silenceMs);
  }, [silenceMs]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(SR) || Boolean(navigator?.mediaDevices?.getUserMedia));
  }, []);

  // setup SpeechRecognition
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onstart = () => {
      setError("");
      setInterim("");
      setListening(true);
      resetSilenceTimer();
    };

    rec.onend = () => {
      setListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    };

    rec.onerror = (e) => {
      setListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      setError(
        e?.error === "not-allowed"
          ? "Mic permission denied. Allow microphone access."
          : e?.error === "no-speech"
            ? "No speech detected."
            : "Voice search failed.",
      );
    };

    rec.onspeechstart = () => {
      // user started speaking
      resetSilenceTimer();
    };

    rec.onspeechend = () => {
      // speech ended, start timer again
      resetSilenceTimer();
    };

    rec.onresult = (event) => {
      resetSilenceTimer();

      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }

      const merged = (finalText || interimText).trim();
      setInterim(merged);

      if (finalText.trim()) {
        onText?.(finalText.trim());
        stop(); // ✅ once final text => stop
      }
    };

    recRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {}
      recRef.current = null;
    };
  }, [lang, onText, resetSilenceTimer]);

  const stopMediaRecorder = () => {
    try {
      const { recorder, stream } = mediaRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    } catch {}
    mediaRef.current.stream = null;
    mediaRef.current.recorder = null;
    mediaRef.current.chunks = [];
  };

  const stop = React.useCallback(() => {
    // stop SR
    try {
      recRef.current?.stop();
    } catch {}

    // stop fallback recorder
    stopMediaRecorder();

    setListening(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }, []);

  const startRecorderFallback = async () => {
    setError("");
    setInterim("");

    // Android Chrome: HTTPS needed (or localhost)
    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setError("Voice search needs HTTPS on mobile browsers.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRef.current.stream = stream;
      mediaRef.current.recorder = recorder;
      mediaRef.current.chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data?.size) mediaRef.current.chunks.push(e.data);
      };

      recorder.onstart = () => {
        setListening(true);
        resetSilenceTimer(); // ✅ start silence timer immediately
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(mediaRef.current.chunks, {
            type: "audio/webm",
          });
          const fd = new FormData();
          fd.append("audio", blob, "voice.webm");

          const res = await fetch("/api/speech-to-text", {
            method: "POST",
            body: fd,
          });

          if (!res.ok) throw new Error("stt_failed");
          const json = await res.json();
          const text = String(json?.text || "").trim();
          if (text) onText?.(text);
        } catch {
          setError("Voice search failed. Please try again.");
        } finally {
          setListening(false);
        }
      };

      recorder.start();

      // ✅ if no one speaks for 8 seconds, stop recorder too
      // (we can't detect speech in recorder easily, so this is a strict timeout)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stop();
        setError("Stopped (no speech detected).");
      }, silenceMs);
    } catch {
      setError("Mic permission denied. Please allow microphone access.");
      setListening(false);
    }
  };

  const start = async () => {
    setError("");
    setInterim("");

    // try SpeechRecognition first
    if (recRef.current) {
      try {
        recRef.current.start();
        return;
      } catch {
        // fallback below
      }
    }

    await startRecorderFallback();
  };

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    supported,
    listening,
    error,
    interim,
    start,
    stop,
    clearError: () => setError(""),
  };
}

function HeroSearch({
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  placeholders = [
    "Try “EPR Plastic”…",
    "Try “IMEI”…",
    "Try “BIS Registration”…",
    "Try “Pollution NOC”…",
  ],
}) {
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const abortRef = React.useRef(null);
  const popupRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = React.useState(false);
  const [apiData, setApiData] = React.useState(null);
  const [err, setErr] = React.useState("");

  const placeholder = useTypewriterPlaceholders(placeholders, 1600);

  // ✅ popup state
  const [voiceOpen, setVoiceOpen] = React.useState(false);

  const voice = useVoiceSearch({
    silenceMs: 8000,
    onText: (text) => {
      setOpen(true);
      setQ(text);
      inputRef.current?.focus?.();
      // close popup once we got text
      setVoiceOpen(false);
    },
  });

  const closeVoicePopup = () => {
    setVoiceOpen(false);
    voice.stop(); // ✅ closing popup stops listening always
  };

  const openVoicePopupAndStart = async () => {
    setVoiceOpen(true);
    await voice.start();
  };

  // close on outside click / esc
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onMouse = (e) => {
      // ✅ if popup open and click is inside popup -> do nothing
      if (voiceOpen && popupRef.current?.contains(e.target)) return;

      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouse, true); // ✅ capture
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouse, true);
    };
  }, [open, voiceOpen]);

  // fetch
  React.useEffect(() => {
    if (!open) return;

    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
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
        setErr("Something went wrong. Please try again.");
        setApiData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [dq, open, baseUrl]);

  const groups = React.useMemo(() => normalizeGroups(apiData), [apiData]);

  const showPanel = open && (q.trim() || loading || err);

  // ✅ auto-close popup when it stops listening (e.g. 8s silence)
  React.useEffect(() => {
    if (!voiceOpen) return;
    if (!voice.listening && !voice.interim) {
      // if it stopped without result, keep popup but show error if any.
      // You can also auto-close:
      // setVoiceOpen(false);
    }
  }, [voiceOpen, voice.listening, voice.interim]);

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      {/* ✅ Voice Popup */}
      <VoicePopup
        open={voiceOpen}
        listening={voice.listening}
        interim={voice.interim}
        error={voice.error}
        onClose={closeVoicePopup}
        popupRef={popupRef}
        onMicClick={() => {
          if (voice.listening) voice.stop();
          else voice.start();
        }}
      />

      {/* Search input */}
      <div className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <span className="text-slate-400">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        {/* 🎤 Mic button -> opens popup + starts listening */}
        <button
          type="button"
          onClick={() => {
            if (voiceOpen) closeVoicePopup();
            else openVoicePopupAndStart();
          }}
          disabled={!voice.supported}
          title={!voice.supported ? "Voice not supported" : "Search by voice"}
          aria-label="Search by voice"
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-xl",
            "border border-slate-200 bg-white text-slate-700 shadow-sm",
            "hover:bg-slate-50 cursor-pointer",
            voiceOpen ? "ring-2 ring-blue-300" : "",
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

        {/* Clear */}
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setApiData(null);
              setErr("");
              setLoading(false);
              inputRef.current?.focus();
            }}
            className="rounded-xl px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      {showPanel ? (
        <div className="absolute left-0 right-0 z-50 mt-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

            <div className="max-h-[52vh] overflow-y-auto p-4 [scrollbar-gutter:stable]">
              {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {err}
                </div>
              ) : loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : !q.trim() ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Start typing to search
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    We’ll show Services, Knowledge Center, Department Updates,
                    and more.
                  </p>
                </div>
              ) : groups.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {groups.map(([groupTitle, list]) => (
                    <div key={groupTitle} className="min-w-0">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {groupTitle}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                          {list.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {list.slice(0, 6).map((x) => (
                          <Link
                            key={x?.url || x?.slug || x?.name}
                            href={ensureInternalHref(x?.url || "#")}
                            onClick={() => setOpen(false)}
                            className="group block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {x?.name}
                                </p>
                                {x?.track ? (
                                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-600">
                                    {x.track}
                                  </p>
                                ) : null}
                              </div>
                              <span className="mt-0.5 text-slate-400 transition group-hover:translate-x-0.5">
                                →
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {list.length > 6 ? (
                        <div className="mt-3">
                          <Link
                            href="/service"
                            onClick={() => setOpen(false)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            View more →
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    No results found for “{q.trim()}”.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Try “EPR”, “BIS”, “NOC”, “IMEI”…
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600">
                  Press <span className="font-semibold">Esc</span> to close
                </p>
                <Link
                  href="/service"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Go to Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HomeHeroSection({
  title = "Tailored Solutions\nFor Your Business",
  ratingText = "Rated 4.9 stars ratings by 15000+ Customers like you",
  ctaHref = "/contact-us",
  ctaText = "CALL FOR FREE CONSULTATION",
}) {
  return (
    <section className="relative bg-white overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 lg:px-8 lg:pt-12 lg:pb-12">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:self-center lg:flex lg:flex-col lg:justify-center">
            <Link
              href={ctaHref}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              <span>{ctaText}</span>
              <PhoneCall className="h-4 w-4" />
            </Link>

            <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight text-[#272d30] sm:text-5xl lg:text-6xl">
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
              <p className="text-lg">
                <span className="text-blue-500">
                  Regulatory, Sustainability, Environmental, Legal{" "}
                </span>
                &amp; Plant Setup Compliance Advisory Platform For Individuals,
                SME &amp; Enterprise.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-700">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-medium">{ratingText}</span>
            </div>

            <div className="mt-6">
              <HeroSearch
                baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
                placeholders={[
                  "Try “EPR For Plastic Waste”…",
                  "Try “BIS Certification”…",
                  "Try “Pollution NOC”…",
                  "Try “IMEI Number”…",
                ]}
              />
            </div>
          </div>

          {/* Right side kept as-is (your cards) */}
          <div className="lg:col-span-6 hidden lg:block">
            <div className="ml-auto w-full max-w-[780px]">
              <div className="flex flex-col gap-8">
                <div className="flex justify-center gap-8">
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Industry Setup Solution
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={industryImg}
                        alt="Industry Setup Solution"
                        height={76}
                        width={110}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[12px] leading-snug text-gray-500">
                      <Link href="/service/biofuel-manufacturing-plant-setup-in-india">
                        Bio-fuels
                      </Link>{" "}
                      / <Link href="/">Medical</Link> /{" "}
                      <Link href="/">Electronics</Link> <br />
                      <Link href="industries/recycling-and-waste-management">
                        Waste Management
                      </Link>
                      /
                      <Link href={"/industries/renewable-energy"}>
                        Renewable
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Sustainability
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={sustainabilityImg}
                        alt="Sustainability"
                        height={76}
                        width={110}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[12px] leading-snug text-gray-500">
                      <Link href="/service/environmental-social-and-governance-esg">
                        ESG
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/environmental-and-social-due-diligence-esdd">
                        ESDD
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/environmental-and-social-management-system-esms">
                        ESMS
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/leed-zero-carbon-certification">
                        Net Zero
                      </Link>{" "}
                      <br />
                      <Link href={"/service/waste-management"}>
                        Waste Channelization
                      </Link>
                      /
                      <Link href="/service/carbon-credit-trading-scheme">
                        Carbon Credits
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold leading-tight text-gray-900">
                      Regulatory Compliance
                    </div>
                    <div className="mx-auto mb-2 flex h-[72px] w-[104px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={regulatoryImg}
                        alt="Regulatory Compliance"
                        height={72}
                        width={104}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link href="/service/factory-license">Factory</Link> /{" "}
                      <Link href="/service/fire-noc-fire-noc-renewal">
                        Fire
                      </Link>{" "}
                      /<Link href={"/service/health-trade-license"}>Trade</Link>
                      <br />
                      <Link href={"/service/fssai-basic-registration-renewal"}>
                        FSSAI
                      </Link>{" "}
                      /
                      <Link
                        href={
                          "/service/central-ground-water-authority-noc-for-water-boring-tube-wells"
                        }
                      >
                        CGWA
                      </Link>
                      / <Link href={""}>Labour</Link> <br />
                      &amp; Other Compliance
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_16px_34px_rgba(0,0,0,0.14)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Environmental
                    </div>
                    <div className="mx-auto mb-2 flex h-[82px] w-[118px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={envBgMid}
                        alt="Environmental"
                        height={82}
                        width={118}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link href={"/service/epr-authorization"}>EPR</Link> /{" "}
                      <Link
                        href={"/service/environmental-impact-assessment-eia"}
                      >
                        EIA
                      </Link>{" "}
                      / <Link href={"/"}>CTO</Link> /{" "}
                      <Link href={"/"}>CTE</Link> <br />
                      <Link href={"/service/environmental-clearance"}>EC </Link>
                      /{" "}
                      <Link
                        href={
                          "/service/bio-medical-waste-management-authorization"
                        }
                      >
                        BWM
                      </Link>{" "}
                      /{" "}
                      <Link
                        href={"/service/plastic-waste-management-authorization"}
                      >
                        PWM
                      </Link>{" "}
                      /{" "}
                      <Link href={"/service/e-waste-management-authorization"}>
                        EWM
                      </Link>{" "}
                      <br />
                      <Link
                        href={
                          "/service/hazardous-waste-management-authorization"
                        }
                      >
                        HWM
                      </Link>{" "}
                      /<Link href={"/service/fsc-certification"}>FSC</Link> /
                      <Link
                        href={
                          "/service/wildlife-and-forests-clearance-certificate-for-project"
                        }
                      >
                        Wildlife
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Import Export
                    </div>
                    <div className="mx-auto mb-2 flex h-[72px] w-[104px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={importExportImg}
                        alt="Import Export"
                        height={72}
                        width={104}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href="/service/import-export-code"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        IEC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/dgft-export-import-license"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        DGFT
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        CHA
                      </Link>
                      <br />
                      <Link
                        href="/service/cdsco-online-registration"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        CDSCO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bis-certification"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        BIS
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/lmpc-certificate-for-import"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        LMPC
                      </Link>
                      <br />
                      <Link
                        href="/service/epr-authorization"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        EPR
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        Custom Clearance
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Product Compliance
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={productComplianceImg}
                        alt="Product Compliance"
                        height={76}
                        width={110}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href="/service/isi-registration-process-in-india"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        ISI
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bis-registration"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        BIS
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/iso-certification-consulting"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        ISO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bee-registration"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        BEE
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/fda-wholesale-license"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        FDA
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        Meity
                      </Link>
                      <br />
                      <Link
                        href="/service/cdsco-online-registration"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        CDSCO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/tec-certificate"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        TEC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/wpc-advisory-services"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        WPC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/dot-osp-license"
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        OSP
                      </Link>{" "}
                      / <span className="text-gray-400">etc.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </section>
  );
}
