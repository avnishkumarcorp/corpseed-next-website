// app/products/page.jsx
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { getProductsPage } from "../lib/products";


function clampText(text, n = 140) {
  const t = String(text || "").trim();
  return t.length > n ? t.slice(0, n).trim() + "..." : t;
}

function buildHref({ page, size, filter, q }) {
  const sp = new URLSearchParams();
  if (page) sp.set("page", String(page));
  if (size) sp.set("size", String(size));
  if ((q || "").trim()) sp.set("q", String(q).trim());
  else if ((filter || "").trim()) sp.set("filter", String(filter).trim());
  return `/products?${sp.toString()}`;
}

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const size = Number(sp?.size || 20);
  const filter = sp?.filter || "";
  const q = sp?.q || "";

  const data = await getProductsPage({ page, size, filter, q });

  const title = data?.title || "Corpseed | All Products";
  const description =
    data?.metaDescription || data?.metaTitle || "Browse Corpseed products.";

  return {
    title,
    description,
    alternates: { canonical: "/products" },
    openGraph: {
      title,
      description,
      url: "https://www.corpseed.com/products",
      siteName: "CORPSEED ITES PRIVATE LIMITED",
      type: "website",
    },
  };
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;

  const page = Number(sp?.page || 1);
  const size = Number(sp?.size || 20);
  const filter = sp?.filter || "";
  const q = sp?.q || "";

  const data = await getProductsPage({ page, size, filter, q });

  const products = data?.products || [];
  const productServices = data?.productServices || [];
  const currentPage = data?.currentPage || page;
  const totalPages = data?.totalPages || 1;
  const pageNumbers = data?.pageNumbers || [];

  const appliedFilter = (q || filter || "").trim();

  return (
    <main className="bg-white">
      {/* Top section like your category page */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Explore products & services
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Corpseed || All Products
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse products with search, filter and pagination.
              </p>
            </div>

            {/* Search box */}
            <form
              action="/products"
              method="GET"
              className="w-full max-w-xl"
            >
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search products (e.g., BIS, EPR, WPC...)"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <input type="hidden" name="size" value={size} />
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Search
                  </button>
                </div>

                {/* quick chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {productServices.slice(0, 5).map((s) => (
                    <Link
                      key={s.id}
                      href={buildHref({ page: 1, size, filter: s.serviceName, q: "" })}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 hover:bg-slate-50 cursor-pointer"
                    >
                      {s.serviceName}
                    </Link>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left filter list (like categories list) */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Filters</p>

              <div className="mt-3 space-y-2">
                <Link
                  href={buildHref({ page: 1, size, filter: "", q: "" })}
                  className={`block rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                    !appliedFilter
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-slate-50"
                  }`}
                >
                  All Products
                </Link>

                {productServices.map((s) => {
                  const active = appliedFilter?.toLowerCase() === String(s.serviceName || "").toLowerCase();
                  return (
                    <Link
                      key={s.id}
                      href={buildHref({ page: 1, size, filter: s.serviceName, q: "" })}
                      className={`block rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                        active
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-semibold">{s.serviceName}</div>
                      <div className="text-xs text-gray-500">Filter products</div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl bg-blue-600 p-5 text-white">
                <p className="text-sm opacity-90">Need help?</p>
                <p className="mt-1 text-lg font-bold">Talk to an Expert</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 cursor-pointer"
                >
                  Contact us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Right grid */}
          <div className="lg:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {appliedFilter ? appliedFilter : "All Products"}
                </span>{" "}
                <span className="text-gray-400">({products.length})</span>
              </p>

              <Link
                href="/contact"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Talk to an expert
              </Link>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {p.title || p.name}
                      </h3>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        Popular
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      {clampText(p.summary, 160)}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {p.serviceName || "Corpseed"}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        Explore more →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* pagination */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={buildHref({ page: Math.max(1, currentPage - 1), size, filter, q })}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
              >
                Prev
              </Link>

              {pageNumbers.map((n) => {
                const active = Number(n) === Number(currentPage);
                return (
                  <Link
                    key={n}
                    href={buildHref({ page: n, size, filter, q })}
                    className={`rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                      active
                        ? "border-blue-200 bg-blue-600 text-white"
                        : "border-gray-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}

              <Link
                href={buildHref({ page: Math.min(totalPages, currentPage + 1), size, filter, q })}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
