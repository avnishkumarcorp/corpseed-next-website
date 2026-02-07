// app/mca-fee-calculator/page.jsx

import { getOnlinePaymentMeta } from "../lib/onlinePayment";
import OnlinePaymentPage from "./OnlinePaymentPage";

export async function generateMetadata() {
  const data = await getOnlinePaymentMeta();

  return {
    title: data?.metaTitle || data?.title || "Corpseed || Payments",
    description: data?.metaDescription || "Corpseed || Payments",
    keywords: data?.metaKeyword || "",
    alternates: {
      canonical: "/online-payments",
    },
    openGraph: {
      title: data?.metaTitle || "Corpseed || Payments",
      description: data?.metaDescription || "Corpseed || Payments",
      url: "/online-payments",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.metaTitle || "Corpseed || Payments",
      description: data?.metaDescription || "Corpseed || Payments",
    },
  };
}

export default function Page() {
  return <OnlinePaymentPage />;
}
