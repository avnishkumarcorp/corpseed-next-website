import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    // ✅ Works in Next 15 and also safe for older versions
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    const { searchParams } = new URL(req.url);
    const otp = searchParams.get("otp");

    console.log("CAREER ROUTE PARAMS:", resolvedParams);
    console.log("CAREER ROUTE SLUG:", slug);
    console.log("CAREER ROUTE OTP:", otp);

    if (!slug || slug === "undefined" || slug === "null") {
      return NextResponse.json(
        { message: "Career slug is required." },
        { status: 400 },
      );
    }

    if (!otp) {
      return NextResponse.json(
        { message: "OTP is required." },
        { status: 400 },
      );
    }

    const body = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API_BASE_URL is missing." },
        { status: 500 },
      );
    }

    const backendUrl = `${baseUrl}/api/customer/career/join-our-team/${encodeURIComponent(
      slug,
    )}/submit?otp=${encodeURIComponent(otp)}`;

    console.log("CAREER SUBMIT BACKEND URL:", backendUrl);
    console.log("CAREER SUBMIT PAYLOAD:", body);

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await backendRes.text();

    console.log("CAREER SUBMIT STATUS:", backendRes.status);
    console.log("CAREER SUBMIT RESPONSE:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text?.includes("Bad Request")
          ? "Bad Request from backend. Please check required payload fields."
          : text || "Request failed.",
      };
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("CAREER SUBMIT ROUTE ERROR:", error);

    return NextResponse.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 },
    );
  }
}
