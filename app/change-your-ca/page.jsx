// app/mca-fee-calculator/page.jsx
import { getChangeYourCAMeta } from "../lib/changeYourCa";
import ChangeYourCA from "./ChangeYourCA";

export async function generateMetadata() {
  const data = await getChangeYourCAMeta();

  return {
    title: data?.metaTitle || data?.title || "Corpseed || Change your CA",
    description: data?.metaDescription || "Corpseed || Change your CA",
    keywords: data?.metaKeyword || "",
    alternates: {
      canonical: "/change-your-ca",
    },
    openGraph: {
      title: data?.metaTitle || "Corpseed || Change your CA",
      description: data?.metaDescription || "Corpseed || Change your CA",
      url: "/change-your-ca",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.metaTitle || "Corpseed || Change your CA",
      description: data?.metaDescription || "Corpseed || Change your CA",
    },
  };
}

export default function Page() {
  return <ChangeYourCA />;
}
