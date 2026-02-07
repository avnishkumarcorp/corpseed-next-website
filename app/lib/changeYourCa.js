const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ✅ Metadata API
export async function getChangeYourCAMeta() {
  const res = await fetch(`${BASE}/api/updated-change-your-ca`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}