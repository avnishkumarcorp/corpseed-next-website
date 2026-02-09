import { getSitemapMeta } from "../lib/sitemap";
import SearchSitemap from "./SearchSitemap";

function splitKeywords(metaKeywords) {
  if (!metaKeywords) return [];
  // supports both "a, b, c" and "a | b | c"
  return metaKeywords
    .split(/[,|]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function generateMetadata() {
  const data = await getSitemapMeta();

  const title = data?.title || "Sitemap | Corpseed";
  const description = data?.metaDescription || "Explore Corpseed pages and services";
  const keywords = data?.metaKeywords
    ? splitKeywords(data.metaKeywords)
    : undefined;

  return {
    title,
    description,
    keywords,
  };
}

export default async function SitemapPage() {
  const data = await getSitemapMeta();

  const title = data?.title || "Sitemap";
  const desc = data?.metaDescription || "Explore all pages and services on Corpseed";
  const keywords = splitKeywords(data?.metaKeywords);

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

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              <p className="max-w-3xl text-sm md:text-lg text-slate-600 leading-relaxed">
                {desc}
              </p>

              {/* Keywords chips (meta only) */}
              {keywords.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {keywords.slice(0, 12).map((k) => (
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

      {/* SEARCH (uses same endpoint as your Header) */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Find services instantly
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Search across services, knowledge centre, department updates and more —
                exactly like your header search.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Popular searches
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["EPR", "BIS", "IMEI", "Pollution NOC", "Factory License"].map((x) => (
                    <span
                      key={x}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200"
                    >
                      {x}
                    </span>
                  ))}
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
