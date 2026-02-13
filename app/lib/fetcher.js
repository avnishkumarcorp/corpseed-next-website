// app/lib/fetcher.js

function getApiBase() {
  const base =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.replace(/\/$/, "");
}

export async function apiGet(path, { revalidate = 600 } = {}) {
  const base = getApiBase();
  if (!base) throw new Error("Missing API_BASE_URL / NEXT_PUBLIC_API_BASE_URL");

  const res = await fetch(`${base}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`API failed ${res.status} ${path} :: ${t}`);
  }

  return res.json();
}
