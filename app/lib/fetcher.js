// app/lib/fetcher.js

function getApiBase() {
  const base =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.replace(/\/$/, "");
}

export async function apiGet(path, { revalidate = 600, cache } = {}) {
  const base = getApiBase();
  if (!base) throw new Error("Missing API_BASE_URL / NEXT_PUBLIC_API_BASE_URL");

  // ✅ ensure single slash between base + path
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  // The `revalidate` option used to be accepted and then thrown away — every
  // call hardcoded `no-store`, so every page view re-fetched the API from
  // scratch and no caller's cache hint did anything. Honour it, and let a
  // caller still opt out explicitly with `{ cache: "no-store" }`.
  const cacheOptions =
    cache === "no-store" ? { cache: "no-store" } : { next: { revalidate } };

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    ...cacheOptions,
  });

  // ✅ treat not-found as null (no crash)
  if (res.status === 404) return null;

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const t = await res.text().catch(() => "");
    throw new Error(
      `API failed ${res.status} ${path} (${url}) content-type=${ct} :: ${t.slice(
        0,
        250,
      )}`,
    );
  }

  return res.json();
}
