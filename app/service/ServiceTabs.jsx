"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceTabs({ tabs = [] }) {
  const scrollerRef = useRef(null);

  const mapped = useMemo(
    () =>
      tabs.map((t) => ({
        ...t,
        id: t.id || slugify(t.title || t.tabName),
        tabName: t.tabName || t.title,
      })),
    [tabs],
  );

  const [activeId, setActiveId] = useState(mapped?.[0]?.id || "");

  // ✅ Lock observer updates briefly after click
  const lockRef = useRef({ until: 0, id: "" });
  const lockMs = 900; // smooth scroll time window

  useEffect(() => {
    if (!mapped.length) return;
    setActiveId((prev) => prev || mapped[0].id);
  }, [mapped]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 140;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // ✅ Scroll-spy (IntersectionObserver)
  useEffect(() => {
    const sections = mapped
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // ✅ if we are in "click lock" window, do not override active tab
        if (Date.now() < lockRef.current.until) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
          )[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        // ✅ slightly better margins (less "previous section stays active")
        rootMargin: "-25% 0px -65% 0px",
        threshold: [0.08, 0.15, 0.22, 0.3],
      },
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [mapped]);

  // ✅ arrows only when overflow exists
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    setCanLeft(left > 2);
    setCanRight(left < max - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, mapped]);

  const nudge = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const onTabClick = (id) => {
    // ✅ lock + set active immediately
    lockRef.current = { until: Date.now() + lockMs, id };
    setActiveId(id);

    // keep clicked tab visible
    const strip = scrollerRef.current;
    const btn = strip?.querySelector?.(`[data-tab-id="${id}"]`);
    btn?.scrollIntoView?.({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    scrollToSection(id);

    // ✅ ensure active stays after smooth scroll ends
    window.setTimeout(() => {
      setActiveId(id);
    }, lockMs);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={!canLeft}
          aria-label="Scroll left"
          className={[
            "inline-flex h-9 w-9 items-center justify-center cursor-pointer",
            "text-slate-600 hover:text-blue-600",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div ref={scrollerRef} className="no-scrollbar flex-1 overflow-x-auto">
          {/* ✅ full-width base line for tab strip */}
          <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200" />

            <div className="flex w-full min-w-max md:min-w-0 md:w-full">
              {mapped.map((t) => {
                const isActive = activeId === t.id;

                return (
                  <button
                    key={t.id}
                    data-tab-id={t.id}
                    type="button"
                    onClick={() => onTabClick(t.id)}
                    className={[
                      "group relative px-5 py-3 text-sm font-semibold cursor-pointer transition",
                      "text-slate-700 hover:text-blue-600 whitespace-nowrap",
                      "md:flex-1 md:px-0 md:text-center",
                    ].join(" ")}
                  >
                    {/* ✅ Text */}
                    <span className="relative inline-block">{t.tabName}</span>

                    {/* ✅ underline area (reserved for ALL tabs) */}
                    <span
                      className={[
                        "pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] transition",
                        isActive ? "bg-blue-600" : "bg-transparent",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={!canRight}
          aria-label="Scroll right"
          className={[
            "inline-flex h-9 w-9 items-center justify-center cursor-pointer",
            "text-slate-600 hover:text-blue-600",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
