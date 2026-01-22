import { logos } from "./common";
import CardCarousel from "./components/carousel/CardCarousel";
import LogoMarquee from "./components/carousel/LogoMarquee";
import ComplianceUpdateSection from "./components/home/sections/ComplianceUpdateSection";
import HomeHeroSection from "./components/home/sections/HomeHeroSection";
import LatestArticlesSection from "./components/home/sections/LatestArticleSection";
import LatestProductsSection from "./components/home/sections/LatestProductsSection";
import NewsSection from "./components/home/sections/NewsSection";
import OurSupportSection from "./components/home/sections/OurSupportSection";
import VirtualMeetingSection from "./components/home/sections/VirtualMeetingSection";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <LogoMarquee items={logos} speed={20} />
      </section>
      <CardCarousel />
      <ComplianceUpdateSection/>
      <VirtualMeetingSection/>
      <OurSupportSection/>
      <NewsSection/>
      <LatestArticlesSection/>
      <LatestProductsSection/>
    </>
  );
}
