import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://admin.corpseed.com/api/customer/clients",
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data);
}