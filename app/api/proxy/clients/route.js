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

    const base = process.env.API_BASE_URL;

    if (!base) {
      console.error("API_BASE_URL is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // If apiUrl is already absolute, use it directly
    const upstream = apiUrl.startsWith("http")
      ? apiUrl
      : `${base.replace(/\/+$/, "")}/${apiUrl.replace(/^\/+/, "")}`;

    console.log("Proxying to:", upstream);

    const res = await fetch(upstream, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // always fresh from backend
    });

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
        error: "Proxy failed",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}