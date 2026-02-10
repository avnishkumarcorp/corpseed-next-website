// app/components/LatestArticlesSection.jsx
"use client";

import React from "react";
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

function clampIndex(v, min, max) {
  return Math.max(min, Math.min(max, v));
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
  const items = Array.isArray(data) ? data : [];

  const wrapRef = React.useRef(null);

  const GAP = 24; // gap-6 => 24px (matches Tailwind)
  const IMG_H = 160;

  const [perView, setPerView] = React.useState(3);
  const [cardW, setCardW] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Skeleton until parent sends data (optional)
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (items.length) {
      setLoading(false);
      setIndex(0);
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

  // Keep index safe when items/perView change
  React.useEffect(() => {
    const maxIndex = Math.max(0, items.length - perView);
    setIndex((p) => clampIndex(p, 0, maxIndex));
  }, [items.length, perView]);

  const maxIndex = Math.max(0, items.length - perView);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const prev = () => setIndex((p) => clampIndex(p - 1, 0, maxIndex));
  const next = React.useCallback(() => {
    if (maxIndex <= 0) return;
    setIndex((p) => (p >= maxIndex ? 0 : p + 1));
  }, [maxIndex]);

  // ✅ Autoplay
  React.useEffect(() => {
    if (paused) return;
    if (loading) return;
    if (items.length <= perView) return;

    const id = setInterval(() => next(), autoplayMs);
    return () => clearInterval(id);
  }, [paused, loading, items.length, perView, next, autoplayMs]);

  // px-based translate (no cutting)
  const step = cardW + GAP; // one card + one gap
  const translateX = index * step;

  const dotsCount = Math.max(1, maxIndex + 1);

  return (
    <section className="w-full bg-[#eef5ff]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-3 py-1.5 text-[14px] font-semibold text-white">
            Latest
          </span>
          <h2 className="text-[26px] font-semibold text-slate-900">Articles</h2>
        </div>

        {/* Carousel */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arrows (outside the cards area) */}
          <button
            type="button"
            onClick={prev}
            disabled={loading || !canPrev}
            className={[
              "hidden md:flex absolute left-0 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || !canPrev
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-50",
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

          <button
            type="button"
            onClick={next}
            disabled={loading || !canNext}
            style={{ right: "-16px" }}
            className={[
              "hidden md:flex absolute right-0 top-1/2 z-30 translate-x-1/2 -translate-y-1/2",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || !canNext
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-50",
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
          {/* Padding wrapper (NOT measured) */}
          <div className="md:px-10">
            {/* ✅ Measured viewport (NO padding, correct width) */}
            <div ref={wrapRef} className="overflow-hidden">
              <div
                className="flex"
                style={{
                  gap: `${GAP}px`,
                  transform: `translateX(-${translateX}px)`,
                  transition: "transform 700ms ease-in-out",
                  willChange: "transform",
                }}
              >
                {(loading ? Array.from({ length: perView * 2 }) : items).map(
                  (a, i) => (
                    <div
                      key={a?.slug || i}
                      style={{ width: cardW || "100%" }}
                      className="shrink-0"
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

          {/* Dots */}
          {!loading && items.length > perView ? (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2.5 rounded-full transition cursor-pointer",
                    i === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300",
                  ].join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          ) : null}

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
        {/* ✅ Equal image area for all cards */}
        <div className="relative w-full overflow-hidden bg-white aspect-[16/9]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={article?.title || "Article"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain object-center p-2"
            />
          ) : (
            <div className="h-full w-full bg-slate-200" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-orange-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
              LATEST BLOG
            </span>

            <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
              {formatDate(article?.postDate)}
            </span>
          </div>

          <h3 className="mt-4 text-[15px] font-semibold leading-6 text-slate-900 line-clamp-2 min-h-[48px]">
            {article?.title}
          </h3>

          <div className="mt-auto" />
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
