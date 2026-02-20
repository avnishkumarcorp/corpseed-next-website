import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/enquiry/book-meeting`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();

    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Book Meeting API Error:", error);

    return NextResponse.json(
      { message: "Internal server error", status: "fail" },
      { status: 500 }
    );
  }
}