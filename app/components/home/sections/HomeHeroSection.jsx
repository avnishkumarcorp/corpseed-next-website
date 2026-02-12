"use client";
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Star } from "lucide-react";

// icons
import industryImg from "../../../../public/home/Industry_Setup_Solutions_Image-02.png";
import sustainabilityImg from "../../../../public/home/Sustainability-02.png";
import regulatoryImg from "../../../../public/home/Regulatory_Compliance_Image-02.png";
import environmentalImg from "../../../../public/home/Sustainability-02.png";
import importExportImg from "../../../../public/home/Import_Export_Image-02.png";
import productComplianceImg from "../../../../public/home/Product_Compliance-02.png";

// center mock images (your uploaded ones)
import envBgLeft from "../../../../public/home/Environmental1_Image-03.png";
import envBgMid from "../../../../public/home/Environmental_main_image-03.png";
import envBgRight from "../../../../public/home/Environmental2_Image-03-03.png";
import React from "react";

const DEFAULT_ITEMS = [
  {
    key: "industry",
    title: "Industry Setup Solution",
    desc: "Bio-fuels / Medical / Electronics\nWaste Management / Renewable",
    href: "/service/industry-setup-solution",
    img: industryImg,
    pos: "topLeft",
  },
  {
    key: "sustainability",
    title: "Sustainability",
    desc: "ESG / ESDD / ESMS / Net Zero\nWaste Channelization / Carbon Credits",
    href: "/service/sustainability",
    img: sustainabilityImg,
    pos: "topRight",
  },
  {
    key: "regulatory",
    title: "Regulatory\nCompliance",
    desc: "Factory / Fire / Trade\nFSSAI / CGWA / Labour\n& Other Compliance",
    href: "/service/regulatory-compliance",
    img: regulatoryImg || sustainabilityImg,
    pos: "midLeft",
  },
  {
    key: "environmental",
    title: "Environmental",
    desc: "EPR / EIA / CTO / CTE\nEC / BWM / PWM / EWM\nHWM / FSC / Wildlife",
    href: "/service/environmental",
    img: environmentalImg,
    featured: true,
    pos: "midCenter",
  },
  {
    key: "importexport",
    title: "Import Export",
    desc: "IEC / DGFT / CHA\nCDSCO / BIS / LMPC\nEPR / Custom Clearance",
    href: "/service/import-export",
    img: importExportImg || sustainabilityImg,
    pos: "midRight",
  },
  {
    key: "product",
    title: "Product Compliance",
    desc: "ISI / BIS / ISO / BEE / FDA / Meity\nCDSCO / TEC / WPC / OSP / etc.",
    href: "/service/product-compliance",
    img: productComplianceImg || sustainabilityImg,
    pos: "bottomCenter",
  },
];

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useTypewriterPlaceholders(items, delay = 1800) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!items?.length) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), delay);
    return () => clearInterval(t);
  }, [items, delay]);
  return items?.[idx] || "";
}

const GRID_KEYS_ORDER = [
  "Services",
  "Product Based Services",
  "Knowledge Center",
  "Knowledge Centre",
  "Department Updates",
  "Compliance Updates",
  "Industries",
];

function normalizeGroups(apiData) {
  if (!apiData || typeof apiData !== "object") return [];
  const entries = Object.entries(apiData).map(([k, v]) => [
    k,
    Array.isArray(v) ? v : [],
  ]);

  const known = [];
  const unknown = [];

  for (const [k, arr] of entries) {
    if (!arr.length) continue;
    if (GRID_KEYS_ORDER.includes(k)) known.push([k, arr]);
    else unknown.push([k, arr]);
  }

  known.sort(
    (a, b) => GRID_KEYS_ORDER.indexOf(a[0]) - GRID_KEYS_ORDER.indexOf(b[0]),
  );
  unknown.sort((a, b) => a[0].localeCompare(b[0]));
  return [...known, ...unknown];
}

function ensureInternalHref(url) {
  // API sometimes returns absolute corpseed url
  if (!url) return "#";
  try {
    const u = new URL(url, "https://www.corpseed.com");
    // Keep same path+query+hash
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return url;
  }
}

function HeroSearch({
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  placeholders = [
    "Try “EPR Plastic”…",
    "Try “IMEI”…",
    "Try “BIS Registration”…",
    "Try “Pollution NOC”…",
  ],
}) {
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const abortRef = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 250);

  const [loading, setLoading] = React.useState(false);
  const [apiData, setApiData] = React.useState(null);
  const [err, setErr] = React.useState("");

  const placeholder = useTypewriterPlaceholders(placeholders, 1600);

  // close on outside click / esc
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onMouse = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouse);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouse);
    };
  }, [open]);

  // fetch
  React.useEffect(() => {
    if (!open) return;

    const query = dq.trim();
    if (!query) {
      setApiData(null);
      setErr("");
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `/api/search/service-industry-blog/${q}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const json = await res.json();
        setApiData(json);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setErr("Something went wrong. Please try again.");
        setApiData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [dq, open, baseUrl]);

  const groups = React.useMemo(() => normalizeGroups(apiData), [apiData]);

  const showPanel = open && (q.trim() || loading || err);

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      {/* Search input */}
      <div className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <span className="text-slate-400">⌕</span>

        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setApiData(null);
              setErr("");
              setLoading(false);
              inputRef.current?.focus();
            }}
            className="rounded-xl px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <span className="rounded-xl bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
            Search
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showPanel ? (
        <div className="absolute left-0 right-0 z-50 mt-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

            <div className="max-h-[52vh] overflow-y-auto p-4 [scrollbar-gutter:stable]">
              {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {err}
                </div>
              ) : loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : !q.trim() ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Start typing to search
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    We’ll show Services, Knowledge Center, Department Updates,
                    and more.
                  </p>
                </div>
              ) : groups.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {groups.map(([groupTitle, list]) => (
                    <div key={groupTitle} className="min-w-0">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {groupTitle}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                          {list.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {list.slice(0, 6).map((x) => (
                          <Link
                            key={x?.url || x?.slug || x?.name}
                            href={ensureInternalHref(x?.url || "#")}
                            onClick={() => setOpen(false)}
                            className="group block rounded-xl border border-slate-200 bg-white p-3
                                       transition hover:border-slate-300 hover:shadow-sm cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {x?.name}
                                </p>
                                {x?.track ? (
                                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-600">
                                    {x.track}
                                  </p>
                                ) : null}
                              </div>
                              <span className="mt-0.5 text-slate-400 transition group-hover:translate-x-0.5">
                                →
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {list.length > 6 ? (
                        <div className="mt-3">
                          <Link
                            href="/service"
                            onClick={() => setOpen(false)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            View more →
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    No results found for “{q.trim()}”.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Try “EPR”, “BIS”, “NOC”, “IMEI”…
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600">
                  Press <span className="font-semibold">Esc</span> to close
                </p>
                <Link
                  href="/service"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Go to Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HomeHeroSection({
  title = "Tailored Solutions\nFor Your Business",
  categories = [
    { label: "Regulatory", href: "/service/regulatory-compliance" },
    { label: "Environmental", href: "/service/environmental" },
    { label: "Sustainability", href: "/service/sustainability" },
    { label: "Legal", href: "/service/legal" },
    { label: "Plant Setup", href: "/service/industry-setup-solution" },
  ],
  subtitle = "Compliance Advisory Platform For Individuals, SME & Enterprise.",
  ratingText = "Rated 4.9 stars ratings by 15000+ Customers like you",
  ctaHref = "/contact-us",
  ctaText = "CALL FOR FREE CONSULTATION",
  items = DEFAULT_ITEMS,
}) {
  return (
    <section className="relative bg-white overflow-visible">
      {/* soft background (keep subtle like your 1st image) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 lg:px-8 lg:pt-12 lg:pb-12">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-6">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              <span>{ctaText}</span>
              <PhoneCall className="h-4 w-4" />
            </Link>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
              {categories.map((c, idx) => (
                <span  className="flex items-center">
                    <div className="font-medium text-blue-600  ">   
                    {c.label}
                    </div>
                  {idx !== categories.length - 1 && (
                    <span className="mx-2 text-gray-300">|</span>
                  )}
                </span>
              ))}
              <span className="text-gray-900">
                &amp; Plant Setup Compliance
              </span>
            </div>

            <p className="mt-3 max-w-xl text-base text-gray-700 sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-700">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-medium">{ratingText}</span>
            </div>

            {/* HERO SEARCH */}
            <div className="mt-6">
              <HeroSearch
                baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
                placeholders={[
                  "Try “EPR For Plastic Waste”…",
                  "Try “BIS Certification”…",
                  "Try “Pollution NOC”…",
                  "Try “IMEI Number”…",
                ]}
              />
            </div>
          </div>

          {/* RIGHT: Desktop only (STRICT ROWS) */}
          <div className="lg:col-span-6 hidden lg:block">
            <div className="ml-auto w-full max-w-[780px]">
              {/* stage height less than viewport */}
              <div className="flex flex-col gap-8">
                <div className="flex justify-center gap-8">
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold text-gray-900">
                      Industry Setup Solution
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={industryImg}
                        alt="Industry Setup Solution"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[12px] leading-snug text-gray-500">
                      <Link href="/service/biofuel-manufacturing-plant-setup-in-india">
                        Bio-fuels
                      </Link>{" "}
                      / <Link href="/">Medical</Link> /{" "}
                      <Link href="/">Electronics</Link> <br />
                      <Link href="industries/recycling-and-waste-management">
                        Waste Management / Renewable
                      </Link>
                    </div>
                  </div>

                  <div
                    href="/service/sustainability"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer"
                  >
                    <div className="text-[14px] font-semibold text-gray-900">
                      Sustainability
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={sustainabilityImg}
                        alt="Sustainability"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[12px] leading-snug text-gray-500">
                      <Link href="/service/environmental-social-and-governance-esg">
                        ESG
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/environmental-and-social-due-diligence-esdd">
                        ESDD
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/environmental-and-social-management-system-esms">
                        ESMS
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/leed-zero-carbon-certification">
                        Net Zero
                      </Link>{" "}
                      <br />
                      <Link href="/service/carbon-credit-trading-scheme">
                        Waste Channelization / Carbon Credits
                      </Link>
                    </div>
                  </div>
                </div>

                {/* MIDDLE ROW (3) - with center card slightly forward */}
                <div className="flex justify-between">
                  <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer">
                    <div className="text-[14px] font-semibold leading-tight text-gray-900">
                      Regulatory Compliance
                    </div>
                    <div className="mx-auto mb-2 flex h-[72px] w-[104px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={regulatoryImg}
                        alt="Regulatory Compliance"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link href="/service/factory-license">Factory</Link> /
                      <Link href="/service/fire-noc-fire-noc-renewal">
                        Fire
                      </Link>{" "}
                      / Trade <br />
                      FSSAI / CGWA / Labour <br />
                      &amp; Other Compliance
                    </div>
                  </div>

                  {/* Center card (on top) */}
                  <Link
                    href="/service/environmental"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_16px_34px_rgba(0,0,0,0.14)] cursor-pointer"
                  >
                    <div className="text-[14px] font-semibold text-gray-900">
                      Environmental
                    </div>
                    <div className="mx-auto mb-2 flex h-[82px] w-[118px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={envBgMid}
                        alt="Environmental"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      EPR / EIA / CTO / CTE <br />
                      EC / BWM / PWM / EWM <br />
                      HWM / FSC / Wildlife
                    </div>
                  </Link>

                  <Link
                    href="/service/import-export"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer"
                  >
                    <div className="text-[14px] font-semibold text-gray-900">
                      Import Export
                    </div>
                    <div className="mx-auto mb-2 flex h-[72px] w-[104px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={importExportImg}
                        alt="Import Export"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      IEC / DGFT / CHA <br />
                      CDSCO / BIS / LMPC <br />
                      EPR / Custom Clearance
                    </div>
                  </Link>
                </div>

                {/* BOTTOM ROW (1) */}
                <div className="flex justify-center">
                  <Link
                    href="/service/product-compliance"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer"
                  >
                    <div className="text-[14px] font-semibold text-gray-900">
                      Product Compliance
                    </div>
                    <div className="mx-auto mb-2 flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-gray-50">
                      <Image
                        src={productComplianceImg}
                        alt="Product Compliance"
                        height={"auto"}
                        width={"100%"}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      ISI / BIS / ISO / BEE / FDA / Meity <br />
                      CDSCO / TEC / WPC / OSP / etc.
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
