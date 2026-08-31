import { apiGet } from "./fetcher";

export async function getPressReleaseData({ page, size, filter }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release?page=${page}&size=${size}&filter=${filter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 300 },
      },
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    },
  );

  // A real 404 means no such press release → the page renders its 404.
  if (res.status === 404) return null;

  // Anything else is an outage. Returning null here made the page call
  // notFound(), so a temporary API failure served a hard 404 on a ranking
  // page. Raise instead, so the route answers 5xx via error.jsx.
  if (!res.ok) {
    const error = new Error(
      `API ${res.status} on /api/updated-press-release/${slug}`,
    );
    error.status = res.status;
    throw error;
  }

  return res.json();
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

export async function getLatestUpdatedPressRelease() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

    const res = await fetch(`${base}/api/updated-press-release/latest`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`API failed ${res.status} :: ${t}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch (e) {
    console.error("getLatestUpdatedPressRelease error:", e);
    return [];
  }
}
