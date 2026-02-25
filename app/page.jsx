import { Suspense } from "react";
import HeroWrapper from "./components/home/HeroWrapper";
import HomeClientSectionsWrapper from "./components/home/HomeClientSectionsWrapper";
import { getHomeTestData } from "./lib/home";

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

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="h-[500px]" />}>
        <HeroWrapper />
      </Suspense>

      <Suspense fallback={<div className="h-[1200px]" />}>
        <HomeClientSectionsWrapper />
      </Suspense>
    </>
  );
}
