// app/lib/service.js
export async function getServiceBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/service/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // ✅ cache response and revalidate periodically
        next: { revalidate: 3600 }, // 1 hour (set what you want)
      }
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("getServiceBySlug error:", err);
    return null;
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