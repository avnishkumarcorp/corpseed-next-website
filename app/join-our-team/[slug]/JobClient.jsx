"use client";

import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(d) {
  if (!d) return "—";
  // API: YYYY-MM-DD
  return String(d);
}

function salaryLabel(s) {
  if (!s || s === "0") return "Negotiable";
  return s;
}

function toBulletsFromText(text) {
  // If your API later sends real bullet text, you can improve this
  // For now we return a stable list like your screenshot style.
  return [
    "To manage quality profile through quality parameter designing module.",
    "1st face of clients - work on bad fits, reopen cases, quality check, IVR calls.",
    "To create and publish regular audit reports with management and clients.",
    "To identify gaps and conduct feedback and refresh with clients to improve the sales.",
    "Build, develop and maintain data models, reporting systems, dashboards and performance metrics.",
    "Prospects that is for generate a lead and transfer to advisor.",
    "Maintain and expand the company’s database of prospects.",
  ];
}

export default function JobClient({ job }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const bullets = useMemo(() => toBulletsFromText(""), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setToast("");

    const form = new FormData(e.currentTarget);

    // you can replace this with your real API later
    // currently using a fake endpoint
    const payload = Object.fromEntries(form.entries());
    payload.jobSlug = job?.slug;
    payload.jobId = job?.id;

    try {
      setSubmitting(true);

      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      setToast("✅ Application submitted successfully (demo).");
      e.currentTarget.reset();
      setApplyOpen(false);
    } catch (err) {
      setToast("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header row inside card */}
      <div className="px-6 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 uppercase">
            {job?.title || "JOB"}
          </h2>

          <div className="flex items-center gap-3 md:mt-1">
            <button
              type="button"
              onClick={() => {
                // simple share: copy url
                try {
                  navigator.clipboard?.writeText(window.location.href);
                  setToast("🔗 Link copied!");
                } catch {
                  setToast("🔗 Copy failed. Please copy manually.");
                }
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold
                         text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Share
            </button>

            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white
                         hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {toast ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            {toast}
          </div>
        ) : null}
      </div>

      <div className="px-6 py-8">
        {/* Job Summary */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-slate-900">Job Summary</h3>

          <ul className="mt-4 space-y-2 text-sm text-slate-700 leading-6">
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Positions open</span> :{" "}
                {job?.noOfPosition ?? "—"}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Qualification</span> :{" "}
                {job?.qualification || "—"}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Experience</span> :{" "}
                {job?.experience || "—"}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Salary</span> :{" "}
                {salaryLabel(job?.salary)}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Location</span> :{" "}
                {job?.jobLocation || "—"}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">Post Date</span> :{" "}
                {formatDate(job?.postDate)}
              </span>
            </li>
          </ul>
        </div>

        <div className="my-10 h-px bg-slate-200" />

        {/* Job Details */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Job Details :</h3>

          <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
            Corpseed ITES Pvt. Ltd. is a technology platform, make things easier
            for Entrepreneurs and businesses. Just like a seed is required to
            grow a tree similarly, there are few prerequisites like "Business
            Planning, finalizing the legal structure of the business, Govt
            Licenses/Permits, Legal compliance, financial structure & Integration
            of right technology to operate the business". These prerequisites act
            as a seed for an organization to grow successfully. These are the
            basic mandatory requirements a business must follow, in order to
            sustain in the current competitive environment. Our goal is to help
            entrepreneurs in managing these most important business requirements,
            at an affordable price for better growth, compliance, and
            sustainability.
          </p>

          <p className="mt-6 text-sm font-semibold text-slate-900">
            Job Description:
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-700 leading-6">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen ? (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => (!submitting ? setApplyOpen(false) : null)}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Please Fill In all Details
                  </p>
                  <p className="text-xs text-slate-500">
                    Applying for: <span className="font-semibold">{job?.title}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setApplyOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm
                             text-slate-700 hover:bg-slate-50 cursor-pointer"
                  disabled={submitting}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={onSubmit} className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Please enter your full name"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Please enter your email address"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="mobile"
                      required
                      placeholder="Phone Number"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      What is your current CTC ? <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-200">
                      <span className="px-3 py-2.5 text-sm text-slate-600 bg-slate-50 border-r border-slate-200">
                        ₹
                      </span>
                      <input
                        name="currentCTC"
                        required
                        placeholder="Please enter your current CTC"
                        className="w-full px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Current Location? <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      required
                      placeholder="Please enter your location"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Total Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experience"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                      defaultValue="Fresher"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="0-1">0-1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Goal motivates you to be the best? <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="goal"
                      required
                      placeholder="Please enter your answer"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Upload a CV <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="cv"
                      type="file"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
                                 cursor-pointer file:cursor-pointer
                                 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100
                                 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700
                                 hover:file:bg-slate-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      What is your motivation to join Corpseed ?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="motivation"
                      required
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm
                                 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">* Mandatory</p>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setApplyOpen(false)}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold
                               text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    disabled={submitting}
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className={cn(
                      "rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white",
                      "hover:bg-blue-700 transition shadow-sm cursor-pointer",
                      submitting && "opacity-70 cursor-not-allowed"
                    )}
                    disabled={submitting}
                  >
                    {submitting ? "Applying..." : "Apply Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
