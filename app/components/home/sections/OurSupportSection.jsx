// app/components/OurSupportersSection.jsx
"use client";

import React from "react";
import Image from "next/image";

// ✅ KEEP YOUR IMPORTS EXACTLY (NO PATH CHANGES)
import corpseedLogo from "../../../assets/CORPSEED.webp";
import mgmt1 from "../../../../public/home/sakshi.png";
import mgmt2 from "../../../../public/home/vipan.png";
import mgmt3 from "../../../../public/home/vinay.png";

import mem1 from "../../../../public/home/iso.png";
import mem2 from "../../../../public/home/cii.png";
import mem3 from "../../../../public/home/cii.png";

const TAB_KEYS = {
  INVESTOR: "investor",
  MANAGEMENT: "management",
  MEMBERS: "members",
};

const DATA = {
  [TAB_KEYS.INVESTOR]: {
    type: "static",
    logo: corpseedLogo,
    text: "We are a bootstrap organization based on the direct support of our clients themselves. It enables us to independently make decisions for the welfare of our clients and provide quality service at affordable rates. Our self-reliance and financial discipline promote efficiency and stimulate creativity.",
  },

  [TAB_KEYS.MANAGEMENT]: {
    type: "carousel",
    slides: [
      {
        name: "Sakshi Jaggi",
        role: "Chief People Officer",
        image: mgmt1,
        description:
          "Mrs. Sakshi Jaggi is a passionate and data-driven HR Expert who revolutionises how Corpseed manages its human resources. With her invaluable insights and expertise in recruitment, data analytics, and operations, she brings a fresh perspective to the table. With her unparalleled commitment and deep understanding of the HR landscape, she has become an indispensable asset to Corpseed.",
      },
      {
        name: "Vinay Singh",
        role: "Advisor",
        image: mgmt3,
        description:
          "With over fifteen years of experience in financial innovation and technology, Mr. Vinay Singh advises and provides strategic guidance to our clients about banking, finance, and tech trends. Corpseed is implementing innovative digital finance solutions under his direction and evolving continuously.",
      },
      {
        name: "Vipan Singh",
        role: "Founder & CEO",
        image: mgmt2,
        description:
          "Mr. Vipan Singh is the visionary founder and CEO of Corpseed ITES Pvt Ltd. With his unbeatable passion, he advocates automation in compliance management for businesses. Under his astute guidance, Corpseed has become synonymous with excellence and efficiency. His unwavering focus on delivering cutting-edge solutions has empowered countless businesses to stay ahead of the curve.",
      },
    ],
  },

  [TAB_KEYS.MEMBERS]: {
    type: "carousel",
    slides: [
      {
        name: "ISO",
        role: "Certification Partner",
        image: mem1,
        description:
          "We work with recognized certification partners to help businesses meet global standards and strengthen credibility across markets.",
      },
      {
        name: "CII",
        role: "Industry Partner",
        image: mem2,
        description:
          "Our ecosystem includes trusted industry bodies that support growth, compliance readiness, and strong governance practices.",
      },
      {
        name: "CII",
        role: "Industry Partner",
        image: mem3,
        description:
          "Through partnerships and alliances, we enable businesses to stay aligned with evolving regulatory and industry expectations.",
      },
    ],
  },
};

/* ----------------------------- UI PARTS ----------------------------- */

function LeftTab({ active, onChange }) {
  const items = [
    { key: TAB_KEYS.INVESTOR, label: "Investor" },
    { key: TAB_KEYS.MANAGEMENT, label: "Management" },
    { key: TAB_KEYS.MEMBERS, label: "Members" },
  ];

  return (
    <div className="rounded-2xl bg-white p-2 shadow-[0_18px_40px_-30px_rgba(2,6,23,0.25)] ring-1 ring-slate-200">
      {items.map((item) => {
        const isActive = active === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              "w-full rounded-xl px-5 py-4 text-left transition cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-900 hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold">{item.label}</span>
              <span className={isActive ? "text-white/80" : "text-slate-400"}>
                →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Dots({ count, activeIndex, onDot }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
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

/**
 * ✅ KEY FIX:
 * The right panel has a fixed height, and the description area is clamped to a fixed number of lines.
 * So all tabs + all slides stay SAME HEIGHT (no jumping).
 */
function FixedShell({ children }) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-white to-slate-50 p-8 shadow-[0_22px_55px_-45px_rgba(2,6,23,0.45)] ring-1 ring-slate-200">
      {/* fixed height container */}
      <div className="min-h-[420px] w-full">{children}</div>
    </div>
  );
}

function StaticContent({ logo, text }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <div className="relative mb-4 h-[56px] w-[180px]">
        <Image src={logo} alt="Corpseed" fill className="object-contain" priority />
      </div>

      {/* fixed description block */}
      <p className="max-w-3xl text-[14px] leading-7 text-slate-600 line-clamp-5">
        {text}
      </p>
    </div>
  );
}

function ProfileSlide({ slide, variant }) {
  const isMember = variant === TAB_KEYS.MEMBERS;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      {/* badge (fixed height space) */}
      <div className="h-[40px]">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-[12px] font-semibold text-white shadow-sm">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          {slide.name} <span className="opacity-80">— {slide.role}</span>
        </div>
      </div>

      {/* image (fixed size) */}
      <div className="relative mt-6">
        <div className="absolute inset-0 -z-10 rounded-full bg-blue-600/15 blur-2xl" />
        <div
          className={[
            "relative overflow-hidden rounded-full bg-white shadow-[0_18px_45px_-30px_rgba(2,6,23,0.35)]",
            isMember ? "h-[120px] w-[120px]" : "h-[130px] w-[130px]",
          ].join(" ")}
        >
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            className={isMember ? "object-contain p-3" : "object-cover"}
            priority
          />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-full ring-4 ring-white" />
      </div>

      {/* description card (fixed height) */}
      <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white px-6 py-5 text-left shadow-[0_18px_45px_-35px_rgba(2,6,23,0.35)] ring-1 ring-slate-200">
        <p className="text-[14px] leading-7 text-slate-600 line-clamp-5">
          {slide.description}
        </p>
      </div>
    </div>
  );
}

function AutoCarousel({ slides, autoplayMs = 3500, resetKey, variant }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => setIndex(0), [resetKey]);

  React.useEffect(() => {
    if (!slides?.length) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [slides, autoplayMs]);

  const goTo = (i) => setIndex(i);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1">
        <ProfileSlide slide={slides[index]} variant={variant} />
      </div>
      <Dots count={slides.length} activeIndex={index} onDot={goTo} />
    </div>
  );
}

/* ----------------------------- MAIN ----------------------------- */

export default function OurSupportSection() {
  const [activeTab, setActiveTab] = React.useState(TAB_KEYS.INVESTOR);
  const current = DATA[activeTab];

  return (
    <section className="w-full bg-[#f3f6fb]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-[44px] font-semibold tracking-tight text-blue-600">
          Our Supporters
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* LEFT MENU */}
          <LeftTab active={activeTab} onChange={setActiveTab} />

          {/* RIGHT CONTENT (fixed height so no fluctuation) */}
          <FixedShell>
            {current.type === "static" ? (
              <StaticContent logo={current.logo} text={current.text} />
            ) : (
              <AutoCarousel
                slides={current.slides}
                autoplayMs={3500}
                resetKey={activeTab}
                variant={activeTab}
              />
            )}
          </FixedShell>
        </div>
      </div>
    </section>
  );
}
