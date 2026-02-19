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

/* ----------------------------- UI ----------------------------- */

function Tabs({ active, onChange }) {
  const items = [
    { key: TAB_KEYS.INVESTOR, label: "Investor" },
    { key: TAB_KEYS.MANAGEMENT, label: "Management" },
    { key: TAB_KEYS.MEMBERS, label: "Members" },
  ];

  return (
    <div className="flex items-center gap-2 rounded-full bg-white p-1 ring-1 ring-slate-200 shadow-sm">
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function Dots({ count, activeIndex, onDot }) {
  if (!count || count <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDot(i)}
          className={[
            "h-2 rounded-full transition cursor-pointer",
            i === activeIndex ? "w-7 bg-blue-600" : "w-2 bg-slate-300 hover:bg-slate-400",
          ].join(" ")}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

function Avatar({ src, alt, variant }) {
  const isMember = variant === TAB_KEYS.MEMBERS;

  // ✅ bigger image (as you asked)
  const size = isMember ? 140 : 160;

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 rounded-full bg-blue-600/10 blur-2xl" />
      <div
        className="relative overflow-hidden rounded-full bg-white ring-1 ring-slate-200 shadow-[0_16px_40px_-30px_rgba(2,6,23,0.45)]"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={isMember ? "object-contain p-7" : "object-cover"}
          priority
        />
      </div>
    </div>
  );
}

function StaticInvestor({ logo, text }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
      <div className="flex justify-center md:justify-start">
        <div className="relative h-[52px] w-[190px]">
          <Image src={logo} alt="Corpseed" fill className="object-contain" priority />
        </div>
      </div>
      <p className="text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function Slide({ slide, variant }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
      <div className="flex justify-center md:justify-start">
        <Avatar src={slide.image} alt={slide.name} variant={variant} />
      </div>

      <div className="min-w-0">
        <div className="text-[20px] font-semibold leading-tight text-slate-900">
          {slide.name}
        </div>
        <div className="mt-1 text-xs font-semibold text-blue-600">
          {slide.role}
        </div>

        {/* ✅ compact description (less height) */}
        <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-sm leading-7 text-slate-600 line-clamp-4">
            {slide.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function AutoCarousel({ slides, autoplayMs = 4200, resetKey, variant }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => setIndex(0), [resetKey]);

  React.useEffect(() => {
    if (!slides?.length) return;
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % slides.length);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [slides, autoplayMs]);

  return (
    <div>
      <div key={index} className="animate-[fadeUp_.2s_ease-out]">
        <Slide slide={slides[index]} variant={variant} />
      </div>

      <Dots count={slides.length} activeIndex={index} onDot={setIndex} />

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- MAIN ----------------------------- */

export default function OurSupportSection() {
  const [activeTab, setActiveTab] = React.useState(TAB_KEYS.MANAGEMENT);
  const current = DATA[activeTab];

  return (
    <section className="w-full bg-[#f3f6fb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ✅ compact header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[38px] font-semibold tracking-tight text-blue-600 sm:text-[44px]">
            Our Supporters
          </h2>
          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* ✅ more compact container */}
        <div className="mt-7 rounded-3xl bg-white p-5 shadow-[0_22px_55px_-45px_rgba(2,6,23,0.45)] ring-1 ring-slate-200 sm:p-7">
          {/* ❌ removed big min-height; keeps compact */}
          {current.type === "static" ? (
            <StaticInvestor logo={current.logo} text={current.text} />
          ) : (
            <AutoCarousel
              slides={current.slides}
              autoplayMs={4200}
              resetKey={activeTab}
              variant={activeTab}
            />
          )}
        </div>
      </div>
    </section>
  );
}
