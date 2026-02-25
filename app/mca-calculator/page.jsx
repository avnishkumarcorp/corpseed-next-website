// app/mca-fee-calculator/page.jsx
import { getMcaFeeCalculatorMeta } from "../lib/mcaCalculator";
import McaCalculatorClient from "./McaCalculatorClient";

export const revalidate = 300;

export async function generateMetadata() {
  const data = await getMcaFeeCalculatorMeta();

  return {
    title: data?.metaTitle || data?.title || "Corpseed || MCA Calculator",
    description: data?.metaDescription || "Corpseed || MCA Calculator",
    keywords: data?.metaKeyword || "",
    alternates: {
      canonical: "/mca-fee-calculator",
    },
    openGraph: {
      title: data?.metaTitle || "Corpseed || MCA Calculator",
      description: data?.metaDescription || "Corpseed || MCA Calculator",
      url: "/mca-fee-calculator",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.metaTitle || "Corpseed || MCA Calculator",
      description: data?.metaDescription || "Corpseed || MCA Calculator",
    },
  };
}

export default function Page() {
  return <McaCalculatorClient />;
}
