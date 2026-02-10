"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import footerLogo from "../../assets/logo-footer.png";

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 24V7h5v17H0zM7 7h4.8v2.3h.1c.7-1.3 2.4-2.7 5-2.7 5.3 0 6.3 3.5 6.3 8V24h-5v-7.8c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V24H7V7z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.3H9.69V11.1h3.13V8.4c0-3.1 1.9-4.8 4.67-4.8 1.33 0 2.47.1 2.8.14v3.24h-1.92c-1.5 0-1.8.71-1.8 1.76v2.3h3.6l-.47 3.6h-3.13V24h6.14c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C17.5 2.7 12 2.7 12 2.7s-5.5 0-8.6.3c-.4.1-1.3.1-2.1.9-.6.7-.8 2.3-.8 2.3S0 8 0 9.8v1.4c0 1.8.2 3.6.2 3.6s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.7.2 7.1.3 7.1.3s5.5 0 8.6-.3c.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.5 14.8V7.9l6.2 3.4-6.2 3.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.5.3 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.5.2-1.2.3-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.5-.3-1.2-.4-2.4-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.4.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.5-.2 1.2-.3 2.4-.4 1.2-.1 1.6-.1 4.8-.1zM12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm5.6-9.9a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.2l-4.9-6.4L6.3 22H2l7.9-9.1L1 2h6.4l4.4 5.8L18.9 2zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20z" />
    </svg>
  );
}

const ABOUT_US_COL = {
  title: "About Us",
  links: [
    { label: "Become A Partner", href: "/become-a-partner" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Knowledge Centre", href: "/knowledge-centre" },
    { label: "Change Your CA", href: "/change-your-ca" },
    { label: "Life At Corpseed", href: "/life-at-corpseed" },
    { label: "MCA Calculator", href: "/mca-calculator" },
    { label: "Online Payment", href: "/online-payment" },
  ],
};

function safeHrefFromFooterCatSlug(slug) {
  if (!slug) return "#";
  // your legal routes are like: /legal/<slug>
  return `/legal/${slug}`;
}

export default function FooterClient({ data }) {
  // ✅ API mapping
  const footerCols = useMemo(() => {
    const cols = Array.isArray(data?.footer) ? data.footer : [];

    // convert API -> UI structure
    return cols.map((c) => ({
      title: c?.categoryName || "Category",
      links: Array.isArray(c?.services)
        ? c.services.map((s) => ({
            label: s?.name || "Service",
            href: s?.url || (s?.slug ? `/service/${s.slug}` : "#"),
          }))
        : [],
    }));
  }, [data]);

  const bottomStripLinks = useMemo(() => {
    const cats = Array.isArray(data?.footerCat) ? data.footerCat : [];
    return cats.map((x) => ({
      label: x?.title || "Link",
      href: safeHrefFromFooterCatSlug(x?.slug),
    }));
  }, [data]);

  return (
    <footer className="w-full bg-white">
      {/* Top strip */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* Follow us */}
          <div className="flex items-center gap-3 text-slate-500">
            <span className="mr-2 text-sm font-medium text-slate-700">
              Follow Us :
            </span>

            <SocialIcon
              label="LinkedIn"
              href="https://in.linkedin.com/company/corpseed"
              className="hover:text-[#0A66C2]"
            >
              <LinkedInIcon />
            </SocialIcon>

            <SocialIcon
              label="Facebook"
              href="https://www.facebook.com/CorpseedGroup"
              className="hover:text-[#1877F2]"
            >
              <FacebookIcon />
            </SocialIcon>

            <SocialIcon
              label="YouTube"
              href="https://www.youtube.com/@CorpSeed"
              className="hover:text-[#FF0000]"
            >
              <YouTubeIcon />
            </SocialIcon>

            <SocialIcon
              label="Instagram"
              href="https://www.instagram.com/corpseed/"
              className="hover:text-[#E1306C]"
            >
              <InstagramIcon />
            </SocialIcon>

            <SocialIcon
              label="X"
              href="https://x.com/corpseed"
              className="hover:text-black"
            >
              <XIcon />
            </SocialIcon>
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
        {/* 5 columns only on lg */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* API Columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="text-[18px] font-semibold text-slate-900">
                {col.title}
              </h3>

              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* STATIC About Us Column */}
          <div>
            <h3 className="text-[18px] font-semibold text-slate-900">
              {ABOUT_US_COL.title}
            </h3>

            <ul className="mt-6 space-y-3">
              {ABOUT_US_COL.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-32">
                <Image
                  src={footerLogo}
                  alt="Corpseed"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              <span className="text-sm text-slate-500">©2026</span>
              <span className="text-sm text-slate-700">
                Corpseed ITES Pvt Ltd
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
            <Link href={"/faq"} className="hover:text-slate-900 cursor-pointer">
              FAQ
            </Link>
            <Link
              href={"/sitemap"}
              className="hover:text-slate-900 cursor-pointer"
            >
              Sitemap
            </Link>
            {bottomStripLinks.map((x) => (
              <Link
                key={x.label}
                href={x.href}
                className="hover:text-slate-900 cursor-pointer"
              >
                {x.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}


export function SocialIcon({ label, href, className = "", children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center
        w-9 h-9
        rounded-full
        border border-slate-200
        bg-white
        transition-all duration-200
        hover:bg-slate-50 hover:shadow-sm
        ${className}
      `}
      style={{ cursor: "pointer" }}
    >
      {children}
    </Link>
  );
}
