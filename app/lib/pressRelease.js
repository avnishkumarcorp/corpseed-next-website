
export async function getPressReleaseData({page,size,filter}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release?page=${page}&size=${size}&filter=${filter}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // good for dynamic content; change if needed
      }
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
    console.error("getServiceBySlug error:", err);
    return null;
  }
}



export async function getPressReleaseBySlug(slug) {
  if (!slug) return null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-press-release/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // good for dynamic content; change if needed
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      const errText = await res.text().catch(() => "");
      console.error("API Error:", res.status, res.statusText, errText);
      return null;
    }
    const data = await res.json(); // ✅ read once
    return data;
  } catch (err) {
    console.error("getServiceBySlug error:", err);
    return null;
  }
}


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}


export async function getLatestNews() {
  if (!API_BASE) {
    console.error("NEXT_PUBLIC_API_BASE_URL is missing");
    return [];
  }

  const url = `${API_BASE}/api/news/latest`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("getLatestNews API Error:", res.status, res.statusText, txt);
      return [];
    }

    const json = await safeJson(res);
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("getLatestNews error:", e);
    return [];
  }
}