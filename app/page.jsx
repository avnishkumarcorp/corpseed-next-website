import { Suspense } from "react";
import HeroWrapper from "./components/home/HeroWrapper";
import HomeClientSectionsWrapper from "./components/home/HomeClientSectionsWrapper";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="h-[500px]" />}>
        <HeroWrapper />
      </Suspense>

      <Suspense fallback={<div className="h-[1200px]" />}>
        <HomeClientSectionsWrapper />
      </Suspense>
    </>
  );
}
