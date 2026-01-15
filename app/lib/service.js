import { mockServices } from "./mockService";


export async function getServiceBySlug(slug) {
  if (!slug) return null;

  // ✅ Later: replace this block with Spring Boot API call
  // return fetch(`https://your-backend/service/${slug}`).then(res => res.json());

  return mockServices[slug] || null;
}
