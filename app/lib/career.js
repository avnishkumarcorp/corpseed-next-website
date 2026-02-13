// app/lib/career.js

import { apiGet } from "./fetcher";

export async function getJoinOurTeamData() {
  try {
    return await apiGet("/api/updated-join-our-team", { revalidate: 600 });
  } catch (e) {
    console.error("getJoinOurTeamData error:", e);
    return null;
  }
}


export async function getJobBySlug(slug) {
  const data = await getJoinOurTeamData();
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
  const job = jobs.find((j) => String(j?.slug || "") === String(slug || ""));
  return { job, pageMeta: data };
}
