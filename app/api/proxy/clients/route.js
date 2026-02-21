import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const apiUrl = searchParams.get("apiUrl");

    if (!apiUrl) {
      return NextResponse.json({ error: "Missing apiUrl" }, { status: 400 });
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

    const res = await fetch(upstream);
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Proxy failed", message: e.message },
      { status: 500 }
    );
  }
}