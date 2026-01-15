import EnquiryForm from "../../components/enquiry-form/EnquiryForm";
import ServiceContent from "../ServiceContent";
import ServiceTabs from "../ServiceTabs";
import ServiceHero from "../ServiceHero";
import { getServiceBySlug } from "../../lib/service";
import LogoMarquee from "../../components/carousel/LogoMarquee";

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ unwrap params Promise
  const data = await getServiceBySlug(slug);

  return {
    title: data?.seoTitle || `${data?.name || "Service"} | Corpseed`,
    description: data?.seoDescription || "Corpseed service details and enquiry.",
    alternates: { canonical: `/service/${slug}` }, // ✅ match your real route
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params; // ✅ unwrap params Promise
  const data = await getServiceBySlug(slug);

  if (!data) return null;


  const logos = [
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/SUPREME-INDUSTRIES.webp", alt: "SUPREME-INDUSTRIES.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/RELIANCE-ENTERTAINMENT-STUDIOS-PRIVATE-LIMITED.webp", alt: "RELIANCE-ENTERTAINMENT-STUDIOS-PRIVATE-LIMITED.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/OYO-HOTELS-AND-HOMES.webp", alt: "OYO-HOTELS-AND-HOMES.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/LINC-PEN-AND-PLASTICS-LTd.webp", alt: "LINC" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/NARAYANA-HEALTH-CARE-CENTER.webp", alt: "NARAYANA-HEALTH-CARE-CENTER.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/ACCORD-PRIVATE-LIMITED.webp", alt: "ACCORD-PRIVATE-LIMITED.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/DELIGHTFUL-GOURMET.webp", alt: "DELIGHTFUL-GOURMET.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/ALTEN-INDIA-PRIVATE-LIMITED.webp", alt: "ALTEN-INDIA-PRIVATE-LIMITED.webp" },
  { src: "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/BMW-INDIA-PRIVATE-LIMITED.webp", alt: "BMW-INDIA-PRIVATE-LIMITED.webp" },
];

  return (
    <div className="bg-white text-gray-900">
      <ServiceHero
        title={data.name}
        subtitle={data.shortDescription}
        badgeText={data.badgeText || "INCLUDES FREE SUPPORT"}
        ratingText={data.ratingText || "Rated 4.9 by 74,861+ customers"}
        videoText={data.videoText || "Click to Watch & Know More"}
      />

       <section className="mx-auto max-w-7xl px-4 py-10">
      <LogoMarquee items={logos} speed={75} />
    </section>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-8">
            <div className="sticky top-[72px] z-30 -mx-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <ServiceTabs tabs={data.tabs} />
            </div>

            <div className="py-6">
              <ServiceContent tabs={data.tabs} />
            </div>
          </div>

          {/* Right sticky enquiry */}
          <div className="lg:col-span-4">
            <div className="sticky top-[88px] pb-10">
              <EnquiryForm serviceName={data.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">
                Need help choosing the right option?
              </p>
              <p className="text-sm text-gray-600">
                Our experts will guide you based on your business and location.
              </p>
            </div>
            <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
              Get Free Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
