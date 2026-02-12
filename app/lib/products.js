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

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error(
        "getProductBySlug API Error:",
        res.status,
        res.statusText,
        txt,
      );
      return null;
    }

    return await safeJson(res);
  } catch (e) {
    console.error("getProductBySlug error:", e);
    return null;
  }
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
      cache: "no-store",
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
