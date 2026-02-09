"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
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

export default function SearchSitemap() {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [err, setErr] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    const query = dq.trim();
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
  }, [dq]);

  const groups = useMemo(() => normalizeGroups(apiData), [apiData]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

      {/* Search row */}
      <div className="p-5 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Search Corpseed
            </label>

            <div className="mt-2 flex items-center gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services, knowledge, updates… (e.g., IMEI, EPR, BIS)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm
                           outline-none transition
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setQ("")}
                className="shrink-0 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm
                           text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-600">
              {loading
                ? "Searching…"
                : q.trim()
                  ? groups.length
                    ? `Showing results for “${q.trim()}”`
                    : `No results found for “${q.trim()}”`
                  : "Tip: try “IMEI”, “EPR”, “BIS”, “Pollution NOC”…"}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-5 md:p-6">
        {err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : !q.trim() ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">
              Start typing to search
            </p>
            <p className="mt-1 text-sm text-slate-600">
              We’ll show Services, Knowledge Centre, Compliance Updates, Industries and more.
            </p>
          </div>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-52 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : groups.length ? (
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(([groupTitle, list]) => (
              <div key={groupTitle} className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-blue-600 tracking-tight">
                    {groupTitle}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                    {list.length}
                  </span>
                </div>

                <ul className="mt-3 space-y-2">
                  {list.slice(0, 7).map((x) => (
                    <li key={x?.url || x?.slug || x?.name}>
                      <Link
                        href={x?.url || "#"}
                        className="block rounded-xl border border-slate-200 bg-white px-3 py-3
                                   text-[13px] leading-5 text-slate-700
                                   hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                      >
                        <div className="font-semibold">{x?.name}</div>
                        {x?.track ? (
                          <div className="mt-0.5 text-[12px] text-slate-500">
                            {x.track}
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>

                {list.length > 7 ? (
                  <div className="mt-3">
                    <Link
                      href="/service"
                      className="text-[12px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View more →
                    </Link>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-900">No results found.</p>
            <p className="mt-1 text-sm text-slate-600">
              Try keywords like <span className="font-semibold">EPR</span>,{" "}
              <span className="font-semibold">BIS</span>,{" "}
              <span className="font-semibold">NOC</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
