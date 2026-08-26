import dynamic from "next/dynamic";

/**
 * Homepage sequence, per audit #3:
 *   Hero → Stats → Trusted by → Popular services → Why Corpseed →
 *   How it works → Leadership → Press → Insights → Products → Closing CTA
 *
 * Deep catalogue content now lives on the category and product pages; the
 * homepage keeps one block per job to be done.
 */

const ClientsMarquee = dynamic(() => import("../clients/ClientsMarquee"), {
  loading: () => (
    <div className="cs-container py-8">
      <div className="h-[92px] rounded-2xl border border-slate-200 bg-white" />
    </div>
  ),
});

const CardCarousel = dynamic(() => import("../carousel/CardCarousel"), {
  loading: () => (
    <div className="cs-container py-10">
      <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
    </div>
  ),
});

const ComplianceUpdateSection = dynamic(
  () => import("./sections/ComplianceUpdateSection"),
);
const ProcessSection = dynamic(() => import("./sections/ProcessSection"));
const OurSupportSection = dynamic(() => import("./sections/OurSupportSection"));
const NewsSection = dynamic(() => import("./sections/NewsSection"));
const LatestArticlesSection = dynamic(
  () => import("./sections/LatestArticleSection"),
);
const LatestProductsSection = dynamic(
  () => import("./sections/LatestProductsSection"),
);
const VirtualMeetingSection = dynamic(
  () => import("./sections/VirtualMeetingSection"),
);
const FinalCtaSection = dynamic(() => import("./sections/FinalCtaSection"));

export default function HomeClientSections({
  homeData,
  newsData,
  latestBlogs,
  products,
}) {
  return (
    <>
      <ClientsMarquee />

      <CardCarousel data={homeData} />

      <ComplianceUpdateSection data={homeData} />

      <ProcessSection />

      <OurSupportSection />

      <NewsSection data={newsData} />

      <LatestArticlesSection data={latestBlogs} />

      <LatestProductsSection data={products} />

      <VirtualMeetingSection />

      <FinalCtaSection />
    </>
  );
}
