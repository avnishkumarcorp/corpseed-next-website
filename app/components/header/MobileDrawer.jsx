// app/components/header/MobileDrawer.jsx
"use client";

import { createPortal } from "react-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import logo from "../../assets/CORPSEED.webp";
import { Chevron, isGroupObject, isLinksArray, normalizeGroups, useDebouncedValue } from "./helpers";

/* -------------------------
   MOBILE: Search + Menu Drawer (FULL)
-------------------------- */

function MobileSearchInline({ onNavigate }) {
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

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ SAME AS HERO SEARCH (proxy)
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
  }, [dq]);

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
                <p className="text-sm font-semibold text-blue-700">{groupTitle}</p>
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
                        <div className="text-[12px] text-slate-500">{x.track}</div>
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
        <div className="overflow-hidden px-4 pb-4" style={{ marginBottom: "4px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileCategoryAccordion({ categoryTitle, value, onNavigate, open, onToggle }) {
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
    <div className="rounded-2xl border border-slate-200 overflow-hidden" style={{ margin: "4px 0px" }}>
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
            <div className="space-y-3" style={{ paddingBottom: "4px" }}>
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

function MobileDrawer({ open, onClose, menuMap, loading, navItems }) {
  const [mounted, setMounted] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState(null);
  const [openCatByNav, setOpenCatByNav] = useState({}); // { [navKey]: "CategoryName" }

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
          "flex flex-col",
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
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="px-4 pb-4">
            <MobileSearchInline onNavigate={onClose} />
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-124px)] overflow-y-auto px-4 pb-8">
          {/* Quick tiles */}
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
              <p className="text-sm font-semibold text-slate-900">Knowledge Centre</p>
              <p className="mt-1 text-xs text-slate-600">Guides & updates</p>
            </Link>
          </div>

          {/* Top navigation tabs */}
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
                    style={{ margin: "3px 0px" }}
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
            <p className="text-sm font-semibold text-slate-900">Need help choosing a service?</p>
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

export default MobileDrawer;
