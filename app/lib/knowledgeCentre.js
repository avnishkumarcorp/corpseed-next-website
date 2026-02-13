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
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (q) params.set("q", String(q));
    if (filter) params.set("filter", String(filter));
    if (tag) params.set("tag", String(tag));

    // ✅ List page changes often → cache for 60s
    return await apiGet(`/api/updated-knowledge-centre?${params.toString()}`, {
      revalidate: 60,
    });
  } catch (e) {
    console.error("getKnowledgeCentreList error:", e);
    return emptyKnowledgeCentrePayload(page);
  }
}

export async function getKnowledgeCentreBySlug(slug) {
  if (!slug) return null;

  try {
    // ✅ Slug page SEO → cache 5 minutes
    return await apiGet(`/api/updated-knowledge-centre/${encodeURIComponent(slug)}`, {
      revalidate: 300,
    });
  } catch (e) {
    console.error("getKnowledgeCentreBySlug error:", e);
    return null;
  }
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
