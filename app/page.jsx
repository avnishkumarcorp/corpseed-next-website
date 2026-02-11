import HomeHeroSection from "./components/home/sections/HomeHeroSection";
import HomeClientSections from "./components/home/HomeClientSections";

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
  const [homeData, newsData, latestBlogs, products] = await Promise.all([
    getHomeTestData(),
    getLatestNews(),
    getLatestBlogs(),
    getLatestProducts(),
  ]);

  return (
    <>
      {/* ✅ Keep Hero in server for best LCP */}
      <HomeHeroSection data={homeData} />

      {/* ✅ Everything else client-lazy */}
      <HomeClientSections
        homeData={homeData}
        newsData={newsData}
        latestBlogs={latestBlogs}
        products={products}
      />
    </>
  );
}
