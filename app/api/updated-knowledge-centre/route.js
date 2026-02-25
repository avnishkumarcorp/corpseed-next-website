export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "20";

    const q = (searchParams.get("q") || "").trim();
    const filter = (searchParams.get("filter") || "").trim();
    const tag = (searchParams.get("tag") || "").trim();

    // ✅ IMPORTANT: if q exists, it should override filter
    const effectiveFilter = q ? q : filter;

    const backendParams = new URLSearchParams();
    backendParams.set("page", page);
    backendParams.set("size", size);

    if (effectiveFilter) backendParams.set("filter", effectiveFilter);
    if (tag) backendParams.set("tag", tag);

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(
      `${base}/api/updated-news?${backendParams.toString()}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      },
    );

    const text = await res.text();

    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, message: text }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, message: e?.message || "Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
