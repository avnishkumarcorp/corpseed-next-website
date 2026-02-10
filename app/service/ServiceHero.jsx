"use client";
import { Star } from "lucide-react";
import VideoPopup from "../components/VideoPopup";
import EnquiryOtpFlow from "../components/otp/EnquiryOtpFlow";
import ConsultNowModal from "../components/ConsultNowModal";
import { useState } from "react";

export default function ServiceHero({
  title,
  summary,
  badgeText,
  ratingText,
  videoText = "Watch Overview",
  videoUrl = "/videos/corpseed-intro.mp4",
}) {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-gray-200">
      {/* subtle gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
      <div className="absolute -top-24 right-[-120px] h-[360px] w-[360px] rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute -bottom-28 left-[-140px] h-[360px] w-[360px] rounded-full bg-indigo-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              {badgeText}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-blue-600">
                {title?.split(" ")?.[0] || title}
              </span>{" "}
              <span className="text-gray-900">
                {title?.split(" ")?.slice(1).join(" ")}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
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
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-4">
              {[
                { value: "10000+", label: "Happy Customers" },
                { value: "500+", label: "CA, CS & Lawyers" },
                { value: "7+", label: "Offices" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right highlight card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">
                Why wait? Start now!
              </p>
              <p className="mt-2 text-sm text-gray-600">We’re available 24/7</p>

              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Call{" "}
                  <span className="font-semibold text-blue-600">
                    7558640644
                  </span>{" "}
                  - Harshita
                </p>
              </div>

              <button
                onClick={() => setConsultOpen(true)}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                Get Free Consultation
              </button>

              <p className="mt-3 text-xs text-gray-500">
                By continuing, you agree to Terms & Privacy Policy.
              </p>
            </div>
            <EnquiryOtpFlow triggerText="Get Free Consultation" />

            <ConsultNowModal
              open={consultOpen}
              onClose={() => setConsultOpen(false)}
              title="Consult Now"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
