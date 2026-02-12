// app/service/[slug]/serviceData.js
import { cache } from "react";
import { getServiceBySlug } from "@/app/lib/service";

export const getServiceData = cache(async (slug) => {
  return getServiceBySlug(slug);
});
