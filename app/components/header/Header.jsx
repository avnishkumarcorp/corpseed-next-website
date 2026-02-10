"use client";
import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/CORPSEED.webp";

/* -------------------------
   CONFIG
-------------------------- */
const NAV_ITEMS = [
  { label: "About", key: "Who We Are" },
  { label: "Environmental Compliance", key: "Environment & Sustainability" },
  { label: "Factory Setup", key: "Project Planning & Setup" },
  { label: "Compliance", key: "Compliance Solutions" },
  { label: "Industries Setup", key: "Industries Solutions" },
];

const ALL_CORPSEED_ALLOWED_KEYS = [
  "Compliance Updates",
  "Knowledge Centre",
  "NewsRoom",
  "Product Based Services",
];

const ALL_CORPSEED_ROUTE_MAP = {
  "Compliance Updates": "/compliance-updates",
  "Knowledge Centre": "/knowledge-centre",
  NewsRoom: "/news-room",
  "Product Based Services": "/products",
};

/**
 * ✅ Mobile fallback routes (so top tabs always work even if API missing)
 * Update these to your real routes.
 */
const MOBILE_FALLBACK_ROUTES = {
  "Who We Are": "/about",
  "Environment & Sustainability": "/environmental-compliance",
  "Project Planning & Setup": "/factory-setup",
  "Compliance Solutions": "/compliance",
  "Industries Solutions": "/industries",
};

const GRID_KEYS_ORDER = [
  "Services",
  "Product Based Services",
  "Knowledge Center",
  "Knowledge Centre",
  "Department Updates",
  "Compliance Updates",
  "Industries",
];

/* -------------------------
   HELPERS
-------------------------- */
function buildMenuMap(menuData) {
  const map = {};
  (menuData || []).forEach((item) => {
    if (item?.serviceMenu) map[item.serviceMenu] = item;
  });
  return map;
}

function getSideKeys(categoryMap) {
  if (!categoryMap || typeof categoryMap !== "object") return [];
  return Object.keys(categoryMap);
}

function isLinksArray(v) {
  return Array.isArray(v);
}

function isGroupObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

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

function Chevron({ open }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "transition-transform duration-200",
        open ? "rotate-90" : "rotate-0",
      ].join(" ")}
      aria-hidden="true"
    >
      ▶
    </span>
  );
}

/* -------------------------
   DESKTOP: SEARCH PANEL
-------------------------- */
const FullWidthSearchPanel = React.memo(function FullWidthSearchPanel({
  open,
  onClose,
  baseUrl,
  topOffset = 72,
}) {
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

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
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

        const url = `${baseUrl}/search/service-industry-blog/${encodeURIComponent(
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
  }, [dq, open, baseUrl]);

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
                <p className="text-sm font-semibold text-slate-900">
                  Start typing to search
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll show Services, Knowledge Center, Department Updates,
                  Industries and more.
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
                              <div className="text-[12px] text-slate-500">
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
                <p className="text-sm font-semibold text-slate-900">
                  No results found.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Try different keywords like{" "}
                  <span className="font-semibold">EPR</span>,{" "}
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
});

/* -------------------------
   DESKTOP: MegaPanel + AllCorpseedDropdown (as you have)
-------------------------- */
function renderLinksList(list) {
  return (
    <ul className="space-y-2 pl-3">
      {list.map((x) => (
        <li key={x?.url || x?.slug || x?.name}>
          <Link
            href={x?.url || "#"}
            className="block text-[13px] leading-5 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {x?.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaPanel({ open, navKey, menuMap, loading }) {
  const item = navKey ? menuMap[navKey] : null;
  const categoryMap = item?.categoryMap;

  const sideKeys = useMemo(() => getSideKeys(categoryMap), [categoryMap]);
  const [activeSide, setActiveSide] = useState("");

  useEffect(() => {
    if (open && sideKeys.length) setActiveSide(sideKeys[0]);
  }, [open, sideKeys]);

  if (!open) return null;

  return (
    <div
      className={[
        "absolute left-0 right-0 top-full z-50",
        "origin-top",
        "transition-all duration-200 ease-out",
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                </div>
              ) : !item ? (
                <p className="text-sm text-slate-600">
                  Menu data not available.
                </p>
              ) : (
                <div className="space-y-2">
                  {sideKeys.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onMouseEnter={() => setActiveSide(k)}
                      onFocus={() => setActiveSide(k)}
                      className={[
                        "w-full text-left rounded-lg px-3 py-2",
                        "text-sm font-semibold cursor-pointer",
                        activeSide === k
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")}
                    >
                      {k}
                    </button>
                  ))}

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-700 leading-6">
                      Corpseed helps clients create long-term value for all
                      stakeholders.
                    </p>
                    <button className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white cursor-pointer">
                      Explore
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="max-h-[68vh] overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] p-5">
                {loading ? (
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
                ) : !item ? null : (
                  <>
                    {(() => {
                      const sideVal = categoryMap?.[activeSide];

                      const renderGroupBlock = (groupTitle, list) => {
                        const items = Array.isArray(list) ? list : [];
                        const visible = items.slice(0, 6);
                        const hasMore = items.length > 6;

                        return (
                          <div key={groupTitle} className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-blue-500 tracking-tight">
                                {groupTitle}
                              </p>
                            </div>

                            <div className="mt-3">
                              {renderLinksList(visible)}
                            </div>

                            {hasMore ? (
                              <div className="mt-3">
                                <Link
                                  href="/service"
                                  className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                  More &gt;&gt;
                                </Link>
                              </div>
                            ) : null}
                          </div>
                        );
                      };

                      const renderGroupsColumnsLocal = (groupsObj) => {
                        const groupKeys = Object.keys(groupsObj || {});
                        return (
                          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            {groupKeys.map((groupTitle) =>
                              renderGroupBlock(
                                groupTitle,
                                groupsObj[groupTitle],
                              ),
                            )}
                          </div>
                        );
                      };

                      if (isLinksArray(sideVal)) {
                        const visible = sideVal.slice(0, 6);
                        const hasMore = sideVal.length > 6;

                        return (
                          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                              <p className="text-sm font-semibold text-blue-700">
                                {activeSide}
                              </p>

                              <div className="mt-3">
                                {renderLinksList(visible)}
                              </div>

                              {hasMore ? (
                                <div className="mt-3">
                                  <Link
                                    href="/service"
                                    className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                  >
                                    More &gt;&gt;
                                  </Link>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      }

                      if (isGroupObject(sideVal)) {
                        return renderGroupsColumnsLocal(sideVal);
                      }

                      return (
                        <p className="text-sm text-slate-600">
                          No data available for this section.
                        </p>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllCorpseedDropdown({ open, menuMap }) {
  const allItem = menuMap?.["All Corpseed"];
  const categoryMap = allItem?.categoryMap;

  const keys =
    categoryMap && typeof categoryMap === "object"
      ? Object.keys(categoryMap)
      : [];

  const items = ALL_CORPSEED_ALLOWED_KEYS.filter((k) => keys.includes(k));

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
            <p className="text-[12px] text-slate-600">
              Explore Corpseed resources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   MOBILE: Search + Menu Drawer (FULL)
-------------------------- */
function MobileSearchInline({ baseUrl, onNavigate }) {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [err, setErr] = useState("");

  const abortRef = useRef(null);
  const groups = useMemo(() => normalizeGroups(apiData), [apiData]);

  useEffect(() => {
    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    if (!baseUrl) {
      setErr("Search base URL is missing.");
      setApiData(null);
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

        const url = `${baseUrl}/search/service-industry-blog/${encodeURIComponent(
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
  }, [dq, baseUrl]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm mb-4">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services, updates, blogs…"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm
                     outline-none transition
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm
                       text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-2 text-xs text-slate-600">
        {loading
          ? "Searching…"
          : q.trim()
            ? groups.length
              ? `Results for “${q.trim()}”`
              : `No results for “${q.trim()}”`
            : "Tip: try “EPR”, “BIS”, “IMEI”, “NOC”…"}
      </div>

      {err ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : !q.trim() ? null : loading ? (
        <div className="mt-3 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : groups.length ? (
        <div className="mt-3 space-y-4">
          {groups.slice(0, 4).map(([groupTitle, list]) => (
            <div key={groupTitle} className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-700">
                  {groupTitle}
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {list.length}
                </span>
              </div>

              <ul className="mt-2 space-y-1">
                {list.slice(0, 4).map((x) => (
                  <li key={x?.url || x?.slug || x?.name}>
                    <Link
                      href={x?.url || "#"}
                      onClick={onNavigate}
                      className="block rounded-lg px-2 py-2 text-[13px] leading-5
                                 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer"
                    >
                      <div className="font-medium">{x?.name}</div>
                      {x?.track ? (
                        <div className="text-[12px] text-slate-500">
                          {x.track}
                        </div>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2">
                <Link
                  href="/service"
                  onClick={onNavigate}
                  className="text-[12px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  View all →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileMenuSection({ title, children, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left cursor-pointer"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">Tap to expand</p>
        </div>
        <Chevron open={open} />
      </button>

      <div
        className={[
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden px-4 pb-4" style={{marginBottom:'4px'}}>{children}</div>
      </div>
    </div>
  );
}

function MobileCategoryAccordion({
  categoryTitle,
  value,
  onNavigate,
  open,
  onToggle,
}) {
  const renderGroup = (groupTitle, list) => {
    const items = Array.isArray(list) ? list : [];
    const visible = items.slice(0, 6);
    return (
      <div key={groupTitle} className="rounded-xl bg-slate-50 p-3">
        <p className="text-sm font-semibold text-blue-700">{groupTitle}</p>
        <ul className="mt-2 space-y-1">
          {visible.map((x) => (
            <li key={x?.url || x?.slug || x?.name}>
              <Link
                href={x?.url || "#"}
                onClick={onNavigate}
                className="block rounded-lg px-2 py-2 text-[13px] leading-5 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer"
              >
                {x?.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden" style={{margin:"4px 0px"}} >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-white cursor-pointer"
      >
        <p className="text-sm font-semibold text-slate-800">{categoryTitle}</p>
        <Chevron open={open} />
      </button>

      <div
        className={[
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden bg-white px-4 pb-4">
          {isLinksArray(value) ? (
            <ul className="space-y-1">
              {value.slice(0, 10).map((x) => (
                <li key={x?.url || x?.slug || x?.name}>
                  <Link
                    href={x?.url || "#"}
                    onClick={onNavigate}
                    className="block rounded-lg px-2 py-2 text-[13px] leading-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    {x?.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : isGroupObject(value) ? (
            <div className="space-y-3" style={{paddingBottom:"4px"}}>
              {Object.keys(value || {}).map((groupTitle) =>
                renderGroup(groupTitle, value[groupTitle]),
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, menuMap, loading, baseUrl, navItems }) {
  const [mounted, setMounted] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState(null);
  const [openCatByNav, setOpenCatByNav] = useState({}); // { [navKey]: "CategoryName" }

  const contentRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // lock body scroll only when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goToNav = (navKey) => {
    setActiveNavKey(navKey);

    // wait a tick so accordion can open before scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(`mobile-section-${navKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openNav = (navKey) => {
    setActiveNavKey(navKey);

    const item = menuMap?.[navKey];
    const sideKeys = Object.keys(item?.categoryMap || {});
    if (sideKeys.length) {
      setOpenCatByNav((p) => ({ ...p, [navKey]: sideKeys[0] }));
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`mobile-section-${navKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // close on ESC only when open
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-[9999]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/40 backdrop-blur-[1px]",
          "transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col", // ✅ important
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4">
            <Link href="/" onClick={onClose} className="cursor-pointer">
              <Image
                src={logo}
                alt="Corpseed"
                width={130}
                height={52}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose?.();
              }}
              className="rounded-xl  px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
               ✕
            </button>
          </div>

          <div className="px-4 pb-4">
            <MobileSearchInline baseUrl={baseUrl} onNavigate={onClose} />
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-124px)] overflow-y-auto px-4 pb-8">
          {/* ✅ Quick tiles */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/service"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer"
            >
              <p className="text-sm font-semibold text-slate-900">Services</p>
              <p className="mt-1 text-xs text-slate-600">Browse catalogue</p>
            </Link>
            <Link
              href="/knowledge-centre"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer"
            >
              <p className="text-sm font-semibold text-slate-900">
                Knowledge Centre
              </p>
              <p className="mt-1 text-xs text-slate-600">Guides & updates</p>
            </Link>
          </div>

          {/* ✅ Top navigation tabs (ALWAYS visible like desktop) */}
          <div className="mt-4 rounded-2xl overflow-hidden">


            <div className="p-2 my-1">
              {navItems.map((nav) => {
                const item = menuMap?.[nav.key];
                const categoryMap = item?.categoryMap;
                const sideKeys = Object.keys(categoryMap || {});

                return (
                  <div
                    key={nav.key}
                    id={`mobile-section-${nav.key}`}
                    className="scroll-mt-28"
                    style={{margin:"3px 0px"}}
                  >
                    <MobileMenuSection
                      title={nav.label}
                      open={activeNavKey === nav.key}
                      onToggle={() =>
                        setActiveNavKey((k) => (k === nav.key ? null : nav.key))
                      }
                    >
                      {sideKeys.map((cat) => (
                        <MobileCategoryAccordion
                          key={cat}
                          categoryTitle={cat}
                          value={categoryMap?.[cat]}
                          open={openCatByNav[nav.key] === cat}
                          onToggle={() =>
                            setOpenCatByNav((p) => ({
                              ...p,
                              [nav.key]: p[nav.key] === cat ? null : cat,
                            }))
                          }
                          onNavigate={onClose}
                        />
                      ))}
                    </MobileMenuSection>
                  </div>
                );
              })}
            </div>
          </div>



          {/* Footer */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              Need help choosing a service?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Use search above or open the Services catalogue.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/service"
                onClick={onClose}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                Explore Services
              </Link>
              <Link
                href="/contact-us"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------
   HEADER (UPDATED): Mobile drawer + desktop as-is
-------------------------- */
export default function Header({ menuData, loading }) {
  const menuMap = useMemo(() => buildMenuMap(menuData), [menuData]);

  const [openKey, setOpenKey] = useState(null);
  const closeTimerRef = useRef(null);

  const [allOpen, setAllOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const allCloseTimerRef = useRef(null);

  const open = (key) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenKey(key);
  };

  const close = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenKey(null), 120);
  };

  const openAll = () => {
    if (allCloseTimerRef.current) clearTimeout(allCloseTimerRef.current);
    setAllOpen(true);
  };

  const closeAll = () => {
    if (allCloseTimerRef.current) clearTimeout(allCloseTimerRef.current);
    allCloseTimerRef.current = setTimeout(() => setAllOpen(false), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image
              src={logo}
              alt="Corpseed"
              width={140}
              height={60}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-6 lg:flex"
            onMouseLeave={close}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onMouseEnter={() => open(item.key)}
                onFocus={() => open(item.key)}
                className={[
                  "relative px-2 py-2 text-sm font-semibold cursor-pointer",
                  "text-slate-600 hover:text-slate-800",
                  "whitespace-nowrap",
                ].join(" ")}
              >
                {item.label}
                <span
                  className={[
                    "absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition-all duration-200",
                    openKey === item.key ? "bg-blue-600" : "bg-transparent",
                  ].join(" ")}
                />
              </button>
            ))}

            <div className="ml-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Search
              </button>

              <div className="ml-6 flex items-center gap-4">
                <div
                  className="relative"
                  onMouseEnter={openAll}
                  onMouseLeave={closeAll}
                >
                  <button className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer">
                    All Corpseed
                  </button>

                  <div onMouseEnter={openAll} onMouseLeave={closeAll}>
                    <AllCorpseedDropdown open={allOpen} menuMap={menuMap} />
                  </div>
                </div>
              </div>
            </div>

            <div onMouseEnter={() => open(openKey)} onMouseLeave={close}>
              <MegaPanel
                open={!!openKey}
                navKey={openKey}
                menuMap={menuMap}
                loading={loading}
              />
            </div>
          </nav>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center justify-center text-xl rounded-lg px-3 py-2 hover:bg-slate-50 cursor-pointer"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Desktop search overlay */}
      <FullWidthSearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
        topOffset={72}
      />

      {/* Mobile drawer */}
      {mobileOpen ? (
        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          menuMap={menuMap}
          loading={loading}
          baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
          navItems={NAV_ITEMS}
        />
      ) : null}
    </header>
  );
}
