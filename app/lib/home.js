// app/lib/home.js

import { apiGet } from "./fetcher";

export async function getHomeTestData() {
  try {
    // Home test data — cache for 5 minutes
    return await apiGet("/api/customer/test", {
      revalidate: 30,
    });
  } catch (err) {
    console.error("getHomeTestData error:", err);
    return null;
  }
}
