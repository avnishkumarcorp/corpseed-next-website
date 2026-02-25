// app/industries/page.jsx
import Link from "next/link";
import Image from "next/image";
import { getIndustriesPage, clamp } from "../lib/industry";
import heroImg from "../assets/industry.webp";
import LogoMarquee from "../components/carousel/LogoMarquee";
import IndustryCaterTabs from "./IndustryCaterTabs";
import EnquiryOtpInline from "../components/otp/EnquiryOtpFlow";
import { getClients } from "../lib/clients";

/* ================= META DATA ================= */

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Industries - Definition, Types, Sectors, & Facts - Corpseed",
    description:
      "Explore industries supported by Corpseed including compliance, regulatory, sustainability, and environmental services.",
    keywords: [
      "Industries",
      "Regulatory Services",
      "Environmental Compliance",
      "Corporate Consulting",
    ],
    openGraph: {
      title: "Industries - Definition, Types, Sectors, & Facts - Corpseed",
      description:
        "Explore industries supported by Corpseed including compliance and regulatory services.",
      images: [
        {
          url: heroImg.src,
          width: 1200,
          height: 630,
          alt: "Industries - Corpseed",
        },
      ],
    },
  };
}

/* ================= SECTION WRAPPER ================= */
function Section({ title, children, className = "" }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* ================= FEATURED CARD ================= */
function FeaturedCard({ item }) {
  const href = `/industries/${item?.slug}`;

  return (
    <div className="rounded-2xl bg-[#1f2e63] text-white shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold !text-white">
          {item?.title || item?.industryName}
        </h3>
        <p className="mt-3 text-sm !text-white/85 leading-6">
          {clamp(item?.summary, 140)}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold !text-white hover:text-white/90 cursor-pointer"
        >
          KNOW MORE ›
        </Link>
      </div>
    </div>
  );
}

/* ================= NEWS CARD ================= */
function NewsCard({ title, item, hrefBase }) {
  const href = item?.slug ? `${hrefBase}/${item.slug}` : hrefBase;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 italic text-slate-700">{clamp(item?.title, 42)}</p>
      <p className="mt-3 text-sm text-slate-600 leading-6">
        {clamp(
          item?.summary?.replace(/<[^>]*>/g, " ") ||
            "Read the latest update and know what’s new.",
          120,
        )}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        KNOW MORE ›
      </Link>
    </div>
  );
}

/* ================= PAGE ================= */
export default async function IndustriesPage() {
  const clients = await getClients();
  let data;

  try {
    data = await getIndustriesPage();
  } catch (e) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-2xl font-bold text-slate-900">Industries</h1>
        <p className="mt-3 text-slate-600">Failed to load industries.</p>
      </div>
    );
  }

  const featured = data?.featuredIndustries || [];
  const highlighted = data?.highlightedIndustries || [];
  const blog = (data?.popularBlogs || [])[0];
  const news = (data?.latestNews || [])[0];
  const law = (data?.latestLawUpdates || [])[0];

  return (
    <main className="bg-white">
      {/* HERO */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <Image
          src={heroImg}
          alt="Industries"
          fill
          priority
          className="object-cover"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-xl">
            <div className="inline-flex rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold">
              INCLUDES FREE SUPPORT
            </div>
            <h1 className="mt-4 text-4xl font-bold !text-white">Industries</h1>
            <p className="mt-4 text-sm leading-6 !text-white/90">
              Industry is a group of diverse organizations involved in the
              manufacture, production, or processing of the same type of product
              and service. All industries are part of the goods- producing
              sector. Secondary or production converts all raw materials into
              products that are more beneficial to people.
            </p>
          </div>
        </div>
      </div>

      {/* INTRO + ENQUIRY FORM (ABOVE LOGO MARQUEE) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start">
            {/* Left content */}
            <div className="text-slate-700 leading-7 w-full">
              <p>
                Industry is an economic branch that produces closely related raw
                materials, goods, or services. For example, you can refer to the
                agriculture industry or the insurance industry. Similar firms
                are grouped into industries based on the primary product they
                produce or sell.
              </p>

              <p className="mt-6">
                It creates industry groups that allow companies to differentiate
                themselves from different operating parties. Investors and
                economists often study industries to better understand the
                drivers and limits of companies’ profit growth.
              </p>

              <p className="mt-6">
                Companies in the same industry can also be compared to each
                other to gauge the relative attractiveness of a company in that
                industry. An industry can be privately owned, publicly owned, or
                jointly owned. The wealth of a nation is largely based on its
                industry.
              </p>
            </div>

            {/* Right Enquiry Form */}
            <div className="lg:flex lg:justify-end">
              <div className="w-full max-w-[600px] border border-gray-200 rounded-sm">
                <EnquiryOtpInline page={"Industries"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="mx-auto max-w-full px-4 bg-white">
        <LogoMarquee speed={60} items={clients} />
      </section>

      {/* FEATURED */}
      <Section title="Industries" className="pb-6 bg-white">
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {featured.slice(0, 3).map((x) => (
            <FeaturedCard key={x?.id || x?.slug} item={x} />
          ))}
        </div>
      </Section>

      {/* CATER */}
      <Section className="pb-8 bg-white">
        <IndustryCaterTabs items={highlighted} />
      </Section>

      {/* NEWS */}
      <Section title="Industries Latest News" className="pb-8 bg-white">
        <div className="mt-6 grid gap-6 lg:grid-cols-3 bg-white">
          <NewsCard
            title="Knowledge-Center"
            item={blog}
            hrefBase="/knowledge-centre"
          />
          <NewsCard title="News" item={news} hrefBase="/news" />
          <NewsCard title="Law Update" item={law} hrefBase="/law-update" />
        </div>
      </Section>
    </main>
  );
}
