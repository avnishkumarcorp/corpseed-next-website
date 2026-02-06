// app/service/[slug]/serviceData.js
import { getServiceBySlug } from "@/app/lib/service";
import { cache } from "react";

export const getServiceData = cache(async (slug) => {
  return getServiceBySlug(slug);
});
