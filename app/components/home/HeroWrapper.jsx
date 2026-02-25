// app/(home)/HeroWrapper.jsx

import { getHomeTestData } from "@/app/lib/home";
import HomeHeroSection from "./sections/HomeHeroSection";

export default async function HeroWrapper() {
  const homeData = await getHomeTestData();
  return <HomeHeroSection data={homeData} />;
}
