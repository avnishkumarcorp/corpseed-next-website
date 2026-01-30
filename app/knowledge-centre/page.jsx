// app/knowledge-centre/page.jsx
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getKnowledgeCentreList } from "../lib/knowledgeCentre";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
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
  if (next.categorySlug) params.set("categorySlug", String(next.categorySlug));
  if (next.tag) params.set("tag", String(next.tag));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function Pagination({ currentPage, totalPages, pageNumbers, q, categorySlug, tag }) {
  const pages = Array.isArray(pageNumbers) && pageNumbers.length ? pageNumbers : [currentPage];

  const prevPage = Math.max(1, Number(currentPage || 1) - 1);
  const nextPage = Math.min(Number(totalPages || 1), Number(currentPage || 1) + 1);

  const mkHref = (page) =>
    `/knowledge-centre${buildQueryString({ page, q, categorySlug, tag })}`;

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
  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const q = sp?.q || "";
  const categorySlug = sp?.categorySlug || "";
  const tag = sp?.tag || "";

  const data = await getKnowledgeCentreList({ page, q, categorySlug, tag });

  return {
    title: data?.title || "Corpseed || Knowledge Center",
    description: data?.metaDescription || "Corpseed Knowledge Center",
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: "/knowledge-centre" },
  };
}

export default async function KnowledgeCentrePage({ searchParams }) {
  const sp = await searchParams;

  const currentPage = Number(sp?.page || 1);
  const q = (sp?.q || "").toString();
  const categorySlug = (sp?.categorySlug || "").toString();
  const tag = (sp?.tag || "").toString();

  const data = await getKnowledgeCentreList({
    page: currentPage,
    q,
    categorySlug,
    tag,
  });

  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const hotTags = Array.isArray(data?.hotTags) ? data.hotTags : [];
  const topBlogs = Array.isArray(data?.topBlogs) ? data.topBlogs : [];

  const totalPages = Number(data?.totalPages || 1);
  const pageNumbers = Array.isArray(data?.pageNumbers) ? data.pageNumbers : [];

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
              <span className="text-slate-900">Knowledge Centre</span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Knowledge Centre
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Articles, guides and latest updates — clean UI, fast reading, and category-wise browsing.
                </p>
              </div>

              {/* ✅ Search (SERVER-safe: GET form, no onSubmit) */}
              <form action="/knowledge-centre" method="GET" className="w-full max-w-xl">
                {/* preserve filters */}
                {categorySlug ? <input type="hidden" name="categorySlug" value={categorySlug} /> : null}
                {tag ? <input type="hidden" name="tag" value={tag} /> : null}
                <input type="hidden" name="page" value="1" />

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search blog..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left - Blog grid */}
          <div className="lg:col-span-8">
            {blogs.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm font-semibold text-slate-900">No blogs found.</p>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing search or filters. If API is returning empty data, it will show here.
                </p>
              </Card>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {blogs.map((b) => {
                  const href = `/knowledge-centre/${b.slug}`;
                  return (
                    <Card key={b.id} className="overflow-hidden">
                      <Link href={href} className="block cursor-pointer">
                        <div className="relative aspect-[16/9] w-full bg-slate-50">
                          <Image
                            src={b.image}
                            alt={b.title || "Blog"}
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
                          {b.title}
                        </Link>

                        <div className="mt-2 text-xs text-slate-500">
                          {safeDate(b.postDate)}{" "}
                          {b?.visited != null ? (
                            <span className="text-slate-400">•</span>
                          ) : null}{" "}
                          {b?.visited != null ? <span>{b.visited} views</span> : null}
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                          {clampStr(b.summary, 190)}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                            {b?.category?.subCategoryName || b?.category?.categoryName || "Knowledge"}
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
              currentPage={data?.currentPage || currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              q={q}
              categorySlug={categorySlug}
              tag={tag}
            />
          </div>

          {/* Right - Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Active filters */}
              {(q || categorySlug || tag) ? (
                <Card className="p-5">
                  <p className="text-sm font-semibold text-slate-900">Active filters</p>
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
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">Categories</p>
                </div>

                <div className="divide-y divide-slate-200">
                  {categories.map((c) => {
                    const href = `/knowledge-centre${buildQueryString({
                      page: 1,
                      q,
                      categorySlug: c.slug,
                      tag,
                    })}`;

                    return (
                      <Link
                        key={c.id}
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
                    const href = `/knowledge-centre${buildQueryString({
                      page: 1,
                      q,
                      categorySlug,
                      tag: t.name,
                    })}`;
                    return (
                      <Link
                        key={t.id}
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
                  <p className="text-sm font-semibold text-slate-900">Top Articles</p>
                </div>

                <div className="divide-y divide-slate-200">
                  {topBlogs.slice(0, 6).map((x) => {
                    const href = `/knowledge-centre/${x.slug}`;
                    return (
                      <Link
                        key={x.id}
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

              {/* ✅ Callback box (SERVER-safe: no onSubmit; if you want real submit, point action to your API route) */}
              <Card className="p-6">
                <p className="text-lg font-semibold text-slate-900">Schedule a call back</p>
                <p className="mt-2 text-sm text-slate-600">
                  Leave your details and we’ll call you back.
                </p>

                {/* Example: server-safe form. Change action to your real endpoint if you have one */}
                <form action="/contact-us" method="GET" className="mt-4 space-y-3">
                  <input
                    name="name"
                    placeholder="Name*"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-600"
                  />
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-600"
                  />

                  <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
              </Card>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
