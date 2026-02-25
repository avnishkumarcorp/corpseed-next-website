// app/news-room/page.jsx
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { getNewsRoomList } from "../lib/newsRoom";
import NewsSearchBox from "./NewsSearchBox";

export const revalidate = 300;

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function clampStr(s, n = 160) {
  const v = (s ?? "").toString().trim();
  if (!v) return "";
  return v.length > n ? `${v.slice(0, n)}…` : v;
}

function safeDate(d) {
  if (!d) return "";
  return String(d);
}

/** ✅ server-safe query builder */
function buildQueryString(next) {
  const params = new URLSearchParams();
  if (next.page) params.set("page", String(next.page));
  if (next.size) params.set("size", String(next.size));
  if (next.q) params.set("q", String(next.q));
  if (next.categorySlug) params.set("categorySlug", String(next.categorySlug));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function Pagination({
  currentPage,
  totalPages,
  pageNumbers,
  q,
  categorySlug,
  size,
}) {
  const pages =
    Array.isArray(pageNumbers) && pageNumbers.length
      ? pageNumbers
      : [currentPage];

  const prevPage = Math.max(1, Number(currentPage || 1) - 1);
  const nextPage = Math.min(
    Number(totalPages || 1),
    Number(currentPage || 1) + 1,
  );

  const mkHref = (page) =>
    `/news${buildQueryString({ page, size, q, categorySlug })}`;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      <Link
        href={mkHref(prevPage)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        Previous
      </Link>

      {pages.map((p) => {
        const active = Number(p) === Number(currentPage);
        return (
          <Link
            key={p}
            href={mkHref(p)}
            className={`rounded-lg px-3 py-2 text-sm cursor-pointer ${
              active
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p}
          </Link>
        );
      })}

      <Link
        href={mkHref(nextPage)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        Next
      </Link>

      <Link
        href={mkHref(totalPages)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        Last
      </Link>
    </div>
  );
}

/** ✅ SEO from API */
export async function generateMetadata({ searchParams }) {
  const { page, size, q, categorySlug } = await searchParams;
  const data = await getNewsRoomList({ page, size, q, categorySlug });
  return {
    title: data?.title || "Corpseed || News Room",
    description: data?.metaDescription || "Corpseed News Room",
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: "/news" },
  };
}

export default async function NewsRoomPage({ searchParams }) {
  const { page, size, q, categorySlug } = await searchParams;

  const currentPage = Number(page || 1);

  const data = await getNewsRoomList({
    page: currentPage,
    size,
    q,
    categorySlug,
  });

  const pageData = data?.page || {};
  const news = Array.isArray(pageData?.news) ? pageData.news : [];
  const categories = Array.isArray(pageData?.topCategories)
    ? pageData.topCategories
    : [];
  const topNews = Array.isArray(pageData?.topNews) ? pageData.topNews : [];

  const totalPages = Number(pageData?.totalPages || 1);
  const pageNumbers = Array.isArray(pageData?.pageNumbers)
    ? pageData.pageNumbers
    : [];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-slate-600">
              <Link href="/" className="hover:underline cursor-pointer">
                Home
              </Link>{" "}
              <span className="text-slate-400">/</span>{" "}
              <span className="text-slate-900">News Room</span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  News Room
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Latest legal and industry news — clean UI, fast reading, and
                  category-wise browsing.
                </p>
              </div>

              {/* ✅ Search (SERVER-safe: GET form) */}
              <NewsSearchBox
                defaultValue={q}
                size={size}
                categorySlug={categorySlug}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left - News grid */}
          <div className="lg:col-span-8">
            {news.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm font-semibold text-slate-900">
                  No news found.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing search or category filter.
                </p>
              </Card>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {news.map((n) => {
                  const href = `/news/${n.slug}`;
                  return (
                    <Card key={n.id} className="overflow-hidden">
                      <Link href={href} className="block cursor-pointer">
                        <div className="relative aspect-[16/9] w-full bg-slate-50">
                          <Image
                            src={n.image}
                            alt={n.title || "News"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </Link>

                      <div className="p-5">
                        <Link
                          href={href}
                          className="line-clamp-2 text-base font-semibold text-slate-900 hover:underline cursor-pointer"
                        >
                          {n.title}
                        </Link>

                        <div className="mt-2 text-xs text-slate-500 flex">
                          <span>{n.author?.name}</span>
                          <span className="mx-1.5">|</span>
                          <span>Updated : {safeDate(n.postDate)} </span>
                          {n?.visited != null ? (
                            <div className="flex items-center">
                              <span className="mx-1.5">|</span>
                              <span className="flex items-center gap-1.5 flex-nowrap">
                                {n.visited} <Eye className="h-3 w-3" />
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                          {clampStr(n.summary, 190)}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                          {/* Category label from current filter if you want:
                              else show "NEWS" */}
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                            {categorySlug
                              ? categorySlug.replace(/-/g, " ")
                              : "NEWS"}
                          </span>

                          <Link
                            href={href}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-700 cursor-pointer"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={pageData?.currentPage || currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              q={q}
              categorySlug={categorySlug}
              size={size}
            />
          </div>

          {/* Right - Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Active filters */}
              {q || categorySlug ? (
                <Card className="p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Active filters
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {q ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Search: {q}
                      </span>
                    ) : null}
                    {categorySlug ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Category: {categorySlug}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <Link
                      href="/news?page=1&size=20"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                    >
                      Clear filters
                    </Link>
                  </div>
                </Card>
              ) : null}

              {/* Categories */}
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Categories
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {categories.map((c) => {
                    const href = `/news${buildQueryString({
                      page: 1,
                      size,
                      q,
                      categorySlug: c.slug,
                    })}`;

                    return (
                      <Link
                        key={c.id}
                        href={href}
                        className="flex items-center justify-between px-5 py-4 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="min-w-0 truncate">{c.title}</span>
                        <span className="text-xs text-slate-400">View</span>
                      </Link>
                    );
                  })}

                  <Link
                    href={`/news?page=1&size=${size}`}
                    className="block px-5 py-4 text-sm text-blue-700 hover:bg-slate-50 cursor-pointer"
                  >
                    View All
                  </Link>
                </div>
              </Card>

              {/* Top News */}
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Top News
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {topNews.slice(0, 6).map((x) => {
                    const href = `/news/${x.slug}`;
                    return (
                      <Link
                        key={x.id}
                        href={href}
                        className="flex gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={x.image}
                            alt={x.title || "Top news"}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-slate-900">
                            {x.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {safeDate(x.postDate)}
                            {x?.visited != null ? (
                              <>
                                <span className="text-slate-400"> • </span>
                                {x.visited} views
                              </>
                            ) : null}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>

              {/* Follow us (same style placeholder) */}
              {/* <Card className="p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Follow us
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    f
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    in
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    yt
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    ig
                  </span>
                </div>
              </Card> */}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
