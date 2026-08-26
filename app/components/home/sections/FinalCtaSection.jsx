import Link from "next/link";

const PHONE = "+917558640644";
const WHATSAPP =
  "https://wa.me/917558640644?text=" +
  encodeURIComponent(
    "Hi Corpseed, I would like to discuss a compliance requirement.",
  );

const ASSURANCES = [
  "Flat-fee pricing, quoted upfront",
  "CA/CS coverage across all 28 states",
  "Renewal reminders included",
];

export default function FinalCtaSection() {
  return (
    <section className="w-full bg-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-reveal relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-12 sm:px-10 md:py-14">
          {/* Decorative wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <h2 className="text-[clamp(1.625rem,1.25rem+1.6vw,2.375rem)] font-bold leading-tight tracking-tight text-white">
                Not sure which licence you need?
              </h2>
              <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-blue-50/90">
                Tell us what you are building. A compliance expert will map the
                exact approvals, timelines and costs for your business — free,
                and with no obligation.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                {ASSURANCES.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[14px] font-medium text-blue-50"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-blue-200"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="m8.5 12 2.4 2.4 4.6-4.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-sm">
              <a href={`tel:${PHONE}`} className="cs-btn cs-btn--onDark cs-btn--lg cs-btn--block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1l-2.2 2.2Z"
                    fill="currentColor"
                  />
                </svg>
                Call +91 75586 40644
              </a>

              <Link href="/book-meeting" className="cs-btn cs-btn--outlineDark cs-btn--lg cs-btn--block">
                Book a meeting
              </Link>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-btn cs-btn--outlineDark cs-btn--lg cs-btn--block"
              >
                Chat on WhatsApp
              </a>

              <p className="mt-1 text-center text-[12.5px] text-blue-100/80">
                Mon–Sat, 9:00am – 6:00pm IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
