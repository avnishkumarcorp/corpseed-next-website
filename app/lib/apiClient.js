const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

if (!BASE) {
  console.warn("⚠️ NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function apiGet(path) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}