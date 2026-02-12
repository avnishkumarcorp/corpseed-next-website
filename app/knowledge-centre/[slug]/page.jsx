// app/knowledge-centre/[slug]/page.jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Eye,
  User2,
  ChevronRight,
  Newspaper,
  BookOpen,
} from "lucide-react";

import { getKnowledgeCentreBySlug } from "@/app/lib/knowledgeCentre";
import SafeHtml from "@/app/components/SafeHtml";
import EnquiryOtpInline from "@/app/components/otp/EnquiryOtpFlow";
import FeedbackBox from "@/app/components/FeedbackBox";
import SocialRail from "@/app/components/ShareRailClient"; // ✅ Using external component


function safeText(v, fallback = "") {
  if (v == null) return fallback;
  return String(v);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr;
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
 * Extracts:
 * 1) <div id="main-toc">...</div> as tocHtml
 * 2) Removes that TOC block from main content
 * 3) Removes formView marker
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

function TocCard({ tocHtml }) {
  if (!tocHtml) return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          Table of Contents
        </p>
        <p className="mt-1 text-xs text-slate-500">Jump to sections</p>
      </div>

      <div className="hidden max-h-[420px] overflow-auto px-5 py-4 lg:block">
        <SafeHtml html={tocHtml} />
      </div>

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
          {Icon && (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            {badge && <p className="text-xs text-slate-500">{badge}</p>}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {items.slice(0, 6).map((x) => (
          <Link
            key={x.slug}
            href={`${basePath}/${x.slug}`}
            className="group flex gap-3 px-5 py-4 hover:bg-slate-50"
          >
            <div className="relative h-14 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {x.image && (
                <Image
                  src={x.image}
                  alt={safeText(x.title)}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:underline">
                {safeText(x.title)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {x.postDate ? formatDate(x.postDate) : "Read"}
                {typeof x.visited === "number"
                  ? ` • ${x.visited} views`
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}


/* ===============================
   SEO
================================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getKnowledgeCentreBySlug(slug);

  if (!data?.blog) {
    return {
      title: "Knowledge Centre | Corpseed",
      description:
        "Read latest articles, updates, formats and guides on Corpseed.",
    };
  }

  return {
    title: data?.title || data?.blog?.title,
    description:
      data?.metaDescription || data?.blog?.summary,
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: `/knowledge-centre/${slug}` },
  };
}


/* ===============================
   PAGE
================================= */
export default async function KnowledgeCentreSlugPage({ params }) {
  const { slug } = await params;

  const apiData = await getKnowledgeCentreBySlug(slug);
  if (!apiData?.blog) return notFound();

  const blog = apiData.blog;
  const author = apiData.author || null;

  const pageUrl = `https://www.corpseed.com/knowledge-centre/${blog.slug}`;

  const { tocHtml, bodyHtml } = splitTocAndBody(blog.description || "");

  return (
    <div className="bg-slate-50">

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">

          <div className="mt-4 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center">

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <div className="relative h-[200px] w-full sm:h-[240px]">
                <Image
                  src={blog.image}
                  alt={safeText(blog.title)}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {blog.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                {apiData?.metaDescription || blog.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                {blog.postDate && (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(blog.postDate)}
                  </span>
                )}

                {typeof blog.visited === "number" && (
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {blog.visited}
                  </span>
                )}

                {author && (
                  <span className="inline-flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    {author?.name || "Corpseed"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CONTENT */}
      <section className="py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">

          {/* ✅ Using SocialRail component */}
          <div className="lg:col-span-1">
            <SocialRail pageUrl={pageUrl} title={blog.title} />
          </div>

          {/* MAIN */}
          <div className="lg:col-span-7 space-y-6">

            <Card className="overflow-hidden">
              <div className="p-5 sm:p-7">
                <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-headings:tracking-tight">
                  <SafeHtml html={bodyHtml} />
                </div>

                <div className="mt-8">
                  <EnquiryOtpInline />
                </div>
              </div>
            </Card>

            {apiData?.feedback && <FeedbackBox />}

            {apiData?.relatedBlogs?.length && (
              <Card>
                <div className="border-b border-slate-200 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Related articles
                  </p>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  {apiData.relatedBlogs.slice(0, 6).map((x) => (
                    <Link
                      key={x.slug}
                      href={`/knowledge-centre/${x.slug}`}
                      className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50"
                    >
                      <div className="relative h-16 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {x.image && (
                          <Image
                            src={x.image}
                            alt={safeText(x.title)}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:underline">
                          {safeText(x.title)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {x.postDate ? formatDate(x.postDate) : "Read"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">

              <TocCard tocHtml={tocHtml} />

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

              <ListCard
                title="Top News"
                badge="Trending"
                icon={Newspaper}
                items={apiData?.topNews || []}
                basePath="/knowledge-centre"
              />

              <ListCard
                title="Latest News"
                badge="Fresh updates"
                icon={Newspaper}
                items={apiData?.latestNews || []}
                basePath="/knowledge-centre"
              />
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}
