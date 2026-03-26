// app/lib/partner.js
import { apiGet } from "./fetcher";

export async function getPartnerPageSeo() {
  try {
    // ✅ Partner SEO doesn't change every second, cache 10 min
    return await apiGet("/api/updated-partner", { cache: "no-store" });
  } catch (e) {
    console.error("getPartnerPageSeo error:", e);
    return null;
  }
}
