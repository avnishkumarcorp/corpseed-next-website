import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ShieldCheck, FileText } from "lucide-react";
import { getLegalPageBySlug } from "@/app/lib/legalPages";
import SafeHtml from "@/app/components/SafeHtml";

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

function getPrettySlug(slug = "") {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function getIconBySlug(slug) {
  const s = (slug || "").toLowerCase();
  if (s.includes("privacy")) return ShieldCheck;
  return FileText;
}

function SideNav() {
  const links = [
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "terms-of-service", label: "Terms of Service" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "cookies-and-related-technology", label: "Cookies Policy" },
    { slug: "terms-of-use", label: "Terms of Use" },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">Legal</p>
        <p className="mt-1 text-xs text-slate-500">Important information</p>
      </div>

      <div className="divide-y divide-slate-200">
        {links.map((x) => (
          <Link
            key={x.slug}
            href={`/legal/${x.slug}`}
            className="flex items-center justify-between px-5 py-4 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span>{x.label}</span>
            <span className="text-xs text-slate-400">View</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/** ✅ SEO from API */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getLegalPageBySlug(slug);

  const title =
    data?.metaTitle ||
    data?.title ||
    data?.page?.title ||
    getPrettySlug(slug) ||
    "Legal | Corpseed";

  const description =
    data?.metaDescription ||
    "Read Corpseed legal policies including privacy policy, terms of use, refund policy and cookies policy.";

  return {
    title: `${title} | Corpseed`,
    description,
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalDynamicPage({ params }) {
  const { slug } = await params;
  const apiData = await getLegalPageBySlug(slug);

  if (!apiData?.page) return notFound();

  const page = apiData.page;

  const heading =
    safeText(page.heading) ||
    safeText(page.title) ||
    safeText(apiData.title) ||
    getPrettySlug(slug);

  const Icon = getIconBySlug(slug);

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-3">
            {/* breadcrumb */}
            <div className="text-sm text-slate-600">
              <Link href="/" className="hover:underline cursor-pointer">
                Home
              </Link>{" "}
              <span className="text-slate-400">/</span>{" "}
              <span className="text-slate-900">Legal</span>{" "}
              <span className="text-slate-400">/</span>{" "}
              <span className="text-slate-900">{heading}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <Icon className="h-5 w-5 text-slate-700" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {heading}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  {page.modifyDate || page.postDate ? (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Updated: {formatDate(page.modifyDate || page.postDate)}
                    </span>
                  ) : null}

                  {apiData?.metaDescription ? (
                    <span className="text-slate-500">•</span>
                  ) : null}

                  {apiData?.metaDescription ? (
                    <span className="line-clamp-1 max-w-3xl text-slate-600">
                      {apiData.metaDescription}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
          {/* Main */}
          <div className="lg:col-span-8">
            <Card className="overflow-hidden">
              <div className="p-5 sm:p-7">
                {/* ✅ HTML body (smaller + legal readable) */}
                <SafeHtml html={page.description} />

                {/* footer meta */}
                <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
                  {page.uuid ? <p>Document ID: {page.uuid}</p> : null}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <SideNav />

              <Card>
                <div className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Need help?
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    If you have questions related to these policies, please
                    contact our support team.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      Contact us
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                    >
                      Back to home
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
