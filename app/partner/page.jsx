// app/partner-with-us/page.jsx
import PartnerWithUsClient from "./PartnerWithUsClient";
import { getPartnerPageSeo } from "../lib/partner";

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
