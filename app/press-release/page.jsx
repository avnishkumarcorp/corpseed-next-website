import Image from "next/image";
import { getPressReleaseData } from "../lib/pressRelease";
import PressListClient from "./PressListClient";
import banner from "../assets/press-release.webp";

export const revalidate = 300;
export async function generateMetadata({ searchParams }) {
  const page = await Number(searchParams?.page ?? 1);
  const size = await Number(searchParams?.size ?? 10);
  const filter = await String(searchParams?.filter ?? "");

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
  const filter = await String(searchParams?.filter || "");

  // ✅ IMPORTANT: do NOT pass filter from URL anymore
  const apiData = await getPressReleaseData({ page, size, filter });

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative border-b border-slate-200">
        <div className="relative w-full">
          <Image
            src={banner}
            alt="Press Release banner"
            width={1920}
            height={400}
            priority
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* ✅ Client UI (search without URL change, pagination with URL) */}
      <PressListClient apiData={apiData} page={page} size={size} />
    </div>
  );
}
