// app/products/page.jsx
import ProductsCatalogue from "./ProductsCatalogue";
import { getProductsPageCached } from "../lib/products.cached";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const size = Number(sp?.size || 20);
  const filter = sp?.filter || "";
  const q = sp?.q || "";

  const data = await getProductsPageCached({ page, size, filter, q });

  const title = data?.title || "Corpseed | All Products";
  const description =
    data?.metaDescription || data?.metaTitle || "Browse Corpseed products.";

  return {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: {
      title,
      description,
      url: "https://www.corpseed.com/products",
      siteName: "CORPSEED ITES PRIVATE LIMITED",
      type: "website",
    },
  };
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const size = Number(sp?.size || 20);
  const filter = sp?.filter || "";
  const q = sp?.q || "";

  const data = await getProductsPageCached({ page, size, filter, q });

  return (
    <ProductsCatalogue data={data} page={page} size={size} filter={filter} q={q} />
  );
}
