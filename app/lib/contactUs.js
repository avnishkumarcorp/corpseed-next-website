export async function getContactUs() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${base}/api/updated-contact-us`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("getContactUs error:", e);
    return null;
  }
}
