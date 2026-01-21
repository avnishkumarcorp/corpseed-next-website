import { logos } from "./common";
import CardCarousel from "./components/carousel/CardCarousel";
import LogoMarquee from "./components/carousel/LogoMarquee";
import HomeHeroSection from "./components/home/sections/HomeHeroSection";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <LogoMarquee items={logos} speed={20} />
      </section>
      <CardCarousel />
    </>
  );
}
