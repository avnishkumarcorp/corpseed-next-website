import HomeHeroSection from "./sections/HomeHeroSection";

/**
 * The hero is entirely static copy now, so it no longer waits on the home
 * API before painting — the largest element on the page renders on the
 * first byte instead of after a round trip.
 */
export default function HeroWrapper() {
  return <HomeHeroSection />;
}
