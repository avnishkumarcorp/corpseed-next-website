export async function createIndustryEnquiry(payload) {
  const res = await fetch("/api/enquiry/industry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.text();

  return {
    ok: res.ok,
    data,
  };
}