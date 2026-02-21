// app/service/[slug]/page.js
import { notFound } from "next/navigation";
import Script from "next/script";
import nextDynamic from "next/dynamic";

import ServiceHero from "../ServiceHero";
import ServiceTabs from "../ServiceTabs";
import ServiceContent from "../ServiceContent";
import ServiceFaqs from "../ServiceFaqs";
import ServiceSlugClient from "./ServiceSlugClient";
import { getServiceData } from "./serviceData";
import StepsTimelineSection from "../StepsTimelineSection";
import PdfShareBar from "@/app/components/PdfShareBar";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// ✅ Route-level caching
export const revalidate = 3600;
export const dynamic = "force-static";

// ✅ If these are heavy client components, lazy-load them.
// If LogoMarquee / EnquiryForm are server components, remove dynamic() and import normally.
const LogoMarquee = nextDynamic(
  () => import("@/app/components/carousel/LogoMarquee"),
  {
    ssr: true,
    loading: () => <div className="h-10" />,
  },
);

const EnquiryForm = nextDynamic(
  () => import("@/app/components/enquiry-form/EnquiryForm"),
  {
    ssr: true,
    loading: () => (
      <div className="rounded-2xl border border-gray-200 p-4">
        Loading form…
      </div>
    ),
  },
);

function jsonLdString(obj) {
  // safer + smaller (removes undefined)
  return JSON.stringify(obj, (_, v) => (v === undefined ? undefined : v));
}

export async function generateMetadata({ params }) {
  const { segments } = (await params) ?? [];

  let state = null;
  let slug = null;

  if (segments?.length === 1) {
    slug = segments[0];
  } else if (segments?.length === 2) {
    state = segments[0];
    slug = segments[1];
  } else {
    return {};
  }

  const data = await getServiceData(slug, state);
  if (!data?.service) return {};

  const titleBase = data.title || data.service.title || "Service";

  const title = state
    ? `${titleBase} in ${state.replace(/-/g, " ")} - Corpseed`
    : `${titleBase} - Corpseed`;

  return {
    title,
    alternates: {
      canonical: state ? `/service/${state}/${slug}` : `/service/${slug}`,
    },
  };
}

export default async function ServicePage({ params }) {
  const { segments } = (await params) ?? [];
  let state = null;
  let slug = null;

  if (segments?.length === 1) {
    slug = segments[0];
  } else if (segments?.length === 2) {
    state = segments[0];
    slug = segments[1];
  } else {
    notFound();
  }

  const data = await getServiceData(slug, state);
  if (!data?.service) notFound();

  const service = data.service;
  const serviceCities = data.serviceCityMapResponseDTOS;

  // const { slug } = await params;
  // const data = await getServiceData(slug);

  // if (!data?.service) notFound();

  // const service = data.service;

  // ✅ Keep JSON-LD small (avoid huge HTML in schema)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: service.title || "Corpseed",
    image: "https://www.corpseed.com/assets/img/logo.webp",
    description:
      service.seoDescription ||
      service.metaDescription ||
      service.summary ||
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
        position: 2,
        name: service.title || "Service",
        item: state
          ? `https://www.corpseed.com/service/${state}/${slug}`
          : `https://www.corpseed.com/service/${slug}`,
      },
    ],
  };

  const faqList = Array.isArray(service.faqs) ? service.faqs : [];
  const faqSchema =
    faqList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqList.map((f) => ({
            "@type": "Question",
            name: String(f?.question || "").trim(),
            acceptedAnswer: {
              "@type": "Answer",
              // ✅ strip heavy html if present (schema can be plain text)
              text: String(f?.answer || f?.answerHtml || "")
                .replace(/<[^>]*>/g, "")
                .trim(),
            },
          })),
        }
      : null;

  return (
    <div className="bg-white text-gray-900">
      {/* ✅ JSON-LD via next/script */}
      <Script
        id="ld-product"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: jsonLdString(productSchema) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <Script
          id="ld-faq"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faqSchema) }}
        />
      ) : null}

      <ServiceHero
        title={service.title}
        summary={service.summary}
        videoUrl={service.videoUrl || "/videos/corpseed-intro.mp4"}
        badgeText="INCLUDES FREE SUPPORT"
        ratingText="Rated 4.9 by 74,861+ customers globally"
        videoText="Click to Watch & Know More"
      />

      <section className="mx-auto max-w-full px-4 py-10 bg-white">
        <LogoMarquee speed={60} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="sticky top-[72px] z-30 -mx-4 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <ServiceTabs tabs={service.serviceDetails} />
            </div>

            <div className="py-6">
              <ServiceContent tabs={service.serviceDetails} />
            </div>

            <StepsTimelineSection />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[88px] pb-10">
              <div className="mb-6 w-full flex justify-end">
                <PdfShareBar />
              </div>
              <EnquiryForm
                serviceName={service.title}
                serviceId={service?.id}
                type={"service"}
              />
            </div>
          </div>
        </div>
      </div>

      <ServiceFaqs faqs={service.serviceFaqs} />

      {serviceCities?.length > 0 && (
        <section className="bg-gray-50 py-6">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-2xl font-semibold mb-8">
              Fire Safety NOC by City
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {serviceCities?.map((city) => (
                <Link
                  key={city.id}
                  href={`/service/${city.cityName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${city?.slug}`}
                  className="group flex items-center justify-center gap-2 font-medium text-slate-700 transition"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 transition group-hover:scale-110" />
                  <span className="text-blue-600">{city.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ServiceSlugClient />
        </div>
      </section>
    </div>
  );
}
