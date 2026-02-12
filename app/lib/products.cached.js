// app/lib/products.cached.js
import { unstable_cache } from "next/cache";
import { getProductsPage } from "./products";

// ✅ Cache per query key (page/size/filter/q)
// Revalidates every 5 minutes (change as needed)
export const getProductsPageCached = unstable_cache(
  async ({ page, size, filter, q }) => {
    return getProductsPage({ page, size, filter, q });
  },
  // cache key prefix (Next will also include the args)
  ["getProductsPageCached"],
  { revalidate: 300 } // ✅ 5 min
);
