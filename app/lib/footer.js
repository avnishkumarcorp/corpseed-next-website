// lib/footer.js
export async function getUpdatedFooter() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updated-footer`;

    const res = await fetch(url, {
      // change to `next: { revalidate: 3600 }` if you want caching
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
