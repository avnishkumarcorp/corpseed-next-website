// app/knowledge-centre/page.jsx
import Link from "next/link";
import Image from "next/image";
import { Eye, Search } from "lucide-react";
import { getKnowledgeCentreList } from "../lib/knowledgeCentre";
import EnquiryOtpInline from "../components/otp/EnquiryOtpFlow";
import KnowledgeSearchInput from "../components/KnowledgeSearchInput";

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

function clampStr(s, n = 140) {
  const v = (s ?? "").toString().trim();
  if (!v) return "";
  return v.length > n ? `${v.slice(0, n)}…` : v;
}

function safeDate(d) {
  if (!d) return "";
  return String(d);
}

function buildQueryString(next) {
  const params = new URLSearchParams();
  if (next.page) params.set("page", String(next.page));
  if (next.q) params.set("q", String(next.q));
  if (next.filter) params.set("filter", String(next.filter));
  if (next.tag) params.set("tag", String(next.tag));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function Pagination({ currentPage, totalPages, q, filter, tag }) {
  const safeCurrent = Number(currentPage || 1);
  const safeTotal = Number(totalPages || 1);

  if (safeTotal <= 1) return null;

  const mkHref = (page) =>
    `/knowledge-centre${buildQueryString({ page, q, filter, tag })}`;

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, safeCurrent - half);
  let end = Math.min(safeTotal, start + windowSize - 1);

  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      {/* First */}
      {safeCurrent > 1 && (
        <Link
          href={mkHref(1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm !text-[#212529]"
        >
          First
        </Link>
      )}

      {/* Previous */}
      {safeCurrent > 1 && (
        <Link
          href={mkHref(safeCurrent - 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm !text-[#212529]"
        >
          Previous
        </Link>
      )}

      {/* Numbered Pages */}
      {pages.map((p) => (
        <Link
          key={p}
          href={mkHref(p)}
          className={`rounded-lg px-3 py-2 text-sm ${
            p === safeCurrent
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white !text-[#212529]"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* Next */}
      {safeCurrent < safeTotal && (
        <Link
          href={mkHref(safeCurrent + 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm !text-[#212529]"
        >
          Next
        </Link>
      )}

      {/* Last */}
      {safeCurrent < safeTotal && (
        <Link
          href={mkHref(safeTotal)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm !text-[#212529]"
        >
          Last
        </Link>
      )}
    </div>
  );
}

/** ✅ SEO */
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;

  const page = Number(sp?.page || 1);
  const q = sp?.q || "";
  const filter = sp?.filter || "";
  const tag = sp?.tag || "";

  const data = await getKnowledgeCentreList({ page, q, filter, tag });

  return {
    title: data?.title || "Corpseed || Knowledge Center",
    description: data?.metaDescription || "Corpseed Knowledge Center",
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: "/knowledge-centre" },
  };
}

export default async function KnowledgeCentrePage({ searchParams }) {
  const sp = await searchParams;
  let currentPage = Number(sp?.page || 1);
  const q = (sp?.q || "").toString();
  const filter = (sp?.filter || "").toString();
  const tag = (sp?.tag || "").toString();

  const data = await getKnowledgeCentreList({
    page: currentPage,
    q,
    filter,
    tag,
  });

  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const hotTags = Array.isArray(data?.hotTags) ? data.hotTags : [];
  const topBlogs = Array.isArray(data?.topBlogs) ? data.topBlogs : [];
  const totalPages = Number(data?.totalPages || 1);

  // ✅ Strict clamp
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // 🚫 If page > totalPages and empty → don't render invalid page
  if (blogs.length === 0 && currentPage > totalPages) {
    return null;
  }

  return (
    <div className="bg-white">
      {/* UI untouched below */}

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-slate-600">
              <Link href="/" className="hover:underline cursor-pointer">
                Home
              </Link>{" "}
              <span className="text-slate-400">/</span>{" "}
              <span className="text-slate-900">Knowledge Centre</span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Knowledge Centre
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Articles, guides and latest updates — clean UI, fast reading,
                  and category-wise browsing.
                </p>
              </div>

              <div className="w-full max-w-xl">
                <KnowledgeSearchInput initialValue={q} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {blogs.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm font-semibold text-slate-900">
                  No blogs found.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing search or filters.
                </p>
              </Card>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {blogs.map((b) => {
                  const href = `/knowledge-centre/${b.slug}`;
                  return (
                    <Card key={b.id ?? b.slug} className="overflow-hidden">
                      <Link href={href} className="block cursor-pointer">
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
                          <Image
                            src={b.image}
                            alt={b.title || "Blog"}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </Link>

                      <div className="p-5">
                        <Link
                          href={href}
                          className="line-clamp-2 text-base font-semibold text-slate-900 hover:underline cursor-pointer"
                        >
                          {b.title}
                        </Link>

                        <div className="mt-2 text-xs text-slate-500 flex">
                          <span>
                            {b.author?.firstName} {b.author?.lastName}
                          </span>
                          <span className="mx-1.5">|</span>
                          <span>Updated : {safeDate(b.modifyDate)} </span>
                          {b?.visited != null && (
                            <div className="flex items-center">
                              <span className="mx-1.5">|</span>
                              <span className="flex items-center gap-1.5 flex-nowrap">
                                {b.visited} <Eye className="h-3 w-3" />
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                          {clampStr(b.summary, 190)}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                            {b?.category?.subCategoryName ||
                              b?.category?.categoryName ||
                              "Knowledge"}
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              q={q}
              filter={filter}
              tag={tag}
            />
          </div>

          {/* Right - Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Active filters */}
              {q || filter || tag ? (
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
                    {filter ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Category: {filter}
                      </span>
                    ) : null}
                    {tag ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        Tag: {tag}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <Link
                      href="/knowledge-centre"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                    >
                      Clear filters
                    </Link>
                  </div>
                </Card>
              ) : null}

              {/* Categories */}
              <div className="bg-[#f2f3ff] p-2 mt-2.5">
                <EnquiryOtpInline page={"knowledge-centre"} />
              </div>

              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Categories
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {categories.map((c) => {
                    const href = `/knowledge-centre${buildQueryString({
                      page: 1,
                      q,
                      filter: c.slug,
                      tag,
                    })}`;

                    return (
                      <Link
                        key={c.id ?? c.slug}
                        href={href}
                        className="flex items-center justify-between px-5 py-4 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="min-w-0 truncate">
                          {c.subCategoryName || c.categoryName}
                        </span>
                        <span className="text-xs text-slate-400">View</span>
                      </Link>
                    );
                  })}

                  <Link
                    href="/knowledge-centre"
                    className="block px-5 py-4 text-sm text-blue-700 hover:bg-slate-50 cursor-pointer"
                  >
                    View All
                  </Link>
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-5">
                <p className="text-sm font-semibold text-slate-900">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hotTags.map((t) => {
                    const href = `/service/${t.slug}`;

                    return (
                      <Link
                        key={t.id ?? t.name}
                        href={href}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        {t.name}
                      </Link>
                    );
                  })}
                </div>
              </Card>

              {/* Top Articles */}
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Top Articles
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {topBlogs.slice(0, 6).map((x) => {
                    const href = `/knowledge-centre/${x.slug}`;
                    return (
                      <Link
                        key={x.id ?? x.slug}
                        href={href}
                        className="flex gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={x.image}
                            alt={x.title || "Top article"}
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

              <div className="bg-[#f2f3ff] p-2 mt-2.5">
                <EnquiryOtpInline page={"knowledge-centre"} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
