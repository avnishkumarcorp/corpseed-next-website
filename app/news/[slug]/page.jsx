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
  Newspaper,
  BookOpen,
  Phone,
} from "lucide-react";

import SafeHtml from "@/app/components/SafeHtml";
import { getNewsBySlug } from "@/app/lib/newsRoom";
import EnquiryOtpInline from "@/app/components/otp/EnquiryOtpFlow";
import { headers } from "next/headers";
import BlogContentClient from "@/app/components/BlogContentClient";
import NewTocClient from "@/app/components/NewTocClient";
import { splitTocAndBody } from "@/app/lib/tocUtils";

export const revalidate = 30;

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
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
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
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              title,
            )}&body=${encodeURIComponent(pageUrl)}`}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
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
              alt={author.name}
              fill
              className="object-cover"
              sizes="95px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                {author.name}
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
    alternates: { canonical: `/news/${slug}` },
  };
}

/* ===============================
   PAGE
================================= */
export default async function NewsRoomSlugPage({ params }) {
  const { slug } = await params;

  const apiData = await getNewsBySlug(slug);
  if (!apiData?.news) return notFound();

  const item = apiData.news;
  const author = apiData.author || null;

  const pageUrl = `https://www.corpseed.com/news/${item.slug}`;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  const url = `${protocol}://${host}/news/${slug}`;

  const { tocItems, bodyHtml } = splitTocAndBody(item.description || "", url);

  return (
    <div className="bg-white">
      <section className="bg-white">
        {/* ROW 1: FULL-WIDTH BORDER WRAPPER */}
        <div className="border-b ">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-stretch">
                {/* LEFT: HEADING CONTENT */}
                <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    {item.title}
                  </h1>

                  <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
                    {apiData?.metaDescription || item.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    {item.postDate ? (
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.postDate)}
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

                {/* RIGHT: ENQUIRY FORM */}
                <div className="min-w-0 border-t border-slate-200 bg-[#f2f3ff] p-3 lg:border-l lg:border-t-0">
                  <div className="h-full w-full">
                    <EnquiryOtpInline page={slug} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 + CONTENT
            LEFT COLUMN  = Image + News Content + Author
            RIGHT COLUMN = TOC + Top News + Latest News + Top Articles + Latest Articles
        */}
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-stretch">
            {/* LEFT COLUMN */}
            <main className="min-w-0 space-y-8">
              {/* IMAGE */}
              {item.image ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                  <Image
                    src={item.image}
                    alt={safeText(item.title)}
                    width={1200}
                    height={800}
                    priority
                    className="block h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 760px"
                  />

                  <div className="absolute bottom-3 right-3 z-[10] flex items-center gap-1.5 rounded-lg bg-gray-200 px-2 py-1 font-bold text-blue-600 shadow-lg">
                    <Phone className="h-4 w-4" />
                    7558640644 - Harshita
                  </div>
                </div>
              ) : null}

              {/* NEWS CONTENT */}
              <div className="relative">
                {/* Social rail overlay */}
                <div className="absolute left-0 top-0 hidden -translate-x-16 lg:block">
                  <SocialRail pageUrl={pageUrl} title={item.title} />
                </div>

                <div className="overflow-hidden p-5 sm:p-6">
                  <div className="prose prose-slate prose-sm max-w-none prose-headings:tracking-tight prose-p:leading-relaxed">
                    <BlogContentClient html={bodyHtml} />
                  </div>

                  {/* Mobile Share */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 lg:hidden">
                    <p className="text-sm font-semibold text-slate-900">
                      Share
                    </p>

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
              </div>

              {author ? <AuthorCard author={author} /> : null}
            </main>

            {/* RIGHT COLUMN: TOC + SIDEBAR CARDS */}
            <aside className="min-w-0 lg:self-stretch">
              {/* NORMAL SIDEBAR CONTENT */}
              <div className="space-y-6">
                {tocItems?.length ? (
                  <Card className="overflow-hidden">
                    <NewTocClient items={tocItems} headerOffset={90} />
                  </Card>
                ) : null}

                <ListCard
                  title="Top News"
                  badge="Trending"
                  icon={Newspaper}
                  items={apiData?.topNews || []}
                  basePath="/news"
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

              {/* ONLY LATEST NEWS STICKY */}
              <div className="mt-6 lg:sticky lg:top-24">
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
      </section>

      {/* Footer back */}
      <div className="bg-white pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/news"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            ← Back to News Room
          </Link>
        </div>
      </div>
    </div>
  );
}
