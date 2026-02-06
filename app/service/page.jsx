import { getAllCategories } from "../lib/service";
import ServicesCatalogue from "./ServicesCatalogue";

export async function generateMetadata() {
  const data = await getAllCategories();

  const title = data?.title || "Corpseed | Services Catalogue";
  const description =
    data?.metaDescription ||
    "Browse Corpseed services by category and find the right compliance solution.";
  const keywords = data?.metaKeyword || "";

  return {
    title,
    description,
    alternates: {
      canonical: "/service",
    },
    openGraph: {
      title,
      description,
      url: "https://www.corpseed.com/service",
      siteName: "Corpseed",
      type: "website",
      images: [
        {
          url: "https://www.corpseed.com/assets/images/corpseed.webp",
          width: 1200,
          height: 630,
        },
      ],
    },
    other: {
      ...(keywords ? { keywords } : {}),
    },
  };
}

export default async function CategoryAllPage() {
  const data = await getAllCategories();

  return <ServicesCatalogue apiData={data} />;
}
