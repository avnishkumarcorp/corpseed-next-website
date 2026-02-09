import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { type } = params;
    const { comment = "", ratingValue = "", location = "" } = await req.json();

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API_BASE_URL missing" },
        { status: 500 }
      );
    }

    const url =
      `${base}/feedback/${encodeURIComponent(type)}` +
      `?comment=${encodeURIComponent(comment)}` +
      `&ratingValue=${encodeURIComponent(ratingValue)}` +
      `&location=${encodeURIComponent(location)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    return new NextResponse(text || "", { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { message: "Feedback proxy error", error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
