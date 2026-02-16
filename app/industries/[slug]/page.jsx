// app/service/[slug]/page.js
import ServiceContent from "@/app/service/ServiceContent";
import EnquiryForm from "@/app/components/enquiry-form/EnquiryForm";
import ServiceTabs from "@/app/service/ServiceTabs";
import ServiceHero from "@/app/service/ServiceHero";
import LogoMarquee from "@/app/components/carousel/LogoMarquee";
import { getIndustryBySlug } from "@/app/lib/industry";

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

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const data = await getIndustryBySlug(slug);

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
      <ServiceHero
        title={data?.industry?.title}
        summary={data?.industry?.summary}
        videoUrl={data?.industry?.videoUrl || "/videos/corpseed-intro.mp4"}
        badgeText="INCLUDES FREE SUPPORT"
        ratingText="Rated 4.9 by 74,861+ customers globally"
        videoText="Click to Watch & Know More"
      />

      <section className="mx-auto max-w-7xl px-4 py-10 bg-white">
        <LogoMarquee speed={60} />
      </section>

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
              <EnquiryForm serviceName={data?.industry?.title} />
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-gray-200 bg-gray-50">
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
      </section>
    </div>
  );
}
