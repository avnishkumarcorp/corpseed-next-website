import { NextResponse } from "next/server";

function getApiBase() {
  const base =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";
  return base.replace(/\/$/, "");
}

export async function GET() {
  try {
    const base = getApiBase();
    if (!base) {
      return NextResponse.json(
        { ok: false, error: "Missing API_BASE_URL", data: [] },
        { status: 500 }
      );
    }

    const upstream = `${base}/api/menu/dynamic`;

    const res = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },

      // ✅ keep it fresh but cacheable
      next: { revalidate: 300 },
    });

    const raw = await res.text().catch(() => "");

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          statusText: res.statusText,
          error: raw || "Upstream error",
          data: [],
        },
        { status: 200 } // keep 200 if your UI expects it
      );
    }

    let data;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    const list = Array.isArray(data) ? data : data?.data ?? [];

    return NextResponse.json(
      { ok: true, data: list },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Server error", data: [] },
      { status: 200 }
    );
  }
}
