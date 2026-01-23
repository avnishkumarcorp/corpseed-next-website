export async function getHeaderMenu() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menu/dynamic`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status === 404) return [];
      const errText = await res.text().catch(() => "");
      console.error("Header menu API Error:", res.status, res.statusText, errText);
      return [];
    }

    const data = await res.json();
    console.log("sdgjfgjsjsfjfsjfjs",data)
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch (err) {
    console.error("getHeaderMenu error:", err);
    return [];
  }
}
