// app/products/[slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProductBySlug } from "@/app/lib/products";
import FeedbackBox from "@/app/components/FeedbackBox";

// your component (client) to render HTML safely
const SafeHtmlShadow = dynamic(() => import("@/app/components/SafeHtmlShadow"));

// your existing enquiry form (client component)
const EnquiryForm = dynamic(
  () => import("@/app/components/enquiry-form/EnquiryForm"),
);

// marker present in your description
const FORM_MARKER = "--------------Blog Contact Form-------------";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  const title = data?.title || data?.product?.title || "Product - Corpseed";
  const description =
    data?.metaDescription ||
    data?.product?.summary ||
    "Corpseed product details.";

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.corpseed.com/products/${slug}`,
      siteName: "CORPSEED ITES PRIVATE LIMITED",
      type: "article",
      images: data?.product?.image ? [{ url: data.product.image }] : [],
    },
  };
}

function splitByFormMarker(html) {
  const raw = String(html || "");
  if (!raw) return { before: "", after: "" };

  // if marker not present, return all as before
  if (!raw.includes(FORM_MARKER)) return { before: raw, after: "" };

  const parts = raw.split(FORM_MARKER);
  return {
    before: parts[0] || "",
    after: parts.slice(1).join(FORM_MARKER) || "",
  };
}

function SideSection({ badge, title, items, type }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-slate-50 px-4 py-3">
        <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>

      <div className="divide-y divide-gray-200">
        {items?.map((it) => {
          const href =
            type === "product"
              ? `/products/${it.slug}`
              : `/knowledge-centre/${it.slug}`;

          return (
            <Link
              key={it.slug}
              href={href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 line-clamp-2">
                  {it.title || it.name}
                </p>
                {it.postDate ? (
                  <p className="mt-1 text-xs text-gray-500">{it.postDate}</p>
                ) : null}
              </div>

              {it.image ? (
                <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <Image
                    src={it.image}
                    alt={it.title || it.name || "item"}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function ProductSlugPage({ params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data?.product) return null;

  const product = data.product;

  const { before, after } = splitByFormMarker(product?.description);

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {product?.title || product?.name}
            </h1>

            {/* meta line */}
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {product?.serviceName ? (
                <span>
                  <span className="font-semibold text-gray-800">Service:</span>{" "}
                  <Link
                    href={`/service/${product.serviceSlug || ""}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {product.serviceName}
                  </Link>
                </span>
              ) : null}

              {product?.categoryName ? (
                <span>
                  <span className="font-semibold text-gray-800">Category:</span>{" "}
                  {product.categoryName}
                </span>
              ) : null}

              {product?.postDate ? (
                <span>
                  <span className="font-semibold text-gray-800">
                    Post Date:
                  </span>{" "}
                  {product.postDate}
                </span>
              ) : null}
            </div>

            {/* HTML Content (before marker) */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <SafeHtmlShadow html={before} />
            </div>

            {/* Replace legacy form marker with your EnquiryForm */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-slate-50 p-5">
              <div className="mb-3">
                <p className="text-lg font-bold text-gray-900 text-center">
                  BOOK A FREE CONSULTATION
                </p>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Get help from our experts. It’s absolutely FREE.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
                <EnquiryForm serviceName={product?.title || product?.name} />
              </div>
            </div>

            {/* if anything remains after marker */}
            {/* {after?.trim() ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <SafeHtmlShadow html={after} />
              </div>
            ) : null} */}
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-[88px] space-y-6">
              <SideSection
                badge="Top"
                title="Products"
                items={data?.topProducts || []}
                type="product"
              />

              <SideSection
                badge="Top"
                title="Articles"
                items={data?.topBlogs || []}
                type="blog"
              />

              <SideSection
                badge="Latest"
                title="Articles"
                items={data?.latestBlogs || []}
                type="blog"
              />

              <FeedbackBox type="product" location={slug} className="mt-10" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
