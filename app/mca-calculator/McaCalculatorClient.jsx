"use client";

import React from "react";
import Image from "next/image";

// optional illustration (or remove)
import calcImg from "../assets/calcul.svg";

const MCA_RULES = {
  Delhi: {
    default: {
      normalFee: 0,
      moaFee: 206000,
      aoaFee: 600,
      stampDuty: 500,
      stampDutyAOA: 0,
      stampDutyMOA: 0,
    },
  },
  Maharashtra: {
    default: {
      normalFee: 0,
      moaFee: 200000,
      aoaFee: 1000,
      stampDuty: 1000,
      stampDutyAOA: 0,
      stampDutyMOA: 0,
    },
  },
  Karnataka: {
    default: {
      normalFee: 0,
      moaFee: 150000,
      aoaFee: 500,
      stampDuty: 500,
      stampDutyAOA: 0,
      stampDutyMOA: 0,
    },
  },
};

const COMPANY_TYPES = [
  "Private Limited Company",
  "Public Limited Company",
  "OPC",
  "LLP",
  "NBFC",
];

const FAQS = [
  {
    q: "Benefits of taking services from Corpseed?",
    a: "We focus on timely delivery with guided support and clear process. You get structured documentation help and predictable timelines.",
  },
  {
    q: "What if I'm not happy with the service?",
    a: "Share your order details with our support team — we will review and resolve it as per applicable policy.",
  },
  {
    q: "How can I be sure that my documents are safe?",
    a: "Documents are handled under controlled access and internal workflow practices during processing.",
  },
  {
    q: "What is Corpseed cashback policy?",
    a: "Cashback/benefits depend on campaigns and terms. Please refer to the policy page or contact support.",
  },
  {
    q: "Process to register customer complaints?",
    a: "Email or call support with your reference details. Our team will respond with next steps.",
  },
  {
    q: "What is the process for online payment?",
    a: "Select service → proceed to checkout → pay securely → receive confirmation and next steps.",
  },
  {
    q: "Is the online payment secured?",
    a: "Payments are processed via secure gateways using encrypted channels as per the payment provider standards.",
  },
];

function inr(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN");
}

function calculateMCAFees({ state, companyType, capitalAmount }) {
  const rulesForState = MCA_RULES?.[state];
  if (!rulesForState) {
    return { error: `No rules configured for ${state}`, breakdown: null, total: 0 };
  }

  const rule = rulesForState?.[companyType] || rulesForState?.default;

  const breakdown = {
    state,
    companyType,
    capitalAmount: Number(capitalAmount || 0),
    normalFee: rule.normalFee || 0,
    moaFee: rule.moaFee || 0,
    aoaFee: rule.aoaFee || 0,
    stampDuty: rule.stampDuty || 0,
    stampDutyAOA: rule.stampDutyAOA || 0,
    stampDutyMOA: rule.stampDutyMOA || 0,
  };

  const total =
    breakdown.normalFee +
    breakdown.moaFee +
    breakdown.aoaFee +
    breakdown.stampDuty +
    breakdown.stampDutyAOA +
    breakdown.stampDutyMOA;

  return { error: "", breakdown, total };
}

function Line({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-semibold text-slate-900">
        ₹ {inr(value)}
      </div>
    </div>
  );
}

function StepCard() {
  const steps = [
    { n: 1, title: "Choose company type", desc: "Select the entity you want to incorporate." },
    { n: 2, title: "Pick state", desc: "Stamp duties differ state-wise." },
    { n: 3, title: "Enter capital amount", desc: "Provide the capital you plan to invest." },
    { n: 4, title: "Get breakdown instantly", desc: "See MOA/AOA + stamp duty + total." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">How it works</h3>
      <div className="mt-5 space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {s.n}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">{s.title}</div>
              <div className="mt-1 text-sm text-slate-500">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function McaCalculatorClient() {
  const [state, setState] = React.useState("Delhi");
  const [companyType, setCompanyType] = React.useState("Public Limited Company");
  const [capitalAmount, setCapitalAmount] = React.useState("10000000");

  const [submitted, setSubmitted] = React.useState(false);

  const result = React.useMemo(() => {
    if (!submitted) return { error: "", breakdown: null, total: 0 };
    return calculateMCAFees({ state, companyType, capitalAmount });
  }, [submitted, state, companyType, capitalAmount]);

  const breakdown = result.breakdown;

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -right-28 top-16 h-[460px] w-[460px] rounded-full bg-indigo-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Intro */}
            <div className="min-w-0 lg:col-span-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Calculate your <span className="text-blue-600">MCA Fees</span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-600">
                Quick estimate for stamp duty + MOA/AOA fees, based on state and company type.
              </p>

              <div className="mt-8 hidden max-w-md lg:block">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={calcImg}
                      alt="MCA calculator"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <StepCard />
              </div>
            </div>

            {/* Right: Form + Result */}
            <div className="min-w-0 lg:col-span-6">
              <div className="lg:sticky lg:top-6">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {/* Header */}
                  <div className="border-b border-slate-200 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Get started</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Enter details to calculate fees instantly.
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        MCA Fee Calculator
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Select State
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          {Object.keys(MCA_RULES).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Company Type
                        </label>
                        <select
                          value={companyType}
                          onChange={(e) => setCompanyType(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          {COMPANY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Capital Amount
                        </label>
                        <input
                          type="number"
                          value={capitalAmount}
                          onChange={(e) => setCapitalAmount(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          placeholder="e.g. 10000000"
                        />
                        <div className="mt-2 text-xs text-slate-500">
                          This is used when fees depend on capital slabs (if configured).
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSubmitted(true)}
                        className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
                      >
                        Calculate
                      </button>

                      {submitted && result.error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          {result.error}
                        </div>
                      ) : null}
                    </div>

                    {/* Result */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Stamp Duties</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {submitted && breakdown
                              ? `${breakdown.state} • ${breakdown.companyType}`
                              : "Submit to see breakdown"}
                          </div>
                        </div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {submitted && breakdown ? `₹ ${inr(result.total)}` : "—"}
                        </div>
                      </div>

                      <div className="mt-4 divide-y divide-slate-200">
                        <Line label="Normal" value={submitted && breakdown ? breakdown.normalFee : 0} />
                        <Line label="MOA Fees" value={submitted && breakdown ? breakdown.moaFee : 0} />
                        <Line label="AOA Fees" value={submitted && breakdown ? breakdown.aoaFee : 0} />
                        <Line label="Stamp Duty" value={submitted && breakdown ? breakdown.stampDuty : 0} />
                        <Line
                          label="Stamp Duty AOA"
                          value={submitted && breakdown ? breakdown.stampDutyAOA : 0}
                        />
                        <Line
                          label="Stamp Duty MOA"
                          value={submitted && breakdown ? breakdown.stampDutyMOA : 0}
                        />
                      </div>

                      {/* Total Bar */}
                      <div className="mt-5 overflow-hidden rounded-xl bg-green-500">
                        <div className="flex items-center justify-between px-5 py-4">
                          <div className="text-sm font-semibold tracking-wide text-white">
                            TOTAL
                          </div>
                          <div className="text-2xl font-bold text-white">
                            ₹ {submitted ? inr(result.total) : "0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mini note */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
                  Tip: If your state has slab-based fees, add slab rules inside <b>MCA_RULES</b>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-semibold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600">
            Quick answers about process, payments and support.
          </p>

          <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-semibold text-slate-900">
                  {f.q}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-6 text-slate-600">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
