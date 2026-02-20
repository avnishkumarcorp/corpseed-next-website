import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enquiry/contact-us`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact Us API Error:", error);

    return NextResponse.json(
      { status: "fail", message: "Internal server error" },
      { status: 500 }
    );
  }
}