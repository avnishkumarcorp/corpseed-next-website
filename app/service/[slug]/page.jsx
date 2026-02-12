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
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data?.service) {
    return {
      title: "Service - Corpseed",
      description: "Corpseed service details and enquiry.",
      alternates: { canonical: `/service/${slug}` },
    };
  }

  const title = data.service.seoTitle || data.service.title || "Service";
  const description =
    data.service.seoDescription ||
    data.service.metaDescription ||
    data.service.summary ||
    "Corpseed service details and enquiry.";

  return {
    title: `${title} - Corpseed`,
    description,
    alternates: { canonical: `/service/${slug}` },
    openGraph: {
      title: `${title} - Corpseed`,
      description,
      url: `https://www.corpseed.com/service/${slug}`,
      siteName: "CORPSEED ITES PRIVATE LIMITED",
      type: "website",
      images: [
        {
          url: data.service.ogImageWebp || "/assets/images/corpseed.webp",
          width: 1200,
          height: 630,
          type: "image/webp",
        },
        {
          url: data.service.ogImagePng || "/assets/images/logo.png",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data?.service) notFound();

  const service = data.service;

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
        position: 2, // ✅ fix
        name: service.title || "Service",
        item: `https://www.corpseed.com/service/${slug}`,
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

      <section className="mx-auto max-w-7xl px-4 py-10">
        <LogoMarquee speed={60} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="sticky top-[72px] z-10 -mx-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <ServiceTabs tabs={data?.service?.serviceDetails} />
            </div>

            <div className="py-6">
              <ServiceContent tabs={service.serviceDetails} />
            </div>

            <StepsTimelineSection />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[88px] pb-10">
              <EnquiryForm serviceName={service.title} />
            </div>
          </div>
        </div>
      </div>

      <ServiceFaqs faqs={service.serviceFaqs} />

      <section className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ServiceSlugClient />
        </div>
      </section>
    </div>
  );
}
 