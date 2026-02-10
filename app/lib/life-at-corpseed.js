// app/lib/life-at-corpseed.js

export async function getLifeAtCorpseed() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-life-at-corpseed`,
      {
        // ✅ use no-store if it changes frequently
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("LifeAtCorpseed API Error:", res.status, errText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("getLifeAtCorpseed error:", e);
    return null;
  }
}



// app/lib/life-at-corpseed.js
// app/lib/life-at-corpseed.js

// app/lib/life-at-corpseed.js

const BASE =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getLifeAtCorpseedBySlug(slug) {
  if (!slug) return null;
  if (!BASE) {
    console.error("Missing API_BASE_URL / NEXT_PUBLIC_API_BASE_URL");
    return null;
  }

  // ✅ backend expects ?slug=
  const url = `${BASE}/api/updated-life-at-corpseed/slug?slug=${encodeURIComponent(
    slug
  )}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text().catch(() => "");

    if (!res.ok) {
      console.error("Life slug API failed:", res.status, url, text);
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      console.error("Life slug API not JSON:", url, text);
      return null;
    }
  } catch (e) {
    console.error("getLifeAtCorpseedBySlug error:", url, e);
    return null;
  }
}

