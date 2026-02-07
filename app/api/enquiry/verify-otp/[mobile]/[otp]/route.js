import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { mobile, otp } =await params; // ✅ no await

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";

  if (!mobile || !otp) {
    return NextResponse.json(
      { message: "mobile and otp are required" },
      { status: 400 }
    );
  }

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const backendUrl = `${backendBase}/api/enquiry/verify-otp/${encodeURIComponent(
    mobile
  )}/${encodeURIComponent(otp)}?name=${encodeURIComponent(name)}`;

  const res = await fetch(backendUrl, { method: "GET", cache: "no-store" });
  const text = await res.text().catch(() => "");

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "text/plain",
    },
  });
}
