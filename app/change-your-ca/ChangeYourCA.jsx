"use client";

import React from "react";
import Image from "next/image";
import officerImg from '../assets/undraw_business_deal_cpi9.svg'

// If you have an illustration image, put it in /public and use it here
// Example: /public/change-ca/office.png
const OFFICER_IMG = "/change-ca/officer.png";

const PLANS = [
  {
    key: "basic",
    title: "BASIC",
    monthly: 1890,
    yearly: 1890 * 12 * 0.85,
    features: [
      { label: "Income Tax Compliances", ok: true },
      { label: "MCA Compliances", ok: true },
      { label: "GST Compliances", ok: false },
      { label: "TDS Compliances", ok: false },
      { label: "Accounting Services", ok: false },
      { label: "PF Compliances", ok: false },
      { label: "ESI Compliances", ok: false },
      { label: "Balance Sheet Preparation", ok: false },
    ],
  },
  {
    key: "standard",
    title: "STANDARD",
    monthly: 3690,
    yearly: 3690 * 12 * 0.85,
    highlight: true,
    features: [
      { label: "Income Tax Compliances", ok: true },
      { label: "MCA Compliances", ok: true },
      { label: "GST Compliances", ok: true },
      { label: "PF Compliances", ok: false },
      { label: "ESI Compliances", ok: false },
      { label: "TDS Compliances", ok: false },
      { label: "Accounting Services", ok: false },
      { label: "Balance Sheet Preparation", ok: false },
    ],
  },
  {
    key: "professional",
    title: "PROFESSIONAL",
    monthly: 18900,
    yearly: 18900 * 12 * 0.85,
    features: [
      { label: "GST Compliances", ok: true },
      { label: "TDS Compliances", ok: true },
      { label: "Accounting Services", ok: true },
      { label: "PF Compliances", ok: true },
      { label: "ESI Compliances", ok: true },
      { label: "Balance Sheet Preparation", ok: true },
      { label: "Income Tax Compliances", ok: true },
      { label: "MCA Compliances", ok: true },
    ],
  },
];

// --- Compliance Table Data (sample – replace with your real data) ---
const COMPANY_TYPES = [
  { key: "pvt", label: "Pvt Ltd", sub: "(Private Limited Company)" },
  { key: "public", label: "Public Ltd", sub: "(Private Limited Company)" },
  { key: "opc", label: "OPC", sub: "(One Person Company)" },
  { key: "llp", label: "LLP", sub: "(Limited Liability Partnership)" },
  { key: "nbfc", label: "NBFC", sub: "(Non Banking Financial Company)" },
];

const COMPLIANCE_ROWS = [
  {
    code: "INC-20A",
    desc:
      "Declaration of Commencement of Business within 180 days from the date of incorporation",
    map: { pvt: true, public: true, opc: true, llp: false, nbfc: true },
  },
  {
    code: "INC-22A",
    desc: "Active KYC of company till 25th April 2019 without late fine",
    map: { pvt: true, public: true, opc: true, llp: false, nbfc: true },
  },
  {
    code: "DIR-3KYC",
    desc: "Directors KYC till 30th of April",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
  {
    code: "Form MBP-1",
    desc:
      "Director discloses his interest in other entities within 30 days of holding first board meeting",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
  {
    code: "DIR-8",
    desc:
      "Every Director of the company in each financial year will file disclosure of non-disqualification",
    map: { pvt: true, public: true, opc: true, llp: false, nbfc: true },
  },
];

// GST Compliance Table sample
const GST_ROWS = [
  {
    code: "GSTR-3B",
    desc: "On 20th of every month",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
  {
    code: "GSTR-1",
    desc: "On every 11th day of month",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
  {
    code: "GSTR-1",
    desc: "Quarterly",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
  {
    code: "ITR-2A",
    desc: "Income Return Filing 30th June",
    map: { pvt: true, public: true, opc: true, llp: true, nbfc: true },
  },
];

// Additional NBFC compliances sample
const NBFC_ADDITIONAL = [
  { no: 1, particulars: "Unaudited March Monthly return/NBS7", time: "On or before 30th June" },
  { no: 2, particulars: "Audited March Monthly return/NBS7", time: "Upon completion" },
  { no: 3, particulars: "Statutory Auditors certificate on Income & Assets", time: "On or before 30th June" },
  { no: 4, particulars: "Information about Cos having FDI/Foreign Funds", time: "On or before 30th June" },
  { no: 5, particulars: "Resolution of Non-acceptance of Public Deposit", time: "Before commencement of new Financial year" },
  { no: 6, particulars: "File Audited Annual Balance Sheet and P&L Account", time: "One month from the date of signoff" },
  { no: 7, particulars: "Declaration of Auditors to act as Auditors of the Company", time: "Annual basis" },
];

function inr(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("en-IN");
}

function Tick({ value }) {
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-xs">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-700 text-xs">
      ✕
    </span>
  );
}

function CheckIcon({ ok }) {
  return ok ? (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
      ✓
    </span>
  ) : (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-slate-500">
      ✓
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-center text-2xl font-medium tracking-wide text-slate-900">
      {children}
    </h2>
  );
}

function ComplianceMatrixTable({ title, rows }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionTitle>{title}</SectionTitle>

      <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[980px] border-collapse bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-[420px] border-b border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-800">
                &nbsp;
              </th>
              {COMPANY_TYPES.map((c) => (
                <th
                  key={c.key}
                  className="border-b border-slate-200 px-4 py-4 text-left text-sm font-semibold text-slate-800"
                >
                  <div>{c.label}</div>
                  <div className="mt-1 text-xs font-normal text-slate-500">{c.sub}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.code + idx} className={idx % 2 ? "bg-slate-50/60" : "bg-white"}>
                <td className="border-b border-slate-200 px-5 py-4 align-top">
                  <div className="font-semibold text-slate-900">{r.code}</div>
                  <div className="mt-1 text-sm text-slate-700">{r.desc}</div>
                </td>

                {COMPANY_TYPES.map((c) => (
                  <td
                    key={c.key}
                    className="border-b border-slate-200 px-4 py-4 text-center align-middle"
                  >
                    <Tick value={!!r.map?.[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ChangeYourCA() {
  const [billing, setBilling] = React.useState("monthly"); // monthly | yearly
  const [open, setOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(PLANS[1]);
  const [form, setForm] = React.useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
  });

  const price = (p) => (billing === "monthly" ? p.monthly : p.yearly);

  const onBuy = (plan) => {
    setSelectedPlan(plan);
    setForm({ fullName: "", mobile: "", email: "", city: "" });
    setOpen(true);
  };

  React.useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || !form.email || !form.city) {
      alert("Please fill all required fields.");
      return;
    }

    // TODO: API call
    // console.log({ plan: selectedPlan.title, billing, ...form });

    alert("Submitted successfully!");
    setOpen(false);
  };

  return (
    <main className="bg-white">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-56 top-20 h-[620px] w-[620px] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      {/* PRICING */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Pricing For Every Business, At Any Stage
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Get your compliances done in no time with our technology based platform.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-blue-600 bg-white p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={[
                  "rounded-full px-7 py-2 text-sm font-semibold cursor-pointer",
                  billing === "monthly"
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-50",
                ].join(" ")}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={[
                  "rounded-full px-7 py-2 text-sm font-semibold cursor-pointer",
                  billing === "yearly"
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-50",
                ].join(" ")}
              >
                Yearly
              </button>
            </div>
          </div>

          {billing === "yearly" ? (
            <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Save 15% on yearly plan
            </div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={[
                "rounded-2xl border bg-white p-7 shadow-sm",
                p.highlight
                  ? "border-blue-600/30 shadow-[0_22px_55px_rgba(37,99,235,0.18)]"
                  : "border-slate-200",
              ].join(" ")}
            >
              <div className="text-center">
                <p className="text-xs font-bold tracking-[0.35em] text-slate-700">
                  {p.title}
                </p>

                <div className="mt-4 flex items-end justify-center gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">₹</span>
                  <span className="text-4xl font-extrabold text-slate-900">
                    {inr(price(p))}
                  </span>
                  <span className="pb-1 text-xs text-slate-500">
                    / {billing === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-amber-500" />
              </div>

              <div className="mt-7 space-y-4">
                {p.features.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <CheckIcon ok={f.ok} />
                    <span
                      className={[
                        "text-[14px]",
                        f.ok ? "text-slate-800" : "text-slate-500 line-through",
                      ].join(" ")}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onBuy(p)}
                className={[
                  "mt-8 w-full rounded-full py-3 text-sm font-semibold cursor-pointer",
                  p.highlight
                    ? "bg-blue-600 text-white shadow hover:bg-blue-700"
                    : "border border-blue-600 text-blue-700 hover:bg-blue-50",
                ].join(" ")}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE TABLE */}
      <ComplianceMatrixTable title="COMPLIANCE TABLE" rows={COMPLIANCE_ROWS} />

      {/* GST COMPLIANCE TABLE */}
      <ComplianceMatrixTable title="GST COMPLIANCE TABLE" rows={GST_ROWS} />

      {/* ADDITIONAL COMPLIANCES FOR NBFC */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionTitle>ADDITIONAL COMPLIANCES FOR NBFC</SectionTitle>

        <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[860px] border-collapse bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-[60px] border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800">
                  #
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800">
                  Particulars
                </th>
                <th className="w-[260px] border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800">
                  Time Limit
                </th>
              </tr>
            </thead>

            <tbody>
              {NBFC_ADDITIONAL.map((r, idx) => (
                <tr key={r.no} className={idx % 2 ? "bg-slate-50/60" : "bg-white"}>
                  <td className="border-b border-slate-200 px-4 py-4 text-sm text-slate-800">
                    {r.no}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-4 text-sm text-slate-800">
                    {r.particulars}
                  </td>
                  <td className="border-b border-slate-200 px-4 py-4 text-sm text-slate-800">
                    {r.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHO IS A COMPLIANCE OFFICER */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle>WHO IS A COMPLIANCE OFFICER?</SectionTitle>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Left text */}
          <div className="space-y-5">
            <p className="text-sm leading-7 text-slate-700">
              The compliance officer must work with the business unit to understand the
              applicable compliance in the business unit and to judge the time on which those
              compliances should be fulfilled. General compliances which are applicable on a
              business unit:
            </p>

            <ul className="ml-5 list-disc space-y-2 text-sm text-slate-800">
              <li>Taxation compliance.</li>
              <li>Statutory Audit.</li>
              <li>Company ROC Compliances.</li>
            </ul>

            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-900">Most Popular Services</p>
            </div>
          </div>

          {/* Right illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[260px] w-[360px] sm:h-[320px] sm:w-[480px]">
              {/* If you don’t have image, keep a placeholder */}
              <div className="absolute inset-0 rounded-2xl bg-slate-50" />
              <Image
                src={officerImg}
                alt="Compliance Officer"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>

        {/* Note strip like your screenshot */}
        <div className="mt-10 flex justify-center">
          <div className="max-w-4xl rounded-md bg-amber-50 px-5 py-4 text-center text-sm text-amber-900">
            <span className="font-semibold">Note:</span> Above package is applicable for turnover
            up to 1 crore annually and with invoice count up to 125 monthly. For more information
            contact our customer care <span className="font-semibold">7558-640-644</span> or{" "}
            <span className="font-semibold">info@corpseed.com</span>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {open ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Change Your CA
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Plan: <span className="font-semibold">{selectedPlan?.title}</span> • Billing:{" "}
                  <span className="font-semibold">{billing}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="px-6 py-5">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                    placeholder="Please enter your full name"
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.mobile}
                    onChange={(e) => setForm((s) => ({ ...s, mobile: e.target.value }))}
                    placeholder="+91 • Phone Number"
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="Email"
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                    placeholder="City"
                    className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
