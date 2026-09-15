import { apiGet } from "./fetcher";

export async function getSitemapMeta() {
  try {
    return await apiGet("/api/sitemap", {
      cache: "no-store", // 1 hour cache
    });
  } catch (err) {
    console.error("getSitemapMeta error:", err);
    return null;
  }
}
