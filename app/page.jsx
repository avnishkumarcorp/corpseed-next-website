import CardCarousel from "./components/carousel/CardCarousel";
import LogoMarquee from "./components/carousel/LogoMarquee";
import ComplianceUpdateSection from "./components/home/sections/ComplianceUpdateSection";
import HomeHeroSection from "./components/home/sections/HomeHeroSection";
import LatestArticlesSection from "./components/home/sections/LatestArticleSection";
import LatestProductsSection from "./components/home/sections/LatestProductsSection";
import NewsSection from "./components/home/sections/NewsSection";
import OurSupportSection from "./components/home/sections/OurSupportSection";
import VirtualMeetingSection from "./components/home/sections/VirtualMeetingSection";

import { getHomeTestData } from "./lib/home";
import { getLatestBlogs } from "./lib/knowledgeCentre";
import { getLatestNews } from "./lib/pressRelease";
import { getLatestProducts } from "./lib/products";

// ✅ Home Page SEO (Meta)
export async function generateMetadata() {
  const data = await getHomeTestData();

  const title =
    data?.title ||
    "Corpseed | Regulatory, Environmental, Sustainability, Plant Setup & Compliance";

  const description =
    data?.metaDescription ||
    "Corpseed platform for Regulatory, Environmental, Sustainability, Plant Setup & Compliance.";

  const keywords = data?.metaKeyword || "";

  return {
    title,
    description,
    keywords,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      siteName: "Corpseed",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const homeData = await getHomeTestData();
  const newsData =await getLatestNews()
  const latestBlogs = await getLatestBlogs();
  const products = await getLatestProducts();

  return (
    <>
      <HomeHeroSection data={homeData} />
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
