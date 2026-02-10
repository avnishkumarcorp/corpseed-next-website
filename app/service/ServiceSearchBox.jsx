"use client";

import Link from "next/link";
import { ArrowRight, Search, X, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(str = "", n = 95) {
  const s = (str || "").toString().trim();
  return s.length > n ? s.slice(0, n).trim() + "…" : s;
}

function compactTitle(str = "", n = 42) {
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
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);

  const q = (value || "").trim();
  const hasQuery = !!q;
  const showSuggestions = useMemo(
    () => hasQuery && suggestions?.length > 0,
    [hasQuery, suggestions],
  );

  const showPopular = useMemo(
    () => !hasQuery && (popular || []).length > 0,
    [hasQuery, popular],
  );

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const panelTitle = showSuggestions ? "Suggestions" : "Popular searches";
  const panelCount = showSuggestions ? suggestions.length : popular.length;

  return (
    <div ref={wrapRef} className="relative w-full sm:w-[460px]">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          ref={inputRef}
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5">
              <X className="h-3.5 w-3.5" />
              Clear
            </span>
          </button>
        ) : null}
      </div>

      {/* Dropdown Panel (Popular OR Suggestions) */}
      {(open && (showSuggestions || showPopular)) ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              {!showSuggestions ? (
                <TrendingUp className="h-4 w-4 text-slate-500" />
              ) : null}
              <p className="text-xs font-semibold text-slate-700">
                {panelTitle}
              </p>
            </div>

            <p className="text-[11px] text-slate-500">{panelCount} item(s)</p>
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-auto">
            {showSuggestions ? (
              <>
                {suggestions.slice(0, 10).map((s) => (
                  <Link
                    key={s.uuid || s.slug}
                    href={`/service/${s.slug}`}
                    onClick={() => setOpen(false)}
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
                      {s.categoryTitle ? (
                        <p className="mt-1 text-[11px] text-slate-500">
                          • {s.categoryTitle}
                        </p>
                      ) : null}
                    </div>

                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </>
            ) : (
              // Popular list (compact, looks clean even for long titles)
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {popular.slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        onChange(t);
                        setOpen(true);
                        inputRef.current?.focus();
                      }}
                      className="group flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                      title={t}
                    >
                      <span className="min-w-0 truncate">
                        {compactTitle(t, 44)}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400 group-hover:text-slate-500">
                        ↵
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-2 px-1 text-[11px] text-slate-500">
                  Tip: type “EPR”, “NOC”, “BIS”, “Pollution”…
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
