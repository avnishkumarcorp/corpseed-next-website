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
      next: { revalidate: 3600, tags: [`service:${slug}`] },

      signal: controller.signal,
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    return null;
  } finally {
    clearTimeout(t);
  }
}




export async function getAllCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/category/all`,
    {
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return null;
  return res.json();
}





export async function getServiceByCityAndSlug(city, slug) {
  if (!city || !slug) return null;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${base}/api/customer/service/${encodeURIComponent(
    city
  )}/${encodeURIComponent(slug)}`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: 3600,
        tags: [`service:${city}:${slug}`],
      },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}