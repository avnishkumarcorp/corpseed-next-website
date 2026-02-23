// app/sitemap.xml/route.js

import { NextResponse } from "next/server";

export const revalidate = 3600; // ISR cache 1 hour

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    // 👇 Call your Spring Boot sitemap
    const res = await fetch(`${base}/sitemap.xml`, {
      cache: "no-store",
      headers: {
        Accept: "application/xml",
      },
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch sitemap", {
        status: 500,
      });
    }

    const xml = await res.text();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    return new NextResponse("Error generating sitemap", {
      status: 500,
    });
  }
}
