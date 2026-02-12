// app/components/InTheNewsSection.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;

  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

function clampText(text, n = 220) {
  const t = String(text || "").trim();
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
}

export default function NewsSection({ data }) {
  const [slides, setSlides] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // ✅ sync slides from parent + fix loading + reset index
  React.useEffect(() => {
    const nextSlides = Array.isArray(data) ? data : [];
    setSlides(nextSlides);
    setIndex(0);
    setLoading(false);
  }, [data]);

  // ✅ keep index safe when slides length changes
  React.useEffect(() => {
    if (!slides.length) return;
    setIndex((p) => Math.min(p, slides.length - 1));
  }, [slides.length]);

  // ✅ autoplay
  React.useEffect(() => {
    if (paused) return;
    if (!slides?.length || slides.length < 2) return;

    const id = setInterval(() => {
      setIndex((p) => (p + 1) % slides.length);
    }, 3500);

    return () => clearInterval(id);
  }, [paused, slides]);

  const goTo = (i) => setIndex(i);

  const prev = () => {
    if (!slides?.length) return;
    setIndex((p) => (p - 1 + slides.length) % slides.length);
  };

  const next = () => {
    if (!slides?.length) return;
    setIndex((p) => (p + 1) % slides.length);
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl bg-[#f6f8fb] shadow-[0_24px_60px_-50px_rgba(2,6,23,0.5)] ring-1 ring-slate-200"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides track */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <NewsSkeleton key={i} />)
            ) : slides.length ? (
              slides.map((slide) => (
                <NewsSlide key={slide?.id || slide?.slug} slide={slide} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>

          {/* dots */}
          {/* dots (hide on mobile) */}
          {/* {!loading && slides.length > 1 ? (
            <div className="pointer-events-auto absolute bottom-5 left-1/2 z-20 -translate-x-1/2 hidden md:block">
              <Dots count={slides.length} activeIndex={index} onDot={goTo} />
            </div>
          ) : null} */}

          {/* arrows */}
          <button
            type="button"
            onClick={prev}
            disabled={loading || slides.length < 2}
            className={[
              "hidden md:flex absolute left-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || slides.length < 2
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white",
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
            disabled={loading || slides.length < 2}
            className={[
              "hidden md:flex absolute right-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || slides.length < 2
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-white",
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

          {/* label */}
          <div className="absolute left-0 top-5 z-20 -translate-y-1/2 rounded-md bg-white px-6 py-3 text-[14px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
            In The News
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSlide({ slide }) {
  const imgUrl = toImgUrl(slide?.image);
  const href = `/news-room/${slide?.slug}`; // adjust route if needed

  return (
    <div className="w-full shrink-0">
      <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative min-h-[240px] md:min-h-[360px] bg-slate-100 overflow-hidden">
          {imgUrl && (
            <Image
              src={imgUrl}
              alt={slide?.title || "News"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-center"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative bg-[#eaf3ff] px-6 py-10 sm:px-10">
          <div className="hidden md:block absolute left-0 top-10 -translate-x-full">
            <div className="h-0 w-0 border-y-[14px] border-y-transparent border-r-[18px] border-r-[#eaf3ff]" />
          </div>

          <div className="max-w-xl">
            <div className="text-[12px] font-semibold tracking-widest text-blue-600">
              NEWS
            </div>

            <h3 className="mt-5 text-[22px] font-semibold leading-snug text-blue-600 sm:text-[24px] line-clamp-3">
              {slide?.title}
            </h3>

            <div className="mt-6 flex gap-4">
              <div className="mt-1 h-auto w-[3px] rounded-full bg-yellow-400" />
              <p className="text-[14px] leading-7 text-slate-700">
                {clampText(slide?.summary, 260)}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              {slide?.postDate ? (
                <span className="rounded-md bg-white/70 px-3 py-1 ring-1 ring-slate-200">
                  {slide.postDate}
                </span>
              ) : null}
              <span className="rounded-md bg-white/70 px-3 py-1 ring-1 ring-slate-200">
                {slide?.visited ?? 0} views
              </span>
            </div>

            {/* <div className="mt-8">
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-[13px] font-semibold text-white shadow-sm cursor-pointer hover:bg-blue-700"
              >
                Read More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dots({ count, activeIndex, onDot }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDot(i)}
          className={[
            "h-2.5 rounded-full transition cursor-pointer",
            i === activeIndex ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300",
          ].join(" ")}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="w-full shrink-0">
      <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-2">
        <div className="min-h-[240px] md:min-h-[360px] animate-pulse bg-slate-200" />
        <div className="bg-[#eaf3ff] px-6 py-10 sm:px-10">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-6 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-6 w-4/6 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 flex gap-4">
            <div className="h-20 w-[3px] rounded-full bg-yellow-300" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full shrink-0">
      <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-2">
        <div className="min-h-[240px] md:min-h-[360px] bg-slate-100" />
        <div className="bg-[#eaf3ff] px-6 py-10 sm:px-10 flex items-center">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              No news found
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
