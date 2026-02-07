import ContactUsClient from "./ContactUsClient";
import { getContactUs } from "@/app/lib/contactUs";

export async function generateMetadata() {
  const data = await getContactUs();

  return {
    title: data?.title || "Contact Us | Corpseed",
    description: data?.metaDescription || "Contact Corpseed",
    keywords: data?.metaKeyword || "",
    alternates: { canonical: "/contact-us" },
  };
}

export default async function ContactUsPage() {
  const data = await getContactUs();
  return <ContactUsClient data={data} />;
}
