// app/components/LatestArticlesSection.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import corpseedLogo from "../../../assets/CORPSEED.webp";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

function formatDate(d) {
  const s = String(d || "").trim();
  return s || "";
}

function getPerViewByWidth(w) {
  if (w >= 1024) return 3; // desktop
  if (w >= 768) return 2; // tablet
  return 1; // mobile
}

export default function LatestArticlesSection({
  data = [],
  autoplayMs = 3500,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const items = Array.isArray(data) ? data : [];

  const wrapRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const jumpRafRef = React.useRef(null);

  const GAP = 24; // gap-6 / pr-6 => 24px
  const IMG_H = 160;

  const [perView, setPerView] = React.useState(3);
  const [cardW, setCardW] = React.useState(0);

  // Skeleton until parent sends data
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (items.length) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1200);

    return () => clearTimeout(t);
  }, [items.length]);

  // Measure container width and compute card width precisely
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const recalc = () => {
      const w = el.getBoundingClientRect().width;
      const pv = getPerViewByWidth(
        wrapRef.current?.getBoundingClientRect().width || window.innerWidth,
      );

      setPerView(pv);

      // card width = (container - totalGaps) / perView
      const totalGaps = GAP * (pv - 1);
      const nextCardW = Math.floor((w - totalGaps) / pv);
      setCardW(nextCardW);
    };

    recalc();

    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);

    window.addEventListener("resize", recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (jumpRafRef.current) {
        cancelAnimationFrame(jumpRafRef.current);
      }
    };
  }, []);

  const getAnimationDurationMs = (track) => {
    const computedStyle = window.getComputedStyle(track);
    const durationValue = computedStyle.animationDuration || "15s";

    if (durationValue.includes("ms")) {
      return parseFloat(durationValue) || 15000;
    }

    if (durationValue.includes("s")) {
      return (parseFloat(durationValue) || 15) * 1000;
    }

    return 15000;
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const moveCards = (direction) => {
    const track = trackRef.current;

    if (!track || loading || items.length <= perView || !cardW) return;

    const animations = track.getAnimations?.() || [];
    const animation = animations[0];

    if (!animation) return;

    if (jumpRafRef.current) {
      cancelAnimationFrame(jumpRafRef.current);
    }

    const durationMs = getAnimationDurationMs(track);

    /*
      Track has duplicate items.
      The keyframe moves from 0 to -50%.
      So one complete visible cycle is half of track width.
    */
    const cycleWidth = Math.max(track.scrollWidth / 2, 1);
    const stepPx = cardW + GAP;
    const jumpMs = (stepPx / cycleWidth) * durationMs;

    const startAnimationTime =
      typeof animation.currentTime === "number" ? animation.currentTime : 0;

    const distance = direction === "next" ? jumpMs : -jumpMs;
    const jumpDuration = 550;
    const startTime = performance.now();

    const animateJump = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);
      const eased = easeInOutCubic(progress);

      let nextTime = startAnimationTime + distance * eased;

      nextTime = ((nextTime % durationMs) + durationMs) % durationMs;

      animation.currentTime = nextTime;

      if (progress < 1) {
        jumpRafRef.current = requestAnimationFrame(animateJump);
      } else {
        jumpRafRef.current = null;
      }
    };

    jumpRafRef.current = requestAnimationFrame(animateJump);
  };

  const canSlide = !loading && items.length > perView;

  return (
    <section
      className="w-full overflow-x-hidden bg-[#eef5ff]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto w-[calc(100%-32px)] py-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-3 py-1.5 text-[14px] font-semibold text-white">
            Latest
          </span>
          <h2 className="text-[26px] font-semibold text-slate-900 !m-0">
            Articles
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative mt-4">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => moveCards("prev")}
            disabled={!canSlide}
            className={[
              "hidden md:flex absolute left-0 top-1/2 z-30 -translate-y-1/2",
              "h-11 w-11 items-center justify-center rounded-full text-[#212529] bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canSlide ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50",
            ].join(" ")}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => moveCards("next")}
            disabled={!canSlide}
            className={[
              "hidden md:flex absolute right-0 top-1/2 z-30 -translate-y-1/2",
              "h-11 w-11 items-center justify-center rounded-full text-[#212529] bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canSlide ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50",
            ].join(" ")}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Measured viewport */}
          <div className="w-full overflow-hidden">
            <div ref={wrapRef} className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex w-max flex-row items-stretch"
                style={{
                  animation: "latestArticleInfiniteScroll 15s linear infinite",
                  animationPlayState: isHovered ? "paused" : "running",
                  willChange: "transform",
                }}
              >
                {(loading ? Array.from({ length: perView * 2 }) : items).map(
                  (a, i) => (
                    <div
                      key={a?.slug ? `article-${a.slug}` : `article-${i}`}
                      className="shrink-0 pr-6"
                      style={{
                        width: cardW || "100%",
                      }}
                    >
                      {loading ? (
                        <ArticleSkeleton imgH={IMG_H} />
                      ) : (
                        <ArticleCard article={a} />
                      )}
                    </div>
                  ),
                )}

                {(loading ? Array.from({ length: perView * 2 }) : items).map(
                  (a, i) => (
                    <div
                      key={
                        a?.slug ? `article-dup-${a.slug}` : `article-dup-${i}`
                      }
                      className="shrink-0 pr-6"
                      style={{
                        width: cardW || "100%",
                      }}
                    >
                      {loading ? (
                        <ArticleSkeleton imgH={IMG_H} />
                      ) : (
                        <ArticleCard article={a} />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Empty */}
          {!loading && !items.length ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-700">
              No latest articles found.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const href = `/knowledge-centre/${article?.slug || ""}`;
  const imgUrl = toImgUrl(article?.image);

  return (
    <Link
      href={href}
      className="block h-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200 cursor-pointer"
    >
      <div className="flex h-full flex-col">
        {/* Equal image area for all cards */}
        <div className="relative w-full overflow-hidden bg-white aspect-[16/9]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={article?.title || "Article"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-contain object-center p-2"
            />
          ) : (
            <div className="h-full w-full bg-slate-200" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 py-2">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-orange-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
              LATEST BLOG
            </span>

            <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
              {formatDate(article?.postDate)}
            </span>
          </div>

          <h3 className="mt-4 text-[15px] font-semibold leading-6 text-slate-900 line-clamp-2">
            {article?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function ArticleSkeleton({ imgH }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div
        className="w-full animate-pulse bg-slate-200"
        style={{ height: imgH }}
      />
      <div className="p-5">
        <div className="flex gap-3">
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
