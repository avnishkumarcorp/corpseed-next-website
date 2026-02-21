// app/lib/life-at-corpseed.js

import { apiGet } from "./fetcher";

/**
 * Get main Life At Corpseed page data
 */
// app/lib/life-at-corpseed.js

export async function getLifeAtCorpseed({ page = 1, size = 5 } = {}) {
  return await apiGet(
    `/api/updated-life-at-corpseed?page=${page}&size=${size}`,
    { revalidate: 60 } // 1 minute cache
  );
}

/**
 * Get Life At Corpseed by slug
 */
export async function getLifeAtCorpseedBySlug(slug) {
  if (!slug) return null;

  try {
    return await apiGet(
      `/api/updated-life-at-corpseed/slug?slug=${encodeURIComponent(slug)}`,
      {
        revalidate: 600, // 10 min cache
      }
    );
  } catch (e) {
    console.error("getLifeAtCorpseedBySlug error:", e);
    return null;
  }
}
