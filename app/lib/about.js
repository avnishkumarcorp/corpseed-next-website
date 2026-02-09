// app/lib/about.js

export async function getAboutUsData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-about-us`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // always fresh (SSR). Change to revalidate if needed.
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("AboutUs API Error:", res.status, res.statusText, errText);
      return null;
    }

    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    console.error("getAboutUsData error:", err);
    return null;
  }
}
