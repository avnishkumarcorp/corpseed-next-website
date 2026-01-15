"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LogoMarquee({
  items = [],
  speed = 70,
  height = 46,
  itemWidth = 140,
}) {
  const viewportRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const doubled = useMemo(() => [...items, ...items], [items]);

  const dragRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onPointerDown = (e) => {
    const el = viewportRef.current;
    if (!el) return;

    // capture pointer so we still get events even if cursor leaves the div
    el.setPointerCapture?.(e.pointerId);

    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.scrollLeft = el.scrollLeft;

    setIsPaused(true);
  };

  const onPointerMove = (e) => {
    const el = viewportRef.current;
    if (!el) return;
    if (!dragRef.current.isDown) return;

    const walk = (e.clientX - dragRef.current.startX) * 1.2;
    el.scrollLeft = dragRef.current.scrollLeft - walk;
  };

  const stopDrag = () => {
    dragRef.current.isDown = false;
    setIsPaused(false);
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    // start near middle for natural manual scrolling
    el.scrollLeft = el.scrollWidth / 4;

    const onScroll = () => {
      const quarter = el.scrollWidth / 4;
      const half = el.scrollWidth / 2;

      if (el.scrollLeft < quarter * 0.4) el.scrollLeft += half;
      if (el.scrollLeft > quarter * 1.6) el.scrollLeft -= half;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const nudge = (dir = 1) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const duration = Math.max(18, Math.round(items.length * (120 / speed)));

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/90 p-2 shadow-sm hover:bg-white cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/90 p-2 shadow-sm hover:bg-white cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={viewportRef}
        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white px-12 py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          stopDrag();
        }}
        // ✅ Pointer events (mouse + touch + pen)
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />

        <div
          className={`flex w-max items-center gap-10 ${
            isPaused ? "" : "animate-logoMarquee"
          }`}
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {doubled.map((item, idx) => {
            const content = (
              <div
                className="flex items-center justify-center"
                style={{ minWidth: itemWidth }}
              >
                <div
                  className="relative opacity-80 transition group-hover:opacity-100"
                  style={{ height, width: itemWidth }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt || "logo"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 120px, 160px"
                  />
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={`${item.src}-${idx}`}
                href={item.href}
                className="cursor-pointer"
              >
                {content}
              </a>
            ) : (
              <div key={`${item.src}-${idx}`}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
