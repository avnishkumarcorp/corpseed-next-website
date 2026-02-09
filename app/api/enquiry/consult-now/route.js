// app/enquiry/consult-now/route.js
export async function POST(req) {
  try {
    const body = await req.json();

    const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return new Response("Missing API_BASE_URL", { status: 500 });

    const upstream = await fetch(`${base}/api/enquiry/consult-now`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text().catch(() => "");
    return new Response(text, { status: upstream.status });
  } catch (e) {
    return new Response("Consult-now enquiry failed", { status: 500 });
  }
}
