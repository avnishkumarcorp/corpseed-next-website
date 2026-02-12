// app/components/LatestProductsSection.jsx
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

// ✅ responsive per-view: mobile 1, sm 2, md 3, lg+ 5
function getPerView(width) {
  if (width < 640) return 1; // <sm
  if (width < 768) return 2; // sm
  if (width < 1024) return 3; // md
  return 5; // lg+
}

export default function LatestProductsSection({ data = [] }) {
  const items = Array.isArray(data) ? data : [];

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [perView, setPerView] = React.useState(5);

  // ✅ detect current breakpoint width on client
  React.useEffect(() => {
    const update = () => setPerView(getPerView(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // ✅ recompute based on perView (fix mobile sliding)
  const maxIndex = Math.max(0, items.length - perView);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const next = React.useCallback(() => {
    if (maxIndex <= 0) return;
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = React.useCallback(() => {
    if (maxIndex <= 0) return;
    setIndex((p) => (p <= 0 ? maxIndex : p - 1));
  }, [maxIndex]);

  // ✅ autoplay only if enough items for current viewport
  React.useEffect(() => {
    if (paused) return;
    if (items.length <= perView) return;

    const id = setInterval(() => next(), 3000);
    return () => clearInterval(id);
  }, [paused, next, items.length, perView]);

  // ✅ reset / clamp index when data or perView changes
  React.useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [items.length, perView, maxIndex]);

  const dotsCount = Math.max(1, maxIndex + 1);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-3 py-1.5 text-[14px] font-semibold text-white">
            Latest
          </span>
          <h2 className="text-[26px] font-semibold text-slate-900">Products</h2>
        </div>

        {/* Slider */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left Arrow (desktop only like your old UI) */}
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev || items.length <= perView}
            className={[
              "absolute left-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canPrev || items.length <= perView
                ? "opacity-40 cursor-not-allowed"
                : "",
            ].join(" ")}
            aria-label="Previous products"
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

          {/* Right Arrow (desktop only) */}
          <button
            type="button"
            onClick={next}
            disabled={!canNext || items.length <= perView}
            className={[
              "absolute right-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canNext || items.length <= perView
                ? "opacity-40 cursor-not-allowed"
                : "",
            ].join(" ")}
            aria-label="Next products"
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

          {/* Track */}
          <div className="overflow-hidden py-4">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                // ✅ this is the key fix
                transform: `translateX(-${index * (100 / perView)}%)`,
              }}
            >
              {items.map((p) => (
                <div
                  key={p?.id || p?.slug}
                  className="shrink-0 px-3"
                  style={{
                    // ✅ each card takes exactly 1/perView width
                    flexBasis: `${100 / perView}%`,
                  }}
                >
                  <ProductCard item={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots (hide on mobile like before) */}
          {/* {items.length > perView ? (
            <div className="mt-6 hidden md:flex items-center justify-center gap-2">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2.5 rounded-full transition cursor-pointer",
                    i === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300",
                  ].join(" ")}
                  aria-label={`Go to position ${i + 1}`}
                />
              ))}
            </div>
          ) : null} */}

          {/* Empty */}
          {!items.length ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-700">
              No latest products found.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const href = `/products/${item?.slug || ""}`;
  const imgUrl = toImgUrl(item?.image);

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200 cursor-pointer"
    >
      <div className="relative h-[150px] w-full bg-slate-50">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={item?.name || "Product"}
            fill
            className="object-contain p-5"
          />
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-[15px] font-medium leading-6 text-slate-900 line-clamp-2">
          {item?.name}
        </h3>
      </div>
    </Link>
  );
}
