import { notFound } from "next/navigation";
import { getAllCategories } from "@/app/lib/service";
import ServicesCatalogue from "@/app/service/ServicesCatalogue";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getAllCategories();

  if (!data) return {};

  if (slug === "all") {
    return {
      title: data?.title || "All Services",
      description: data?.metaDescription || "",
      alternates: {
        canonical: "/category/all",
      },
    };
  }

  const category = data?.allCategories?.find((c) => c.slug === slug);

  if (!category) return {};

  return {
    title: category?.title || "Category Services",
    description: category?.metaDescription || "",
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategorySlugPage({ params }) {
  const { slug } = await params;
  const data = await getAllCategories();

  if (!data) notFound();

  // If slug is not "all" and category not found → 404
  if (slug !== "all" && !data?.allCategories?.some((c) => c.slug === slug)) {
    notFound();
  }

  return <ServicesCatalogue apiData={data} activeSlug={slug} />;
}
