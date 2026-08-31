// app/lib/service.js
export async function getServiceBySlug(slug) {
  if (!slug) return null;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${base}/api/customer/service/${encodeURIComponent(slug)}`;

  // Optional: abort slow requests (prevents hanging SSR)
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000); // 12s

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },

      // ✅ caches on server and revalidates
      next: { revalidate: 300, tags: [`service:${slug}`] },

      signal: controller.signal,
    });

    // Only a real 404 means "no such service" → the page renders its 404.
    if (res.status === 404) return null;

    // Anything else is an outage, not a missing page. Raise it so the route
    // answers 5xx via error.jsx. Returning null here made the page call
    // notFound(), so a brief API failure served a hard 404 on a ranking
    // service page — the quickest way to lose it from Google's index.
    if (!res.ok) {
      const error = new Error(`API ${res.status} on /api/customer/service/${slug}`);
      error.status = res.status;
      throw error;
    }

    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function getAllCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/category/all`,
    {
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function getServiceByCityAndSlug(city, slug) {
  if (!city || !slug) return null;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${base}/api/customer/service/${encodeURIComponent(
    city,
  )}/${encodeURIComponent(slug)}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: 300,
        tags: [`service:${city}:${slug}`],
      },
      signal: controller.signal,
    });

    if (res.status === 404) return null;

    if (!res.ok) {
      const error = new Error(`API ${res.status} on /api/customer/service/${city}/${slug}`);
      error.status = res.status;
      throw error;
    }

    return await res.json();
  } finally {
    clearTimeout(t);
  }
}
