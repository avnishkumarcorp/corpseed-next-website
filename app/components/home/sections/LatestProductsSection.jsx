import Image from "next/image";
import Link from "next/link";

function toImgUrl(image) {
  const img = String(image || "").trim();
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/${img}`;
}

export default function LatestProductsSection({ data = [] }) {
  const items = Array.isArray(data) ? data : [];
  const loopItems = [...items, ...items]; // duplicate for infinite loop

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-3 py-1.5 text-[14px] font-semibold text-white">
            Latest
          </span>
          <h2 className="text-[26px] font-semibold text-slate-900 !m-0">
            Products
          </h2>
        </div>

        <div className="relative mt-6 overflow-hidden group py-1.5">
          <div className="flex gap-4 animate-products-scroll group-hover:[animation-play-state:paused]">
            {loopItems.map((p, i) => (
              <div
                key={`${p?.id || p?.slug}-${i}`}
                className="
                  shrink-0
                  w-[85%]
                  sm:w-[48%]
                  md:w-[32%]
                  lg:w-[19%]
                "
              >
                <ProductCard item={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item }) {
  const href = `/product/${item?.slug || ""}`;
  const imgUrl = toImgUrl(item?.image);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-[150px] w-full bg-gradient-to-b from-slate-50 to-white">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={item?.name || "Product"}
            fill
            className="object-contain p-5"
          />
        )}
      </div>

      <div className="px-5 pt-4 pb-4">
        {item?.serviceName && (
          <div className="mb-2">
            <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 truncate max-w-full">
              {item.serviceName}
            </span>
          </div>
        )}

        <h3 className="text-[15px] font-semibold leading-6 text-slate-900 line-clamp-2">
          {item?.name}
        </h3>
      </div>
    </Link>
  );
}
