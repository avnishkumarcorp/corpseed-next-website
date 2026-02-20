"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

function buildQueryString(next) {
  const params = new URLSearchParams();
  if (next.page) params.set("page", String(next.page));
  if (next.size) params.set("size", String(next.size));
  if (next.q) params.set("q", String(next.q));
  if (next.categorySlug) params.set("categorySlug", String(next.categorySlug));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function normalizeMapToList(mapObj) {
  const obj = mapObj && typeof mapObj === "object" ? mapObj : {};
  return Object.entries(obj)
    .map(([slug, title]) => ({ slug, title }))
    .filter((x) => x.slug && x.title);
}

export default function NewsSearchBox({ defaultValue = "", size, categorySlug }) {
  const router = useRouter();

  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const trimmed = useMemo(() => value.trim(), [value]);

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  // Fetch suggestions (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!trimmed) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        const res = await fetch(
          `/api/search/news/epr?q=${encodeURIComponent(trimmed)}`,
          { signal: abortRef.current.signal, cache: "no-store" },
        );

        const json = await res.json().catch(() => ({}));
        const list = normalizeMapToList(json?.data);

        setItems(list);
        setOpen(true);
        setActiveIdx(list.length ? 0 : -1);
      } catch (e) {
        // ignore abort
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmed]);

  function goToSearch(q) {
    const href = `/news${buildQueryString({
      page: 1,
      size,
      q,
      categorySlug,
    })}`;
    router.push(href);
    setOpen(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    goToSearch(trimmed);
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(items.length - 1, (p < 0 ? 0 : p + 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(0, (p < 0 ? 0 : p - 1)));
    } else if (e.key === "Enter") {
      // If a dropdown item is selected, go directly to slug page
      if (activeIdx >= 0 && items[activeIdx]) {
        e.preventDefault();
        router.push(`/news/${items[activeIdx].slug}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      <form onSubmit={onSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => trimmed && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search news..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-20 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold text-slate-600">
              {loading ? "Searching…" : items.length ? "Suggestions" : "No results"}
            </p>

            {trimmed ? (
              <button
                onClick={() => goToSearch(trimmed)}
                className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
              >
                View all →
              </button>
            ) : null}
          </div>

          {items.length ? (
            <ul className="max-h-80 overflow-auto py-2">
              {items.map((x, idx) => {
                const active = idx === activeIdx;
                return (
                  <li key={x.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        // go directly to that news detail page
                        router.push(`/news/${x.slug}`);
                        setOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm cursor-pointer ${
                        active ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <p className="line-clamp-2 font-semibold text-slate-900">
                        {x.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">/{x.slug}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-4 text-sm text-slate-600">
              Try a different keyword.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
