"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, X } from "lucide-react";

import ServiceSearchBox from "./ServiceSearchBox";
import TalkToExpertCard from "./TalkToExpertCard";
import ConsultNowModal from "../components/ConsultNowModal";
import { useRouter, useSearchParams } from "next/navigation";

// ... keep your helpers safeText, clamp, normalizeLabel

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

export default function ServicesCatalogue({ apiData, activeSlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = apiData?.allCategories || [];
  const pageTitle = apiData?.title || "All Categories";
  const pageDesc =
    apiData?.metaDescription ||
    "Select a category and explore services tailored to your needs.";
  const [query, setQuery] = useState("");
  const [consultOpen, setConsultOpen] = useState(false);

  const slugFromUrl = searchParams.get("category");

  const initialActiveId = useMemo(() => {
    if (!activeSlug || activeSlug === "all") return null;

    const matched = categories.find((c) => c.slug === activeSlug);

    return matched?.id || null;
  }, [activeSlug, categories]);

  const [activeId, setActiveId] = useState(initialActiveId);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeId) || categories?.[0] || null;
  }, [categories, activeId]);

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

  const popularChips = useMemo(() => {
    const sorted = [...allServices]
      .sort((a, b) => (a.sequence ?? 999999) - (b.sequence ?? 999999))
      .slice(0, 6)
      .map((x) => x.title);
    return Array.from(new Set(sorted)).slice(0, 5);
  }, [allServices]);

  const normalizedQ = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (normalizedQ) {
      return allServices.filter((s) => {
        const hay =
          `${s.title} ${s.summary} ${s.serviceName} ${s.categoryTitle}`.toLowerCase();
        return hay.includes(normalizedQ);
      });
    }

    // 🔥 If no activeId → show ALL
    if (!activeId) {
      return allServices;
    }

    const list = activeCategory?.serviceMiniResponseDTOS || [];

    return list.map((s) => ({
      ...s,
      categoryId: activeCategory?.id,
      categoryTitle: activeCategory?.title,
      categorySlug: activeCategory?.slug,
    }));
  }, [normalizedQ, allServices, activeCategory, activeId]);

  const suggestions = useMemo(() => {
    if (!normalizedQ) return [];
    return filtered.slice(0, 12);
  }, [normalizedQ, filtered]);

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

          {/* ✅ NEW Search */}
          <ServiceSearchBox
            value={query}
            onChange={setQuery}
            suggestions={suggestions}
            popular={popularChips}
          />
        </div>

        {/* Layout */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Categories */}
          <aside className="order-1 lg:order-none lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="sticky top-24">
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 max-h-[80vh] overflow-auto">
                  {(categories || []).map((c) => {
                    const active = !query && c.id === activeId;
                    const img = c.icon;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setActiveId(c.id);
                          router.push(`/category/${c.slug}`);
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
                            {img ? (
                              <Image
                                src={img}
                                alt={c.subCategoryName || "category"}
                                width={40}
                                height={40}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold">
                                {(c.subCategoryName || "C")
                                  .slice(0, 1)
                                  .toUpperCase()}
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
                              {c.subCategoryName}
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

                {/* ✅ Reusable CTA */}
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

              <TalkToExpertCard
                isCategory={true}
                onClick={() => setConsultOpen(true)}
              />
            </div>

            {/* Smooth transition wrapper */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <TalkToExpertCard onClick={() => setConsultOpen(true)} />
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

      {/* ✅ Modal */}
      <ConsultNowModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        title="Consult Now"
        consultNow={true}
        categoryId={activeId}
      />
    </section>
  );
}
