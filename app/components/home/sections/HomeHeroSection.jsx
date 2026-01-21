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

export default function HomeHeroSection({
  title = "Tailored Solutions\nFor Your Business",
  categories = [
    { label: "Regulatory", href: "/service/regulatory-compliance" },
    { label: "Sustainability", href: "/service/sustainability" },
    { label: "Environmental", href: "/service/environmental" },
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
    <section className="relative overflow-hidden bg-white">
      {/* soft background (keep subtle like your 1st image) */}
      <div className="pointer-events-none absolute inset-0">
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
                <span key={c.href} className="flex items-center">
                  <Link
                    href={c.href}
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {c.label}
                  </Link>
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
          </div>

          {/* RIGHT: Desktop only (STRICT ROWS) */}
          <div className="lg:col-span-6 hidden lg:block">
            <div className="ml-auto w-full max-w-[780px]">
              {/* stage height less than viewport */}
              <div className="flex flex-col gap-8">
                <div className="flex justify-center gap-8">
                  <Link
                    href="/service/industry-setup-solution"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer"
                  >
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
                      Bio-fuels / Medical / Electronics <br />
                      Waste Management / Renewable
                    </div>
                  </Link>

                  <Link
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
                      ESG / ESDD / ESMS / Net Zero <br />
                      Waste Channelization / Carbon Credits
                    </div>
                  </Link>
                </div>

                {/* MIDDLE ROW (3) - with center card slightly forward */}
                <div className="flex justify-between">
                  <Link
                    href="/service/regulatory-compliance"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center shadow-[0_10px_22px_rgba(0,0,0,0.10)] cursor-pointer"
                  >
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
                      Factory / Fire / Trade <br />
                      FSSAI / CGWA / Labour <br />
                      &amp; Other Compliance
                    </div>
                  </Link>

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
