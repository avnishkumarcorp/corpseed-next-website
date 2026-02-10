"use client";

import Link from "next/link";
import React from "react";

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
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

export default function SearchSitemap() {
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const abortRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = React.useState(false);
  const [apiData, setApiData] = React.useState(null);
  const [err, setErr] = React.useState("");

  // Close on outside click / esc (same as HeroSearch)
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onMouse = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouse);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouse);
    };
  }, [open]);

  // Fetch results (debounced + abort)
  React.useEffect(() => {
    if (!open) return;

    const query = (dq || "").trim();
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

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/service-industry-blog/${encodeURIComponent(
          query,
        )}`;

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
  }, [dq, open]);

  const groups = React.useMemo(() => normalizeGroups(apiData), [apiData]);

  const showPanel = open && ((q || "").trim() || loading || err);

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* SEARCH INPUT (Hero style) */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

        <div className="p-5 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur">
          <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Search Corpseed
          </label>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="text-slate-400">⌕</span>

                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    if (!open) setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  placeholder="Search services, knowledge, updates… (e.g., IMEI, EPR, BIS)"
                  className="w-full bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                {q ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      setApiData(null);
                      setErr("");
                      setLoading(false);
                      setOpen(true);
                      inputRef.current?.focus();
                    }}
                    className="rounded-xl px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="rounded-xl bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                    Search
                  </span>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-600">
                {loading
                  ? "Searching…"
                  : (q || "").trim()
                    ? groups.length
                      ? `Showing results for “${q.trim()}”`
                      : `No results found for “${q.trim()}”`
                    : "Tip: try “IMEI”, “EPR”, “BIS”, “Pollution NOC”…"}
              </div>
            </div>
          </div>
        </div>

        {/* OPTIONAL: static info area below input (you can keep or remove) */}
        <div className="p-5 md:p-6">
          <p className="text-sm text-slate-600">
            Start typing in the search box to see results in a dropdown (like
            home hero search).
          </p>
        </div>
      </div>

      {/* DROPDOWN PANEL (Hero style) */}
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
              ) : !(q || "").trim() ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Start typing to search
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    We’ll show Services, Knowledge Centre, Department Updates,
                    Compliance Updates, Industries and more.
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
                            className="group block rounded-xl border border-slate-200 bg-white p-3
                                       transition hover:border-slate-300 hover:shadow-sm cursor-pointer"
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
                    Try “EPR”, “BIS”, “NOC”, “IMEI”…{" "}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600">
                  Press <span className="font-semibold">Esc</span> to close
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Close →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
