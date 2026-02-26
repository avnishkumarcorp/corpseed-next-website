"use client";
import React, { useState } from "react";
import Image from "next/image";
import calendarImg from "../../../../public/home/calander.svg";
import Link from "next/link";
import StartupGuidePopup from "../../StartupGuidePopup";

const RightCard = ({ icon, title, desc, href, onClick = () => {} }) => {
  return (
    <Link
      href={href || ""}
      target={href ? "_blank" : ""}
      rel={href ? "noopener noreferrer" : ""}
      onClick={onClick}
      className="flex gap-3 rounded-xl bg-white px-5 py-4 shadow-[0_10px_30px_-22px_rgba(2,6,23,0.35)] ring-1 ring-slate-200"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <div className="text-[15px] font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-[14px] text-slate-600">{desc}</div>
      </div>
    </Link>
  );
};

export default function VirtualMeetingSection() {
  const [openStartupGuide, setOpenStartupGuide] = useState(false);
  let location = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* main container */}
        <div className="rounded-2xl bg-[#cfe1ff] px-6 py-10 sm:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT (center aligned like screenshot) */}
            <div className="flex flex-col items-center text-center">
              {/* Calendar Image */}
              <div className="mb-4">
                <Image
                  src={calendarImg}
                  alt="Calendar"
                  priority
                  className="h-auto w-[220px] object-contain"
                />
              </div>

              <h3 className="text-[30px] font-medium text-slate-900 sm:text-[34px]">
                Book a Virtual Meeting
              </h3>

              <Link
                href={"/book-meeting"}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm cursor-pointer"
              >
                Book Now
              </Link>
            </div>

            {/* RIGHT */}
            <div className="mx-auto w-full max-w-[520px] space-y-5">
              <RightCard
                title="Start Up Guide"
                desc="Download Your Free Legal Guide Now"
                onClick={() => setOpenStartupGuide(true)}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 10l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 17v3h16v-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />

              <RightCard
                title="Your Order"
                desc="Feel Free To Ask Any Query"
                href={"https://crm.corpseed.com/client_orders.html"}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 4h10v4H7V4z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 8h12v12H6V8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12h6M9 16h8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />

              <RightCard
                title="Become a partner"
                desc="At Corpseed We Understand Our Responsibility"
                href="partner"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2.5 19c.8-3 3.1-4.5 5.5-4.5S12.7 16 13.5 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 19c.6-2.3 2.4-4.5 5.3-4.5 2.3 0 4.3 1.3 5.2 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <StartupGuidePopup
        open={openStartupGuide}
        onClose={() => setOpenStartupGuide(false)}
        location={location}
      />
    </section>
  );
}
