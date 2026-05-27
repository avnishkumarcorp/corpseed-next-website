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
            href: s?.slug ? `/service/${s.slug}` : "#",
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
  const title = "Our Exclusive Services";

  const ctaLabel = normalized?.cta?.label || "SEE ALL SERVICES";
  const ctaHref = normalized?.cta?.href || "/category/all";

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
    <section className="relative overflow-x-hidden bg-[#EEF6FF] py-8">
      <div className="mx-auto w-[calc(100%-32px)]">
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
            className="inline-flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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
      <div className="no-scrollbar flex items-center gap-6 overflow-x-auto px-2 py-2.5 md:justify-center">
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
                "relative cursor-pointer whitespace-nowrap text-lg font-medium",
                isActive
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-600",
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
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const jumpRafRef = useRef(null);
  const hoverPausedRef = useRef(false);
  const isJumpingRef = useRef(false);

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  useEffect(() => {
    return () => {
      if (jumpRafRef.current) {
        cancelAnimationFrame(jumpRafRef.current);
      }
    };
  }, []);

  const getTrackAnimation = () => {
    const track = trackRef.current;
    if (!track) return null;

    const animations = track.getAnimations?.() || [];
    return animations[0] || null;
  };

  const pauseTrack = () => {
    hoverPausedRef.current = true;

    const animation = getTrackAnimation();
    if (!animation) return;

    animation.pause();
  };

  const resumeTrack = () => {
    hoverPausedRef.current = false;

    const animation = getTrackAnimation();
    if (!animation || isJumpingRef.current) return;

    animation.play();
  };

  const getAnimationDurationMs = (track) => {
    const computedStyle = window.getComputedStyle(track);
    const durationValue = computedStyle.animationDuration || "30s";

    if (durationValue.includes("ms")) {
      return parseFloat(durationValue) || 30000;
    }

    if (durationValue.includes("s")) {
      return (parseFloat(durationValue) || 30) * 1000;
    }

    return 30000;
  };

  const smootherStep = (t) => {
    // Very smooth acceleration/deceleration
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  const moveCards = (direction) => {
    const track = trackRef.current;
    const group = groupRef.current;

    if (!track || !group) return;

    const animation = getTrackAnimation();
    if (!animation) return;

    if (jumpRafRef.current) {
      cancelAnimationFrame(jumpRafRef.current);
    }

    isJumpingRef.current = true;

    // Freeze base animation while we manually move its timeline
    animation.pause();

    const durationMs = getAnimationDurationMs(track);

    const firstCard = group.querySelector("[data-service-card]");
    const groupStyle = window.getComputedStyle(group);

    const gap =
      parseFloat(groupStyle.columnGap || groupStyle.gap || "24") || 24;

    const cardWidth = firstCard?.getBoundingClientRect?.().width || 280;
    const stepPx = cardWidth + gap;

    const cycleWidth = group.scrollWidth || track.scrollWidth / 2 || 1;
    const jumpMs = (stepPx / cycleWidth) * durationMs;

    const startAnimationTime =
      typeof animation.currentTime === "number" ? animation.currentTime : 0;

    const distance = direction === "next" ? jumpMs : -jumpMs;

    // Higher value = smoother / slower button slide
    const jumpDuration = 950;
    const startTime = performance.now();

    const animateJump = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);
      const eased = smootherStep(progress);

      let nextTime = startAnimationTime + distance * eased;

      nextTime = ((nextTime % durationMs) + durationMs) % durationMs;

      animation.currentTime = nextTime;

      if (progress < 1) {
        jumpRafRef.current = requestAnimationFrame(animateJump);
      } else {
        jumpRafRef.current = null;
        isJumpingRef.current = false;

        if (hoverPausedRef.current) {
          animation.pause();
        } else {
          animation.play();
        }
      }
    };

    jumpRafRef.current = requestAnimationFrame(animateJump);
  };

  if (safeItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center text-sm text-gray-600">
        No services available right now.
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden px-0 py-2"
      onPointerEnter={pauseTrack}
      onPointerMove={() => {
        if (!hoverPausedRef.current) pauseTrack();
      }}
      onPointerLeave={resumeTrack}
      onFocusCapture={pauseTrack}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          resumeTrack();
        }
      }}
    >
      {safeItems.length > 1 && (
        <button
          type="button"
          onClick={() => moveCards("prev")}
          className="
            absolute left-2 top-1/2 z-20 flex h-11 w-11
            -translate-y-1/2 cursor-pointer items-center justify-center rounded-full
            bg-white/95 shadow-md ring-1 ring-black/5
            hover:shadow-lg
          "
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {safeItems.length > 1 && (
        <button
          type="button"
          onClick={() => moveCards("next")}
          className="
            absolute right-2 top-1/2 z-20 flex h-11 w-11
            -translate-y-1/2 cursor-pointer items-center justify-center rounded-full
            bg-white/95 shadow-md ring-1 ring-black/5
            hover:shadow-lg
          "
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      )}

      <div
        ref={trackRef}
        className="flex w-max flex-row items-stretch"
        style={{
          animationName: "servicesInfiniteScroll",
          animationDuration: "30s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          willChange: "transform",
        }}
      >
        <div
          ref={groupRef}
          className="flex shrink-0 flex-row items-stretch gap-6 pr-6"
        >
          {safeItems.map((it, idx) => (
            <ServiceTile
              key={it?.id ? `serviceTile-${it.id}` : `tile-${idx}`}
              item={it}
            />
          ))}
        </div>

        <div className="flex shrink-0 flex-row items-stretch gap-6 pr-6">
          {safeItems.map((it, idx) => (
            <ServiceTile
              key={it?.id ? `serviceTile-dup-${it.id}` : `tile-dup-${idx}`}
              item={it}
            />
          ))}
        </div>
      </div>
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
      data-service-card
      className={[
        "w-[85vw] min-w-[85vw] max-w-[85vw]",
        "sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px]",
        "shrink-0",
        "rounded-2xl bg-white p-6",
        "shadow-[0_14px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/5",
        "flex flex-col",
        "min-h-[260px]",
      ].join(" ")}
    >
      <h5 className="font-medium text-lg leading-snug text-[#212529] line-clamp-2">
        {title}
      </h5>

      <p className="mt-2 text-sm leading-6 text-[#212529] line-clamp-6">
        {desc}
      </p>

      <div className="mt-auto flex justify-end pt-6">
        <Link
          href={href}
          className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Explore more &nbsp;›
        </Link>
      </div>
    </div>
  );
}
