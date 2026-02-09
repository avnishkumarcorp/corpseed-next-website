// app/lib/career.js

// export async function getJoinOurTeamData() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-join-our-team`,
//       {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//       }
//     );

//     if (!res.ok) {
//       const errText = await res.text().catch(() => "");
//       console.error("Join Our Team API Error:", res.status, res.statusText, errText);
//       return null;
//     }

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error("getJoinOurTeamData error:", err);
//     return null;
//   }
// }


// app/lib/career.js

export async function getJoinOurTeamData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-join-our-team`,
      { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Join Our Team API Error:", res.status, res.statusText, errText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("getJoinOurTeamData error:", err);
    return null;
  }
}

export async function getJobBySlug(slug) {
  const data = await getJoinOurTeamData();
  const jobs = data?.jobs || [];
  const job = jobs.find((j) => String(j?.slug || "") === String(slug || ""));
  return { job, pageMeta: data };
}
