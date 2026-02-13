import { getSubscribeThankYouMeta } from "@/app/lib/subscribe";
import SubscribeThankYouClient from "./SubscribeThankYouClient";


export async function generateMetadata() {
  const data = await getSubscribeThankYouMeta();

  const title = data?.title || "Thank You | Corpseed";
  const description =
    data?.metaDescription ||
    "Thank you for subscribing to Corpseed updates.";
  const keywords = data?.metaKeyword || "";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: "/subscribe/thankyou",
    },
    openGraph: {
      title,
      description,
      url: "https://www.corpseed.com/subscribe/thankyou",
      siteName: "Corpseed",
      type: "website",
    },
    robots: {
      index: false, // usually thank-you pages shouldn't be indexed
      follow: false,
    },
  };
}

export default function Page() {
  return <SubscribeThankYouClient />;
}
