"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * You can still keep this fallback if needed
 */
const FALLBACK_DATA = {
  title: "Our Exclusive Services",
  cta: { label: "SEE ALL SERVICES", href: "/service" },
  specialCategories: [],
  cardCategories: [],
};

/**
 * Reusable section
 * @param {object} props.data - your API response object
 * @param {string} props.defaultTabKey
 * @param {boolean} props.showDots
 */
export default function CardCarousel({
  data = FALLBACK_DATA,
  defaultTabKey,
  showDots = false,
}) {
  // ---------- 1) Pick source array from API ----------
  const sourceList = useMemo(() => {
    if (Array.isArray(data?.specialCategories) && data.specialCategories.length)
      return data.specialCategories;

    if (Array.isArray(data?.cardCategories) && data.cardCategories.length)
      return data.cardCategories;

    // if someone passes already-normalized
    if (Array.isArray(data?.tabs) && data?.itemsByTab) return [];

    return [];
  }, [data]);

  // ---------- 2) Build tabs + itemsByTab from API ----------
  const normalized = useMemo(() => {
    // If already normalized, use as-is
    if (Array.isArray(data?.tabs) && data?.itemsByTab) {
      return {
        title: data?.title || "Our Exclusive Services",
        cta: data?.cta || { label: "SEE ALL SERVICES", href: "/services" },
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
            href: s?.slug ? `/service/${s.slug}` : "#", // ✅ change if your route is /service/[slug]
          }))
        : [];

      return acc;
    }, {});

    return {
      title: data?.title || "Our Exclusive Services",
      cta: data?.cta || { label: "SEE ALL SERVICES", href: "/service" },
      tabs,
      itemsByTab,
    };
  }, [data, sourceList]);

  // ---------- 3) Safe values ----------
  const title ="Our Exclusive Services";

  const ctaLabel = normalized?.cta?.label || "SEE ALL SERVICES";
  const ctaHref = normalized?.cta?.href || "/services";

  const tabs = Array.isArray(normalized?.tabs) ? normalized.tabs : [];
  const itemsByTab =
    normalized?.itemsByTab && typeof normalized.itemsByTab === "object"
      ? normalized.itemsByTab
      : {};

  // Pick a safe initial tab
  const initialTab =
    defaultTabKey ||
    (tabs[0]?.key ?? (Object.keys(itemsByTab)[0] || "default"));

  const [activeTab, setActiveTab] = useState(initialTab);

  // If tabs/data change, keep activeTab valid
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
    <section className="relative bg-[#EEF6FF] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>

        {/* Tabs */}
        {tabs?.length > 0 && (
          <div className="mt-2 flex justify-center">
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
          </div>
        )}

        {/* Carousel */}
        <div className="mt-2">
          <ServicesCarousel items={items} showDots={showDots} />
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tabs ---------------- */
function Tabs({ tabs = [], activeKey, onChange }) {
  const safeTabs = Array.isArray(tabs) ? tabs.filter(Boolean) : [];

  return (
    <div className="w-full max-w-5xl">
      <div className="no-scrollbar flex items-center justify-center gap-10 overflow-x-auto px-2 py-2.5">
        {safeTabs.map((t) => {
          const key = t?.key ?? t?.label;
          const label = t?.label ?? String(key ?? "");
          const isActive = key === activeKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange?.(key)}
              className={[
                "relative whitespace-nowrap text-lg font-medium cursor-pointer",
                isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600",
              ].join(" ")}
            >
              {label}
              {isActive && (
                <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Carousel ---------------- */
function ServicesCarousel({ items = [], showDots = true }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  // Track active index while scrolling (drag/trackpad/touch)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let rafId = null;

    const update = () => {
      const cards = el.querySelectorAll("[data-card]");
      if (!cards.length) {
        setActiveIndex(0);
        return;
      }

      const containerLeft = el.getBoundingClientRect().left;

      let bestIdx = 0;
      let bestDist = Infinity;

      cards.forEach((card, idx) => {
        const dist = Math.abs(
          card.getBoundingClientRect().left - containerLeft,
        );
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveIndex(bestIdx);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", onScroll);
    };
  }, [safeItems.length]);

  // Clamp activeIndex if items length changes
  useEffect(() => {
    if (activeIndex > safeItems.length - 1) setActiveIndex(0);
  }, [safeItems.length, activeIndex]);

  const scrollToIndex = (idx) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    if (!cards.length) return;

    const next = Math.max(0, Math.min(idx, cards.length - 1));
    cards[next].scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  // Empty state
  if (safeItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center text-sm text-gray-600">
        No services available right now.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className={[
          "absolute -left-10 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 md:flex cursor-pointer",
          activeIndex === 0 ? "opacity-40 cursor-pointer" : "hover:shadow-lg",
        ].join(" ")}
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={handleNext}
        disabled={activeIndex === safeItems.length - 1}
        className={[
          "absolute -right-10 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 md:flex cursor-pointer",
          activeIndex === safeItems.length - 1
            ? "opacity-40 cursor-pointer"
            : "hover:shadow-lg",
        ].join(" ")}
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollerRef}
        className={[
          "no-scrollbar flex gap-6 overflow-x-auto px-2 py-2",
          "scroll-smooth snap-x snap-mandatory",
          "touch-pan-x",
        ].join(" ")}
      >
        {safeItems.map((it, idx) => (
          <ServiceTile
            key={it?.id ? `serviceTile-${it.id}` : `tile-${idx}`} // ✅ fixed
            item={it}
          />
        ))}
      </div>

      {/* Dots */}
      {showDots && safeItems.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {safeItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={[
                "h-2.5 w-2.5 rounded-full cursor-pointer",
                i === activeIndex ? "bg-blue-600" : "bg-blue-200",
              ].join(" ")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Card ---------------- */
function ServiceTile({ item }) {
  const title = item?.title || "Untitled Service";
  const desc = item?.desc || "Description will be available soon.";
  const href = item?.href || "#";

  return (
    <div
      data-card
      className={[
        "snap-start",
        "min-w-[200px] max-w-[200px] sm:min-w-[280px] sm:max-w-[280px]",
        "rounded-2xl bg-white p-6",
        "shadow-[0_14px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/5",
        "flex flex-col",                 // ✅ IMPORTANT
        "h-[260px] sm:h-[280px]",         // ✅ fixed height (adjust if you want)
      ].join(" ")}
    >
      {/* Title */}
      <h5 className="font-medium text-lg leading-snug text-[#212529] line-clamp-2">
        {title}
      </h5>

      {/* Description area (fixed space) */}
      <p className="mt-4 text-sm leading-6 text-[#212529] line-clamp-6">
        {desc}
      </p>

      {/* ✅ Always bottom */}
      <div className="mt-auto pt-6 flex justify-end">
        <Link
          href={href}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          Explore more &nbsp;›
        </Link>
      </div>
    </div>
  );
}

