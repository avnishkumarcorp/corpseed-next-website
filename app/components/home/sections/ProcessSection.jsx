import Link from "next/link";

/** Audit #14 — make the enquiry-to-certificate journey legible at a glance. */
const STEPS = [
  {
    title: "Tell us your requirement",
    desc: "Share what you need in a two-minute form or a quick call. No jargon required.",
    icon: (
      <>
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-5 4V6.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8 8.5h8M8 12h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Expert consultation",
    desc: "A specialist for your state and sector confirms scope, timeline and a flat fee.",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4.5 20a7.5 7.5 0 0 1 15 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Documentation",
    desc: "We prepare, review and validate every document so nothing bounces back.",
    icon: (
      <>
        <path
          d="M7 3.5h6.5L18 8v12.5H7V3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M13 3.5V8h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="M10 12.5h5M10 16h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Government filing",
    desc: "We file with the relevant authority and handle every query and inspection.",
    icon: (
      <>
        <path
          d="M3.5 9.5 12 4.5l8.5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M6 10.5v7M10 10.5v7M14 10.5v7M18 10.5v7M3.5 20h17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    title: "Certificate delivered",
    desc: "Your licence lands in your dashboard, with renewal reminders set up for you.",
    icon: (
      <>
        <circle cx="12" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="m9.5 10 1.8 1.8L14.8 8.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.8 15.2 7.5 21l4.5-2.2L16.5 21l-1.3-5.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </>
    ),
  },
];

export default function ProcessSection() {
  return (
    <section className="w-full bg-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-section-head cs-section-head--split cs-reveal">
          <div>
            <span className="cs-eyebrow">How it works</span>
            <h2 className="cs-section-title">
              From enquiry to certificate in five steps
            </h2>
            <p className="cs-section-sub">
              One dedicated expert stays with your file from the first call to
              the final approval — you always know what happens next.
            </p>
          </div>

          <Link href="/contact-us" className="cs-btn cs-btn--secondary shrink-0">
            Book a consultation
            <span className="cs-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {/* Connector rail — desktop only, decorative */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent lg:block"
          />

          {/* No stagger delay needed: each step drives its own scroll timeline,
              so they cascade naturally as the row comes into view. */}
          {STEPS.map((step, i) => (
            <li key={step.title} className="cs-reveal relative">
              <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.8)]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {step.icon}
                </svg>

                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </div>

              <h3 className="mt-4 text-[15.5px] font-semibold leading-snug text-slate-900">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
