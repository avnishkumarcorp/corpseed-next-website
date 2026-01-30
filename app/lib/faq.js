// app/lib/faq.js
export async function getFaqData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-faq`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("FAQ API Error:", res.status, res.statusText, errText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("getFaqData error:", err);
    return null;
  }
}
