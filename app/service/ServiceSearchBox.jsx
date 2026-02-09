"use client";

import Link from "next/link";
{ /* no writing block, so normal code fence */ }
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo } from "react";

function clamp(str = "", n = 95) {
  const s = (str || "").toString().trim();
  return s.length > n ? s.slice(0, n).trim() + "…" : s;
}

export default function ServiceSearchBox({
  value,
  onChange,
  suggestions = [],
  popular = [],
  placeholder = "Search services (e.g., EPR, NOC, BIS, Recycling...)",
}) {
  const showSug = useMemo(() => value?.trim() && suggestions?.length, [value, suggestions]);

  return (
    <div className="relative w-full sm:w-[440px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1">
              <X className="h-3 w-3" />
              Clear
            </span>
          </button>
        ) : null}
      </div>

      {/* Popular chips (only when empty) */}
      {!value && popular?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {popular.slice(0, 5).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {/* Suggestions dropdown */}
      {showSug ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <p className="text-xs font-semibold text-slate-600">Suggestions</p>
            <p className="text-[11px] text-slate-500">
              {suggestions.length} result(s)
            </p>
          </div>

          <div className="max-h-96 overflow-auto">
            {suggestions.slice(0, 8).map((s) => (
              <Link
                key={s.uuid || s.slug}
                href={`/service/${s.slug}`}
                className="group flex gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                  {(s.title || "S").slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {clamp(s.summary, 95)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {s.categoryTitle ? `• ${s.categoryTitle}` : ""}
                  </p>
                </div>

                <ArrowRight className="mt-2 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
