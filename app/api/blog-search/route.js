import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword || keyword.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/search?keyword=${encodeURIComponent(
        keyword,
      )}`,
      {
        headers: { accept: "*/*" },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();

    // 🔥 Limit results for performance
    const limited = Array.isArray(data) ? data.slice(0, 6) : [];

    return NextResponse.json(limited);
  } catch (e) {
    return NextResponse.json([]);
  }
}
