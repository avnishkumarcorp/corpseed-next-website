// app/lib/service.js

export async function getIndustryBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/industries/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // good for dynamic content; change if needed
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;

      // optional: read text once for debugging
      const errText = await res.text().catch(() => "");
      console.error("API Error:", res.status, res.statusText, errText);
      return null;
    }

    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    console.error("getServiceBySlug error:", err);
    return null;
  }
}
