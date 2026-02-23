import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!base) {
      return NextResponse.json(
        { error: "API_BASE_URL missing" },
        { status: 500 },
      );
    }

    const upstream = `${base.replace(/\/$/, "")}/api/customer/clients`;

    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upstream failed", message: error.message },
      { status: 502 },
    );
  }
}
