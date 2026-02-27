// app/products/ProductsCatalogue.jsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

import ProductsControls from "./ProductsControls";
import TalkToExpertCard from "../service/TalkToExpertCard";

// ✅ Lazy-load modal JS (loads only when user opens)
const ConsultNowModal = dynamic(() => import("../components/ConsultNowModal"), {
  ssr: false,
});

function clampText(text, n = 140) {
  const t = String(text || "").trim();
  return t.length > n ? t.slice(0, n).trim() + "..." : t;
}

function buildHref({ page, size, filter, q }) {
  const sp = new URLSearchParams();
  if (page) sp.set("page", String(page));
  if (size) sp.set("size", String(size));

  // ✅ keep your existing rule: q wins over filter
  if ((q || "").trim()) sp.set("q", String(q).trim());
  else if ((filter || "").trim()) sp.set("filter", String(filter).trim());

  return `/product?${sp.toString()}`;
}

// ✅ safe image url (handles absolute + relative)
function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

// ✅ Memoized card so modal open/close doesn't rerender all cards
const ProductCard = React.memo(function ProductCard({ p, idx }) {
  const imgUrl = toImgUrl(p?.image || p?.img || p?.thumbnail);
  const href = `/product/${p?.slug || ""}`;

  return (
    <Link
      href={href}
      // ✅ prefetch only first few to reduce bandwidth
      prefetch={idx < 6}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[170px] w-full bg-slate-50">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={p?.title || p?.name || "Product"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            // ✅ only above-fold images priority
            priority={idx < 2}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {p?.title || p?.name}
          </h3>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
            Popular
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {clampText(p?.summary, 160)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {p?.serviceName || "Corpseed"}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            Explore more →
          </span>
        </div>
      </div>
    </Link>
  );
});

export default function ProductsCatalogue({ data, page, size, filter, q }) {
  const [consultOpen, setConsultOpen] = useState(false);

  const products = data?.products || [];
  const productServices = data?.productServices || [];
  const currentPage = data?.currentPage || page || 1;
  const totalPages = data?.totalPages || 1;
  const pageNumbers = data?.pageNumbers || [];

  // ✅ URL state
  const appliedFilter = (q || filter || "").trim();

  // ✅ For ProductsControls initialFilter
  const initialFilter = useMemo(() => (q || filter || "").trim(), [q, filter]);

  // ✅ IMPORTANT: backend does NOT text-search. We do client-side filtering for q.
  const normalizedQ = String(q || "")
    .trim()
    .toLowerCase();

  const visibleProducts = useMemo(() => {
    if (!normalizedQ) return products;

    return products.filter((p) => {
      const haystack = `
        ${p?.title || ""}
        ${p?.name || ""}
        ${p?.summary || ""}
        ${p?.serviceName || ""}
      `.toLowerCase();

      return haystack.includes(normalizedQ);
    });
  }, [products, normalizedQ]);

  return (
    <>
      <main className="bg-white">
        {/* Top section */}
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
            </div>

            {/* Controls */}
            <div className="mt-6">
              <ProductsControls
                initialFilter={initialFilter}
                services={productServices}
                size={size}
              />
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left filters */}
            <aside className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="sticky top-24">
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
                      const name = String(s?.serviceName || "");
                      const slug = String(s?.slug || "");
                      const active =
                        appliedFilter?.toLowerCase() === name.toLowerCase();

                      return (
                        <Link
                          key={s.id}
                          href={buildHref({
                            page: 1,
                            size,
                            filter: slug,
                            q: "",
                          })}
                          className={`block rounded-xl border px-3 py-2 text-sm cursor-pointer text-[#212529] ${
                            active
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-semibold">{name}</div>
                          <div className="text-xs text-gray-500">
                            Filter products
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <div className="mt-4">
                    <TalkToExpertCard onClick={() => setConsultOpen(true)} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setConsultOpen(true)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-slate-50 cursor-pointer"
                  >
                    Talk to an expert <ArrowRight className="h-4 w-4" />
                  </button>
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
                  <span className="text-gray-400">
                    ({visibleProducts.length})
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() => setConsultOpen(true)}
                  className="rounded-xl border border-gray-200 bg-white !text-[#212529] px-4 py-2 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Talk to an expert
                </button>
              </div>

              {/* cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((p, idx) => (
                  <ProductCard key={p?.id || p?.slug || idx} p={p} idx={idx} />
                ))}
              </div>

              {/* no results */}
              {normalizedQ && !visibleProducts.length ? (
                <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-base font-semibold text-gray-900">
                    No products found for “{q}”
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Try keywords like <b>BIS</b>, <b>EPR</b>, <b>Battery</b>,{" "}
                    <b>Television</b>.
                  </p>
                </div>
              ) : null}

              {/* pagination */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href={buildHref({
                    page: Math.max(1, currentPage - 1),
                    size,
                    filter,
                    q,
                  })}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm !text-[#212529] hover:bg-slate-50 cursor-pointer"
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
                          : "border-gray-200 bg-white hover:bg-slate-50 !text-[#212529]"
                      }`}
                    >
                      {n}
                    </Link>
                  );
                })}

                <Link
                  href={buildHref({
                    page: Math.min(totalPages, currentPage + 1),
                    size,
                    filter,
                    q,
                  })}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm !text-[#212529] hover:bg-slate-50 cursor-pointer"
                >
                  Next
                </Link>
              </div>

              {/* note */}
              {normalizedQ ? (
                <p className="mt-3 text-center text-[12px] text-gray-500">
                  Note: search results are refined on the client because the API
                  uses <b>filter</b> and may return broad matches.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <ConsultNowModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        title="Consult Now"
        bookMeeting={true}
        page={"product"}
      />
    </>
  );
}
