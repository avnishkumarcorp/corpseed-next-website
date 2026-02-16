// app/lib/authorProfile.js
import { apiGet } from "./fetcher";

export async function getAuthorProfileBySlug(slug, { revalidate = 600 } = {}) {
  if (!slug) return null;

  // now apiGet returns null on 404
  return apiGet(`/api/customer/profile/${encodeURIComponent(slug)}`, {
    revalidate,
  });
}
