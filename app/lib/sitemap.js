// app/lib/sitemap.js

export async function getSitemapMeta() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sitemap`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Sitemap API Error:", res.status, res.statusText, errText);
      return null;
    }

    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    console.error("getSitemapMeta error:", err);
    return null;
  }
}
