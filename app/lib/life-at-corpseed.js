// app/lib/life-at-corpseed.js

import { apiGet } from "./fetcher";

/**
 * Get main Life At Corpseed page data
 */
export async function getLifeAtCorpseed() {
  try {
    // Cache for 10 minutes (adjust if needed)
    return await apiGet("/api/updated-life-at-corpseed", {
      revalidate: 600,
    });
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
