"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Star } from "lucide-react";
import { createPortal } from "react-dom";

// icons
import industryImg from "../../../../public/home/Industry_Setup_Solutions_Image-02.png";
import sustainabilityImg from "../../../../public/home/Sustainability-02.png";
import regulatoryImg from "../../../../public/home/Regulatory_Compliance_Image-02.png";
import environmentalImg from "../../../../public/home/Sustainability-02.png";
import importExportImg from "../../../../public/home/Import_Export_Image-02.png";
import productComplianceImg from "../../../../public/home/Product_Compliance-02.png";

// center mock images
import envBgLeft from "../../../../public/home/Environmental1_Image-03.png";
import envBgMid from "../../../../public/home/Environmental_main_image-03.png";
import envBgRight from "../../../../public/home/Environmental2_Image-03-03.png";
import dynamic from "next/dynamic";

const HeroSearch = dynamic(() => import("../HeroSearch"), {
  ssr: true,
});

export function Portal({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function HomeHeroSection({
  title = "Tailored Solutions\nFor Your Business",
  ratingText = "Rated 4.9 stars ratings by 15000+ Customers like you",
  ctaHref = "/contact-us",
  ctaText = "CALL FOR FREE CONSULTATION",
}) {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[92%] px-4 pt-6 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-6">
        <div className="grid items-start gap-10 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-6 lg:self-center lg:flex lg:flex-col lg:justify-center text-center lg:text-left min-w-0">
            <a
              href="tel:+917558640644" // 👈 your real number
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              <span>{ctaText}</span>
              <PhoneCall className="h-4 w-4" />
            </a>

            <h1 className="mt-5 text-[3rem] font-semibold not-italic leading-[1.05] tracking-[0.03em] text-[#272d30]">
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
              <p className="text-[16px] text-[#212529] tracking-[0.05rem] font-medium">
                <span className="!text-blue-500">
                  Regulatory, Sustainability, Environmental, Legal{" "}
                </span>
                &amp; Plant Setup Compliance Advisory Platform For Individuals,
                SME &amp; Enterprise.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-700">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-medium">{ratingText}</span>
            </div>

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

          {/* Right side kept as-is (your cards) */}
          <div className="lg:col-span-6 hidden lg:block min-w-0">
            <div className="ml-auto w-full">
              <div className="flex flex-col gap-6">
                {/* Row 1 */}
                <div className="flex justify-center gap-6">
                  {/* Card */}
                  <div className="w-[200px] h-[130px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Industry Setup Solution
                    </p>

                    <div className="mx-auto mt-2 flex h-[60px] w-[90px] items-center justify-center rounded-xl bg-gray-50">
                      <Image
                        src={industryImg}
                        alt="Industry Setup Solution"
                        width={90}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-[12px] leading-snug text-gray-500">
                      <Link
                        href="/service/biofuel-manufacturing-plant-setup-in-india"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Bio-fuels
                      </Link>{" "}
                      / <Link href="/">Medical</Link> /{" "}
                      <Link href="/">Electronics</Link> <br />
                      <Link
                        href="industries/recycling-and-waste-management"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Waste Management
                      </Link>
                      /
                      <Link
                        href={"/industries/renewable-energy"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Renewable
                      </Link>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="w-[200px] h-[130px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Sustainability
                    </p>

                    <div className="mx-auto mt-2 flex h-[50px] w-[90px] items-center justify-center rounded-xl bg-gray-50">
                      <Image
                        src={sustainabilityImg}
                        alt="Sustainability"
                        width={90}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-[12px] leading-snug text-gray-500 mt-2.5">
                      <Link
                        href="/service/environmental-social-and-governance-esg"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        ESG
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/environmental-and-social-due-diligence-esdd"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        ESDD
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/environmental-and-social-management-system-esms"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        ESMS
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/leed-zero-carbon-certification"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Net Zero
                      </Link>{" "}
                      <br />
                      <Link
                        href={"/service/waste-management"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Waste Channelization
                      </Link>
                      /
                      <Link
                        href="/service/carbon-credit-trading-scheme"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Carbon Credits
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex justify-center gap-6">
                  <div className="w-[210px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Regulatory Compliance
                    </p>

                    <div className="mx-auto mt-2 flex h-[58px] w-[88px] items-center justify-center rounded-xl bg-gray-50 relative">
                      <Image
                        src={regulatoryImg}
                        alt="Regulatory"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href="/service/factory-license"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Factory
                      </Link>{" "}
                      /{" "}
                      <Link href="/service/fire-noc-fire-noc-renewal">
                        Fire
                      </Link>{" "}
                      /
                      <Link
                        href={"/service/health-trade-license"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Trade
                      </Link>
                      <br />
                      <Link
                        href={"/service/fssai-basic-registration-renewal"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        FSSAI
                      </Link>{" "}
                      /
                      <Link
                        href={
                          "/service/central-ground-water-authority-noc-for-water-boring-tube-wells"
                        }
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        CGWA
                      </Link>
                      /{" "}
                      <Link
                        href={""}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Labour
                      </Link>{" "}
                      <br />
                      &amp; Other Compliance
                    </div>
                  </div>

                  <div className="w-[210px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Environmental
                    </p>

                    <div className="mx-auto mt-2 flex h-[58px] w-[88px] items-center justify-center rounded-xl bg-gray-50 relative">
                      <Image
                        src={envBgMid}
                        alt="Regulatory"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href={"/service/epr-authorization"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        EPR
                      </Link>{" "}
                      /{" "}
                      <Link
                        href={"/service/environmental-impact-assessment-eia"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        EIA
                      </Link>{" "}
                      / <Link href={"/"}>CTO</Link> /{" "}
                      <Link href={"/"}>CTE</Link> <br />
                      <Link
                        href={"/service/environmental-clearance"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        EC{" "}
                      </Link>
                      /{" "}
                      <Link
                        href={
                          "/service/bio-medical-waste-management-authorization"
                        }
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        BWM
                      </Link>{" "}
                      /{" "}
                      <Link
                        href={"/service/plastic-waste-management-authorization"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        PWM
                      </Link>{" "}
                      /{" "}
                      <Link
                        href={"/service/e-waste-management-authorization"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        EWM
                      </Link>{" "}
                      <br />
                      <Link
                        href={
                          "/service/hazardous-waste-management-authorization"
                        }
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        HWM
                      </Link>{" "}
                      /
                      <Link
                        href={"/service/fsc-certification"}
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        FSC
                      </Link>{" "}
                      /
                      <Link
                        href={
                          "/service/wildlife-and-forests-clearance-certificate-for-project"
                        }
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Wildlife
                      </Link>
                    </div>
                  </div>

                  <div className="w-[210px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Import Export
                    </p>

                    <div className="mx-auto mt-2 flex h-[58px] w-[88px] items-center justify-center rounded-xl bg-gray-50 relative">
                      <Image
                        src={importExportImg}
                        alt="Regulatory"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href="/service/import-export-code"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        IEC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/dgft-export-import-license"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        DGFT
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        CHA
                      </Link>
                      <br />
                      <Link
                        href="/service/cdsco-online-registration"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        CDSCO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bis-certification"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        BIS
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/lmpc-certificate-for-import"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        LMPC
                      </Link>
                      <br />
                      <Link
                        href="/service/epr-authorization"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        EPR
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Custom Clearance
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex justify-center">
                  <div className="w-[210px] rounded-lg border border-gray-200 bg-white px-0.5 py-1.5 text-center shadow-md hover:shadow-lg transition cursor-pointer">
                    <p className="text-center text-[14px] font-semibold text-[#3d3d3d] leading-none mb-0">
                      Product Compliance
                    </p>

                    <div className="mx-auto mt-2 h-[58px] w-[88px] rounded-xl bg-gray-50 overflow-hidden">
                      <Image
                        src={productComplianceImg}
                        alt="Product Compliance"
                        width={88}
                        height={58}
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-2 text-[11px] leading-snug text-gray-500">
                      <Link
                        href="/service/isi-registration-process-in-india"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        ISI
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bis-registration"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        BIS
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/iso-certification-consulting"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        ISO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/bee-registration"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        BEE
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/fda-wholesale-license"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        FDA
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        Meity
                      </Link>
                      <br />
                      <Link
                        href="/service/cdsco-online-registration"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        CDSCO
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/tec-certificate"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        TEC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/wpc-advisory-services"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        WPC
                      </Link>{" "}
                      /{" "}
                      <Link
                        href="/service/dot-osp-license"
                        className="text-[#8c8c8c] text-[11px] leading-[13px]"
                      >
                        OSP
                      </Link>{" "}
                      / <span className="text-gray-400">etc.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* end right */}
        </div>
      </div>
    </section>
  );
}
