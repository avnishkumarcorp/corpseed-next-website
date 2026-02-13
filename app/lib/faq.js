// app/lib/faq.js

import { apiGet } from "./fetcher";

export async function getFaqMeta() {
  try {
    // FAQ SEO + content — cache for 10 minutes
    return await apiGet("/api/updated-faq", {
      revalidate: 600,
    });
  } catch (error) {
    console.error("getFaqMeta error:", error);
    return null;
  }
}
