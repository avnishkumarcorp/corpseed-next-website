import Image from "next/image";
import Link from "next/link";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

function clampText(text, n = 240) {
  const t = String(text || "").trim();
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
}

/**
 * Audit #10 — one featured story with real editorial weight, a short list of
 * the rest, and a single "View all news" action. Reads as credibility
 * content rather than another card grid.
 */
export default function NewsSection({ data }) {
  const slides = (Array.isArray(data) ? data : []).filter(Boolean);

  if (!slides.length) return null;

  const [lead, ...rest] = slides;
  const others = rest.slice(0, 3);

  return (
    <section className="w-full bg-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-section-head cs-section-head--split cs-reveal">
          <div>
            <span className="cs-eyebrow">In the news</span>
            <h2 className="cs-section-title">Corpseed in the press</h2>
            <p className="cs-section-sub">
              Coverage of our work on regulatory reform, sustainability and
              India&apos;s compliance landscape.
            </p>
          </div>

          <Link href="/press-release" className="cs-btn cs-btn--secondary shrink-0">
            View all news
            <span className="cs-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          <FeaturedStory slide={lead} />

          {others.length ? (
            <ul className="cs-reveal flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/60">
              {others.map((slide) => (
                <li key={slide?.id || slide?.slug}>
                  <Link
                    href={`/press-release/${slide?.slug || ""}`}
                    className="group flex flex-col gap-1.5 p-5 transition hover:bg-white"
                  >
                    <span className="cs-badge cs-badge--neutral self-start">
                      Press release
                    </span>

                    <span className="text-[14.5px] font-semibold leading-snug text-slate-900 cs-clamp-3 transition-colors group-hover:text-blue-700">
                      {slide?.title}
                    </span>

                    {slide?.postDate ? (
                      <span className="text-[12.5px] text-slate-500">
                        {slide.postDate}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FeaturedStory({ slide }) {
  if (!slide) return null;

  const href = `/press-release/${slide?.slug || ""}`;
  const imgUrl = toImgUrl(slide?.image);

  return (
    <article className="cs-card cs-card--hover cs-reveal group overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[220px] overflow-hidden bg-slate-100 md:min-h-[300px]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={slide?.title || "Press coverage"}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
          )}
        </div>

        <div className="flex flex-col justify-center gap-3 bg-blue-50/60 p-6 sm:p-7">
          <span className="cs-badge cs-badge--brand self-start">
            Featured story
          </span>

          <h3 className="text-[1.1875rem] font-bold leading-snug tracking-tight text-slate-900 cs-clamp-3 transition-colors group-hover:text-blue-700 sm:text-[1.3125rem]">
            <Link href={href} className="after:absolute after:inset-0">
              {slide?.title}
            </Link>
          </h3>

          {slide?.summary ? (
            <p className="border-l-[3px] border-amber-400 pl-4 text-[14px] leading-[1.75] text-slate-700 cs-clamp-4">
              {clampText(slide.summary, 260)}
            </p>
          ) : null}

          {slide?.postDate ? (
            <span className="text-[12.5px] text-slate-500">
              {slide.postDate}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
