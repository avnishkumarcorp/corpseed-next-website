"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import logo from "../../assets/CORPSEED.webp";
import Image from "next/image";

// app/components/header/navConfig.js
const NAV_ITEMS = [
  { label: "About", key: "Who We Are" },
  { label: "Environmental", key: "Environment & Sustainability" },
  { label: "Factory Setup", key: "Project Planning & Setup" },
  { label: "Solutions", key: "Compliance Solutions" }, // if exists in API later
  { label: "Industries Setup", key: "Industries Solutions" }, // if exists in API later
];

function buildMenuMap(menuData) {
  const map = {};
  (menuData || []).forEach((item) => {
    if (item?.serviceMenu) map[item.serviceMenu] = item;
  });
  return map;
}

// Normalize mixed shapes:
// - Who We Are => categoryMap: { "Corpseed Info": [links...] }
// - Env => categoryMap: { "Environmental Services": { "Group": [links...] }, ... }
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
      {/* ✅ increased width */}
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-12">
            {/* ✅ Left sidebar (no scroll) */}
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

            {/* ✅ Right content (only this scrolls; half screen height) */}
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
                                <button
                                  type="button"
                                  className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                  onClick={() => {}}
                                >
                                  More &gt;&gt;
                                </button>
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
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                                    onClick={() => {}}
                                  >
                                    More &gt;&gt;
                                  </button>
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

export default function Header({ menuData, loading }) {
  const menuMap = useMemo(() => buildMenuMap(menuData), [menuData]);

  const [openKey, setOpenKey] = useState(null);
  const closeTimerRef = useRef(null);

  const open = (key) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenKey(key);
  };

  const close = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    // tiny delay prevents “jerk” when moving mouse between nav and panel
    closeTimerRef.current = setTimeout(() => setOpenKey(null), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-lg">
      {/* Main bar */}
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
                  "text-slate-800 hover:text-slate-950",
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
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                Search
              </button>
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer">
                All Corpseed
              </button>
            </div>

            {/* Mega Panel */}
            <div onMouseEnter={() => open(openKey)} onMouseLeave={close}>
              <MegaPanel
                open={!!openKey}
                navKey={openKey}
                menuMap={menuMap}
                loading={loading}
              />
            </div>
          </nav>

          {/* Mobile (basic) */}
          <button className="lg:hidden rounded-lg border border-slate-200 px-3 py-2 text-sm cursor-pointer">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
