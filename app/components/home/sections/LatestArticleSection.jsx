// app/components/LatestArticlesSection.jsx
"use client";

import React from "react";
import Image from "next/image";
import corpseedLogo from "../../../assets/CORPSEED.webp";

const ARTICLES = [
  {
    id: 1,
    category: "HOSPITALITY SECTOR",
    date: "2026-01-08",
    title: "NABL Revises Medical Imaging Accreditation Standards",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/How_To_Apply_For_BOCW_Registration_Online_Corpseed.webp",
  },
  {
    id: 2,
    category: "TAXATION COMPLIANCE",
    date: "2026-01-08",
    title: "How To Log In GST Portal (www.gst.gov.in) Online In India",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/How_To_Apply_For_BOCW_Registration_Online_Corpseed.webp",
  },
  {
    id: 3,
    category: "HEALTHCARE SECTOR",
    date: "2026-01-07",
    title: "What is Joint Commission International (JCI) Accreditation?",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/Joint_Commission_International_Accreditation_Corpseed.webp",
  },
  {
    id: 4,
    category: "BIO-ENERGY",
    date: "2026-01-08",
    title: "How To Log In GST Portal (www.gst.gov.in) Online In India",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/Biogas_Plant_in_India_Corpseed.webp",
  },
  {
    id: 5,
    category: "TAXATION COMPLIANCE",
    date: "2026-01-07",
    title: "What is Joint Commission International (JCI) Accreditation?",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/gst_login_portal_corpseed.webp",
  },
  {
    id: 6,
    category: "LABOUR COMPLIACE",
    date: "2026-01-08",
    title: "How To Log In GST Portal (www.gst.gov.in) Online In India",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/How_To_Apply_For_BOCW_Registration_Online_Corpseed.webp",
  },
  {
    id: 7,
    category: "HOSPITALITY SECTOR",
    date: "2026-01-07",
    title: "What is Joint Commission International (JCI) Accreditation?",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/NABL_Revises_Medical_Imaging_Accreditation_Standards_Corpseed.webp",
  },
  // Add more objects for more slides
];

export default function LatestArticlesSection() {
  const [index, setIndex] = React.useState(0);

  // show 3 cards like screenshot (desktop). For mobile it will show 1.
  const itemsPerView = 3;

  const canPrev = index > 0;
  const canNext = index < Math.max(0, ARTICLES.length - itemsPerView);

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
              {ARTICLES.map((a) => (
                <div key={a.id} className="w-full shrink-0 px-3 md:w-1/3">
                  <ArticleCard article={a} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile swipe hint (optional) */}
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
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200">
      {/* Image */}
      <div className="relative h-[150px] w-full bg-slate-50">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />

        {/* small logo placeholder top-left (like screenshot) */}
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <Image
            src={corpseedLogo}
            alt="Corpseed"
            className="h-6 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-orange-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
            {article.category}
          </span>

          <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            {article.date}
          </span>
        </div>

        <h3 className="mt-4 text-[15px] font-semibold leading-6 text-slate-900">
          {article.title}
        </h3>
      </div>
    </div>
  );
}
