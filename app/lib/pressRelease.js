import { apiGet } from "./fetcher";



export async function getPressReleaseData({page,size,filter}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release?page=${page}&size=${size}&filter=${filter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // good for dynamic content; change if needed
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;

      // optional: read text once for debugging
      const errText = await res.text().catch(() => "");
      console.error("API Error:", res.status, res.statusText, errText);
      return null;
    }
    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    return null;
  }
}



export async function getPressReleaseBySlug(slug) {
  if (!slug) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // good for dynamic content; change if needed
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      const errText = await res.text().catch(() => "");
      console.error("API Error:", res.status, res.statusText, errText);
      return null;
    }
    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    return null;
  }
}


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}



export async function getLatestNews() {
  try {
    return await apiGet("/api/news/latest", { revalidate: 300 });
  } catch (e) {
    console.error("getLatestNews error:", e);
    return [];
  }
}
