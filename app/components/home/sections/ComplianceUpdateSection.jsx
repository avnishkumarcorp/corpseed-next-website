import Image from "next/image";
import Link from "next/link";
import complianceUpdateImg from "../../../../public/home/compliance_updates.png";

/** Audit #15 — one icon family, one stroke weight, one tile treatment. */
const FEATURES = [
  {
    title: "Compliance built around you",
    desc: "No complicated forms and no bots. Answer a few questions and a specialist takes the paperwork, filings and follow-ups off your desk.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 7.2V12l3 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: "CA/CS in all 28 states",
    desc: "Wherever you operate, you get an independent professional who knows that state's authorities, timelines and local requirements.",
    icon: (
      <>
        <path
          d="M12 21s7-5.1 7-10.4A7 7 0 0 0 5 10.6C5 15.9 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10.4" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
  {
    title: "Flat-fee pricing, quoted upfront",
    desc: "Self-guided or fully managed, the number you are quoted is the number you pay. Government fees are itemised separately, never hidden.",
    icon: (
      <>
        <rect
          x="3.5"
          y="6"
          width="17"
          height="12"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M7 12h.01M17 12h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

export default function ComplianceUpdateSection() {
  return (
    <section className="w-full bg-white">
      <div className="cs-container cs-section--tight">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="cs-reveal">
            <span className="cs-eyebrow">Why Corpseed</span>
            <h2 className="cs-section-title">
              A smarter platform for better results
            </h2>
            <p className="cs-section-sub">
              Compliance stops being a scramble when one team owns the filing,
              the follow-up and the renewal.
            </p>

            <ul className="mt-8 space-y-7">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-4">
                  <span className="cs-icon-tile cs-icon-tile--lg">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {feature.icon}
                    </svg>
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-[1.0625rem] font-semibold leading-snug text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[14.5px] leading-[1.7] text-slate-600">
                      {feature.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact-us" className="cs-btn cs-btn--primary">
                Get a free quote
              </Link>
              <Link href="/about-us" className="cs-btn cs-btn--secondary">
                How we work
                <span className="cs-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="cs-reveal relative flex justify-center lg:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
            >
              <div className="h-3/4 w-3/4 rounded-full bg-blue-100/50 blur-3xl" />
            </div>

            <Image
              src={complianceUpdateImg}
              alt="Corpseed dashboard showing tracked compliance deadlines and filing status"
              sizes="(max-width: 1024px) 90vw, 520px"
              className="w-[90%] max-w-[520px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
