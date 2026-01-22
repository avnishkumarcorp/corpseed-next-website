import EnquiryForm from "../../components/enquiry-form/EnquiryForm";
import ServiceContent from "../ServiceContent";
import ServiceTabs from "../ServiceTabs";
import ServiceHero from "../ServiceHero";
import { getServiceBySlug } from "../../lib/service";
import LogoMarquee from "../../components/carousel/LogoMarquee";
import { logos } from "../../common";

export async function generateMetadata({ params }) {
  const { slug } =await params; // ✅ no await
  const data = await getServiceBySlug(slug);

  return {
    title: data?.title || `${data?.title || "Service"} | Corpseed`,
    description: data?.metaDescription || "Corpseed service details and enquiry.",
    alternates: { canonical: `/service/${slug}` },
  };
}

export default async function ServicePage({ params }) {
  const { slug } =await params; // ✅ no await
  const data = await getServiceBySlug(slug);

  if (!data) return null;

  return (
    <div className="bg-white text-gray-900">
      <ServiceHero
        title={data?.service?.title}
        summary={data?.service?.summary}
        badgeText="INCLUDES FREE SUPPORT"
        ratingText="Rated 4.9 by 74,861+ customers globally"
        videoText="Click to Watch & Know More"
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <LogoMarquee items={logos} speed={75} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="sticky top-[72px] z-30 -mx-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <ServiceTabs tabs={data?.service?.serviceDetails} />
            </div>

            <div className="py-6">
              <ServiceContent tabs={data?.service?.serviceDetails} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[88px] pb-10">
              <EnquiryForm serviceName={data?.name} />
            </div>
          </div>
        </div>
      </div>

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
