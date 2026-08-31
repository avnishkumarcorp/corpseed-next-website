// app/lib/knowledgeCentre.js

import { apiGet } from "./fetcher";

function emptyKnowledgeCentrePayload(page = 1) {
  return {
    title: "Corpseed || Knowledge Center",
    metaDescription: "",
    metaKeyword: "",
    currentPage: page,
    totalPages: 1,
    pageNumbers: [1],
    blogs: [],
    categories: [],
    hotTags: [],
    topBlogs: [],
  };
}

export async function getKnowledgeCentreList({
  page = 1,
  size = 20,
  q = "",
  filter = "",
  tag = "",
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (q) params.set("q", String(q));
  if (filter) params.set("filter", String(filter));
  if (tag) params.set("tag", String(tag));

  // ✅ List page changes often → cache for 60s
  //
  // Errors deliberately propagate to error.jsx. This used to catch everything
  // and return an empty payload, so an API outage rendered a shell page with
  // HTTP 200 — telling crawlers the listing genuinely has no content. A 5xx
  // is the honest answer and is treated as temporary.
  const data = await apiGet(
    `/api/updated-knowledge-centre?${params.toString()}`,
    { revalidate: 60 },
  );

  // apiGet returns null only for a real 404, which here just means no results.
  return data ?? emptyKnowledgeCentrePayload(page);
}

export async function getKnowledgeCentreBySlug(slug) {
  if (!slug) return null;

  // No try/catch on purpose. Returning null on a 5xx made the page call
  // notFound(), so a temporary API failure answered with a hard 404 — the
  // fastest way to get a ranking article dropped from the index. Only a real
  // 404 from the API returns null now; anything else raises.
  return apiGet(`/api/updated-knowledge-centre/${encodeURIComponent(slug)}`, {
    revalidate: 300,
  });
}

export async function getLatestBlogs() {
  try {
    // ✅ Homepage latest blogs → cache 5 minutes
    const data = await apiGet("/api/blogs/latest", { revalidate: 300 });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("getLatestBlogs error:", e);
    return [];
  }
}
