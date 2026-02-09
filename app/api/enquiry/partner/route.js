// app/enquiry/partner/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backend = process.env.NEXT_PUBLIC_API_BASE_URL; // or process.env.API_BASE_URL (recommended server-only)
    if (!backend) {
      return NextResponse.json({ message: "Missing API base url" }, { status: 500 });
    }

    const res = await fetch(`${backend}/api/enquiry/partner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    return new NextResponse(text, { status: res.status });
  } catch (e) {
    console.error("partner route error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
