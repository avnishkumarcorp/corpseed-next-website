import HomeHeroSection from "./components/home/sections/HomeHeroSection";
import HomeClientSections from "./components/home/HomeClientSections";

import { getHomeTestData } from "./lib/home";
import { getLatestBlogs } from "./lib/knowledgeCentre";
import { getLatestProducts } from "./lib/products";
import { getLatestUpdatedPressRelease } from "./lib/pressRelease";

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

export const revalidate = 300;

export default async function HomePage() {
  const [homeData, pressList, latestBlogs, products] = await Promise.all([
    getHomeTestData(),
    getLatestUpdatedPressRelease(),
    getLatestBlogs(),
    getLatestProducts(),
  ]);

  return (
    <>
      <HomeHeroSection data={homeData} />
      <HomeClientSections
        homeData={homeData}
        newsData={pressList}
        latestBlogs={latestBlogs}
        products={products}
      />
    </>
  );
}
