export async function getHeaderMenu() {
  try {
    // call your Next API (same origin)
    const res = await fetch("/api/header-menu", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (err) {
    console.error("getHeaderMenu error:", err);
    return [];
  }
}
