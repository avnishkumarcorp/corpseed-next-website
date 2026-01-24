// app/lib/home.js

export async function getHomeTestData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/test`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;

      const errText = await res.text().catch(() => "");
      console.error("Home test API Error:", res.status, res.statusText, errText);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getHomeTestData error:", err);
    return null;
  }
}
