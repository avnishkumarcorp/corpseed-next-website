// lib/lawUpdates.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function toApiDate(uiDate) {
  // uiDate: "YYYY-MM-DD" -> API wants "MM/DD/YYYY"
  if (!uiDate) return "";
  const [y, m, d] = uiDate.split("-");
  if (!y || !m || !d) return "";
  return `${m}/${d}/${y}`;
}

function buildQs({ page = 1, size = 6, from = "", to = "", dept = "" }) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("size", String(size));

  if (from) qs.set("from", toApiDate(from));
  if (to) qs.set("to", toApiDate(to));
  if (dept) qs.set("dept", dept);

  return qs.toString();
}

export async function getLawUpdatesList({ page, size, from, to, dept }) {
  const qs = buildQs({ page, size, from, to, dept });
  const url = `${API_BASE}/api/updated-law-update?${qs}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Law updates list fetch failed: ${res.status}`);

  return res.json();
}

export async function getLawUpdateBySlug(slug) {
  const url = `${API_BASE}/api/updated-law-update/${slug}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
