import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import SafeHtmlShadow from "@/app/components/SafeHtmlShadow";
import { getLifeAtCorpseedBySlug } from "@/app/lib/life-at-corpseed";


export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getLifeAtCorpseedBySlug(slug)

  return {
    title: data?.title || data?.lifeUser?.title || "Life at Corpseed | Corpseed",
    description:
      data?.metaDescription ||
      data?.lifeUser?.summary ||
      "Life at Corpseed story.",
    keywords: data?.metaKeyword || "",
  };
}

const uniqBy = (arr, keyFn) => {
  const map = new Map();
  (arr || []).forEach((x) => {
    const k = keyFn(x);
    if (!map.has(k)) map.set(k, x);
  });
  return Array.from(map.values());
};

export default async function LifeAtCorpseedSlugPage({ params }) {
  const { slug } = await params;
  const data = await getLifeAtCorpseedBySlug(slug);

  if (!data?.lifeUser) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Story not found
          </h1>
          <p className="mt-2 text-gray-600">
            Please go back and open another story.
          </p>
          <Link
            href="/life-at-corpseed"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Life at Corpseed
          </Link>
        </div>
      </main>
    );
  }

  const u = data.lifeUser;

  const tags = (u.categories || []).map((t) => (t?.startsWith("#") ? t : `#${t}`));

  // ✅ your API has duplicates in relatedLifeUsers, so we clean it
  const related = uniqBy(data.relatedLifeUsers || [], (x) => `${x?.id}-${x?.slug}`);
  const allUsers = uniqBy(data.allLifeUsers || [], (x) => `${x?.id}-${x?.slug}`);

  const sidebarList = related.length ? related : allUsers.filter((x) => x.slug !== u.slug).slice(0, 6);

  return (
    <main className="bg-white text-slate-800">
      {/* Top bar */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/life-at-corpseed"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="text-sm text-gray-500 truncate">
              Life at Corpseed / <span className="text-gray-900">{u.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HERO (standard + smooth) */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image Card */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[16/9] sm:aspect-[16/8]">
                  <Image
                    src={u.pictureName}
                    alt={u.title}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                </div>
              </div>
            </div>

            {/* Title + Summary */}
            <div className="lg:col-span-5">
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Quote className="h-3.5 w-3.5" />
                  #PeopleOfCorpseed
                </div>

                <h1 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight text-gray-900">
                  {u.title}
                </h1>

                {u.summary ? (
                  <p className="mt-3 text-gray-600 leading-relaxed">{u.summary}</p>
                ) : null}

                {/* Tags */}
                {tags.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Optional designation */}
                {u.designation ? (
                  <div className="mt-5 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Designation: </span>
                    {u.designation}
                  </div>
                ) : null}

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    href="/life-at-corpseed"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Explore more stories <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Content + Sidebar */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Content */}
            <article className="lg:col-span-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Story
                </h2>

                <div className="mt-4">
                  {/* ✅ Your reusable safe renderer */}
                  <SafeHtmlShadow html={u.description || ""} />
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-6 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900">
                    More stories
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Discover other people & teams at Corpseed.
                  </p>

                  <div className="mt-4 space-y-3">
                    {sidebarList.map((x) => (
                      <Link
                        key={`${x.id}-${x.slug}`}
                        href={`/life-at-corpseed/${x.slug}`}
                        className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <Image
                            src={x.pictureName}
                            alt={x.title}
                            fill
                            className="object-cover object-center"
                            sizes="56px"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {x.title}
                          </div>
                          <div className="mt-1 line-clamp-2 text-xs text-gray-600">
                            {x.summary}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/life-at-corpseed"
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      View all <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Tags list from API (optional) */}
                {Array.isArray(data.tags) && data.tags.length ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900">Tags</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {data.tags.slice(0, 18).map((t) => (
                        <span
                          key={t.id}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                        >
                          #{t.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
