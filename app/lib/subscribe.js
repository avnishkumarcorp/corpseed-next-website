// app/lib/subscribe.js

import { apiGet } from "./fetcher";

export async function subscribeEmail(email) {
  const e = String(email || "").trim();
  if (!e) {
    return { ok: false, message: "Email is required." };
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (!base) {
    return { ok: false, message: "API base URL is missing." };
  }

  const url = `${base.replace(/\/$/, "")}/subscribe?email=${encodeURIComponent(e)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      // try to read text / json (backend can return either)
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        message: text?.trim() || "Subscription failed. Please try again.",
        status: res.status,
      };
    }

    // if backend returns body, we read it safely
    const raw = await res.text().catch(() => "");
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw || null;
    }

    return { ok: true, data };
  } catch (err) {
    return { ok: false, message: "Network error while subscribing." };
  }
}





export async function getSubscribeThankYouMeta() {
  try {
    return await apiGet("/api/customer/subscribe/thanks", {
      revalidate: 3600, // cache 1 hour
    });
  } catch (err) {
    console.error("getSubscribeThankYouMeta error:", err);
    return null;
  }
}
