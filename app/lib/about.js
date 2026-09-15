// app/lib/about.js

import { apiGet } from "./fetcher";

export async function getAboutUsData() {
  try {
    // ✅ ISR: cache for 10 minutes (change if you want)
    return await apiGet("/api/updated-about-us", { revalidate: 30 });
  } catch (err) {
    console.error("getAboutUsData error:", err);
    return null;
  }
}
