"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import calendarImg from "../../../../public/home/calander.svg";
import StartupGuidePopup from "../../StartupGuidePopup";

const ICONS = {
  download: (
    <>
      <path d="M12 3.5v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="m8 10 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 17v2.5h15V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  order: (
    <>
      <rect x="4.5" y="7" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  partner: (
    <>
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 19c.8-2.8 2.9-4.3 5.5-4.3M14 19c.7-2.6 2.6-4.3 5.2-4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
};

function ResourceCard({ icon, title, desc, action, href, external, onClick }) {
  const inner = (
    <>
      <span className="cs-icon-tile shrink-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {ICONS[icon]}
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-slate-900">
          {title}
        </span>
        <span className="mt-0.5 block text-[13.5px] leading-snug text-slate-600">
          {desc}
        </span>
      </span>

      <span className="cs-link-arrow shrink-0 !text-[13px] self-center">
        {action}
        <span className="cs-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </>
  );

  const className =
    "group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_34px_-24px_rgba(15,23,42,0.6)]";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export default function VirtualMeetingSection() {
  const [openStartupGuide, setOpenStartupGuide] = useState(false);

  return (
    <section className="w-full bg-white">
      <div className="cs-container cs-section--tight">
        <div className="cs-reveal overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-2 lg:gap-12">
            {/* Book a meeting */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Image
                src={calendarImg}
                alt=""
                aria-hidden="true"
                className="h-auto w-[168px] object-contain sm:w-[196px]"
              />

              <h2 className="mt-5 text-[clamp(1.375rem,1.1rem+1.1vw,1.875rem)] font-bold tracking-tight text-slate-900">
                Book a virtual meeting
              </h2>

              <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-slate-600">
                Pick a 30-minute slot with a compliance specialist. Bring your
                questions — we will map the approvals you actually need.
              </p>

              <Link href="/book-meeting" className="cs-btn cs-btn--primary cs-btn--lg mt-6">
                Book your slot
                <span className="cs-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            {/* Self-serve resources */}
            <div className="w-full space-y-3.5">
              <ResourceCard
                icon="download"
                title="Startup compliance guide"
                desc="A free checklist of every licence a new business needs."
                action="Download"
                onClick={() => setOpenStartupGuide(true)}
              />

              <ResourceCard
                icon="order"
                title="Track your order"
                desc="Check filing status and documents in your dashboard."
                action="Open"
                href="https://crm.corpseed.com/client_orders.html"
                external
              />

              <ResourceCard
                icon="partner"
                title="Become a partner"
                desc="Refer clients or deliver services alongside our team."
                action="Apply"
                href="/partner"
              />
            </div>
          </div>
        </div>
      </div>

      <StartupGuidePopup
        open={openStartupGuide}
        onClose={() => setOpenStartupGuide(false)}
      />
    </section>
  );
}
