// app/(home)/HomeClientSectionsWrapper.jsx
import HomeClientSections from "./HomeClientSections";
import { getLatestUpdatedPressRelease } from "@/app/lib/pressRelease";
import { getHomeTestData } from "@/app/lib/home";
import { getLatestBlogs } from "@/app/lib/knowledgeCentre";
import { getLatestProducts } from "@/app/lib/products";

export default async function HomeClientSectionsWrapper() {
  const [homeData, pressList, latestBlogs, products] = await Promise.all([
    getHomeTestData(),
    getLatestUpdatedPressRelease(),
    getLatestBlogs(),
    getLatestProducts(),
  ]);

  return (
    <HomeClientSections
      homeData={homeData}
      newsData={pressList}
      latestBlogs={latestBlogs}
      products={products}
    />
  );
}
