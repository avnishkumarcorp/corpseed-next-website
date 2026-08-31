// lib/newsRoom.js
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getNewsRoomList({
  page = 1,
  size = 20,
  q = "",
  categorySlug = "",
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (q) params.set("q", String(q));
  if (categorySlug) params.set("categorySlug", String(categorySlug));

  const url = `${BASE}/api/updated-news?${params.toString()}`;

  const res = await fetch(url, {
    // news list changes often → keep it fresh
    next: { revalidate: 30 },
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-news/${encodeURIComponent(
      slug,
    )}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
    },
  );

  // A real 404 means no such article → the page renders its 404.
  if (res.status === 404) return null;

  // Anything else is an outage. Raise it instead of returning null, which
  // would make the page call notFound() and serve a hard 404 for what is
  // only a temporary API failure.
  if (!res.ok) {
    const error = new Error(`API ${res.status} on /api/updated-news/${slug}`);
    error.status = res.status;
    throw error;
  }

  return await res.json();
}
