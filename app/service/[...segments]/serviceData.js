// app/service/[slug]/serviceData.js
import { cache } from "react";
import {
  getServiceBySlug,
  getServiceByCityAndSlug,
} from "@/app/lib/service";

export const getServiceData = cache(async (slug, state = null) => {
  if (state) {
    console.log("jkhjdhgkjfdj          state")
    return getServiceByCityAndSlug(state, slug);
  }
console.log("jkhjdhgkjfdj          ")
  return getServiceBySlug(slug);
});