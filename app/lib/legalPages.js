export async function getLegalPageBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-pages/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      const errText = await res.text().catch(() => "");
      console.error("Legal API Error:", res.status, res.statusText, errText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("getLegalPageBySlug error:", err);
    return null;
  }
}
