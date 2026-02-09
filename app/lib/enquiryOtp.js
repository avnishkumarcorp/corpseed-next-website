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



export async function submitPartnerEnquiry({
  otp,
  name,
  email,
  mobile,
  message,
  location = "",
}) {
  const payload = {
    otp: String(otp || "").trim(),
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    mobile: String(mobile || "").trim(),
    message: String(message || "").trim(),
    location: String(location || "").trim(),
  };

  const res = await fetch("/api/enquiry/partner", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return { ok: res.ok, status: res.status, data: await res.text().catch(() => "") };
}



// app/lib/enquiry.js

export async function submitConsultNowEnquiry({
  otp,
  name,
  email,
  mobile,
  message,
  location,
}) {
  const payload = {
    otp: String(otp || "").trim(),
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    mobile: String(mobile || "").trim(),
    message: String(message || "").trim(),
    location: String(location || "").trim(),
    postDate: "",
    modifyDate: "",
  };

  const res = await fetch("/api/enquiry/consult-now", {
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
