// app/lib/life-at-corpseed.js

import { apiGet } from "./fetcher";

/**
 * Get main Life At Corpseed page data
 */
// app/lib/life-at-corpseed.js

export async function getLifeAtCorpseed({ page = 1, size = 5 } = {}) {
  try {
    return await apiGet(
      `/api/updated-life-at-corpseed?page=${page}&size=${size}`,
      { revalidate: 0 } // dynamic
    );
  } catch (e) {
    console.error("getLifeAtCorpseed error:", e);
    return null;
  }
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
