import Image from "next/image";
import Link from "next/link";
import banner from "../assets/corpseed-banner.webp";
import {
  Play,
  ArrowRight,
  Users,
  Sparkles,
  Quote,
  ChevronDown,
} from "lucide-react";
import { getLifeAtCorpseed } from "../lib/life-at-corpseed";
import LifeStoriesClient from "./LifeStoriesClient";

// ✅ dynamic SEO from API
export async function generateMetadata() {
  const data = await getLifeAtCorpseed();

  return {
    title: data?.title || "Life at Corpseed | Corpseed",
    description:
      data?.metaDescription ||
      "Discover careers, culture, and people shaping the future at Corpseed.",
    keywords: data?.metaKeyword || "",
  };
}

export default async function LifeAtCorpseedPage() {
  const data = await getLifeAtCorpseed();

  return (
    <main className="bg-white text-slate-800">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-300">
        <div className="relative h-[60vh] min-h-[420px] w-full">
          <Image
            src={banner}
            alt="Corpseed Office"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

          <div className="absolute inset-0">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-10 md:pb-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                  <Sparkles className="w-4 h-4" />
                  #People Of Corpseed
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold !text-white leading-tight">
                  Find Yourself at Corpseed
                </h1>

                <p className="mt-3 text-base md:text-lg !text-white/85 max-w-2xl leading-relaxed">
                  Discover careers, culture, and people shaping the future.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition cursor-pointer">
                    <Play className="w-4 h-4" />
                    Watch Video
                  </button>

                  <Link
                    href="#people"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-white font-semibold hover:bg-white/15 transition cursor-pointer"
                  >
                    Explore Stories <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-7 hidden md:flex items-center gap-2 text-white/70 text-sm">
                  <ChevronDown className="w-4 h-4" />
                  Scroll to explore
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
            <Users className="w-4 h-4 text-blue-600" />
            Meet our team
          </div>

          <h2 className="mt-4 text-2xl md:text-4xl font-bold text-gray-900">
            Meet the People who power{" "}
            <span className="text-blue-600">Corpseed</span>
          </h2>

          <p className="mt-3 text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We are the <strong>#PeopleOfCorpseed</strong> — a diverse group of
            professionals united by innovation, integrity, and impact.
          </p>
        </div>
      </section>

      {/* PEOPLE STORIES */}
      <section id="people" className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6">
          <LifeStoriesClient
            initialStories={data?.lifeUsers || []}
            totalPages={data?.totalPages || 1}
          />
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      {/* <section className="py-10 md:py-14 bg-slate-50 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Our Communities Inspire Our Progress
            </h2>
            <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
              We foster an inclusive environment where diverse backgrounds fuel
              innovation and growth.
            </p>
          </div>

          {communities.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-300 bg-white p-8 text-center text-gray-600">
              No community blogs available right now.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.map((c) => (
                <CommunityCard key={c.id} item={c} />
              ))}
            </div>
          )}
        </div>
      </section> */}
    </main>
  );
}

/* ---------------- components ---------------- */

function StoryRow({ item }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      {/* Image */}
      <div
        className={`relative h-[260px] sm:h-[320px] lg:h-[360px] ${
          item.reverse ? "lg:col-span-5 lg:order-2" : "lg:col-span-5"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`p-6 md:p-8 ${
          item.reverse ? "lg:col-span-7 lg:order-1" : "lg:col-span-7"
        }`}
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {item.title}
        </h3>

        <p className="mt-3 text-gray-600 leading-relaxed">{item.desc}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-full text-gray-600 bg-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={`/life-at-corpseed/${item.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ item }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative h-56">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          {item.title}
        </h3>
        <p className="mt-2 text-gray-600 leading-relaxed">{item.desc}</p>

        <div className="mt-5">
          <Link
            href={`/blogs/${item.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
