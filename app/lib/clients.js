export async function getClients() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    console.error("API base URL missing");
    return [];
  }

  try {
    const res = await fetch(
      `${base}/api/customer/clients`,
      {
        next: { revalidate: 3600, tags: ["clients"] },
      }
    );

    if (!res.ok) {
      console.error("Clients API failed:", res.status);
      return [];
    }

    const json = await res.json();

    return Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
      ? json
      : [];
  } catch (err) {
    console.error("Clients fetch error:", err);
    return [];
  }
}