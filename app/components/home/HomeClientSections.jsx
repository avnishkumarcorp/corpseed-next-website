"use client";

import dynamic from "next/dynamic";

// ✅ these can be ssr:false because this file is a Client Component
const LogoMarquee = dynamic(() => import("../carousel/LogoMarquee"), {
  ssr: false,
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="h-[110px] rounded-xl border border-gray-200 bg-white" />
    </section>
  ),
});

const CardCarousel = dynamic(() => import("../carousel/CardCarousel"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-56 rounded-xl border border-gray-200 bg-white" />
    </div>
  ),
});

const ComplianceUpdateSection = dynamic(
  () => import("./sections/ComplianceUpdateSection"),
  { ssr: false },
);
const VirtualMeetingSection = dynamic(
  () => import("./sections/VirtualMeetingSection"),
  { ssr: false },
);
const OurSupportSection = dynamic(
  () => import("./sections/OurSupportSection"),
  {
    ssr: false,
  },
);
const NewsSection = dynamic(() => import("./sections/NewsSection"), {
  ssr: false,
});
const LatestArticlesSection = dynamic(
  () => import("./sections/LatestArticleSection"),
  { ssr: false },
);
const LatestProductsSection = dynamic(
  () => import("./sections/LatestProductsSection"),
  { ssr: false },
);

export default function HomeClientSections({
  homeData,
  newsData,
  latestBlogs,
  products,
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <LogoMarquee speed={60} />
      </section>
      <CardCarousel data={homeData} />
      <ComplianceUpdateSection data={homeData} />
      <VirtualMeetingSection data={homeData} />
      <OurSupportSection data={homeData} />
      <NewsSection data={newsData} />
      <LatestArticlesSection data={latestBlogs} />
      <LatestProductsSection data={products} />
    </>
  );
}
