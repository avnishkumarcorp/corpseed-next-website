// app/api/subscribe/route.js
import { NextResponse } from "next/server";
import { subscribeEmail } from "@/app/lib/subscribe";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email;

    const result = await subscribeEmail(email);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message || "Subscription failed." },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Subscribed successfully.", data: result.data || null },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
