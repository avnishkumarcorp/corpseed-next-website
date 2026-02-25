// app/lib/industries.js
export async function getIndustriesPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${base}/api/customer/industries`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Industries API failed ${res.status}: ${t}`);
  }

  return res.json();
}

export function toImgUrl(file) {
  // Your data has image names (webp) – usually hosted on S3.
  // Change this base if your CDN path is different.
  const f = String(file || "").trim();
  if (!f) return "";
  if (f.startsWith("http")) return f;

  const s3 = "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/";
  return s3 + f;
}

export function clamp(s, n = 140) {
  const v = (s ?? "").toString().trim();
  if (!v) return "";
  return v.length > n ? v.slice(0, n) + "..." : v;
}

export async function getIndustryBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/industries/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 300 }, // good for dynamic content; change if needed
      },
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
    return null;
  }
}
