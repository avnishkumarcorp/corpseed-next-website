"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceTabs({ tabs = [] }) {
  const scrollerRef = useRef(null);
  const [activeId, setActiveId] = useState(tabs?.[0]?.title ? slugify(tabs[0].title) : "");

  const mapped = useMemo(
    () => tabs.map((t) => ({ ...t, id: t.id || slugify(t.title) })),
    [tabs]
  );

  useEffect(() => {
    // Observe sections to update active tab on scroll
    const sections = mapped
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        // tune this so the active tab changes nicely
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0.1, 0.2, 0.3, 0.4],
      }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [mapped]);

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  // adjust this number based on your sticky header + tabs height
  const offset = 140;

  const y = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: y, behavior: "smooth" });
};


  const nudge = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => nudge(-1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
        type="button"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto"
      >
        {mapped.map((t) => {
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => scrollTo(t.id)}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer",
                isActive
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
              type="button"
            >
              {t.title}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => nudge(1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
        type="button"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
