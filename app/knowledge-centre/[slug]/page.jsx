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
  Phone,
} from "lucide-react";
import { getKnowledgeCentreBySlug } from "@/app/lib/knowledgeCentre";
import SafeHtml from "@/app/components/SafeHtml";
import EnquiryOtpInline from "@/app/components/otp/EnquiryOtpFlow";
import FeedbackBox from "@/app/components/FeedbackBox";
import SocialRail from "@/app/components/ShareRailClient";
import dynamic from "next/dynamic";
import TocClient from "@/app/components/TocClient";
import { headers } from "next/headers";

export const revalidate = 30;

const BlogContentClient = dynamic(
  () => import("@/app/components/BlogContentClient"),
);

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
 * Extracts:
 * 1) <div id="main-toc">...</div> as tocHtml
 * 2) Removes that TOC block from main content
 * 3) Removes formView marker
 */
function splitTocAndBody(html = "", url = "") {
  let input = String(html || "");

  // remove <base ...> from full html
  input = input.replace(/<base[^>]*>/gi, "");

  const tocMatch = input.match(
    /<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>|<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>/i,
  );

  const tocHtmlRaw = tocMatch ? tocMatch[0] : "";

  // rewrite TOC links to current page path
  const tocHtml = tocHtmlRaw
    .replace(/<base[^>]*>/gi, "")
    .replace(
      /<a([^>]*?)href=(['"])([^'"]*?)\2([^>]*?)>/gi,
      (full, pre, q, href, post) => {
        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return full;

        const hash = href.slice(hashIndex + 1);
        return `<a${pre}href="${url}#${hash}"${post}>`;
      },
    );

  let bodyHtml = tocHtmlRaw ? input.replace(tocHtmlRaw, "") : input;

  // remove form marker
  bodyHtml = bodyHtml.replace(
    /<span[^>]*class=["']formView["'][^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  // remove <base> if any remains
  bodyHtml = bodyHtml.replace(/<base[^>]*>/gi, "");

  return { tocHtml, bodyHtml };
}

function TocCard({ tocHtml }) {
  if (!tocHtml) return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <p className="text-sm font-semibold text-slate-900">
            Table of Contents
          </p>
        </div>
      </div>

      {/* Desktop ToC */}
      <div className="hidden max-h-[calc(100vh-220px)] overflow-auto px-4 py-4 lg:block">
        <TocClient html={tocHtml} headerOffset={90} />
      </div>

      {/* Mobile ToC */}
      <div className="block px-5 py-4 lg:hidden">
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
            <span className="inline-flex items-center gap-2">
              Open contents
              <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
            </span>
          </summary>

          <div className="mt-3 max-h-[320px] overflow-auto pr-1">
            <TocClient html={tocHtml} headerOffset={90} />
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
            className="group flex cursor-pointer gap-3 px-5 py-4 hover:bg-slate-50"
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

function AuthorCard({ author }) {
  if (!author) return null;

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-slate-900 to-blue-600 opacity-80" />

      <div className="px-6 py-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-900">
            About the Author
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-[95px] w-[95px] flex-none overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={author.profilePicture}
              alt={`${author.firstName} ${author.lastName}`}
              fill
              className="object-cover"
              sizes="95px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                {author.firstName} {author.lastName}
              </h3>

              {author.jobTitle ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {author.jobTitle}
                </span>
              ) : null}
            </div>

            <div className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              <SafeHtml html={author.aboutMe} />
            </div>

            <div className="mt-3">
              <Link
                href={`/profile/${author.slug}`}
                className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View profile →
              </Link>
            </div>
          </div>
        </div>
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
    description: data?.metaDescription || data?.blog?.summary,
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

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  const url = `${protocol}://${host}/knowledge-centre/${slug}`;

  const { tocHtml, bodyHtml } = splitTocAndBody(blog.description || "", url);

  return (
    <div className="bg-white">
      {/* ===============================
    TOP SECTION
    ROW 1: HEADING + ENQUIRY SAME HEIGHT
    ROW 2: IMAGE + TOC SIDE BY SIDE
================================= */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-stretch">
            {/* LEFT: HEADING CARD */}
            <Card className="flex min-w-0 flex-col overflow-hidden lg:h-full">
              <div className="flex h-full flex-col justify-center p-5 sm:p-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {blog.title}
                </h1>

                {blog.summary ? (
                  <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
                    {blog.summary}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                  {blog.modifyDate ? (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.modifyDate)}
                    </span>
                  ) : null}

                  {typeof blog.visited === "number" ? (
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {blog.visited}
                    </span>
                  ) : null}

                  {author ? (
                    <span className="inline-flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      {author?.firstName || "Corpseed"}{" "}
                      {author?.lastName || "Corpseed"}
                    </span>
                  ) : null}

                  {blog?.categoryTitle ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {blog.categoryTitle}
                    </span>
                  ) : null}
                </div>
              </div>
            </Card>

            {/* RIGHT: ENQUIRY FORM CARD */}
            <aside className="min-w-0 lg:flex">
              <Card className="flex w-full overflow-hidden border-blue-100 bg-[#f2f3ff] p-3 lg:h-full">
                <div className="w-full">
                  <EnquiryOtpInline page={slug} />
                </div>
              </Card>
            </aside>

            {/* LEFT BELOW: IMAGE */}
            {blog.image ? (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <Image
                  src={blog.image}
                  alt={safeText(blog.title)}
                  width={1200}
                  height={800}
                  priority
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 760px"
                />

                <div className="absolute bottom-3 right-3 z-[10] flex items-center gap-1.5 rounded-lg bg-gray-200 px-2 py-1 font-bold text-blue-600 shadow-lg">
                  <Phone className="h-4 w-4" />
                  7558640644 - Harshita
                </div>
              </div>
            ) : null}

            {/* RIGHT BELOW: TOC NEXT TO IMAGE */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <TocCard tocHtml={tocHtml} />
            </aside>
          </div>
        </div>
      </section>

      {/* ===============================
          ARTICLE CONTENT
          TOC IS NOW OUTSIDE TOP SECTION
          AND BESIDE THE ARTICLE TEXT
      ================================= */}
      <section className="bg-white py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative">
            {/* Social rail overlay */}
            <div className="absolute left-0 top-0 hidden -translate-x-16 lg:block">
              <SocialRail pageUrl={pageUrl} title={blog.title} />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
              {/* Main Content */}
              <main className="min-w-0 space-y-8">
                <Card className="overflow-hidden p-5 sm:p-6">
                  <div className="prose prose-slate prose-sm max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
                    <BlogContentClient html={bodyHtml} />
                  </div>
                </Card>

                {author ? <AuthorCard author={author} /> : null}

                {apiData?.feedback ? <FeedbackBox /> : null}

                {apiData?.relatedBlogs?.length ? (
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
                          className="group flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50"
                        >
                          <div className="relative h-16 w-20 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {x.image ? (
                              <Image
                                src={x.image}
                                alt={safeText(x.title)}
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                            ) : null}
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
                ) : null}
              </main>

              {/* Right Sidebar: ToC + article/news cards */}
              <aside className="min-w-0">
                <div className="space-y-6 lg:sticky lg:top-24">
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
                    basePath="/news"
                  />

                  <ListCard
                    title="Latest News"
                    badge="Fresh updates"
                    icon={Newspaper}
                    items={apiData?.latestNews || []}
                    basePath="/news"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Footer back */}
      <div className="bg-white pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/knowledge-centre"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            ← Back to Knowledge Centre
          </Link>
        </div>
      </div>
    </div>
  );
}
