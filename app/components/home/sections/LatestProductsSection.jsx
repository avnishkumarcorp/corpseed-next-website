import Image from "next/image";
import Link from "next/link";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

/** Audit #12 — a curated shelf, not the whole catalogue. */
const MAX_FEATURED = 10;

export default function LatestProductsSection({ data = [] }) {
  const all = (Array.isArray(data) ? data : []).filter(Boolean);
  const items = all.slice(0, MAX_FEATURED);
  const hiddenCount = Math.max(0, all.length - items.length);

  if (!items.length) return null;

  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-section-head cs-section-head--split cs-reveal">
          <div>
            <span className="cs-eyebrow">Product certification</span>
            <h2 className="cs-section-title">Featured product approvals</h2>
            <p className="cs-section-sub">
              BIS, ISI and mandatory certifications for the products businesses
              register with us most often.
            </p>
          </div>

          <Link href="/product" className="cs-btn cs-btn--secondary shrink-0">
            {hiddenCount
              ? `View all products (${all.length})`
              : "View all products"}
            <span className="cs-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* Horizontal on mobile, grid on desktop — no auto-scroll to fight */}
        <ul className="cs-scroll-x mt-8 gap-4 pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-5">
          {items.map((product) => (
            <li
              key={product?.id || product?.slug}
              className="w-[68vw] shrink-0 sm:w-[240px] md:w-auto"
            >
              <ProductCard item={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const href = `/product/${item?.slug || ""}`;
  const imgUrl = toImgUrl(item?.image);

  return (
    <article className="cs-card cs-card--hover group h-full overflow-hidden">
      <div className="relative h-[140px] w-full bg-gradient-to-b from-slate-50 to-white">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={item?.name || "Product"}
            fill
            sizes="(max-width: 768px) 68vw, 240px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        {item?.serviceName ? (
          <span className="cs-badge cs-badge--brand mb-2 self-start max-w-full truncate">
            {item.serviceName}
          </span>
        ) : null}

        <h3 className="text-[14.5px] font-semibold leading-snug text-slate-900 cs-clamp-2 transition-colors group-hover:text-blue-700">
          <Link href={href} className="after:absolute after:inset-0">
            {item?.name}
          </Link>
        </h3>

        <span className="cs-link-arrow mt-auto pt-3 !text-[12.5px]">
          Check requirements
          <span className="cs-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </article>
  );
}
