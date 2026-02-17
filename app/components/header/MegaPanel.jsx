"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSideKeys, isGroupObject, isLinksArray } from "./helpers";

function renderLinksList(list) {
  return (
    <ul className="space-y-2 pl-3">
      {(list || []).map((x) => (
        <li key={x?.url || x?.slug || x?.name}>
          <Link
            href={x?.url || (x?.slug ? `/service/${x.slug}` : "#")}
            className="block text-[13px] leading-5 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {x?.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ✅ ONLY for Corpseed Info: 3 columns => 2 rows for 6 items
function renderAboutGrid(list) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {(list || []).map((x) => (
        <Link
          key={x?.url || x?.slug || x?.name}
          href={x?.url || (x?.slug ? `/service/${x.slug}` : "#")}
          className="text-[13px] leading-5 text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          {x?.name}
        </Link>
      ))}
    </div>
  );
}

// ✅ helper: decide which "More" button to show
function getMoreHref(items = []) {
  const hasService = items.some(
    (it) => typeof it?.url === "string" && it.url.startsWith("/service"),
  );
  const hasIndustries = items.some(
    (it) => typeof it?.url === "string" && it.url.startsWith("/industries"),
  );

  if (hasIndustries) return "/industries";
  if (hasService) return "/service";
  return "";
}

export default function MegaPanel({ open, navKey, menuMap, loading }) {
  const item = navKey ? menuMap[navKey] : null;
  const categoryMap = item?.categoryMap;

  const sideKeys = useMemo(() => getSideKeys(categoryMap), [categoryMap]);
  const [activeSide, setActiveSide] = useState("");

  useEffect(() => {
    if (open && sideKeys.length) setActiveSide(sideKeys[0]);
  }, [open, sideKeys]);

  if (!open) return null;

  const RIGHT_HEIGHT = "max-h-[520px]";
  const ABOUT_SIDES = new Set(["Corpseed Info", "About"]);

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
            {/* LEFT SIDE */}
            <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                </div>
              ) : !item ? (
                <p className="text-sm text-slate-600">Menu data not available.</p>
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
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-12 lg:col-span-9">
              <div
                className={[
                  RIGHT_HEIGHT,
                  "overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] p-5",
                ].join(" ")}
              >
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
                  (() => {
                    const sideVal = categoryMap?.[activeSide];

                    const renderGroupBlock = (groupTitle, list) => {
                      const items = Array.isArray(list) ? list : [];

                      // ✅ detect "More" target
                      const moreHref = getMoreHref(items);

                      return (
                        <div key={groupTitle} className="min-w-0 flex flex-col h-[220px]">
                          {/* Section Title */}
                          <p className="text-sm font-semibold text-blue-500 tracking-tight mb-3">
                            {groupTitle}
                          </p>

                          {/* Scrollable List */}
                          <div className="flex-1 overflow-y-auto pr-2">
                            {renderLinksList(items)}
                          </div>

                          {/* ✅ MORE BUTTON */}
                          {moreHref && (
                            <div className="pt-2">
                              <Link
                                href={moreHref}
                                className="text-[13px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                More →
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    };

                    const renderGroupsColumnsLocal = (groupsObj) => {
                      const groupKeys = Object.keys(groupsObj || {});
                      return (
                        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                          {groupKeys.map((groupTitle) =>
                            renderGroupBlock(groupTitle, groupsObj[groupTitle]),
                          )}
                        </div>
                      );
                    };

                    // ✅ sideVal is a list (not group object)
                    if (isLinksArray(sideVal)) {
                      const isAbout = ABOUT_SIDES.has(String(activeSide || "").trim());
                      const moreHref = getMoreHref(sideVal);

                      return (
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-blue-700">
                            {activeSide}
                          </p>

                          {isAbout ? (
                            renderAboutGrid(sideVal)
                          ) : (
                            <div className="mt-3">{renderLinksList(sideVal)}</div>
                          )}

                          {/* ✅ MORE BUTTON for list sections too */}
                          {moreHref && (
                            <div className="pt-3">
                              <Link
                                href={moreHref}
                                className="text-[13px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                More →
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (isGroupObject(sideVal)) return renderGroupsColumnsLocal(sideVal);

                    return (
                      <p className="text-sm text-slate-600">
                        No data available for this section.
                      </p>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
