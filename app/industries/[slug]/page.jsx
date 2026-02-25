// app/service/[slug]/page.js
import { clamp, getIndustryBySlug } from "@/app/lib/industry";
import { getClients } from "@/app/lib/clients";
import Link from "next/link";
import dynamic from "next/dynamic";

const ServiceFaqs = dynamic(() => import("@/app/service/ServiceFaqs"));
const IndustryCaterTabs = dynamic(() => import("../IndustryCaterTabs"));
const IndustryHeroSection = dynamic(() => import("./IndustryHeroSection"));
const LogoMarquee = dynamic(
  () => import("@/app/components/carousel/LogoMarquee"),
);
const ServiceTabs = dynamic(() => import("@/app/service/ServiceTabs"));
const EnquiryForm = dynamic(
  () => import("@/app/components/enquiry-form/EnquiryForm"),
);
const ServiceContent = dynamic(() => import("@/app/service/ServiceContent"));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getIndustryBySlug(slug);

  const title = data?.title || data?.industry?.metaTitle || "Industry";

  const description =
    data?.metaDescription ||
    data?.industry?.metaDescription ||
    data?.industry?.summary ||
    "Corpseed service details and enquiry.";

  const keywords = data?.metaKeyword || data?.industry?.metaKeyword || "";

  const ogImageWebp =
    data?.industry?.ogImageWebp || "/assets/images/corpseed.webp";
  const ogImagePng = data?.industry?.ogImagePng || "/assets/images/logo.png";

  return {
    title: `${title} - Corpseed`,
    description,
    alternates: {
      canonical: `/industries/${slug}`,
    },
    openGraph: {
      title: `${title} - Corpseed`,
      description,
      url: `https://www.corpseed.com/industries/${slug}`,
      siteName: "CORPSEED ITES PRIVATE LIMITED",
      type: "website",
      images: [
        { url: ogImageWebp, width: 1200, height: 630, type: "image/webp" },
        { url: ogImagePng, width: 1200, height: 630, type: "image/png" },
      ],
    },
    other: {
      ...(keywords ? { keywords } : {}),
    },
  };
}
function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Section({ title, children, className = "" }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function FeaturedCard({ item }) {
  const href = `/industries/${item?.slug}`;

  return (
    <div className="rounded-2xl bg-[#1f2e63] text-white shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold !text-white">
          {item?.title || item?.industryName}
        </h3>
        <p className="mt-3 text-sm !text-white/85 leading-6">
          {clamp(item?.summary, 140)}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold !text-white hover:text-white/90 cursor-pointer"
        >
          KNOW MORE ›
        </Link>
      </div>
    </div>
  );
}

/* ================= NEWS CARD ================= */
function NewsCard({ title, item, hrefBase }) {
  const href = item?.slug ? `${hrefBase}/${item.slug}` : hrefBase;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 italic text-slate-700">{clamp(item?.title, 42)}</p>
      <p className="mt-3 text-sm text-slate-600 leading-6">
        {clamp(
          item?.summary?.replace(/<[^>]*>/g, " ") ||
            "Read the latest update and know what’s new.",
          120,
        )}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        KNOW MORE ›
      </Link>
    </div>
  );
}

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const data = await getIndustryBySlug(slug);
  const clients = await getClients();

  const featured = data?.industries || [];

  if (!data) return null;

  // Build schema objects (example; map from your API fields)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Corpseed",
    image: "https://www.corpseed.com/assets/img/logo.webp",
    description:
      data?.service?.seoDescription ||
      data?.service?.metaDescription ||
      data?.service?.summary ||
      "",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "69232",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.corpseed.com/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data?.service?.title,
        item: `https://www.corpseed.com/service/${slug}`,
      },
    ],
  };

  // If you have FAQs in data, map them:
  const faqSchema = data?.service?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.service.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answerHtml || f.answer },
        })),
      }
    : null;

  return (
    <div className="bg-white text-gray-900">
      {/* JSON-LD scripts */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}

      {/* Your existing UI */}

      <section className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={data?.industry?.image} // replace with your actual image path
            alt="Industry Background"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-white">
              <span className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                INCLUDES FREE SUPPORT
              </span>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl !text-white">
                {data?.industry?.title}
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 !text-gray-200">
                {data?.industry?.summary}
              </p>
            </div>

            {/* Right CTA Card */}
            {/* <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl">
                <p className="text-lg font-semibold text-gray-900">
                  Why wait. Start now!
                </p>

                <div className="mt-4 flex items-center gap-3 text-blue-600 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5h2l3 7-1.5 3h9.5M6 5h15M9 12h6"
                    />
                  </svg>
                  <span>Call 7558640644 - Harshita</span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  We’re available 24/7
                </p>

                <button className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Get Started
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <IndustryHeroSection
        title={data?.industry?.title}
        summary={data?.industry?.summary}
        videoUrl={data?.industry?.videoUrl || "/videos/corpseed-intro.mp4"}
        badgeText="INCLUDES FREE SUPPORT"
        ratingText="Rated 4.9 by 74,861+ customers globally"
        videoText="Click to Watch & Know More"
      />

      <section className="mx-auto max-w-full px-4 bg-white">
        <LogoMarquee speed={60} items={clients} />
      </section>

      <Section title="Industries" className="pb-6 bg-white">
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {featured.slice(0, 3).map((x) => (
            <FeaturedCard key={x?.id || x?.slug} item={x} />
          ))}
        </div>
      </Section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="sticky top-[72px] z-30 -mx-4 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <ServiceTabs tabs={data?.industry?.industryDetails} />
            </div>

            <div className="py-6">
              <ServiceContent tabs={data?.industry?.industryDetails} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[88px] pb-10">
              <EnquiryForm
                serviceName={data?.industry?.title}
                type={"industry"}
                industryId={data?.industry?.id}
              />
            </div>
          </div>
        </div>
      </div>
      <Section className="pb-8 bg-white">
        <IndustryCaterTabs items={data?.industry10} />
      </Section>
      <Section className="pb-8 bg-white">
        <ServiceFaqs faqs={data.faqs} />
      </Section>

      {/* <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">
                Need help choosing the right option?
              </p>
              <p className="text-sm text-gray-600">
                Our experts will guide you based on your business and location.
              </p>
            </div>
            <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
              Get Free Consultation
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}
