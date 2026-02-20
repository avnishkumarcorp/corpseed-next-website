export async function createCallbackEnquiry(payload) {
  try {
    const res = await fetch("/api/enquiry/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      data: { message: "Network error." },
    };
  }
}