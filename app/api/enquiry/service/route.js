export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/enquiry/service",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error while submitting enquiry." }),
      { status: 500 }
    );
  }
}

