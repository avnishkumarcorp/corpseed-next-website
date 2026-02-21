"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    { label: "Become A Partner", href: "/partner" },
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
  return `/legal/${slug}`;
}

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  // simple + safe
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function FooterClient({ data }) {
  const router = useRouter();

  // ✅ API mapping
  const footerCols = useMemo(() => {
    const cols = Array.isArray(data?.footer) ? data.footer : [];
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

  // ✅ Subscribe state
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" }); // type: success | error | info

  async function handleSubscribe(e) {
    e.preventDefault();

    const trimmed = String(email || "").trim();
    if (!isValidEmail(trimmed)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "info", msg: "Subscribing..." });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setStatus({
          type: "error",
          msg: json?.message || "Subscription failed. Please try again.",
        });
        return;
      }

      setStatus({ type: "success", msg: "Subscribed successfully!" });
      setEmail("");

      router.push("/subscribe/thank-you");
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="w-full bg-white">
      {/* Top strip */}
      <div className="border-y border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* Follow us */}
          <div className="col-lg-4 d-flex align-items-center">
            <div className="w-full flex justify-center items-center gap-1.5">
              <h4 className="text-xl font-semibold !m-0">Follow Us : </h4>
              <nav className="flex gap-1.5">
                <a
                  href="https://www.linkedin.com/company/corpseed/"
                  target="_blank"
                  className="text-[#BEBEBE] hover:text-blue-700 transition-colors duration-300"
                  rel="noreferrer"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 48 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip2)">
                      <path
                        d="M44.4469 0.00164795H3.54375C1.58437 0.00164795 0 1.54852 0 3.46102V44.5329C0 46.4454 1.58437 48.0016 3.54375 48.0016H44.4469C46.4063 48.0016 48 46.4454 48 44.5423V3.46102C48 1.54852 46.4063 0.00164795 44.4469 0.00164795ZM14.2406 40.9048H7.11563V17.9923H14.2406V40.9048ZM10.6781 14.8704C8.39063 14.8704 6.54375 13.0235 6.54375 10.7454C6.54375 8.46727 8.39063 6.6204 10.6781 6.6204C12.9563 6.6204 14.8031 8.46727 14.8031 10.7454C14.8031 13.0141 12.9563 14.8704 10.6781 14.8704ZM40.9031 40.9048H33.7875V29.7673C33.7875 27.1141 33.7406 23.6923 30.0844 23.6923C26.3812 23.6923 25.8187 26.5891 25.8187 29.5798V40.9048H18.7125V17.9923H25.5375V21.1235H25.6312C26.5781 19.3235 28.9031 17.4204 32.3625 17.4204C39.5719 17.4204 40.9031 22.1641 40.9031 28.3329V40.9048V40.9048Z"
                        fill="#BEBEBE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip2">
                        <rect
                          width="48"
                          height="48"
                          fill="white"
                          transform="translate(0 0.00164795)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/CorpseedGroup/"
                  target="_blank"
                  className="text-[#BEBEBE] hover:text-blue-700 transition-colors duration-300"
                  rel="noreferrer"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 48 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0)">
                      <path
                        d="M48 24.0016C48 10.7468 37.2548 0.00164795 24 0.00164795C10.7452 0.00164795 0 10.7468 0 24.0016C0 35.9806 8.77641 45.9096 20.25 47.7101V30.9391H14.1562V24.0016H20.25V18.7141C20.25 12.6991 23.8331 9.37665 29.3152 9.37665C31.9402 9.37665 34.6875 9.8454 34.6875 9.8454V15.7516H31.6613C28.68 15.7516 27.75 17.6018 27.75 19.5016V24.0016H34.4062L33.3422 30.9391H27.75V47.7101C39.2236 45.9096 48 35.9806 48 24.0016Z"
                        fill="#BEBEBE"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect
                          width="48"
                          height="48"
                          fill="white"
                          transform="translate(0 0.00164795)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCk19GzvT2hLrGQsskedcn2w"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#BEBEBE] hover:text-blue-700 transition-colors duration-300"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 48 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.5219 7.28438C47.5219 7.28438 47.0531 3.975 45.6094 2.52188C43.7812 0.609375 41.7375 0.6 40.8 0.4875C34.0875 -2.68221e-07 24.0094 0 24.0094 0H23.9906C23.9906 0 13.9125 -2.68221e-07 7.2 0.4875C6.2625 0.6 4.21875 0.609375 2.39062 2.52188C0.946875 3.975 0.4875 7.28438 0.4875 7.28438C0.4875 7.28438 0 11.175 0 15.0563V18.6937C0 22.575 0.478125 26.4656 0.478125 26.4656C0.478125 26.4656 0.946875 29.775 2.38125 31.2281C4.20937 33.1406 6.60938 33.075 7.67813 33.2812C11.5219 33.6469 24 33.7594 24 33.7594C24 33.7594 34.0875 33.7406 40.8 33.2625C41.7375 33.15 43.7812 33.1406 45.6094 31.2281C47.0531 29.775 47.5219 26.4656 47.5219 26.4656C47.5219 26.4656 48 22.5844 48 18.6937V15.0563C48 11.175 47.5219 7.28438 47.5219 7.28438ZM19.0406 23.1094V9.61875L32.0062 16.3875L19.0406 23.1094Z"
                      fill="#BEBEBE"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/corpseed/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#BEBEBE] hover:text-blue-700 transition-colors duration-300"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70313 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3313 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2813 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
                      fill="#BEBEBE"
                    />
                    <path
                      d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
                      fill="#BEBEBE"
                    />
                    <path
                      d="M39.6937 11.1843C39.6937 12.778 38.4 14.0624 36.8156 14.0624C35.2219 14.0624 33.9375 12.7687 33.9375 11.1843C33.9375 9.59053 35.2313 8.30615 36.8156 8.30615C38.4 8.30615 39.6937 9.5999 39.6937 11.1843Z"
                      fill="#BEBEBE"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.twitter.com/corpseed"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#BEBEBE] hover:text-black transition-colors duration-300"
                  >
                    <path d="M18.901 1H22L14.62 9.408L23.5 23H16.54L11.09 15.548L4.5 23H1.4L9.3 14.12L1 1H8.14L13.07 7.8L18.901 1ZM17.88 21H19.6L7.21 2.9H5.35L17.88 21Z" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>

          {/* ✅ Subscribe */}
          <div className="w-full max-w-2xl lg:w-auto">
            <form
              className="flex w-full items-center gap-0"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status.type) setStatus({ type: "", msg: "" });
                }}
                placeholder="Email address..."
                className="h-11 w-full rounded-none border border-slate-300 bg-white px-4 text-[14px] text-slate-700 outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={submitting}
                className={`h-11 whitespace-nowrap px-6 text-[14px] font-semibold text-white cursor-pointer transition
      ${submitting ? "bg-slate-700 opacity-80" : "bg-black hover:bg-slate-900"}
    `}
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {/* small smooth status line */}
            {status.msg ? (
              <p
                className={`mt-2 text-[13px] transition-all ${
                  status.type === "success"
                    ? "text-emerald-600"
                    : status.type === "error"
                      ? "text-red-600"
                      : "text-slate-500"
                }`}
              >
                {status.msg}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-10">
          {footerCols.map((col) => (
            <div key={col.title} className="min-w-0">
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
          <div className="min-w-0">
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
        <div className="flex justify-center mt-2.5">
          <Link
            href={"/category/all"}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            SEE ALL SERVICES
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-32">
                <Link href="/" className="inline-block">
                  <Image
                    src={footerLogo}
                    alt="Corpseed"
                    width={128}
                    height={48}
                    sizes="128px"
                    className="h-12 w-auto object-contain"
                    // ✅ footer is not LCP; remove priority
                  />
                </Link>
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
