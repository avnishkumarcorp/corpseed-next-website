// app/partner-with-us/page.jsx
import PartnerWithUsClient from "./PartnerWithUsClient";

async function getPartnerPageSeo() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-partner`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("getPartnerPageSeo error:", e);
    return null;
  }
}

export async function generateMetadata() {
  const data = await getPartnerPageSeo();

  const title =
    data?.seo?.metaTitle || data?.title || "Corpseed || Partner with us";

  const description =
    data?.seo?.metaDescription ||
    data?.metaDescription ||
    "Corpseed partner network — register to collaborate with Corpseed.";

  const keywords = data?.seo?.metaKeyword || data?.metaKeyword || "";

  return {
    title,
    description,
    keywords,
    alternates: { canonical: "/partner-with-us" },
    openGraph: {
      title,
      description,
      url: "https://www.corpseed.com/partner-with-us",
      siteName: "Corpseed",
      type: "website",
    },
  };
}

export default function PartnerWithUsPage() {
  return <PartnerWithUsClient />;
}
