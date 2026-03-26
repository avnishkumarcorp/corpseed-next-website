// app/lib/contact.js  (or wherever this function is)

import { apiGet } from "./fetcher";

export async function getContactUs() {
  try {
    // Contact page content — cache 10 minutes
    return await apiGet("/api/updated-contact-us", {
      revalidate: 60,
    });
  } catch (e) {
    console.error("getContactUs error:", e);
    return null;
  }
}
