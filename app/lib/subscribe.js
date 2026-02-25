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

  // ✅ FIXED: removed leading space
  const url = `${base.replace(/\/$/, "")}/api/customer/subscribe?request=${encodeURIComponent(e)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json", // ✅ FIXED
      },
      next: { revalidate: 300 },
    });

    const text = await res.text();

    if (!res.ok) {
      return {
        ok: false,
        message: text || "Subscription failed.",
        status: res.status,
      };
    }

    return {
      ok: true,
      data: text ? JSON.parse(text) : null,
    };
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
