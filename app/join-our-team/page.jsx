
import { getJoinOurTeamData } from "../lib/career";
import CareerClient from "./CareerClient";

function splitKeywords(metaKeyword) {
  return (metaKeyword || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function generateMetadata() {
  const data = await getJoinOurTeamData();

  const title = data?.title || "Career | Corpseed";
  const description = data?.metaDescription || "Join the Corpseed team.";
  const keywords = splitKeywords(data?.metaKeyword);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
  };
}

export default async function JoinOurTeamPage() {
  const data = await getJoinOurTeamData();
  const jobs = data?.jobs || [];

  return (
    <main className="bg-white">
      <CareerClient pageMeta={data} jobs={jobs} />
    </main>
  );
}
