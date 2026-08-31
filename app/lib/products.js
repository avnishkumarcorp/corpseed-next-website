// app/lib/product.js

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; // same you use everywhere

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProductsPage({
  page = 1,
  size = 20,
  filter = "",
  q = "",
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));

  const finalFilter = (q || filter || "").trim();
  params.set("filter", finalFilter);

  const url = `${API_BASE}/api/updated-product?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // ✅ allow caching + revalidate
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error(
        "getProductsPage API Error:",
        res.status,
        res.statusText,
        txt,
      );
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("getProductsPage error:", e);
    return null;
  }
}

export async function getProductBySlug(slug) {
  if (!slug) return null;

  const url = `${API_BASE}/api/updated-product/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 300 },
  });

  // A real 404 means no such product → the page renders its 404.
  if (res.status === 404) return null;

  // Anything else is an outage. Returning null here made the page call
  // notFound(), so a temporary API failure served a hard 404 on a ranking
  // page. Raise instead, so the route answers 5xx via error.jsx.
  if (!res.ok) {
    const error = new Error(`API ${res.status} on /api/updated-product/${slug}`);
    error.status = res.status;
    throw error;
  }

  return safeJson(res);
}

export async function getLatestProducts() {
  if (!API_BASE) {
    console.error("NEXT_PUBLIC_API_BASE_URL is missing");
    return [];
  }

  const url = `${API_BASE}/api/products/latest`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error(
        "getLatestProducts API Error:",
        res.status,
        res.statusText,
        txt,
      );
      return [];
    }

    const json = await safeJson(res);
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("getLatestProducts error:", e);
    return [];
  }
}
