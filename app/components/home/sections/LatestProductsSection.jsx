// app/components/LatestProductsSection.jsx
"use client";

import React from "react";
import Image from "next/image";

const PRODUCTS = [
  {
    id: 1,
    title: "BIS Certification for LED Luminaires",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_UPS_and_Inverters_Corpseed.webp",
  },
  {
    id: 2,
    title: "BIS Certification for USB Type External Hard disk",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Digital_Camera_Corpseed.webp",
  },
  {
    id: 3,
    title: "BIS Certification for Nickel-Cadmium (NiCad) Ba...",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_WebCam_Corpseed.webp",
  },
  {
    id: 4,
    title: "BIS Certification for UPS/Inverters",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Set_Top_Box_Corpseed.webp",
  },
  {
    id: 5,
    title: "BIS Certification for Lithium-ion Batteries",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Induction_Stove_Corpseed.webp",
  },
  {
    id: 6,
    title: "BIS Certification for LED Luminaires",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_UPS_and_Inverters_Corpseed.webp",
  },
  {
    id: 7,
    title: "BIS Certification for USB Type External Hard disk",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Digital_Camera_Corpseed.webp",
  },
  {
    id: 8,
    title: "BIS Certification for Nickel-Cadmium (NiCad) Ba...",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_WebCam_Corpseed.webp",
  },
  {
    id: 9,
    title: "BIS Certification for UPS/Inverters",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Set_Top_Box_Corpseed.webp",
  },
  {
    id: 10,
    title: "BIS Certification for Lithium-ion Batteries",
    image:
      "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BIS_Certification_for_Induction_Stove_Corpseed.webp",
  },
  // add more products...
];

export default function LatestProductsSection() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // 5 cards visible on desktop like screenshot. Responsive below.
  const perViewDesktop = 5;

  const maxIndex = Math.max(0, PRODUCTS.length - perViewDesktop);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const next = React.useCallback(() => {
    // loop back to start for autoplay
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = () => {
    setIndex((p) => (p <= 0 ? maxIndex : Math.max(0, p - 1)));
  };

  // ✅ Autoplay (loops)
  React.useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(id);
  }, [paused, next]);

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
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prev}
            className={[
              "absolute left-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
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
            className={[
              "absolute right-[-50px] top-1/2 z-20 hidden -translate-y-1/2 md:flex",
              "h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 cursor-pointer",
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
              {PRODUCTS.map((p) => (
                <div key={p.id} className="w-full shrink-0 px-3 md:w-1/5">
                  <ProductCard item={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Center dots (optional, modern) */}
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
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200">
      {/* Image */}
      <div className="relative h-[150px] w-full bg-slate-50">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain p-5"
        />
      </div>

      {/* Title */}
      <div className="p-5">
        <h3 className="text-[15px] font-medium leading-6 text-slate-900 line-clamp-2">
          {item.title}
        </h3>
      </div>
    </div>
  );
}
