import Image from "next/image";
import { getPressReleaseData } from "../lib/pressRelease";
import PressListClient from "./PressListClient";

export async function generateMetadata({ searchParams }) {
  const page =await Number(searchParams?.page ?? 1);
  const size =await Number(searchParams?.size ?? 10);
  const filter =await String(searchParams?.filter ?? "");

  const data = await getPressReleaseData({ page, size, filter });

  return {
    title: data?.title || "Press Release | Corpseed",
    description:
      data?.metaDescription ||
      "Read Corpseed press releases, announcements and latest news about collaborations, compliance and innovation.",
  };
}


export default async function PressReleasePage({ searchParams }) {
 const page = await Number(searchParams?.page || 1);
  const size = await Number(searchParams?.size || 10);
  const filter =await String(searchParams?.filter || "");

  // ✅ IMPORTANT: do NOT pass filter from URL anymore
  const apiData = await getPressReleaseData({ page, size, filter });

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="relative h-[260px] md:h-[340px]">
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2000&q=70"
            alt="Press Release banner"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-blue-950/55 to-slate-950/30" />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-widest text-white/85">
                  WWW.CORPSEED.COM
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {apiData?.title || "Press Release"}
                </h1>
                <p className="mt-3 text-sm sm:text-base text-white/90">
                  Read announcements, collaborations, and updates from Corpseed — curated for a clean,
                  fast reading experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Client UI (search without URL change, pagination with URL) */}
      <PressListClient apiData={apiData} page={page} size={size} />
    </div>
  );
}
