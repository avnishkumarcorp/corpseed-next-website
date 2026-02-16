// app/law-updates/[slug]/page.jsx
import SafeHtml from "@/app/components/SafeHtml";
import { getLawUpdateBySlug } from "@/app/lib/lawUpdates";

import Link from "next/link";

// --- helper: split iframe from summary html (server-safe regex) ---
function splitSummaryAndIframe(html = "") {
  const iframeRegex = /<iframe[\s\S]*?<\/iframe>/i;
  const match = html.match(iframeRegex);

  if (!match) return { summaryHtml: html, iframeHtml: "" };

  const iframeHtml = match[0];
  const summaryHtml = html.replace(iframeRegex, "").trim();
  return { summaryHtml, iframeHtml };
}

export async function generateMetadata({ params }) {
  const { slug } =await params;
  const data = await getLawUpdateBySlug(slug);

  const title = data?.title || data?.lawUpdate?.title || "Law Update | Corpseed";
  const description =
    data?.metaDescription ||
    "Latest law update details, compliance summary and reference document.";
  const keywords = data?.metaKeyword || "";

  return {
    title,
    description,
    keywords,
  };
}

export default async function LawUpdateDetailPage({ params }) {
  const { slug } =await params;

  const data = await getLawUpdateBySlug(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Detail API not found
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Backend endpoint is not returning slug data.
            </p>

            <Link
              href="/law-updates"
              className="mt-4 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              ← Back to list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // your response shape: { title, metaDescription, metaKeyword, lawUpdate: {...} }
  const item = data?.lawUpdate || data;

  const { summaryHtml, iframeHtml } = splitSummaryAndIframe(item?.summary || "");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/law-updates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Law Updates
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {item?.refrenceSlug ? (
                <>
                  <a
                    href={item.refrenceSlug}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Open PDF
                  </a>

                  <a
                    href={item.refrenceSlug}
                    download
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Download
                  </a>
                </>
              ) : null}

              <a
                href={`/law-updates/${item?.slug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Copy Link
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Title card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Law Update
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {item?.title}
              </h1>

              {/* meta pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {item?.department ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Department: {item.department}
                  </span>
                ) : null}

                {item?.authority ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Authority: {item.authority}
                  </span>
                ) : null}

                {item?.publishDate ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Publish: {item.publishDate}
                  </span>
                ) : null}

                {item?.applicableDate ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Applicable: {item.applicableDate}
                  </span>
                ) : null}

                {item?.categoryName ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.categoryName}
                  </span>
                ) : null}

                {item?.subCategoryName ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.subCategoryName}
                  </span>
                ) : null}
              </div>

              {/* small highlight */}
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Quick note
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Below is the official summary and the reference document preview.
                  Use “Open PDF” for full screen view.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Summary
                </h2>
              </div>

              <div className="mt-4">
                {/* ✅ sanitized HTML but WITHOUT iframe */}
                <SafeHtml html={summaryHtml || "<p>No summary available.</p>"} />
              </div>
            </div>
          </div>

          {/* Right sticky panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* PDF Preview */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Document Preview
                    </p>
                    <p className="text-xs text-slate-600">
                      Embedded reference document
                    </p>
                  </div>

                  {item?.refrenceSlug ? (
                    <a
                      href={item.refrenceSlug}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                    >
                      Fullscreen ↗
                    </a>
                  ) : null}
                </div>

                {/* iframe container (nice & consistent) */}
                <div className="p-3">
                  {iframeHtml ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                      <div
                        className="w-full"
                        style={{ height: 520 }}
                        // iframe comes from backend; SafeHtml already sanitizes, but here we keep only iframe block
                        dangerouslySetInnerHTML={{ __html: iframeHtml }}
                      />
                    </div>
                  ) : item?.refrenceSlug ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Preview not available
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Use “Open PDF” to view the document.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        No reference file
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        This update doesn’t include a reference PDF.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Related
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Explore more updates from the same department.
                </p>

                <div className="mt-4">
                  <Link
                    href={`/law-updates?dept=${encodeURIComponent(item?.department || "")}&page=1&size=6`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    View more from {item?.department || "this department"}
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
