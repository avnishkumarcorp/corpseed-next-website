import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { q } = await params;

  const url = `https://www.corpseed.com/search/service-industry-blog/${encodeURIComponent(q)}`;

  const res = await fetch(url, { cache: "no-store" });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
