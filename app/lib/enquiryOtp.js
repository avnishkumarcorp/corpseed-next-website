export async function sendOtp({
  name,
  mobile,
  email = "",
  location = "",
  message = "",
}) {
  const payload = {
    name: String(name || "").trim(),
    mobile: String(mobile || "").trim(),
    email: String(email || "").trim(),
    location: String(location || "").trim(),
    message: String(message || "").trim(),
  };

  const res = await fetch("/api/enquiry/send-otp", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return {
    ok: res.ok,
    status: res.status,
    data: await res.text().catch(() => ""),
  };
}





export async function verifyOtp({ mobile, otp,name }) {
  const cleanMobile = String(mobile || "").trim();
  const cleanOtp = String(otp || "").trim();
  const cleanName = String(name || "").trim();

  const res = await fetch(
    `/api/enquiry/verify-otp/${encodeURIComponent(cleanMobile)}/${encodeURIComponent(cleanOtp)}?name=${encodeURIComponent(cleanName)}`,
    { method: "GET", cache: "no-store" }
  );

  return { ok: res.ok, status: res.status, data: await res.text().catch(() => "") };
}

