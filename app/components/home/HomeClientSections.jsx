import dynamic from "next/dynamic";

const ClientsMarquee = dynamic(() => import("../clients/ClientsMarquee"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="h-[110px] rounded-xl border border-gray-200 bg-white" />
    </section>
  ),
});

const CardCarousel = dynamic(() => import("../carousel/CardCarousel"), {
  loading: () => (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-56 rounded-xl border border-gray-200 bg-white" />
    </div>
  ),
});

const ComplianceUpdateSection = dynamic(
  () => import("./sections/ComplianceUpdateSection"),
);
const VirtualMeetingSection = dynamic(
  () => import("./sections/VirtualMeetingSection"),
);
const OurSupportSection = dynamic(() => import("./sections/OurSupportSection"));
const NewsSection = dynamic(() => import("./sections/NewsSection"));
const LatestArticlesSection = dynamic(
  () => import("./sections/LatestArticleSection"),
);
const LatestProductsSection = dynamic(
  () => import("./sections/LatestProductsSection"),
);

export default function HomeClientSections({
  homeData,
  newsData,
  latestBlogs,
  products,
}) {
  return (
    <>
      <section className="mx-auto max-w-full px-4 bg-white">
        <ClientsMarquee />
      </section>
      <div className="min-h-[350px]">
        <CardCarousel data={homeData} />
      </div>

      <div className="min-h-[450px]">
        <ComplianceUpdateSection data={homeData} />
      </div>
      <VirtualMeetingSection data={homeData} />
      <OurSupportSection data={homeData} />
      <NewsSection data={newsData} />
      <LatestArticlesSection data={latestBlogs} />
      <LatestProductsSection data={products} />
    </>
  );
}
