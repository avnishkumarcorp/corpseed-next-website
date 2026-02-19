"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";
import SafeHtml from "../components/SafeHtml";
import EnquiryForm from "../components/enquiry-form/EnquiryForm";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-800">
      {children}
    </span>
  );
}

function CardShell({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
}

function ShareRow({ title }) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title || "");

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;

  return (
    <div className="flex items-center gap-3 text-slate-500">
      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-700 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-green-600 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M16.001 3C8.268 3 2 9.268 2 17.001c0 2.995.936 5.767 2.535 8.05L3 29l4.076-1.504A13.91 13.91 0 0 0 16.001 31C23.733 31 30 24.733 30 17.001 30 9.268 23.733 3 16.001 3zm0 25.2c-2.59 0-5.02-.79-7.06-2.15l-.505-.32-2.42.89.81-2.35-.33-.51A11.16 11.16 0 0 1 4.8 17c0-6.17 5.03-11.2 11.2-11.2S27.2 10.83 27.2 17 22.17 28.2 16.001 28.2zm6.15-8.42c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.53-.17-.75.17s-.86 1.1-1.05 1.33c-.19.23-.38.26-.71.09-.34-.17-1.42-.52-2.7-1.66-.99-.88-1.66-1.97-1.85-2.31-.19-.34-.02-.52.15-.69.15-.15.34-.38.51-.57.17-.19.23-.32.34-.53.12-.23.06-.43-.03-.6-.09-.17-.75-1.82-1.03-2.5-.27-.66-.54-.57-.75-.58-.19-.01-.41-.01-.63-.01-.23 0-.6.09-.91.43-.31.34-1.19 1.16-1.19 2.83 0 1.66 1.22 3.27 1.39 3.5.17.23 2.4 3.66 5.82 5.13.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.66-.1 2.01-.82 2.29-1.62.28-.79.28-1.47.19-1.62-.09-.14-.31-.23-.66-.4z" />
        </svg>
      </a>

      {/* Email */}
      <a
        href={mailUrl}
        className="hover:text-slate-900 transition-colors"
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </a>
    </div>
  );
}

function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildQS({ page, size }) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("size", String(size));
  return `?${qs.toString()}`;
}

export default function PressListClient({ apiData, page, size }) {
  const router = useRouter();

  const pressList = apiData?.pressList || [];
  const topCategories = apiData?.topCategories || [];
  const topPress = apiData?.topPress || [];

  const currentPage = apiData?.currentPage ?? page;
  const totalPages = apiData?.totalPages ?? 1;

  // ✅ client-side search only (no URL)
  const [q, setQ] = useState("");

  const filteredPress = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return pressList;

    return pressList.filter((x) => {
      const title = (x?.title || "").toLowerCase();
      const meta = (x?.metaDescription || "").toLowerCase();
      const body = stripHtml(x?.shortDescription || "").toLowerCase();
      return (
        title.includes(query) || meta.includes(query) || body.includes(query)
      );
    });
  }, [pressList, q]);

  const goToPage = (nextPage) => {
    const safe = Math.min(Math.max(nextPage, 1), totalPages || 1);
    router.push(`/press-release${buildQS({ page: safe, size })}`);
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <section className="py-10 md:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
        {/* LEFT: LIST */}
        <div className="lg:col-span-8 space-y-6">
          {/* ✅ visibility: small header row */}
          {/* <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">
              Showing{" "}
              <span className="text-slate-900">{filteredPress.length}</span>{" "}
              results
              {q.trim() ? (
                <>
                  {" "}
                  for <span className="text-blue-700">“{q.trim()}”</span>
                </>
              ) : null}
            </p>

            {q.trim() ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Clear search
              </button>
            ) : null}
          </div> */}

          {filteredPress.length === 0 ? (
            <CardShell>
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  No press releases found.
                </p>
              </div>
            </CardShell>
          ) : (
            <>
              {filteredPress.map((x) => {
                const href = `/press-release/${x.slug}`;
                const excerpt = x?.metaDescription?.trim()
                  ? x.metaDescription.trim()
                  : (() => {
                      const clean = <SafeHtml html={x.shortDescription} />;
                      return clean.length > 260
                        ? clean.slice(0, 260) + "..."
                        : clean;
                    })();

                return (
                  <CardShell key={x.id}>
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Badge>PRESS RELEASE</Badge>

                        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span>{x.postDate || ""}</span>
                        </div>
                      </div>

                      <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        <Link
                          href={href}
                          className="hover:underline cursor-pointer"
                        >
                          {x.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                        {excerpt}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 cursor-pointer"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>

                        <ShareRow />
                      </div>
                    </div>
                  </CardShell>
                );
              })}

              {/* ✅ Pagination below cards (API hit only here) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-sm text-slate-600">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={prevDisabled}
                    className={`rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 cursor-pointer ${
                      prevDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={nextDisabled}
                    className={`rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 cursor-pointer ${
                      nextDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          {/* ✅ Search (client-only, NO URL change) */}
          <CardShell>
            <div className="p-5">
              <p className="text-sm font-bold text-slate-900">Search</p>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Search title / description..."
                  aria-label="Search press release"
                />
                <button
                  type="button"
                  onClick={() => {
                    // nothing else needed; search is already reactive
                    // keep button only for UI
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Search
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Search works on the current page results only.
              </p>
            </div>
          </CardShell>

          {/* Categories */}
          <CardShell>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-700" />
                <p className="text-sm font-bold text-slate-900">Categories</p>
              </div>

              <div className="mt-4 space-y-2">
                {topCategories.length === 0 ? (
                  <p className="text-sm text-slate-600">No categories</p>
                ) : (
                  topCategories.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      <span className="font-semibold text-slate-800">
                        {c.name}
                      </span>
                      {c.visited != null ? (
                        <span className="text-slate-500">{c.visited}</span>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardShell>

          {/* Top press */}
          <CardShell>
            <div className="p-5">
              <p className="text-sm font-bold text-slate-900">
                Top Press-Release
              </p>

              <div className="mt-4 space-y-4">
                {topPress.length === 0 ? (
                  <p className="text-sm text-slate-600">No top press</p>
                ) : (
                  topPress.map((p) => (
                    <Link
                      key={p.id}
                      href={`/press-release/${p.slug}`}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 cursor-pointer"
                    >
                      {/* ✅ prevent shrink */}
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover" // use object-contain if you don't want crop
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Read article
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </CardShell>

          {/* Schedule callback (static UI) */}
          {/* <CardShell>
            <div className="p-5">
              <p className="text-lg font-extrabold text-slate-900">
                Schedule a call back
              </p>

              <form className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <input
                    className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Name*"
                    aria-label="Name"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <input
                    className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Phone Number*"
                    aria-label="Phone"
                  />
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-slate-500" />
                  <textarea
                    className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Message (optional)"
                    aria-label="Message"
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Submit
                </button>

                <p className="text-xs text-slate-500">
                  By submitting, you agree to be contacted by Corpseed.
                </p>
              </form>
            </div>
          </CardShell> */}
          <EnquiryForm />
        </aside>
      </div>
    </section>
  );
}
