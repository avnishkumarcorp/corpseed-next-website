// app/components/InTheNewsSection.jsx
"use client";

import React from "react";
import Image from "next/image";
const SLIDES = [
  {
    image: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/Corpseed_and_CII_Conference_Join_Forces_to_Revolutionize_MSMEs_Corpseed.webp",
    tag: "PRESS RELEASE",
    title:
      "Corpseed and CII Join Forces to Revolutionize MSMEs at Groundbreaking Conference on Tech and Trade",
    excerpt:
      "Corpseed ITES Pvt. Ltd is honoured to be the Knowledge Partner with the Confederation of Indian Industry (CII) at the much-anticipated conference on MSMEs Fueling India’s Strength, with the theme ‘Thriving Through Trade and Tech’.",
  },
  {
    image: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/CII_Knowledge_Partner_Corpseed.webp",
    tag: "PRESS RELEASE",
    title:
      "Corpseed and CII Announce Strategic Collaboration to Boost Business Compliance and Innovation",
    excerpt:
      "New Delhi, July 26, 2024 – Corpseed ITES Pvt. Ltd., a leading business consulting firm in India, has announced a strategic collaboration with the Confederation of Indian Industry (CII) to enhance business compliance and foster innovation across various sectors.",
  },
  {
    image: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/Corpseeds_New_Branch_Office_Gujarat_Corpseed.webp",
    tag: "PRESS RELEASE",
    title: "Corpseed’s New Branch Office - Gujarat",
    excerpt:
      "Surat, Gujarat, May 15, 2023: Corpseed, one of the fastest-growing Financial, Environment and Legal Compliance Advisory Platform for Individuals, SMEs and Enterprises, is delighted to announce that it has opened a new branch office in Gujarat on 15th May of 2023.",
  },
];

export default function NewsSection() {
  const [index, setIndex] = React.useState(0);

  // autoplay
  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % SLIDES.length);
    }, 3500);

    return () => clearInterval(id);
  }, []);

  const goTo = (i) => setIndex(i);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Carousel shell (fixed height => no jump) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f6f8fb] shadow-[0_24px_60px_-50px_rgba(2,6,23,0.5)] ring-1 ring-slate-200">
          {/* Slides track */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <NewsSlide key={i} slide={slide} />
            ))}
          </div>

          {/* Center dots (like your screenshot) */}
          <div className="pointer-events-auto absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
            <Dots count={SLIDES.length} activeIndex={index} onDot={goTo} />
          </div>

          {/* Optional nav arrows (hidden on small screens) */}
          <button
            type="button"
            onClick={() =>
              setIndex((p) => (p - 1 + SLIDES.length) % SLIDES.length)
            }
            className="hidden md:flex absolute left-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 cursor-pointer"
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
            onClick={() => setIndex((p) => (p + 1) % SLIDES.length)}
            className="hidden md:flex absolute right-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 cursor-pointer"
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

          {/* Top-left label "In The News" */}
          <div className="absolute left-5 top-5 z-20 -translate-y-1/2 rounded-md bg-white px-6 py-3 text-[14px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
            In The News
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSlide({ slide }) {
  return (
    <div className="w-full shrink-0">
      {/* Fixed height wrapper for consistent layout */}
      <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative min-h-[240px] md:min-h-[360px]">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />

          {/* Soft overlay for nicer contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative bg-[#eaf3ff] px-6 py-10 sm:px-10">
          {/* pointer/triangle like screenshot */}
          <div className="hidden md:block absolute left-0 top-10 -translate-x-full">
            <div className="h-0 w-0 border-y-[14px] border-y-transparent border-r-[18px] border-r-[#eaf3ff]" />
          </div>

          <div className="max-w-xl">
            <div className="text-[12px] font-semibold tracking-widest text-blue-600">
              {slide.tag}
            </div>

            <h3 className="mt-5 text-[22px] font-semibold leading-snug text-blue-600 sm:text-[24px]">
              {slide.title}
            </h3>

            <div className="mt-6 flex gap-4">
              {/* left accent line */}
              <div className="mt-1 h-auto w-[3px] rounded-full bg-yellow-400" />
              <p className="text-[14px] leading-7 text-slate-700">
                {slide.excerpt}
              </p>
            </div>

            {/* Optional CTA */}
            {/* <div className="mt-8">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-[13px] font-semibold text-white shadow-sm cursor-pointer"
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
              </button>
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
