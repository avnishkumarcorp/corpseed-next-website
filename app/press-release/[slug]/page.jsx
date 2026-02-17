import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Facebook,
  Linkedin,
  Mail,
  ChevronRight,
  User2,
  Eye,
  Share2,
} from "lucide-react";
import { getPressReleaseBySlug } from "@/app/lib/pressRelease";
import SafeHtml from "@/app/components/SafeHtml";
import SafeHtmlShadow from "@/app/components/SafeHtmlShadow";

function safeText(v, fallback = "") {
  if (v == null) return fallback;
  return String(v);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr; // API already gives YYYY-MM-DD
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ${className}`}
    >
      {children}
    </span>
  );
}

/** ✅ Option A: Share Row inside content */
function ShareRow({ url, title }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Share2 className="h-4 w-4" />
        Share:
      </span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 cursor-pointer"
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <Facebook className="h-4 w-4 text-slate-700" />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 cursor-pointer"
        aria-label="Share on LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-slate-700" />
      </a>

      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 cursor-pointer"
        aria-label="Share via Email"
        title="Email"
      >
        <Mail className="h-4 w-4 text-slate-700" />
      </a>
    </div>
  );
}

function TocBlock({ tableContent }) {
  if (!tableContent) return null;

  return (
    <>
      {/* <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          Table of Contents
        </p>
        <p className="mt-1 text-xs text-slate-500">Jump to sections</p>
      </div> */}

      {/* Desktop */}
      {/* <div
        className="hidden max-h-[420px] overflow-auto px-5 py-4 lg:block"
        dangerouslySetInnerHTML={{ __html: tableContent }}
      /> */}
      <SafeHtmlShadow html={tableContent} />

      {/* Mobile */}
      <div className="block px-5 py-4 lg:hidden">
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
            <span className="inline-flex items-center gap-2">
              Open contents
              <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
            </span>
          </summary>
          <div
            className="mt-3 max-h-[320px] overflow-auto pr-1"
            dangerouslySetInnerHTML={{ __html: tableContent }}
          />
        </details>
      </div>
    </>
  );
}

function MiniList({ title, badge, items, basePath = "/press-release" }) {
  if (!items?.length) return null;

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          {badge ? (
            <span className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          ) : null}
          <p className="text-sm font-semibold text-slate-900">{title}</p>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {items.slice(0, 6).map((x) => (
          <Link
            key={x.id}
            href={`${basePath}/${x.slug}`}
            className="group flex gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer"
          >
            <div className="relative h-14 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {x.image ? (
                <Image
                  src={x.image}
                  alt={safeText(x.title)}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
                {x.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {x.postDate ? formatDate(x.postDate) : "Read article"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ no await
  const data = await getPressReleaseBySlug(slug);

  if (!data?.press) {
    return {
      title: "Press Release | Corpseed",
      description:
        "Read Corpseed press releases, announcements and latest news about collaborations, compliance and innovation.",
    };
  }

  return {
    title: data?.metaTitle || data?.title || "Press Release | Corpseed",
    description:
      data?.metaDescription ||
      "Read Corpseed press releases, announcements and latest news about collaborations, compliance and innovation.",
    keywords: data?.metaKeyword || undefined,
  };
}

export default async function PressReleaseSlugPage({ params }) {
  const { slug } = await params; // ✅ no await
  const apiData = await getPressReleaseBySlug(slug);

  if (!apiData?.press) return notFound();

  const press = apiData.press;

  const topPress = apiData?.topPress || [];
  const latestPress = apiData?.latestPress || [];
  const topBlog = apiData?.topBlog || [];
  const latestBlog = apiData?.latestBlog || [];

  const author = press?.author || null;

  // ✅ Share url (use your real route)
  const pageUrl = `https://www.corpseed.com/press-release/${press.slug}`;

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="relative h-[220px] md:h-[320px]">
          <Image
            src={
              press.image ||
              "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2000&q=70"
            }
            alt={safeText(press.title, "Press release")}
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/55 to-slate-950/35" />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold tracking-widest text-white/80">
                  WWW.CORPSEED.COM
                </p>
                <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                  {press.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/85">
                  <Pill className="border-white/20 bg-white/10 text-white">
                    PRESS RELEASE
                  </Pill>

                  {press.postDate ? (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(press.postDate)}
                    </span>
                  ) : null}

                  {typeof press.visited === "number" ? (
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {press.visited}
                    </span>
                  ) : null}
                </div>

                {/* ✅ Option A share row in hero */}
                <div className="mt-4">
                  <ShareRow url={pageUrl} title={press.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
          {/* Main article */}
          <div className="lg:col-span-8 space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-600">
              <Link
                href="/press-release"
                className="hover:underline cursor-pointer"
              >
                Press
              </Link>{" "}
              <span className="text-slate-400">/</span>{" "}
              <span className="text-slate-900">{press.title}</span>
            </div>

            {/* Article Card */}
            {/* <Card className="overflow-hidden"> */}
            <div className="p-5 sm:p-7">
              {/* Author */}

              {/* Body (API HTML) */}
              <SafeHtmlShadow html={press.shortDescription} />

              {author ? (
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-200 bg-white">
                    {author.profilePicture ? (
                      <Image
                        src={author.profilePicture}
                        alt={`${author.firstName || ""} ${author.lastName || ""}`.trim()}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500">
                        <User2 className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {`${author.firstName || ""} ${author.lastName || ""}`.trim() ||
                        "Author"}
                    </p>
                    <p className="text-xs text-slate-600">
                      {author.slug ? `@${author.slug}` : "Corpseed"}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* ✅ Share row after content as well */}
              {/* <div className="mt-8 border-t border-slate-200 pt-5">
                <ShareRow url={pageUrl} title={press.title} />
              </div> */}
            </div>
            {/* </Card> */}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <TocBlock tableContent={press.tableContent} />

              <MiniList
                title="Press Release"
                badge="Latest"
                items={latestPress}
                basePath="/press-release"
              />
              <MiniList
                title="Top Press"
                badge="Top"
                items={topPress}
                basePath="/press-release"
              />

              {/* Top Blog */}
              {topBlog?.length ? (
                <Card>
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Top Articles
                    </p>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {topBlog.slice(0, 6).map((b) => (
                      <Link
                        key={b.id}
                        href={`/knowledge-centre/${b.slug}`}
                        className="group flex gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="relative h-14 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {b.image ? (
                            <Image
                              src={b.image}
                              alt={safeText(b.title)}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
                            {b.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {typeof b.visited === "number"
                              ? `${b.visited} views`
                              : "Read article"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              ) : null}

              {/* Latest Blog */}
              {latestBlog?.length ? (
                <Card>
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Latest Articles
                    </p>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {latestBlog.slice(0, 6).map((b) => (
                      <Link
                        key={b.id}
                        href={`/knowledge-centre/${b.slug}`}
                        className="group flex gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="relative h-14 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {b.image ? (
                            <Image
                              src={b.image}
                              alt={safeText(b.title)}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
                            {b.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Read article
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
