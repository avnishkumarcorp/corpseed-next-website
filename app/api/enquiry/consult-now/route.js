export async function POST(req) {
  try {
    const body = await req.json();

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      console.error("Base URL missing");
      return new Response("Missing API base URL", { status: 500 });
    }

    const upstream = await fetch(`${base}/api/enquiry/consult-now`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Consult-now route error:", e);
    return new Response("Consult-now enquiry failed", { status: 500 });
  }
}