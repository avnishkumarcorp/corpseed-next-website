// app/sitemap/page.jsx
import { getSitemapMeta } from "../lib/sitemapApi";
import SearchSitemap from "./SearchSitemap";

function splitKeywords(metaKeywords) {
  if (!metaKeywords) return [];
  return String(metaKeywords)
    .split(/[,|]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function safeText(v) {
  return (v ?? "").toString();
}

function uniq(arr = []) {
  return Array.from(new Set(arr.filter(Boolean)));
}

// ✅ Optional: build absolute canonical (helps SEO)
function getSiteUrl() {
  const v =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.corpseed.com";
  return v.replace(/\/$/, "");
}

export async function generateMetadata() {
  const data = await getSitemapMeta();

  const title = data?.title || "Sitemap | Corpseed";
  const description =
    data?.metaDescription || "Explore Corpseed pages and services";

  const keywordsArr = data?.metaKeywords
    ? uniq(splitKeywords(data.metaKeywords))
    : [];

  const canonical = `${getSiteUrl()}/sitemap`;

  return {
    title,
    description,
    // Next accepts string OR string[]
    keywords: keywordsArr.length ? keywordsArr : undefined,

    alternates: {
      canonical,
    },

    // ✅ nice share preview (optional but good)
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function SitemapPage() {
  const data = await getSitemapMeta();

  const title = safeText(data?.title) || "Sitemap";
  const desc =
    safeText(data?.metaDescription) ||
    "Explore all pages and services on Corpseed";

  const keywords = uniq(splitKeywords(data?.metaKeywords)).slice(0, 12);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
            <div className="flex flex-col gap-3">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                Corpseed <span className="opacity-60">•</span> Sitemap
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {title}
              </h1>

              <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-lg">
                {desc}
              </p>

              {/* Keywords chips */}
              {keywords.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Find services instantly
              </h2>

              <p className="mt-3 leading-relaxed text-slate-600">
                Search across services, knowledge centre, department updates and
                more — exactly like your header search.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Popular searches
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "EPR",
                    "BIS",
                    "IMEI",
                    "Pollution NOC",
                    "Factory License",
                  ].map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {x}
                    </span>
                  ))}
                </div>

                {/* ✅ small helpful links */}
                <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                  <a
                    href="/sitemap.xml"
                    className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600 cursor-pointer"
                  >
                    View sitemap.xml
                  </a>
                  <span className="text-slate-400">•</span>
                  <a
                    href="/"
                    className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600 cursor-pointer"
                  >
                    Go to Home
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SearchSitemap />
          </div>
        </div>
      </section>
    </main>
  );
}
