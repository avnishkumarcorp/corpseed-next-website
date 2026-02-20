import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enquiry/callback`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: backendRes.status,
    });

  } catch (error) {
    console.error("Callback Enquiry Error:", error);
    return NextResponse.json(
      { message: "Callback enquiry failed" },
      { status: 500 }
    );
  }
}