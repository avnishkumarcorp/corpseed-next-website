import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Category artwork
import industryImg from "../../../../public/home/Industry_Setup_Solutions_Image-02.png";
import sustainabilityImg from "../../../../public/home/Sustainability-02.png";
import regulatoryImg from "../../../../public/home/Regulatory_Compliance_Image-02.png";
import importExportImg from "../../../../public/home/Import_Export_Image-02.png";
import productComplianceImg from "../../../../public/home/Product_Compliance-02.png";
import environmentalImg from "../../../../public/home/Environmental_main_image-03.png";

const HeroSearch = dynamic(() => import("../HeroSearch"), { ssr: true });

// Re-exported for backwards compatibility with older imports.
export { default as Portal } from "../../ui/Portal";

const PHONE = "+917558640644";

/**
 * Six categories, one uniform treatment.
 *
 * Category titles point at the full catalogue (the only category route we
 * can guarantee resolves); the sub-links are the real service pages, so the
 * homepage keeps its internal-linking value without risking a 404.
 */
const CATEGORIES = [
  {
    name: "Environmental",
    image: environmentalImg,
    blurb: "EPR, EIA, CTE/CTO & waste authorisations",
    links: [
      { label: "EPR", href: "/service/epr-authorization" },
      { label: "EIA", href: "/service/environmental-impact-assessment-eia" },
      { label: "EC", href: "/service/environmental-clearance" },
      {
        label: "PWM",
        href: "/service/plastic-waste-management-authorization",
      },
    ],
  },
  {
    name: "Regulatory Compliance",
    image: regulatoryImg,
    blurb: "Factory, fire, trade, FSSAI & labour licences",
    links: [
      { label: "Factory", href: "/service/factory-license" },
      { label: "Fire NOC", href: "/service/fire-noc-fire-noc-renewal" },
      { label: "FSSAI", href: "/service/fssai-basic-registration-renewal" },
      { label: "Trade", href: "/service/health-trade-license" },
    ],
  },
  {
    name: "Product Compliance",
    image: productComplianceImg,
    blurb: "BIS, ISI, ISO, WPC, TEC & CDSCO approvals",
    links: [
      { label: "BIS", href: "/service/bis-registration" },
      { label: "ISI", href: "/service/isi-registration-process-in-india" },
      { label: "ISO", href: "/service/iso-certification-consulting" },
      { label: "WPC", href: "/service/wpc-advisory-services" },
    ],
  },
  {
    name: "Import & Export",
    image: importExportImg,
    blurb: "IEC, DGFT licensing, LMPC & customs clearance",
    links: [
      { label: "IEC", href: "/service/import-export-code" },
      { label: "DGFT", href: "/service/dgft-export-import-license" },
      { label: "CDSCO", href: "/service/cdsco-online-registration" },
      { label: "LMPC", href: "/service/lmpc-certificate-for-import" },
    ],
  },
  {
    name: "Sustainability",
    image: sustainabilityImg,
    blurb: "ESG, ESDD, ESMS, net-zero & carbon credits",
    links: [
      { label: "ESG", href: "/service/environmental-social-and-governance-esg" },
      {
        label: "ESDD",
        href: "/service/environmental-and-social-due-diligence-esdd",
      },
      { label: "Net Zero", href: "/service/leed-zero-carbon-certification" },
      {
        label: "Carbon",
        href: "/service/carbon-credit-trading-scheme",
      },
    ],
  },
  {
    name: "Industry Setup",
    image: industryImg,
    blurb: "Plant setup for energy, medical & electronics",
    links: [
      {
        label: "Bio-fuels",
        href: "/service/biofuel-manufacturing-plant-setup-in-india",
      },
      { label: "Renewable", href: "/industries/renewable-energy" },
      {
        label: "Waste",
        href: "/industries/recycling-and-waste-management",
      },
    ],
  },
];

function StarRating() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-amber-500"
        >
          <path d="m12 17.27 5.18 3.13-1.37-5.89L20.4 9.6l-6.02-.52L12 3.5 9.62 9.08 3.6 9.6l4.59 4.91-1.37 5.89L12 17.27Z" />
        </svg>
      ))}
    </span>
  );
}

export default function HomeHeroSection({
  title = "One platform.\n500+ compliance services.",
  subtitle = "Get BIS, EPR, CDSCO, FSSAI, environmental and factory licences faster — with a dedicated expert who handles the filing end to end.",
}) {
  const lines = String(title).split("\n");

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ambient background — purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-blue-100/45 blur-3xl" />
        <div className="absolute -right-48 top-10 h-[560px] w-[560px] rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="cs-container relative z-10 pt-8 pb-10 md:pt-12 md:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---------------------------------------------- Left: the pitch */}
          <div className="lg:col-span-7">
            {/* Social proof above the headline */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
                <StarRating />
                <span className="text-[13px] font-semibold text-amber-900">
                  4.9/5 from 15,000+ businesses
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-emerald-600"
                >
                  <path
                    d="M12 3 4.5 6v5.4c0 4.6 3.2 8.9 7.5 9.6 4.3-.7 7.5-5 7.5-9.6V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 12 2.2 2.2L15.5 10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                ISO-certified advisory
              </span>
            </div>

            <h1 className="mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.375rem)] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {i === lines.length - 1 && lines.length > 1 ? (
                    <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-600">
              {subtitle}
            </p>

            {/* Search is the primary discovery tool — give it the room */}
            <div className="mt-7">
              <HeroSearch
                baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
                size="lg"
                placeholders={[
                  "Search 500+ services — try “EPR for plastic waste”",
                  "Search 500+ services — try “BIS certification”",
                  "Search 500+ services — try “Factory licence”",
                  "Search 500+ services — try “Pollution NOC”",
                ]}
              />
            </div>

            {/* One dominant CTA, one secondary — per audit #4 */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={`tel:${PHONE}`} className="cs-btn cs-btn--primary cs-btn--lg">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1l-2.2 2.2Z"
                    fill="currentColor"
                  />
                </svg>
                Talk to an expert — free
              </a>

              <Link href="/category/all" className="cs-btn cs-btn--secondary cs-btn--lg">
                Browse all services
                <span className="cs-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <p className="mt-3 text-[13px] text-slate-500">
              No obligation · Response within 1 working hour · Mon–Sat, 9am–6pm
            </p>
          </div>

          {/* ------------------------------------ Right: explore by category */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-5">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
                  Explore by category
                </h2>
                <Link
                  href="/category/all"
                  className="cs-link-arrow !text-[13px]"
                >
                  View all
                  <span className="cs-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>

              {/* Single column on purpose: two columns squeezed the artwork
                  down to ~28px where these illustrations are unreadable, and
                  wrapped both the titles and the service chips. Full width
                  buys a legible icon and one clean line of chips. */}
              <ul className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.name}>
                    <div className="group rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition duration-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-[0_14px_28px_-22px_rgba(15,23,42,0.5)]">
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">
                          <Image
                            src={cat.image}
                            alt=""
                            width={48}
                            height={48}
                            sizes="48px"
                            className="h-12 w-12 object-contain"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <Link
                            href="/category/all"
                            className="block text-[14.5px] font-semibold leading-tight text-slate-900 transition group-hover:text-blue-700"
                          >
                            {cat.name}
                          </Link>

                          <p className="mt-0.5 text-[12px] leading-snug text-slate-500 cs-clamp-1">
                            {cat.blurb}
                          </p>

                          <div className="mt-1.5 flex gap-1 overflow-hidden">
                            {cat.links.slice(0, 4).map((l) => (
                              <Link
                                key={l.href}
                                href={l.href}
                                className="shrink-0 whitespace-nowrap rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <span
                          aria-hidden="true"
                          className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                        >
                          →
                        </span>
                      </div>
                    </div>
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
