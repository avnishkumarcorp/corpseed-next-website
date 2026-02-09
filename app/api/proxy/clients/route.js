import { NextResponse } from "next/server";

export const runtime = "nodejs"; // safe for most APIs

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const apiUrl = searchParams.get("apiUrl") || "api/customer/clients";

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_API_BASE_URL missing" },
        { status: 500 },
      );
    }

    // Build upstream url safely
    const upstream = new URL(apiUrl.replace(/^\//, ""), base.endsWith("/") ? base : base + "/");

    const res = await fetch(upstream.toString(), {
      method: "GET",
      // ✅ do NOT set Content-Type for GET (can trigger preflight/CORS in some setups)
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();
    // pass through status + body
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": "public, max-age=60", // tweak if you want
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Proxy failed", message: String(e?.message || e) },
      { status: 500 },
    );
  }
}
