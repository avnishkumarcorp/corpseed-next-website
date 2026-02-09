export async function submitFeedback({ type, ratingValue, comment, location }) {
  const payload = {
    ratingValue: String(ratingValue || "").trim(),
    comment: String(comment || "").trim(),
    location: String(location || "").trim(),
  };

  const res = await fetch(`/api/feedback/${encodeURIComponent(type)}`, {
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
