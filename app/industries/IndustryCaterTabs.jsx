"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function clamp(s, n = 260) {
  const v = (s ?? "").toString().trim();
  if (!v) return "";
  return v.length > n ? v.slice(0, n) + "..." : v;
}

export default function IndustryCaterTabs({ items = [] }) {
  const list = useMemo(() => (items || []).slice(0, 20), [items]);
  const [activeId, setActiveId] = useState(list?.[0]?.id || list?.[0]?.slug);

  const active = useMemo(() => {
    return list.find((x) => (x?.id || x?.slug) === activeId) || list[0];
  }, [list, activeId]);

  if (!active) return null;

  // ✅ SAME HEIGHT BOTH SIDES
  const PANEL_HEIGHT = "h-[520px]"; // adjust if you want

  return (
    <div className={`mt-6 grid gap-8 lg:grid-cols-2 items-stretch`}>
      {/* LEFT LIST (tabs) */}
      <div
        className={[
          "rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden",
          PANEL_HEIGHT,
          "flex flex-col",
        ].join(" ")}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900">
            Industries We Cater To
          </h3>
        </div>

        {/* scroll list */}
        <div className="flex-1 overflow-auto border-t border-slate-200">
          {list.map((x) => {
            const id = x?.id || x?.slug;
            const isActive = id === activeId;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                className={[
                  "w-full text-left flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200",
                  "transition-colors",
                  "cursor-pointer",
                  isActive ? "bg-white" : "hover:bg-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-semibold",
                    isActive ? "text-slate-900" : "text-slate-800",
                  ].join(" ")}
                >
                  {x?.title || x?.industryName}
                </span>

                <span
                  className={[
                    "!text-slate-400 transition-transform",
                    isActive ? "translate-x-0" : "",
                  ].join(" ")}
                >
                  ›
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={[
          "rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm",
          PANEL_HEIGHT,
          "relative",
        ].join(" ")}
      >
        {/* image */}
        <div className="absolute inset-0">
          <Image
            src={active?.carouselImage || active?.image}
            alt={active?.title || "Industry"}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2e63]/85 via-[#1f2e63]/60 to-transparent" />
        </div>

        {/* content */}
        <div className="relative h-full p-8 max-w-[520px] flex flex-col justify-start text-white">
          <h3 className="text-2xl font-bold !text-white">{active?.title}</h3>

          <p className="mt-3 text-sm leading-6 !text-white/90">
            {clamp(active?.summary, 300)}
          </p>

          <Link
            href={`/industries/${active?.slug}`}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1f2e63] hover:bg-slate-100 cursor-pointer"
          >
            KNOW MORE <span aria-hidden>›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
