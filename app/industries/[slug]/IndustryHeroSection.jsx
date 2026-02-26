"use client";
import { Phone, Star } from "lucide-react";
import { useState } from "react";
import ConsultNowModal from "@/app/components/ConsultNowModal";
import EnquiryOtpInline from "@/app/components/otp/EnquiryOtpFlow";
import VideoPopup from "@/app/components/VideoPopup";
import Link from "next/link";

export default function IndustryHeroSection({
  title,
  summary,
  badgeText,
  ratingText,
  videoText = "Watch Overview",
  videoUrl = "/videos/corpseed-intro.mp4",
  location,
}) {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <section className="relative overflow-visible z-20">
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Link href={"/service/epr-for-e-waste-management"}>
              <img
                src="https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/Epr_Authorization_Ewaste_corpseed.webp"
                alt="Epr_Authorization_Ewaste_corpseed.webp"
              ></img>
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <VideoPopup videoUrl={videoUrl} videoText={videoText} />

              <div className="inline-flex items-center gap-2 text-sm text-gray-700">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{ratingText}</span>
              </div>
            </div>

            {/* small stats */}
            <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-gray-200 rounded-2xl bg-white p-4">
              {[
                { value: "10000+", label: "Happy Customers" },
                { value: "500+", label: "CA, CS & Lawyers" },
                { value: "7+", label: "Offices" },
              ].map((s) => (
                <div key={s.label} className="text-center px-4">
                  <div className="text-lg font-bold text-blue-600">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1"></div>

          {/* Right highlight card */}
          <div className="lg:col-span-4">
            <div className="bg-[#f2f3ff] p-2 mt-2.5">
              <EnquiryOtpInline
                triggerText="Get Free Consultation"
                className="m-0"
                page={title}
                location={location}
              />
            </div>

            <ConsultNowModal
              open={consultOpen}
              onClose={() => setConsultOpen(false)}
              title="Consult Now"
              page={title}
              location={location || title}
            />
          </div>
        </div>
        <div className="hidden md:block absolute right-0 -top-32 bg-[#f2f3ff] p-5 shadow-sm -ml-24 w-fit z-[999]">
          <p className="text-sm text-gray-900">Why wait? Start now!</p>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 flex gap-1.5">
            <Phone className="h-5 w-5" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-600">7558640644</span> -
              Harshita
            </p>
          </div>

          <p className="mt-3 text-xs text-gray-500">We are available 24/7.</p>
        </div>
      </div>
    </section>
  );
}
