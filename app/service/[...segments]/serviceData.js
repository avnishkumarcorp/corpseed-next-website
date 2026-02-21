// app/service/[slug]/serviceData.js
import { cache } from "react";
import {
  getServiceBySlug,
  getServiceByCityAndSlug,
} from "@/app/lib/service";

export const getServiceData = cache(async (slug, state = null) => {
  if (state) {
    return getServiceByCityAndSlug(state, slug);
  }
  return getServiceBySlug(slug);
});