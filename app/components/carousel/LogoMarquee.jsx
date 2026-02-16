"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CLIENTS_CACHE = {
  promise: null,
  data: null,
  error: null,
  ts: 0,
};

const hashClients = (arr) => {
  try {
    return JSON.stringify(
      (arr || []).map((x) => [
        x?.id,
        x?.uuid,
        x?.name,
        x?.slug,
        x?.image,
        x?.imageURL,
        x?.imageUrl,
      ]),
    );
  } catch {
    return String(Date.now());
  }
};

async function fetchClientsOnce(apiUrl) {
  if (CLIENTS_CACHE.data) return CLIENTS_CACHE.data;
  if (CLIENTS_CACHE.promise) return CLIENTS_CACHE.promise;

  CLIENTS_CACHE.promise = (async () => {
    const proxyUrl = `/api/proxy/clients?apiUrl=${encodeURIComponent(apiUrl)}`;

    // ✅ don't attach AbortController to a shared cached request
    const res = await fetch(proxyUrl, { cache: "no-store" });

    if (!res.ok) throw new Error(`API failed: ${res.status}`);

    const json = await res.json();
    const arr = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : json?.data || [];

    CLIENTS_CACHE.data = Array.isArray(arr) ? arr : [];
    CLIENTS_CACHE.error = null;
    CLIENTS_CACHE.ts = Date.now();
    return CLIENTS_CACHE.data;
  })().catch((err) => {
    CLIENTS_CACHE.error = err;
    CLIENTS_CACHE.promise = null;
    throw err;
  });

  return CLIENTS_CACHE.promise;
}

/** Tooltip rendered to document.body so it doesn't get clipped by overflow-hidden */
function TooltipPortal({ open, text, anchorRect }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !open || !anchorRect) return null;

  const top = anchorRect.top - 10;
  const left = anchorRect.left + anchorRect.width / 2;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top,
        left,
        transform: "translate(-50%, -100%)",
        zIndex: 99999,
        pointerEvents: "none",
        background: "#111827",
        color: "white",
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 8,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>,
    document.body,
  );
}

// ✅ robust image builder (supports absolute urls, "/path", or filename)
function buildLogoSrc(it, imageBaseUrl) {
  const raw = String(
    it?.imageURL ?? it?.imageUrl ?? it?.logoUrl ?? it?.image ?? "",
  ).trim();

  if (!raw) return "";

  // already absolute
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // protocol-relative like //domain.com/a.webp
  if (raw.startsWith("//")) return `https:${raw}`;

  // domain without protocol: corpseed-main.s3....com/path
  if (/^[a-z0-9.-]+\.[a-z]{2,}\/.+/i.test(raw)) return `https://${raw}`;

  // starts with slash: /corpseed/a.webp
  if (raw.startsWith("/")) {
    return `${imageBaseUrl.replace(/\/$/, "")}${raw}`;
  }

  // filename: ACCORD.webp
  return `${imageBaseUrl.replace(/\/$/, "")}/${raw}`;
}

export default function LogoMarquee({
  apiUrl = "api/customer/clients",
  imageBaseUrl = "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed",
  linkPrefix = "",
  openInNewTab = false,
  height = 46,
  itemWidth = 120,
  speed = 60,
}) {
  const [loading, setLoading] = useState(
    !CLIENTS_CACHE.data && !CLIENTS_CACHE.promise,
  );
  const [clients, setClients] = useState(CLIENTS_CACHE.data || []);
  const lastHashRef = useRef(hashClients(CLIENTS_CACHE.data || []));

  // controls
  const [isPaused, setIsPaused] = useState(false);
  const [dir, setDir] = useState(1); // 1: move left, -1: move right

  // tooltip state (portal)
  const [tipOpen, setTipOpen] = useState(false);
  const [tipText, setTipText] = useState("");
  const [tipRect, setTipRect] = useState(null);

  // refs for animation
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);
  const offsetRef = useRef(0);

  // DOM refs
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const singleWidthRef = useRef(0);

  // drag
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startOffset: 0,
  });

  const applyClientsToState = (data) => {
    const nextHash = hashClients(data);
    if (nextHash !== lastHashRef.current) {
      lastHashRef.current = nextHash;
      setClients(Array.isArray(data) ? data : []);
    }
  };

  // ✅ ALWAYS sync from cache/promise (prevents empty state race on route changes)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // ✅ if cache already exists, sync it
        if (CLIENTS_CACHE.data) {
          if (!mounted) return;
          applyClientsToState(CLIENTS_CACHE.data);
          setLoading(false);
          return;
        }

        setLoading(true);

        // ✅ await in-flight promise OR start fetch
        let data;
        try {
          data = CLIENTS_CACHE.promise
            ? await CLIENTS_CACHE.promise
            : await fetchClientsOnce(apiUrl);
        } catch (e) {
          // ✅ if it failed, try ONE retry (helps flaky mounts)
          data = await fetchClientsOnce(apiUrl);
        }

        if (!mounted) return;
        applyClientsToState(data);
        setLoading(false);
      } catch (e) {
        console.error("LogoMarquee:", e);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  // ------------------ Normalize for rendering ------------------
  const normalizedItems = useMemo(() => {
    return (clients || [])
      .filter(Boolean)
      .map((it) => {
        const src = buildLogoSrc(it, imageBaseUrl);

        // link
        const slug = (it?.slug || "").toString().trim();
        const href = slug && linkPrefix ? `${linkPrefix}${slug}` : "";

        return {
          key: it?.uuid || it?.id || src,
          name: it?.name || "Logo",
          src,
          href,
        };
      })
      .filter((x) => x.src);
  }, [clients, imageBaseUrl, linkPrefix]);

  const doubled = useMemo(
    () =>
      normalizedItems.length ? [...normalizedItems, ...normalizedItems] : [],
    [normalizedItems],
  );

  // ------------------ Pause/Resume helpers ------------------
  const pauseNow = () => {
    setIsPaused(true);
    lastTsRef.current = 0; // avoid jump
  };

  const resumeNow = () => {
    setIsPaused(false);
    lastTsRef.current = 0; // avoid jump
  };

  // ------------------ Tooltip helpers ------------------
  const showTip = (e, name) => {
    pauseNow(); // stop exactly at hover
    const rect = e.currentTarget.getBoundingClientRect();
    setTipText(name);
    setTipRect(rect);
    setTipOpen(true);
  };

  const hideTip = () => {
    setTipOpen(false);
    setTipRect(null);
    resumeNow();
  };

  // ------------------ Measure width of ONE set (half track) ------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track || normalizedItems.length === 0) return;

    const measure = () => {
      const total = track.scrollWidth; // doubled width
      singleWidthRef.current = total / 2 || 0;

      const W = singleWidthRef.current;
      if (W > 0) {
        offsetRef.current = ((offsetRef.current % W) + W) % W;
        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => ro.disconnect();
  }, [normalizedItems.length, itemWidth]);

  // ------------------ Continuous autoplay (transform-based) ------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (normalizedItems.length === 0) return;

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const W = singleWidthRef.current;

      if (!isPaused && W > 0) {
        offsetRef.current += dir * speed * dt;

        if (offsetRef.current >= W) offsetRef.current -= W;
        if (offsetRef.current < 0) offsetRef.current += W;

        track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
  }, [normalizedItems.length, isPaused, dir, speed]);

  // ------------------ Drag support ------------------
  const onPointerDown = (e) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.setPointerCapture?.(e.pointerId);
    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startOffset = offsetRef.current;

    pauseNow();
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.isDown) return;

    const track = trackRef.current;
    const W = singleWidthRef.current;
    if (!track || !W) return;

    const dx = (e.clientX - dragRef.current.startX) * 1.1;
    offsetRef.current = dragRef.current.startOffset - dx;

    offsetRef.current = ((offsetRef.current % W) + W) % W;
    track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
  };

  const onPointerUp = () => {
    dragRef.current.isDown = false;
    resumeNow();
  };

  // ------------------ Arrow nudge ------------------
  const nudge = (direction) => {
    const track = trackRef.current;
    const W = singleWidthRef.current;
    if (!track || !W) return;

    pauseNow();

    offsetRef.current += direction * 280;
    offsetRef.current = ((offsetRef.current % W) + W) % W;
    track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;

    if (tipOpen) {
      setTipOpen(false);
      setTipRect(null);
    }

    window.clearTimeout(nudge._t);
    nudge._t = window.setTimeout(() => resumeNow(), 450);
  };

  // ------------------ UI ------------------
  return (
    <div className="relative w-full bg-white">
      {/* <button
        type="button"
        onClick={() => {
          setDir(-1);
          nudge(-1);
        }}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/90 p-2 shadow-sm hover:bg-white cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button> */}

      {/* <button
        type="button"
        onClick={() => {
          setDir(1);
          nudge(1);
        }}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/90 p-2 shadow-sm hover:bg-white cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button> */}

      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-xl bg-white px-12 py-4"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />

        {loading && normalizedItems.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            Loading logos...
          </div>
        ) : normalizedItems.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            No logos found.
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex w-max items-center gap-4 will-change-transform" // ✅ 16px gap
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {doubled.map((item, idx) => {
              const key = `${item.key}-${idx}`;

              const content = (
                <div
                  className="relative flex items-center justify-center"
                  style={{ minWidth: itemWidth }}
                >
                  <div
                    className="relative cursor-pointer"
                    onMouseEnter={(e) => showTip(e, item.name)}
                    onMouseLeave={hideTip}
                  >
                    <div
                      className="relative flex items-center justify-center opacity-80 transition-opacity duration-200 hover:opacity-100"
                      style={{ height, width: itemWidth }}
                      title={item.name}
                    >
                      <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 120px, 160px"
                        className="object-contain max-w-[95%] max-h-[95%]" // ✅ tighter
                      />
                    </div>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={key}
                  href={item.href}
                  className="cursor-pointer"
                  target={openInNewTab ? "_blank" : undefined}
                  rel={openInNewTab ? "noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={key}>{content}</div>
              );
            })}
          </div>
        )}
      </div>

      <TooltipPortal open={tipOpen} text={tipText} anchorRect={tipRect} />
    </div>
  );
}
