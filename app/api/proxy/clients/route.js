import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const apiUrl = searchParams.get("apiUrl");

    if (!apiUrl) {
      return NextResponse.json(
        { error: "Missing apiUrl" },
        { status: 400 }
      );
    }

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!base) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_API_BASE_URL missing" },
        { status: 500 }
      );
    }

    // 🔥 Always ensure single slash joining
    const cleanBase = base.replace(/\/+$/, "");
    const cleanPath = apiUrl.replace(/^\/+/, "");

    const upstream = `${cleanBase}/${cleanPath}`;

    console.log("Proxying to:", upstream);

    const res = await fetch(upstream, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type":
          res.headers.get("content-type") || "application/json",
      },
    });
  } catch (e) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      { error: "Proxy failed", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}