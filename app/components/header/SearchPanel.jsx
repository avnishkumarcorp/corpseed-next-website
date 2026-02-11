"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { normalizeGroups, useDebouncedValue } from "./helpers";

export default function SearchPanel({ open, onClose, topOffset = 72 }) {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [err, setErr] = useState("");

  const abortRef = useRef(null);
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on ESC + outside click
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    const onMouse = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouse);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouse);
    };
  }, [open, onClose]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQ("");
      setApiData(null);
      setErr("");
      setLoading(false);
      if (abortRef.current) abortRef.current.abort();
    }
  }, [open]);

  // Fetch on query
  useEffect(() => {
    if (!open) return;

    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `/api/search/service-industry-blog/${encodeURIComponent(query)}`;
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

  const groups = useMemo(() => normalizeGroups(apiData), [apiData]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={[
        "fixed left-0 right-0 z-[9999]",
        "origin-top transition-all duration-200 ease-out",
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
      ].join(" ")}
      style={{ top: topOffset }}
    >
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div
          ref={panelRef}
          className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

          <div className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search services, knowledge, updates… (e.g., IMEI, EPR, BIS)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
                             outline-none transition
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
                             text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold
                             text-white hover:bg-blue-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
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

          <div className="max-h-[68vh] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] p-5">
            {err ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {err}
              </div>
            ) : !q.trim() ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Start typing to search</p>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll show Services, Knowledge Center, Department Updates, Industries and more.
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

                    <ul className="mt-3 space-y-2 pl-1">
                      {list.slice(0, 7).map((x) => (
                        <li key={x?.url || x?.slug || x?.name}>
                          <Link
                            href={x?.url || "#"}
                            className="block rounded-lg px-2 py-2 text-[13px] leading-5
                                       text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                            onClick={onClose}
                          >
                            <div className="font-medium">{x?.name}</div>
                            {x?.track ? (
                              <div className="text-[12px] text-slate-500">{x.track}</div>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {list.length > 7 ? (
                      <div className="mt-3">
                        <Link
                          href="/service"
                          className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={onClose}
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
                  Try different keywords like <span className="font-semibold">EPR</span>,{" "}
                  <span className="font-semibold">BIS</span>,{" "}
                  <span className="font-semibold">NOC</span>.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                Press <span className="font-semibold">Esc</span> to close
              </p>
              <Link
                href="/service"
                onClick={onClose}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Go to Services Catalogue →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
