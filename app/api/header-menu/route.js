export async function GET() {
  try {
    const upstream = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menu/dynamic`;

    const res = await fetch(upstream, {
      method: "GET",
      // don't send Content-Type for GET; not needed and can trigger preflight sometimes
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return new Response(
        JSON.stringify({
          ok: false,
          status: res.status,
          statusText: res.statusText,
          error: errText || "Upstream error",
          data: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data ?? [];

    return new Response(JSON.stringify({ ok: true, data: list }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // small caching on edge/browser; tweak if needed
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
