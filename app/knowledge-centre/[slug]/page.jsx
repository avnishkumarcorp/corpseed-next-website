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
import { getKnowledgeCentreBySlug } from "@/app/lib/knowledgeCentre";
import SafeHtml from "@/app/components/SafeHtml";
import EnquiryOtpInline from "@/app/components/otp/EnquiryOtpFlow";
import FeedbackBox from "@/app/components/FeedbackBox";

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
 * 3) Detects span.formView marker and removes it
 */
function splitTocAndBody(html = "") {
  const input = String(html || "");

  // Extract TOC block
  const tocMatch = input.match(
    /<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>|<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>/i,
  );

  const tocHtml = tocMatch ? tocMatch[0] : "";

  // Remove TOC block from body
  let bodyHtml = tocHtml ? input.replace(tocHtml, "") : input;

  // Remove blog contact marker (you showed: <span class="formView">--------------Blog Contact Form-------------</span>)
  bodyHtml = bodyHtml.replace(
    /<span[^>]*class=["']formView["'][^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  return { tocHtml, bodyHtml };
}

function SocialRail({ pageUrl, title }) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-28">
        <div className="flex flex-col items-center gap-3">
          {/* Share (just a non-clickable icon/button style) */}
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
        <p className="text-sm font-semibold text-slate-900">
          Table of Contents
        </p>
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


/** ✅ SEO from API */
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
    title: data?.title || data?.blog?.title || "Knowledge Centre | Corpseed",
    description:
      data?.metaDescription ||
      data?.blog?.summary ||
      "Corpseed knowledge centre article.",
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: `/knowledge-centre/${slug}` },
  };
}

export default async function KnowledgeCentreSlugPage({ params }) {
  const { slug } = await params;

  const apiData = await getKnowledgeCentreBySlug(slug);
  if (!apiData?.blog) return notFound();

  const blog = apiData.blog;
  const author = apiData.author || null;

  // Build share URL (use your real domain)
  const pageUrl = `https://www.corpseed.com/knowledge-centre/${blog.slug}`;

  // Extract TOC from HTML and clean body
  const { tocHtml, bodyHtml } = splitTocAndBody(blog.description || "");

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          {/* breadcrumb */}
          {/* <div className="text-sm text-slate-600">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <Link href="/knowledge-centre" className="hover:underline cursor-pointer">
              Knowledge Centre
            </Link>{" "}
            <span className="text-slate-400">/</span>{" "}
            <span className="text-slate-900">{blog.title}</span>
          </div> */}

          <div className="mt-4 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
            {/* LEFT image */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <div className="relative h-[200px] w-full sm:h-[240px]">
                <Image
                  src={blog.image}
                  alt={safeText(blog.title)}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>

            {/* RIGHT text */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {blog.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                {apiData?.metaDescription || blog.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                {blog.postDate ? (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last updated: {formatDate(blog.postDate)}
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
                    {author?.name || "Corpseed"}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
          {/* Social rail */}
          <div className="lg:col-span-1">
            <SocialRail pageUrl={pageUrl} title={blog.title} />
          </div>

          {/* Main */}
          <div className="lg:col-span-7 space-y-6">
            {/* Author card */}
            {/* {author ? (
              <Card>
                <div className="flex items-center gap-3 p-5">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white">
                    {author.profilePicture ? (
                      <Image
                        src={author.profilePicture}
                        alt={`${author.firstName || ""} ${author.lastName || ""}`.trim()}
                        fill
                        className="object-cover"
                        sizes="48px"
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
                      {author.jobTitle || "Corpseed"}
                    </p>
                  </div>
                </div>
              </Card>
            ) : null} */}

            {/* Article */}
            <Card className="overflow-hidden">
              <div className="p-5 sm:p-7">
                {/* Smaller + clean typography (fix “text is big large”) */}
                <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-headings:tracking-tight">
                  <SafeHtml html={bodyHtml} />
                </div>

                {/* Replace “Blog Contact Form” marker with CTA */}
                <div className="mt-8">
                  <EnquiryOtpInline/>
                </div>

                {/* Mobile share */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 lg:hidden">
                  <p className="text-sm font-semibold text-slate-900">Share</p>
                  <div className="flex items-center gap-2">
                    <a
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
                      href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(pageUrl)}`}
                      aria-label="Email"
                      title="Email"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Feedback */}
            {apiData?.feedback ? (
              // <Card>
              //   <div className="p-5 sm:p-7">
              //     <p className="text-sm font-semibold text-slate-900">
              //       Give us your feedback
              //     </p>
              //     <p className="mt-1 text-sm text-slate-600">
              //       {apiData?.feedback?.ratingValue || "Thanks!"}
              //       {apiData?.feedback?.comment
              //         ? ` • ${apiData.feedback.comment}`
              //         : ""}
              //     </p>
              //   </div>
              // </Card>
              <FeedbackBox/>

            ) : null}

            {/* Related blogs */}
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
                      className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 cursor-pointer"
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
                          {typeof x.visited === "number"
                            ? ` • ${x.visited} views`
                            : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* TOC */}
              <TocCard tocHtml={tocHtml} />

              {/* Blogs */}
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

              {/* News */}
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
