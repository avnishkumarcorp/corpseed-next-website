import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "http://www.admin.corpseed.com/api/customer/clients",
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data);
}