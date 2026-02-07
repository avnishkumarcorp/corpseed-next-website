const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ✅ Metadata API
export async function getOnlinePaymentMeta() {
  const res = await fetch(`${BASE}/api/updated-payment`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}