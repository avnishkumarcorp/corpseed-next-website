import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/customer/clients`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}