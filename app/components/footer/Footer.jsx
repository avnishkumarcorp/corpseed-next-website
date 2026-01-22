// app/components/SiteFooter.jsx
"use client";

import React from "react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Waste Management & Circularity",
      links: [
        "Bio-Medical Waste",
        "Hazardous Waste Management",
        "Battery Waste Management",
        "Solid Waste Management",
        "DPCC Waste Management",
        "EPR Authorization",
        "Sustainability Consulting",
      ],
    },
    {
      title: "Green Certifications and Eco-labeling",
      links: [
        "Zero Carbon Certification",
        "Green Building Certification",
        "Eco Labelling Certification",
        "Energy Audits",
        "Green Building Design and Certification",
        "Sustainable Business Certification",
      ],
    },
    {
      title: "Safety and Regulatory",
      links: [
        "Hallmark Registration",
        "ISI Registration",
        "BIS Registration",
        "Drone Registration",
        "Medical Devices Import",
        "Drug License",
        "WPC Import License",
      ],
    },
    {
      title: "About Us",
      links: [
        "Become A Partner",
        "Contact Us",
        "Knowledge Centre",
        "Change Your CA",
        "Life At Corpseed",
        "MCA Calculator",
        "Online Payment",
      ],
    },
  ];

  return (
    <footer className="w-full bg-white">
      {/* Top strip */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* Follow us */}
          <div className="flex items-center gap-3">
            <span className="text-[18px] font-medium text-slate-900">
              Follow Us :
            </span>

            <div className="flex items-center gap-3 text-slate-600">
              <SocialIcon label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.94 6.5A2.44 2.44 0 1 1 7 2.5a2.44 2.44 0 0 1-.06 4z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.5 21V9h4v12h-4z"
                    fill="currentColor"
                  />
                  <path
                    d="M13 9c2.5 0 4.5 1.6 4.5 5.2V21h-4v-6c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.4-.1.2-.1.6-.1 1V21h-4s.1-10.7 0-12h4v1.7C10 9.8 11.2 9 13 9z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13.5 22v-9h3l.5-3h-3.5V8.2c0-.8.3-1.2 1.3-1.2H17V4.2c-.5-.1-1.6-.2-3-.2-2.8 0-4.5 1.7-4.5 4.7V10H7v3h2.5v9h4z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 8.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C15.1 4.7 12 4.7 12 4.7h0s-3.1 0-6.1.3c-.4.1-1.3.1-2.1.9C3.2 6.6 3 8.2 3 8.2S2.7 10 2.7 11.8v.9C2.7 14.4 3 16.2 3 16.2s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.7.2 5.8.3 5.8.3s3.1 0 6.1-.3c.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.3-1.8.3-3.6v-.9c0-1.8-.3-3.6-.3-3.6z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.4 15.3v-6l5.6 3-5.6 3z"
                    fill="#fff"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.5 6.5h.01"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.5 7.1c.01.2.01.4.01.6 0 6.4-4.8 13.8-13.8 13.8-2.7 0-5.3-.8-7.5-2.2.4.1.9.1 1.3.1 2.2 0 4.2-.8 5.8-2.1-2.1-.1-3.8-1.4-4.4-3.3.3.1.7.1 1 .1.4 0 .8-.1 1.1-.1-2.1-.4-3.7-2.2-3.7-4.4v-.1c.6.4 1.4.6 2.2.7-1.2-.9-2-2.1-2-3.6 0-.8.2-1.6.6-2.2 2.4 2.9 6 4.9 10.1 5.1-.1-.4-.1-.8-.1-1.2 0-2.6 2.1-4.6 4.6-4.6 1.3 0 2.5.6 3.4 1.4.9-.2 1.7-.5 2.5-.9-.3.9-.9 1.7-1.7 2.2.8-.1 1.6-.3 2.3-.6-.5.8-1.1 1.5-1.8 2.1z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Subscribe */}
          <form
            className="flex w-full max-w-xl items-center gap-3 lg:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address..."
              className="h-11 w-full rounded-none border border-slate-300 bg-white px-4 text-[14px] text-slate-700 outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="h-11 whitespace-nowrap bg-black px-6 text-[14px] font-semibold text-white cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-[18px] font-semibold text-slate-900">
                {col.title}
              </h3>

              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[14px] text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Center button */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-7 py-3 text-[13px] font-semibold text-white cursor-pointer"
          >
            ALL SERVICES
          </button>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ children, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 cursor-pointer"
    >
      {children}
    </a>
  );
}
