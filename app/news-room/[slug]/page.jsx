// app/news-room/[slug]/page.jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Eye,
  User2,
  Share2,
  Facebook,
  Linkedin,
  Mail,
  ChevronRight,
  Newspaper,
  BookOpen,
} from "lucide-react";

import SafeHtml from "@/app/components/SafeHtml";
import { getNewsBySlug } from "@/app/lib/newsRoom";
import SafeHtmlShadow from "@/app/components/SafeHtmlShadow";

function safeText(v, fallback = "") {
  if (v == null) return fallback;
  return String(v);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return String(dateStr);
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

/**
 * Extract TOC from description HTML:
 * 1) <div id="main-toc">...</div> => tocHtml
 * 2) remove it from body
 * 3) remove span.formView marker (if exists)
 */
function splitTocAndBody(html = "") {
  const input = String(html || "");

  const tocMatch = input.match(
    /<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>|<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>/i,
  );

  const tocHtml = tocMatch ? tocMatch[0] : "";
  let bodyHtml = tocHtml ? input.replace(tocHtml, "") : input;

  bodyHtml = bodyHtml.replace(
    /<span[^>]*class=["']formView["'][^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  return { tocHtml, bodyHtml };
}

function SocialRail({ pageUrl, title }) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-28 -translate-x-2">
        <div className="flex flex-col items-center gap-3">
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            title="Share"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </div>

          <div className="h-px w-8 bg-slate-200" />

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              pageUrl,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              pageUrl,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              title,
            )}&body=${encodeURIComponent(pageUrl)}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
            title="Email"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function TocCard({ tocHtml }) {
  if (!tocHtml) return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">Table of Contents</p>
        <p className="mt-1 text-xs text-slate-500">Jump to sections</p>
      </div>

      {/* Desktop */}
      <div className="hidden max-h-[420px] overflow-auto px-5 py-4 lg:block">
        <SafeHtml html={tocHtml} />
      </div>

      {/* Mobile */}
      <div className="block px-5 py-4 lg:hidden">
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
            <span className="inline-flex items-center gap-2">
              Open contents
              <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
            </span>
          </summary>
          <div className="mt-3 max-h-[320px] overflow-auto pr-1">
            <SafeHtml html={tocHtml} />
          </div>
        </details>
      </div>
    </Card>
  );
}

function ListCard({ title, icon: Icon, items, basePath, badge }) {
  if (!items?.length) return null;

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          {Icon ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            {badge ? <p className="text-xs text-slate-500">{badge}</p> : null}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {items.slice(0, 6).map((x) => (
          <Link
            key={x.slug}
            href={`${basePath}/${x.slug}`}
            className="group flex gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer"
          >
            <div className="relative h-14 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {x.image ? (
                <Image
                  src={x.image}
                  alt={safeText(x.title)}
                  fill
                  className="object-cover" // ✅ remove padding + fill nicely
                  sizes="80px"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
                {safeText(x.title)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {x.postDate ? formatDate(x.postDate) : "Read"}
                {typeof x.visited === "number" ? ` • ${x.visited} views` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/** ✅ SEO from API (news slug) */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getNewsBySlug(slug);

  if (!data?.news) {
    return {
      title: "News Room | Corpseed",
      description: "Read the latest legal news and updates on Corpseed.",
    };
  }

  const item = data.news;

  return {
    title: data?.title || item?.title || "News Room | Corpseed",
    description: data?.metaDescription || item?.summary || "Corpseed news.",
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: `/news-room/${slug}` },
  };
}

export default async function NewsRoomSlugPage({ params }) {
  const { slug } = await params;

  const apiData = await getNewsBySlug(slug);
  if (!apiData?.news) return notFound();

  const item = apiData.news;
  const author = apiData.author || null;

  // ✅ Share URL
  const pageUrl = `https://www.corpseed.com/news-room/${item.slug}`;

  // ✅ TOC split
  const { tocHtml, bodyHtml } = splitTocAndBody(item.description || "");

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          {/* ✅ IMAGE LEFT + TEXT RIGHT (top aligned) */}
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.45fr_1.05fr] lg:items-start">
            {/* LEFT image (no padding, no extra space) */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <div className="relative h-[260px] w-full sm:h-[320px]">
                <Image
                  src={item.image}
                  alt={safeText(item.title)}
                  fill
                  priority
                  className="object-cover" // ✅ remove empty padding space
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>
            </div>

            {/* RIGHT text */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {item.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                {apiData?.metaDescription || item.summary}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                {item.postDate ? (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Published: {formatDate(item.postDate)}
                  </span>
                ) : null}

                {typeof item.visited === "number" ? (
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {item.visited}
                  </span>
                ) : null}

                {author ? (
                  <span className="inline-flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    {author?.name || "Corpseed"}
                  </span>
                ) : null}

                {item?.categoryTitle ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {item.categoryTitle}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT (same fix: don't let social rail push content) */}
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative">
            {/* Social rail overlay (shift left) */}
            <div className="hidden lg:block absolute left-0 top-0 -translate-x-16">
              <SocialRail pageUrl={pageUrl} title={item.title} />
            </div>

            {/* Main + Sidebar */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
              {/* Main */}
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="p-5 sm:p-7">
                    <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-headings:tracking-tight">
                      <SafeHtmlShadow html={bodyHtml} />
                    </div>

                    {/* Mobile share */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 lg:hidden">
                      <p className="text-sm font-semibold text-slate-900">Share</p>
                      <div className="flex items-center gap-2">
                        <a
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            pageUrl,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Facebook"
                          title="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            pageUrl,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="LinkedIn"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                          href={`mailto:?subject=${encodeURIComponent(
                            item.title,
                          )}&body=${encodeURIComponent(pageUrl)}`}
                          aria-label="Email"
                          title="Email"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <TocCard tocHtml={tocHtml} />

                  <ListCard
                    title="Top News"
                    badge="Trending"
                    icon={Newspaper}
                    items={apiData?.topNews || []}
                    basePath="/news-room"
                  />

                  <ListCard
                    title="Latest News"
                    badge="Fresh updates"
                    icon={Newspaper}
                    items={apiData?.latestNews || []}
                    basePath="/news-room"
                  />

                  <ListCard
                    title="Top Articles"
                    badge="Most visited"
                    icon={BookOpen}
                    items={apiData?.topBlogs || []}
                    basePath="/knowledge-centre"
                  />

                  <ListCard
                    title="Latest Articles"
                    badge="Recently published"
                    icon={BookOpen}
                    items={apiData?.latestBlogs || []}
                    basePath="/knowledge-centre"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Footer back */}
      <div className="pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/news-room"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            ← Back to News Room
          </Link>
        </div>
      </div>
    </div>
  );
}
