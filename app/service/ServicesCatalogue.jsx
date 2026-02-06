"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";

function safeText(v) {
  return (v || "").toString();
}

function clamp(str = "", n = 130) {
  const s = safeText(str);
  return s.length > n ? s.slice(0, n).trim() + "…" : s;
}

function normalizeLabel(label = "") {
  // turn "Start Business\nIn India" style into one line
  return safeText(label).replace(/\s+/g, " ").trim();
}

export default function ServicesCatalogue({ apiData }) {
  const categories = apiData?.allCategories || [];
  const pageTitle = apiData?.title || "All Categories";
  const pageDesc =
    apiData?.metaDescription ||
    "Select a category and explore services tailored to your needs.";

  const [activeId, setActiveId] = useState(categories?.[0]?.id);
  const [query, setQuery] = useState("");

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeId) || categories?.[0] || null;
  }, [categories, activeId]);

  // Flatten services for global search
  const allServices = useMemo(() => {
    return (categories || []).flatMap((cat) =>
      (cat.serviceMiniResponseDTOS || []).map((s) => ({
        ...s,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categorySlug: cat.slug,
      })),
    );
  }, [categories]);

  // Popular chips: first few services by sequence across all categories
  const popularChips = useMemo(() => {
    const sorted = [...allServices]
      .sort((a, b) => (a.sequence ?? 999999) - (b.sequence ?? 999999))
      .slice(0, 6)
      .map((x) => x.title);
    return Array.from(new Set(sorted)).slice(0, 5);
  }, [allServices]);

  const normalizedQ = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    // If searching: global search
    if (normalizedQ) {
      return allServices.filter((s) => {
        const hay =
          `${s.title} ${s.summary} ${s.serviceName} ${s.categoryTitle}`.toLowerCase();
        return hay.includes(normalizedQ);
      });
    }

    // otherwise: active category services
    const list = activeCategory?.serviceMiniResponseDTOS || [];
    return list.map((s) => ({
      ...s,
      categoryId: activeCategory?.id,
      categoryTitle: activeCategory?.title,
      categorySlug: activeCategory?.slug,
    }));
  }, [normalizedQ, allServices, activeCategory]);

  const suggestions = useMemo(() => {
    if (!normalizedQ) return [];
    return filtered.slice(0, 7);
  }, [normalizedQ, filtered]);

  const iconUrl = (icon) => {
    if (!icon) return null;
    // Adjust this path based on your backend image hosting
    // Example assumes icon is just filename and served from /uploads or /assets
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${icon}`.replace(
      /([^:]\/)\/+/g,
      "$1",
    );
  };

  return (
    <section className="bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Explore categories & services
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{pageDesc}</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[420px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services (e.g., EPR, NOC, BIS, Recycling...)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Clear
                  </span>
                </button>
              ) : null}
            </div>

            {/* Popular chips */}
            {!query && popularChips.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {popularChips.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuery(t)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Suggestions dropdown */}
            {query && suggestions.length ? (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="px-3 py-2 text-xs font-semibold text-slate-600">
                  Suggestions
                </div>
                <div className="max-h-80 overflow-auto">
                  {suggestions.map((s) => (
                    <Link
                      key={s.uuid || s.slug}
                      href={`/service/${s.slug}`}
                      className="flex items-start gap-3 px-3 py-3 hover:bg-slate-50"
                    >
                      <div className="mt-0.5 h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">
                        {safeText(s.title).slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {s.title}
                          </p>
                          <span className="shrink-0 text-[10px] text-slate-500">
                            • {normalizeLabel(s.categoryTitle)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {clamp(s.summary, 90)}
                        </p>
                      </div>
                      <ArrowRight className="ml-auto mt-1 h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Layout */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Categories */}
          <aside className="order-1 lg:order-none lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="sticky top-24">
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {(categories || []).map((c) => {
                    const active = !query && c.id === activeId;
                    const img = c.icon;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setQuery(""); // reset search when switching category
                          setActiveId(c.id);
                        }}
                        className={[
                          "group rounded-2xl border px-3 py-3 text-left transition cursor-pointer",
                          active
                            ? "border-blue-200 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden",
                              active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100",
                            ].join(" ")}
                          >
                            {console.log("fdkjdkjhkdhkdhdk", img)}
                            {img ? (
                              <Image
                                src={img || ""}
                                alt={c.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold">
                                {safeText(c.title).slice(0, 1).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={[
                                "text-sm font-semibold leading-5",
                                active ? "text-blue-700" : "text-slate-800",
                              ].join(" ")}
                            >
                              {c.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {(c.serviceMiniResponseDTOS?.length || 0) +
                                " services"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* CTA box */}
                <div className="mt-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-sm">
                  <p className="text-xs font-semibold opacity-90">Need help?</p>
                  <p className="mt-1 text-lg font-extrabold tracking-tight">
                    Talk to an Expert
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/90">
                    Get free guidance on the right service, documents &
                    timeline.
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white cursor-pointer"
                  >
                    Get Free Consultation
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Services */}
          <main className="order-2 lg:order-none lg:col-span-9">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {query ? (
                  <>
                    Results for <span className="font-semibold">“{query}”</span>{" "}
                    <span className="ml-2 text-xs text-slate-500">
                      ({filtered.length} found)
                    </span>
                  </>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold">
                      {activeCategory?.title || "Services"}
                    </span>{" "}
                    <span className="ml-2 text-xs text-slate-500">
                      ({filtered.length})
                    </span>
                  </>
                )}
              </p>

              <Link
                href="/contact"
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:inline-flex cursor-pointer"
              >
                Talk to an expert
              </Link>
            </div>

            {/* Smooth transition wrapper */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered
                  .slice()
                  .sort(
                    (a, b) => (a.sequence ?? 999999) - (b.sequence ?? 999999),
                  )
                  .map((s) => (
                    <Link
                      key={s.uuid || s.slug}
                      href={`/service/${s.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold leading-snug text-slate-900">
                          {s.title}
                        </h3>

                        {/* small badge for top sequence */}
                        {(s.sequence ?? 9999) <= 5 ? (
                          <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                            Popular
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {clamp(s.summary, 140)}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                        Explore more{" "}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </div>

                      <div className="mt-3 text-[11px] text-slate-500">
                        {normalizeLabel(s.categoryTitle)}
                      </div>
                    </Link>
                  ))}
              </div>

              {!filtered.length ? (
                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-base font-semibold text-slate-900">
                    No services found.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Try keywords like{" "}
                    <span className="font-semibold">“EPR”</span>,{" "}
                    <span className="font-semibold">“NOC”</span>,{" "}
                    <span className="font-semibold">“BIS”</span>.
                  </p>
                </div>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
