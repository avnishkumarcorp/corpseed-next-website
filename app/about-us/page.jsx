import { getAboutUsData } from "../lib/about";
import AboutUsClient from "./AboutUsClient";


export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getAboutUsData();

  const title = data?.title || "About Us | Corpseed";
  const description =
    data?.metaDescription ||
    "Learn about Corpseed’s story, mission and vision — simplifying business compliance through technology-driven solutions.";

  // API gives a single string with "|" separators
  const keywords = data?.metaKeyword
    ? data.metaKeyword
        .split("|")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords, // Next.js supports array or string
  };
}



export default function AboutUsPage() {
  return <AboutUsClient />;
}
