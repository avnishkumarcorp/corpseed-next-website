"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import founderImg from "../../../../public/home/VipanThakur.jpg";
import sakshiImg from "../../../../public/home/sakshi.png";
import vinayImg from "../../../../public/home/VinayThakur.jpg";
import vireshImg from "../../../../public/home/VireshOberoi.jpg";
import isoImg from "../../../../public/home/iso.png";
import ciiImg from "../../../../public/home/cii.png";

/**
 * Audit #9 — leadership was taking more homepage space than the service
 * discovery content beside it, so it is down to one quote card plus a compact
 * team list. Selecting a person swaps the card, which keeps every profile
 * reachable without stacking four full-height bios down the page.
 */
const PEOPLE = [
  {
    name: "Vipan Singh",
    role: "Founder & CEO",
    fullRole: "Founder & CEO, Corpseed ITES Pvt Ltd",
    image: founderImg,
    quote:
      "Compliance should not be the reason a good business slows down. We built Corpseed so founders get one team, one price and one clear answer — instead of chasing five departments.",
  },
  {
    name: "Viresh Oberoi",
    role: "Co-founder & Director",
    fullRole: "Co-founder & Director",
    image: vireshImg,
    quote:
      "Having built India's largest eCommerce marketplace at mjunction, I know what disciplined process does for scale. That is the same rigour we bring to Corpseed's growth and governance.",
  },
  {
    name: "Sakshi Jaggi",
    role: "Chief People Officer",
    fullRole: "Chief People Officer",
    image: sakshiImg,
    quote:
      "Great compliance work is done by people, not templates. My job is to bring in specialists who genuinely know their departments — and to make sure they stay long enough to master them.",
  },
  {
    name: "Vinay Singh",
    role: "Advisor",
    fullRole: "Advisor — Finance & Technology",
    image: vinayImg,
    quote:
      "Fifteen years in financial technology taught me that automation only helps when it removes real friction. That is the test every Corpseed product has to pass.",
  },
];

const MEMBERSHIPS = [
  { name: "ISO certified", image: isoImg },
  { name: "CII member", image: ciiImg },
];

export default function OurSupportSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = PEOPLE[activeIndex];

  return (
    <section className="w-full bg-slate-50">
      <div className="cs-container cs-section--tight">
        <div className="cs-reveal grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          {/* Selected person */}
          <figure className="relative m-0 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-45px_rgba(15,23,42,0.7)] sm:p-8">
            <svg
              aria-hidden="true"
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute right-6 top-5 text-blue-100"
            >
              <path d="M7.5 5A5.5 5.5 0 0 0 2 10.5 5.5 5.5 0 0 0 7.5 16c.42 0 .82-.05 1.2-.14C8.1 17.7 6.5 18.9 4.4 19.3l.5 1.9c4.4-.9 7.3-4.4 7.3-9.4V10.5A5.5 5.5 0 0 0 7.5 5Zm11 0A5.5 5.5 0 0 0 13 10.5 5.5 5.5 0 0 0 18.5 16c.42 0 .82-.05 1.2-.14-.6 1.84-2.2 3.04-4.3 3.44l.5 1.9c4.4-.9 7.3-4.4 7.3-9.4V10.5A5.5 5.5 0 0 0 18.5 5Z" />
            </svg>

            <span className="cs-eyebrow">Leadership</span>

            {/* min-height sized to the longest quote so switching people does
                not make the card (and the section below it) jump */}
            <blockquote
              key={active.name}
              className="mt-4 animate-[csFadeUp_.25s_ease-out] sm:min-h-[132px]"
            >
              <p className="text-[1.0625rem] leading-[1.75] text-slate-700 sm:text-[1.125rem]">
                “{active.quote}”
              </p>
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white ring-offset-2 ring-offset-blue-100">
                <Image
                  src={active.image}
                  alt={`${active.name}, ${active.fullRole}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>

              <span className="min-w-0">
                <span className="block text-[15.5px] font-semibold text-slate-900">
                  {active.name}
                </span>
                <span className="block text-[13px] text-slate-500">
                  {active.fullRole}
                </span>
              </span>
            </figcaption>

            <Link href="/about-us" className="cs-link-arrow mt-6 !text-[13.5px]">
              Read our story
              <span className="cs-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </figure>

          {/* Team picker + memberships */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[1.0625rem] font-semibold text-slate-900">
                The people behind it
              </h2>
              <p className="mt-1 text-[13px] text-slate-500">
                Select a name to read more.
              </p>

              <ul className="mt-4 space-y-2.5">
                {PEOPLE.map((person, i) => {
                  const isActive = i === activeIndex;

                  return (
                    <li key={person.name}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        aria-pressed={isActive}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition duration-200",
                          isActive
                            ? "border-blue-300 bg-blue-50/70 shadow-[0_10px_24px_-20px_rgba(37,99,235,0.9)]"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-white hover:shadow-sm",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 transition",
                            isActive ? "ring-2 ring-blue-400 ring-offset-1" : "",
                          ].join(" ")}
                        >
                          <Image
                            src={person.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={[
                              "block text-[14px] font-semibold leading-tight",
                              isActive ? "text-blue-800" : "text-slate-900",
                            ].join(" ")}
                          >
                            {person.name}
                          </span>
                          <span className="block text-[12.5px] text-slate-500">
                            {person.role}
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className={[
                            "shrink-0 text-[13px] transition",
                            isActive
                              ? "text-blue-600"
                              : "text-slate-300",
                          ].join(" ")}
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-slate-500">
                Accreditations
              </p>

              <ul className="mt-3 flex items-center gap-6">
                {MEMBERSHIPS.map((m) => (
                  <li key={m.name} className="flex items-center">
                    <Image
                      src={m.image}
                      alt={m.name}
                      height={52}
                      width={96}
                      sizes="96px"
                      className="h-[52px] w-auto object-contain"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
