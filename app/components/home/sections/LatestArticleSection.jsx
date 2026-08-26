import Image from "next/image";
import Link from "next/link";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

/** Rough but honest reading time from whatever body text the API gives us. */
function readingTime(article) {
  const text = [article?.summary, article?.description, article?.content]
    .filter(Boolean)
    .join(" ");

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;

  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function ArticleMeta({ article, tone = "light" }) {
  const time = readingTime(article);
  const date = String(article?.postDate || "").trim();
  const muted = tone === "dark" ? "text-slate-300" : "text-slate-500";

  if (!date && !time) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] ${muted}`}>
      {date ? <span>{date}</span> : null}
      {date && time ? <span aria-hidden="true">·</span> : null}
      {time ? <span>{time}</span> : null}
    </div>
  );
}

/**
 * Audit #11 — one lead story carries the section, the rest read as a tidy
 * secondary list instead of five identically-weighted cards.
 */
export default function LatestArticlesSection({ data = [] }) {
  const items = (Array.isArray(data) ? data : []).filter(Boolean);

  const [lead, ...rest] = items;
  const secondary = rest.slice(0, 4);

  return (
    <section className="w-full bg-slate-50">
      <div className="cs-container cs-section--tight">
        <div className="cs-section-head cs-section-head--split cs-reveal">
          <div>
            <span className="cs-eyebrow">Knowledge centre</span>
            <h2 className="cs-section-title">Latest compliance insights</h2>
            <p className="cs-section-sub">
              Rule changes, deadlines and practical guides — written by the
              experts who file these applications every day.
            </p>
          </div>

          <Link
            href="/knowledge-centre"
            className="cs-btn cs-btn--secondary shrink-0"
          >
            Read all articles
            <span className="cs-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {!items.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-[14px] text-slate-600">
            New articles are on the way.{" "}
            <Link
              href="/knowledge-centre"
              className="font-semibold text-blue-700 underline"
            >
              Visit the knowledge centre
            </Link>
            .
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <FeaturedArticle article={lead} />

            <ul className="flex flex-col gap-4">
              {secondary.map((article) => (
                <li key={article?.slug || article?.id}>
                  <CompactArticle article={article} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedArticle({ article }) {
  if (!article) return null;

  const href = `/knowledge-centre/${article?.slug || ""}`;
  const imgUrl = toImgUrl(article?.image);

  return (
    <article className="cs-card cs-card--hover cs-reveal group overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={article?.title || "Featured article"}
            fill
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
        )}

        <span className="cs-badge cs-badge--accent absolute left-4 top-4 shadow-sm">
          Featured
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <ArticleMeta article={article} />

        <h3 className="mt-2.5 text-[1.25rem] font-bold leading-snug tracking-tight text-slate-900 cs-clamp-3 transition-colors group-hover:text-blue-700">
          <Link href={href} className="after:absolute after:inset-0">
            {article?.title}
          </Link>
        </h3>

        {article?.summary ? (
          <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600 cs-clamp-3">
            {article.summary}
          </p>
        ) : null}

        <span className="cs-link-arrow mt-5 !text-[13.5px]">
          Read the guide
          <span className="cs-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </article>
  );
}

function CompactArticle({ article }) {
  const href = `/knowledge-centre/${article?.slug || ""}`;
  const imgUrl = toImgUrl(article?.image);

  return (
    <div className="cs-card cs-card--hover group !flex-row items-stretch gap-4 overflow-hidden p-3 sm:p-4">
      <div className="relative h-[84px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-[92px] sm:w-[124px]">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt=""
            fill
            sizes="124px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <ArticleMeta article={article} />

        <h3 className="mt-1.5 text-[14.5px] font-semibold leading-snug text-slate-900 cs-clamp-3 transition-colors group-hover:text-blue-700">
          <Link href={href} className="after:absolute after:inset-0">
            {article?.title}
          </Link>
        </h3>
      </div>
    </div>
  );
}
