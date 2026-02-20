import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      "http://localhost:8080/api/enquiry/industry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}