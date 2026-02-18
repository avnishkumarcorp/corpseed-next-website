"use client";

import Link from "next/link";
import {
  ALL_CORPSEED_ALLOWED_KEYS,
  ALL_CORPSEED_ROUTE_MAP,
} from "./config";

export default function AllCorpseedDropdown({ open, menuMap }) {
  const allItem = menuMap?.["All Corpseed"];
  const categoryMap = allItem?.categoryMap;

  const keys =
    categoryMap && typeof categoryMap === "object" ? Object.keys(categoryMap) : [];

  // const items = ALL_CORPSEED_ALLOWED_KEYS.filter((k) => keys.includes(k));
  const items = ALL_CORPSEED_ALLOWED_KEYS;

  const iconFor = (k) => {
    if (k === "Compliance Updates") return "🧾";
    if (k === "Knowledge Centre") return "📚";
    if (k === "NewsRoom") return "📰";
    return "🧩";
  };

  return (
    <div
      className={[
        "absolute right-0 top-full mt-3 w-[320px] z-50",
        "transition-all duration-200 ease-out",
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

        <div className="p-3">
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <p className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">
                All Corpseed
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Quick navigation
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              {items.length} items
            </span>
          </div>

          <div className="mt-2 grid gap-2">
            {items.map((k) => (
              <Link
                key={k}
                href={ALL_CORPSEED_ROUTE_MAP[k]}
                className="group w-full flex items-center gap-3 rounded-xl
                           bg-slate-50/60 px-3 py-3 text-left
                           transition-all duration-200
                           hover:bg-slate-100/70 cursor-pointer"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200/70 shadow-sm">
                  {iconFor(k)}
                </span>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{k}</p>
                  <p className="text-[12px] text-slate-600">
                    Open {k.toLowerCase()}
                  </p>
                </div>

                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[12px] text-slate-600">Explore Corpseed resources</p>
          </div>
        </div>
      </div>
    </div>
  );
}
