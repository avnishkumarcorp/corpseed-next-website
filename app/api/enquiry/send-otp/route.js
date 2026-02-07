import { NextResponse } from "next/server";

export async function POST(req) {
  let payload = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const data = {
    name: String(payload?.name || "").trim(),
    mobile: String(payload?.mobile || "").trim(),
    email: String(payload?.email || "").trim(),
    location: String(payload?.location || "").trim(),
    message: String(payload?.message || "").trim(),
  };

  // ✅ Only required fields
  if (!data.name || !data.mobile) {
    return NextResponse.json(
      { message: "name and mobile are required" },
      { status: 400 }
    );
  }

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ NO PARAMS, NO QUERY — PURE BODY
  const backendUrl = `${backendBase}/api/enquiry/send-otp`;

  const res = await fetch(backendUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text().catch(() => "");

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}
