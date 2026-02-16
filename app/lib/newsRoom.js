// lib/newsRoom.js
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getNewsRoomList({ page = 1, size = 20, q = "", categorySlug = "" }) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (q) params.set("q", String(q));
  if (categorySlug) params.set("categorySlug", String(categorySlug));

  const url = `${BASE}/api/updated-news?${params.toString()}`;

  const res = await fetch(url, {
    // news list changes often → keep it fresh
        cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// If you don't already have stripHtml somewhere, use this:
/*
export function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
*/

export async function getNewsBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-news/${encodeURIComponent(
        slug,
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      if (res.status === 404) return null;

      const errText = await res.text().catch(() => "");
      console.error("getNewsBySlug API Error:", res.status, res.statusText, errText);
      return null;
    }

    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    console.error("getNewsBySlug error:", err);
    return null;
  }
}