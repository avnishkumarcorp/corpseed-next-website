export async function getHeaderMenu() {
  try {
    const upstream = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menu/dynamic`;

    const res = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("getHeaderMenu failed:", res.status, res.statusText, t);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (e) {
    console.error("getHeaderMenu error:", e);
    return [];
  }
}
