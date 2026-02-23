import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // important for proxies

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

    const base = process.env.API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "API_BASE_URL missing" },
        { status: 500 }
      );
    }

    const upstream = apiUrl.startsWith("http")
      ? apiUrl
      : `${base.replace(/\/$/, "")}/${apiUrl.replace(/^\//, "")}`;

    // ✅ Add timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType =
      res.headers.get("content-type") || "application/json";

    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      {
        error: "Upstream API failed",
        message: error.message,
      },
      { status: 502 } // use 502, not 500
    );
  }
}