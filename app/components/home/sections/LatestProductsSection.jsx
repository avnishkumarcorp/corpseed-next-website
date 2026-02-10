// app/components/LatestProductsSection.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getLatestProducts } from "@/app/lib/products";


function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;

  // ✅ same bucket pattern you use
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

export default function LatestProductsSection() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // 5 visible on desktop
  const perViewDesktop = 5;

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getLatestProducts();
        if (!alive) return;

        setItems(Array.isArray(data) ? data : []);
        setIndex(0);
      } catch (e) {
        if (!alive) return;
        setErr("Unable to load latest products.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const maxIndex = Math.max(0, items.length - perViewDesktop);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const next = React.useCallback(() => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = () => {
    setIndex((p) => (p <= 0 ? maxIndex : Math.max(0, p - 1)));
  };

  // ✅ autoplay (loop) only if enough items
  React.useEffect(() => {
    if (paused) return;
    if (items.length <= perViewDesktop) return;

    const id = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(id);
  }, [paused, next, items.length]);

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

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* Slider */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prev}
            disabled={loading || items.length <= perViewDesktop}
            className={[
              "absolute left-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || items.length <= perViewDesktop
                ? "opacity-40 cursor-not-allowed"
                : "opacity-100",
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

          {/* Right Arrow */}
          <button
            type="button"
            onClick={next}
            disabled={loading || items.length <= perViewDesktop}
            className={[
              "absolute right-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              loading || items.length <= perViewDesktop
                ? "opacity-40 cursor-not-allowed"
                : "opacity-100",
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
                transform: `translateX(-${index * (100 / perViewDesktop)}%)`,
              }}
            >
              {(loading ? Array.from({ length: 10 }) : items).map((p, i) => (
                <div
                  key={p?.id || p?.slug || i}
                  className="w-full shrink-0 px-3 md:w-1/5"
                >
                  {loading ? (
                    <ProductSkeleton />
                  ) : (
                    <ProductCard item={p} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {!loading && items.length > perViewDesktop ? (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
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
      {/* Image */}
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

      {/* Title */}
      <div className="p-5">
        <h3 className="text-[15px] font-medium leading-6 text-slate-900 line-clamp-2">
          {item?.name}
        </h3>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div className="h-[150px] w-full animate-pulse bg-slate-200" />
      <div className="p-5">
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
