// app/api/enquiry/global/route.js

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/enquiry/global",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Global Enquiry Error:", error);

    return new Response(
      JSON.stringify({
        message: "Server error while submitting global enquiry.",
      }),
      { status: 500 },
    );
  }
}
