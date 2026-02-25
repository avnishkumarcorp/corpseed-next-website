import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { q } = await params;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/service-industry-blog/${encodeURIComponent(q)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
