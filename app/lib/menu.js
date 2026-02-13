// app/lib/menu.js

function getApiBase() {
  const base =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return base.replace(/\/$/, "");
}

export async function getHeaderMenu() {
  try {
    const base = getApiBase();

    // ✅ if env missing, don't silently fail
    if (!base) {
      console.error("getHeaderMenu: Missing API_BASE_URL / NEXT_PUBLIC_API_BASE_URL");
      return [];
    }

    const upstream = `${base}/api/menu/dynamic`;

    const res = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },

      // ✅ ISR cache for menu (change 300 -> 60 if you want faster updates)
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("getHeaderMenu failed:", upstream, res.status, res.statusText, t);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (e) {
    console.error("getHeaderMenu error:", e);
    return [];
  }
}
