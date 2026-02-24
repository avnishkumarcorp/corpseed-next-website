import Image from "next/image";

export default function LogoMarquee({
  items = [],
  imageBaseUrl = "",
  height = 46,
  itemWidth = 120,
  speed = 500, // 60s = slow and smooth
}) {
  const normalized = items.map((it, i) => {
    const raw =
      it?.imageURL || it?.imageUrl || it?.logoUrl || it?.image || "";

    const src = raw.startsWith("http")
      ? raw
      : `${imageBaseUrl.replace(/\/$/, "")}/${raw}`;

    return {
      key: it?.uuid || it?.id || i,
      name: it?.name || "Logo",
      src,
    };
  });

  const renderGroup = (suffix = "") =>
    normalized.map((item) => (
      <div
        key={`${item.key}${suffix}`}
        className="relative group flex-shrink-0 flex items-center justify-center overflow-visible"
        style={{ width: itemWidth }}
      >
        {/* Logo */}
        <Image
          src={item.src}
          alt={item.name}
          width={itemWidth}
          height={height}
          title={item.name} // native fallback
          className="h-[46px] w-auto object-contain opacity-80 group-hover:opacity-100 transition duration-300"
        />

        {/* Tooltip */}
        <div
          className="
            absolute -top-12 left-1/2 -translate-x-1/2
            bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md
            opacity-0 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0
            transition-all duration-200
            whitespace-nowrap
            pointer-events-none
            z-50
            shadow-lg
          "
        >
          {item.name}

          {/* Arrow */}
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>
    ));

  return (
    <div className="relative w-full bg-white py-4 overflow-hidden">
      {/* Gradient fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="overflow-hidden">
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: `${speed}s` }}
        >
          <div className="flex items-center gap-16">
            {renderGroup()}
          </div>
          <div className="flex items-center gap-16">
            {renderGroup("-dup")}
          </div>
        </div>
      </div>
    </div>
  );
}