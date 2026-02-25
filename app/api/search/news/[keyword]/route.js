export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return new Response(JSON.stringify({ ok: true, data: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ upstream: /search/news/{q}=...
    const upstream = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/news/${encodeURIComponent(q)}`;

    const res = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: res.status,
          error: text || "Upstream error",
          data: {},
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // The API returns an object: { "slug": "Title", ... }
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }

    return new Response(JSON.stringify({ ok: true, data: json || {} }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e), data: {} }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
