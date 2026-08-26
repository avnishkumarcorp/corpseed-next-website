"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Portal from "../ui/Portal";

const GRID_KEYS_ORDER = [
  "Services",
  "Knowledge Center",
  "Knowledge Centre",
  "Compliance Updates",
  "Industries",
];

/** Shown before the user types — turns an empty box into a discovery surface. */
const POPULAR_SEARCHES = [
  { label: "EPR Authorisation", href: "/service/epr-authorization" },
  { label: "BIS Certification", href: "/service/bis-certification" },
  { label: "FSSAI Licence", href: "/service/fssai-basic-registration-renewal" },
  { label: "Factory Licence", href: "/service/factory-license" },
  { label: "CDSCO Registration", href: "/service/cdsco-online-registration" },
  { label: "Import Export Code", href: "/service/import-export-code" },
];

const TRENDING = [
  { label: "Plastic Waste (PWM)", href: "/service/plastic-waste-management-authorization" },
  { label: "E-Waste (EWM)", href: "/service/e-waste-management-authorization" },
  { label: "Environmental Clearance", href: "/service/environmental-clearance" },
  { label: "ISO Certification", href: "/service/iso-certification-consulting" },
];

function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Types the placeholder out character by character so the search box keeps
 * suggesting what it can do without the jarring instant swap.
 */
function useTypewriterPlaceholder(items, { active = true } = {}) {
  const [text, setText] = React.useState(items?.[0] || "");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!active || !items?.length) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setText(items[index % items.length]);
      const swap = setInterval(
        () => setIndex((v) => (v + 1) % items.length),
        3000,
      );
      return () => clearInterval(swap);
    }

    const full = items[index % items.length];
    let char = 0;
    let holdTimer;

    const typer = setInterval(() => {
      char += 1;
      setText(full.slice(0, char));

      if (char >= full.length) {
        clearInterval(typer);
        holdTimer = setTimeout(
          () => setIndex((v) => (v + 1) % items.length),
          2200,
        );
      }
    }, 28);

    return () => {
      clearInterval(typer);
      clearTimeout(holdTimer);
    };
  }, [items, index, active]);

  return text;
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

function SearchIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HeroSearch({
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  size = "md",
  placeholders = [
    "Search 500+ services — try “EPR”",
    "Search 500+ services — try “BIS”",
    "Search 500+ services — try “Factory licence”",
  ],
}) {
  const router = useRouter();

  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const abortRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 180);

  const [loading, setLoading] = React.useState(false);
  const [apiData, setApiData] = React.useState(null);
  const [err, setErr] = React.useState("");
  const [panelStyle, setPanelStyle] = React.useState(null);

  const isLarge = size === "lg";
  const placeholder = useTypewriterPlaceholder(placeholders, {
    active: !q && !open,
  });

  /* ------------------------------------------------ close on outside/esc */
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    const onPointerDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown, true);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown, true);
    };
  }, [open]);

  /* ------------------------------------------------------------- fetching */
  React.useEffect(() => {
    if (!open) return;

    const query = dq.trim();

    if (query.length < 2) {
      setApiData(null);
      setErr("");
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(
          `/api/search/service-industry-blog/${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        setApiData(await res.json());
      } catch (e) {
        if (e?.name === "AbortError") return;
        setErr("Something went wrong. Please try again.");
        setApiData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [dq, open, baseUrl]);

  /* ------------------------------------------------------ panel placement */
  React.useEffect(() => {
    if (!open) return;

    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPanelStyle({ left: r.left, top: r.bottom + 10, width: r.width });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const groups = React.useMemo(() => normalizeGroups(apiData), [apiData]);
  const typed = q.trim();
  const hasResults = groups.length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!typed) {
      inputRef.current?.focus();
      return;
    }
    setOpen(false);
    router.push(`/category/all?q=${encodeURIComponent(typed)}`);
  };

  const clear = () => {
    setQ("");
    setApiData(null);
    setErr("");
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        role="search"
        onSubmit={submit}
        className={[
          "flex items-center gap-2 rounded-2xl border bg-white transition",
          "border-slate-200 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.5)]",
          "focus-within:border-blue-500 focus-within:shadow-[0_16px_38px_-22px_rgba(37,99,235,0.65)] focus-within:ring-4 focus-within:ring-blue-100",
          isLarge ? "px-3 py-2 sm:px-4 sm:py-2.5" : "px-3 py-2",
        ].join(" ")}
      >
        <span className="pl-0.5 text-slate-400">
          <SearchIcon className={isLarge ? "h-6 w-6" : "h-5 w-5"} />
        </span>

        <label htmlFor="hero-search" className="cs-sr-only">
          Search Corpseed services
        </label>

        <input
          id="hero-search"
          ref={inputRef}
          type="search"
          value={q}
          autoComplete="off"
          onChange={(e) => {
            setQ(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={[
            "w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400",
            "text-slate-900 [&::-webkit-search-cancel-button]:hidden",
            isLarge ? "py-2.5 text-[15px] sm:text-[16px]" : "py-2 text-[14px]",
          ].join(" ")}
        />

        {q ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="shrink-0 rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Clear
          </button>
        ) : null}

        <button
          type="submit"
          className={[
            "shrink-0 cs-btn cs-btn--primary",
            isLarge ? "!min-h-[44px] !px-5" : "!min-h-[38px] !px-4 !text-[13px]",
          ].join(" ")}
        >
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">
            <SearchIcon className="h-5 w-5" />
          </span>
        </button>
      </form>

      {/* Trending shortcuts, always visible — discovery without typing */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="text-[12.5px] font-semibold text-slate-500">
          Popular:
        </span>
        {POPULAR_SEARCHES.slice(0, 4).map((s) => (
          <Link key={s.href} href={s.href} className="cs-chip !min-h-[30px] !text-[12.5px]">
            {s.label}
          </Link>
        ))}
      </div>

      {open && panelStyle ? (
        <Portal>
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              left: panelStyle.left,
              top: panelStyle.top,
              width: panelStyle.width,
              zIndex: 999999,
            }}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_70px_-30px_rgba(15,23,42,0.55)]">
              <div className="max-h-[58vh] overflow-y-auto p-4 [scrollbar-gutter:stable]">
                {err ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[14px] text-red-700">
                    {err}
                  </div>
                ) : loading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : typed.length < 2 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SuggestionList
                      title="Most requested"
                      items={POPULAR_SEARCHES}
                      onPick={() => setOpen(false)}
                    />
                    <SuggestionList
                      title="Trending this month"
                      items={TRENDING}
                      onPick={() => setOpen(false)}
                    />
                  </div>
                ) : hasResults ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {groups.map(([groupTitle, list]) => (
                      <div key={groupTitle} className="min-w-0">
                        <div className="mb-2.5 flex items-center justify-between">
                          <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500">
                            {groupTitle}
                          </p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {list.length}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {list.slice(0, 6).map((x) => (
                            <Link
                              key={x?.url || x?.slug || x?.name}
                              href={x?.url || "#"}
                              onClick={() => setOpen(false)}
                              className="group flex items-start justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50"
                            >
                              <span className="min-w-0 text-[14px] leading-snug text-slate-800 group-hover:text-blue-700">
                                {x?.name}
                              </span>
                              <span className="mt-0.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600">
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[14px] font-semibold text-slate-900">
                      No matches for “{typed}”.
                    </p>
                    <p className="mt-1 text-[13.5px] text-slate-600">
                      Try a shorter term, or talk to an expert — we cover 500+
                      services.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.slice(0, 4).map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className="cs-chip !min-h-[30px] !text-[12.5px]"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-2.5">
                <p className="text-[11.5px] text-slate-500">
                  Press <kbd className="rounded border border-slate-300 bg-white px-1 font-sans">Esc</kbd>{" "}
                  to close
                </p>
                <Link
                  href="/category/all"
                  onClick={() => setOpen(false)}
                  className="cs-link-arrow !text-[12px]"
                >
                  Browse all 500+ services
                  <span className="cs-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}

function SuggestionList({ title, items, onPick }) {
  return (
    <div className="min-w-0">
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500">
        {title}
      </p>
      <div className="space-y-1.5">
        {items.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            onClick={onPick}
            className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <SearchIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate text-[14px] text-slate-800 group-hover:text-blue-700">
                {s.label}
              </span>
            </span>
            <span className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
