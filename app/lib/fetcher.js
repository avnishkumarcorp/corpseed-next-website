// app/lib/fetcher.js

function getApiBase() {
  const base =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.replace(/\/$/, "");
}

export async function apiGet(path, { revalidate = 600 } = {}) {
  const base = getApiBase();
  if (!base) throw new Error("Missing API_BASE_URL / NEXT_PUBLIC_API_BASE_URL");

  // ✅ ensure single slash between base + path
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  // ✅ treat not-found as null (no crash)
  if (res.status === 404) return null;

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const t = await res.text().catch(() => "");
    throw new Error(
      `API failed ${res.status} ${path} (${url}) content-type=${ct} :: ${t.slice(
        0,
        250
      )}`
    );
  }

  return res.json();
}
