"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_DATA = {
  title: "Popular services",
  cta: { label: "Browse all 500+ services", href: "/category/all" },
  specialCategories: [],
  cardCategories: [],
};

/**
 * Audit #2 / #7 — surface a curated set first, keep every card the same
 * shape, and label the standouts instead of decorating every tile.
 */
const FEATURED_COUNT = 3; // first N cards in each tab get a "Most popular" flag

export default function CardCarousel({ data = FALLBACK_DATA, defaultTabKey }) {
  const sourceList = useMemo(() => {
    if (Array.isArray(data?.specialCategories) && data.specialCategories.length)
      return data.specialCategories;

    if (Array.isArray(data?.cardCategories) && data.cardCategories.length)
      return data.cardCategories;

    return [];
  }, [data]);

  const normalized = useMemo(() => {
    if (Array.isArray(data?.tabs) && data?.itemsByTab) {
      return {
        cta: data?.cta || FALLBACK_DATA.cta,
        tabs: data.tabs,
        itemsByTab: data.itemsByTab,
      };
    }

    const tabs = sourceList.map((cat) => ({
      key: cat?.uuid || String(cat?.id),
      label: cat?.subCategoryName || cat?.categoryName || "Tab",
    }));

    const itemsByTab = sourceList.reduce((acc, cat) => {
      const tabKey = cat?.uuid || String(cat?.id);

      acc[tabKey] = Array.isArray(cat?.services)
        ? cat.services.map((s) => ({
            id: s?.id || s?.uuid,
            title: s?.title || s?.serviceName || "Untitled Service",
            desc: s?.summary || "Description will be available soon.",
            href: s?.slug ? `/service/${s.slug}` : "#",
          }))
        : [];

      return acc;
    }, {});

    return { cta: data?.cta || FALLBACK_DATA.cta, tabs, itemsByTab };
  }, [data, sourceList]);

  const ctaLabel = normalized?.cta?.label || FALLBACK_DATA.cta.label;
  const ctaHref = normalized?.cta?.href || FALLBACK_DATA.cta.href;

  const tabs = Array.isArray(normalized?.tabs) ? normalized.tabs : [];
  const itemsByTab =
    normalized?.itemsByTab && typeof normalized.itemsByTab === "object"
      ? normalized.itemsByTab
      : {};

  const initialTab =
    defaultTabKey || tabs[0]?.key || Object.keys(itemsByTab)[0] || "default";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const availableKeys = tabs.map((t) => t?.key).filter(Boolean);
    const fallbackKey =
      availableKeys[0] || Object.keys(itemsByTab)[0] || "default";

    if (!availableKeys.includes(activeTab) && !(activeTab in itemsByTab)) {
      setActiveTab(fallbackKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, itemsByTab]);

  const items = useMemo(() => {
    const arr = itemsByTab?.[activeTab];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  }, [activeTab, itemsByTab]);

  return (
    <section className="w-full overflow-x-hidden bg-gradient-to-b from-blue-50/80 to-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-section-head cs-section-head--split">
          <div>
            <span className="cs-eyebrow">Start here</span>
            <h2 className="cs-section-title">Popular compliance services</h2>
            <p className="cs-section-sub">
              The approvals businesses ask us for most. Pick a category, or
              search the full catalogue of 500+ services.
            </p>
          </div>

          <Link href={ctaHref} className="cs-btn cs-btn--secondary shrink-0">
            {ctaLabel}
            <span className="cs-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {tabs?.length > 0 && (
          <div className="mt-7">
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
          </div>
        )}

        <div className="mt-6">
          <ServicesCarousel items={items} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Tabs */

function Tabs({ tabs = [], activeKey, onChange }) {
  const safeTabs = Array.isArray(tabs) ? tabs.filter(Boolean) : [];

  return (
    <div
      role="tablist"
      aria-label="Service categories"
      className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1"
    >
      {safeTabs.map((t) => {
        const key = t?.key ?? t?.label;
        const label = t?.label ?? String(key ?? "");
        const isActive = key === activeKey;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(key)}
            className={[
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-semibold transition duration-200",
              isActive
                ? "border-blue-600 bg-blue-600 text-white shadow-[0_10px_22px_-14px_rgba(37,99,235,0.9)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- Carousel */

function ServicesCarousel({ items = [] }) {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  const syncArrows = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    syncArrows();

    el.addEventListener("scroll", syncArrows, { passive: true });
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", syncArrows);
      ro.disconnect();
    };
  }, [syncArrows, safeItems.length]);

  const scrollByCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;

    const card = el.querySelector("[data-service-card]");
    const step = card ? card.getBoundingClientRect().width + 20 : 300;

    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  if (safeItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <p className="text-[15px] font-semibold text-slate-900">
          Services are loading
        </p>
        <p className="mt-1 text-[14px] text-slate-600">
          Meanwhile, you can{" "}
          <Link href="/category/all" className="font-semibold text-blue-700 underline">
            browse the full catalogue
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Native scroll-snap: no timers, no layout thrash, works with touch,
          trackpad and keyboard out of the box. */}
      <div
        ref={scrollerRef}
        className="cs-scroll-x -mx-1 gap-5 px-1 pb-2 pt-1"
        tabIndex={0}
        aria-label="Popular services"
      >
        {safeItems.map((item, idx) => (
          <ServiceTile
            key={item?.id ? `service-${item.id}` : `service-${idx}`}
            item={item}
            featured={idx < FEATURED_COUNT}
          />
        ))}
      </div>

      {/* Edge fades hint at more content */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 sm:w-14",
          canPrev ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 sm:w-14",
          canNext ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {safeItems.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => scrollByCards("prev")}
            disabled={!canPrev}
            className="cs-nav-btn"
            aria-label="Previous services"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards("next")}
            disabled={!canNext}
            className="cs-nav-btn"
            aria-label="More services"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- Card */

function ServiceTile({ item, featured }) {
  const title = item?.title || "Untitled Service";
  const desc = item?.desc || "Description will be available soon.";
  const href = item?.href || "#";

  return (
    <article
      data-service-card
      className={[
        "cs-card cs-card--hover group shrink-0 p-6",
        "w-[82vw] sm:w-[300px]",
      ].join(" ")}
    >
      {featured ? (
        <span className="cs-badge cs-badge--accent mb-3 self-start">
          Most popular
        </span>
      ) : (
        <span className="cs-badge cs-badge--brand mb-3 self-start">Service</span>
      )}

      <h3 className="cs-card__title cs-clamp-2 transition-colors group-hover:text-blue-700">
        <Link href={href} className="after:absolute after:inset-0">
          {title}
        </Link>
      </h3>

      <p className="cs-card__desc mt-2.5 cs-clamp-4">{desc}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="cs-link-arrow !text-[13.5px]">
          Get a quote
          <span className="cs-arrow" aria-hidden="true">
            →
          </span>
        </span>

        <span className="text-[12px] font-medium text-slate-400">
          Flat fee
        </span>
      </div>
    </article>
  );
}
