// app/components/LatestArticlesSection.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import corpseedLogo from "../../../assets/CORPSEED.webp";
import { getLatestBlogs } from "@/app/lib/knowledgeCentre";


function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;

  // ✅ adjust if your CDN path differs
  // (your old static sample used this bucket)
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

function formatDate(d) {
  const s = String(d || "").trim();
  return s || "";
}

export default function LatestArticlesSection() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  const [index, setIndex] = React.useState(0);

  // desktop 3, mobile 1 (we keep same slider math by switching via CSS)
  const itemsPerView = 3;

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getLatestBlogs();
        if (!alive) return;

        setItems(Array.isArray(data) ? data : []);
        setIndex(0);
      } catch (e) {
        if (!alive) return;
        setErr("Unable to load latest articles.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const canPrev = index > 0;
  const canNext = index < Math.max(0, items.length - itemsPerView);

  const next = () => {
    if (!canNext) return;
    setIndex((p) => p + 1);
  };

  const prev = () => {
    if (!canPrev) return;
    setIndex((p) => Math.max(0, p - 1));
  };

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

        {/* State */}
        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* Slider */}
        <div className="relative mt-8">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            className={[
              "absolute left-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canPrev ? "opacity-40 cursor-not-allowed" : "opacity-100",
            ].join(" ")}
            aria-label="Previous articles"
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
            disabled={!canNext}
            className={[
              "absolute right-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
              !canNext ? "opacity-40 cursor-not-allowed" : "opacity-100",
            ].join(" ")}
            aria-label="Next articles"
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

          {/* Track wrapper */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${index * (100 / itemsPerView)}%)`,
              }}
            >
              {(loading ? Array.from({ length: 6 }) : items).map((a, i) => (
                <div key={a?.slug || i} className="w-full shrink-0 px-3 md:w-1/3">
                  {loading ? <ArticleSkeleton /> : <ArticleCard article={a} />}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile dots */}
          <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
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
      className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[150px] w-full bg-slate-50">
        {imgUrl ? (
          <Image src={imgUrl} alt={article?.title || "Article"} fill className="object-cover" />
        ) : null}

        {/* logo top-left */}
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <Image
            src={corpseedLogo}
            alt="Corpseed"
            width={24}
            height={24}
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          {/* ✅ API does not provide category; show a consistent tag */}
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
    </Link>
  );
}

function ArticleSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div className="h-[150px] w-full animate-pulse bg-slate-200" />
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
