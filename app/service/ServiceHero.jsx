"use client";
import { Phone, Star } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const VideoPopup = dynamic(() => import("../components/VideoPopup"), {
  ssr: false,
});

const EnquiryOtpInline = dynamic(
  () => import("../components/otp/EnquiryOtpFlow"),
  { ssr: false },
);

const ConsultNowModal = dynamic(() => import("../components/ConsultNowModal"), {
  ssr: false,
});

export default function ServiceHero({
  title,
  summary,
  badgeText,
  ratingText,
  videoText = "Watch Overview",
  videoUrl = "/videos/corpseed-intro.mp4",
  slug,
}) {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <section className="relative overflow-hidden ">
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center border border-gray-200 px-3 py-1 text-white text-xs font-semibold bg-[#2b63f9]">
              {/* <span className="h-2 w-2 rounded-full bg-blue-600" /> */}
              {badgeText}
            </div>

            <h1 className="mt-4 text-3xl tracking-tight sm:text-4xl lg:text-5xl leading-tight break-words">
              {title && (
                <>
                  <span className="text-blue-600">
                    {title.split(" ").slice(0, 2).join(" ")}
                  </span>{" "}
                  <span className="text-gray-900">
                    {title.split(" ").slice(2).join(" ")}
                  </span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#212529] font-sans text-justify">
              {summary}
            </p>

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
            <div className="hidden md:block bg-[#f2f3ff] p-5 shadow-sm -ml-24 w-fit">
              <p className="text-sm text-gray-900">Why wait? Start now!</p>
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 flex gap-1.5">
                <Phone className="h-5 w-5" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">
                    7558640644
                  </span>{" "}
                  - Harshita
                </p>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                We are available 24/7.
              </p>
            </div>

            <div className="bg-[#f2f3ff] p-2 mt-2.5">
              <EnquiryOtpInline
                triggerText="Get Free Consultation"
                className="m-0"
                page={title}
                slug={slug}
              />
            </div>

            <ConsultNowModal
              open={consultOpen}
              onClose={() => setConsultOpen(false)}
              title="Consult Now"
              page={title}
              slug={slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
