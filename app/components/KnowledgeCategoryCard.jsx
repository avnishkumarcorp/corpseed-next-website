"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

function buildQueryString(next) {
  const params = new URLSearchParams();

  if (next.page) params.set("page", String(next.page));
  if (next.q) params.set("q", String(next.q));
  if (next.filter) params.set("filter", String(next.filter));
  if (next.tag) params.set("tag", String(next.tag));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default function KnowledgeCategoryCard({
  categories = [],
  q = "",
  tag = "",
}) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return categories;

    return categories.filter((c) => {
      const name = c?.subCategoryName || c?.categoryName || "";
      return name.toLowerCase().includes(keyword);
    });
  }, [categories, search]);

  const visibleCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, 10);

  const hasMoreThanTen = filteredCategories.length > 10;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header with small search */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Categories</p>

          <div className="relative w-36">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAll(false);
              }}
              placeholder="Search"
              className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div
        className={`divide-y divide-slate-200 ${
          showAll ? "max-h-[420px] overflow-y-auto" : ""
        }`}
      >
        {visibleCategories.length > 0 ? (
          visibleCategories.map((c) => {
            const href = `/knowledge-centre${buildQueryString({
              page: 1,
              q,
              filter: c.slug,
              tag,
            })}`;

            return (
              <Link
                key={c.id ?? c.slug}
                href={href}
                className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="min-w-0 truncate">
                  {c.subCategoryName || c.categoryName}
                </span>
                <span className="ml-3 shrink-0 text-xs text-slate-400">
                  View
                </span>
              </Link>
            );
          })
        ) : (
          <div className="px-4 py-5 text-center text-sm text-slate-500">
            No category found.
          </div>
        )}
      </div>

      {/* Small footer */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5">
        {/* <span className="text-xs text-slate-500">
          Showing {visibleCategories.length} of {filteredCategories.length}
        </span> */}

        {hasMoreThanTen ? (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
