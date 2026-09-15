"use client";

import { sendOtp } from "@/app/lib/enquiryOtp";
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
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingPayload, setPendingPayload] = useState(null);
  const [pendingFormEl, setPendingFormEl] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [otpError, setOtpError] = useState("");

  const bullets = useMemo(() => toBulletsFromText(""), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setToast("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const cvFile = form.get("cv");

    // ✅ These are actual form fields
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const mobile = String(form.get("mobile") || "")
      .replace(/\D/g, "")
      .slice(0, 10);
    const currentCTC = String(form.get("currentCTC") || "").trim();
    const location = String(form.get("location") || "").trim();
    const experience = String(form.get("experience") || "").trim();
    const goal = String(form.get("goal") || "").trim();
    const motivation = String(form.get("motivation") || "").trim();
    const address = String(form.get("address") || "").trim();

    const hasCvFile = cvFile instanceof File && cvFile.name;

    // ✅ Checks only on fields present in form
    if (!name) return setToast("❌ Name is required.");

    if (!email) return setToast("❌ Email is required.");

    if (mobile.length !== 10) {
      return setToast("❌ Enter valid 10 digit mobile number.");
    }

    if (!currentCTC) return setToast("❌ Current CTC is required.");

    if (!location) return setToast("❌ Current location is required.");

    if (!experience) return setToast("❌ Experience is required.");

    if (!goal) return setToast("❌ Goal is required.");

    if (!hasCvFile) return setToast("❌ CV is required.");

    if (!motivation) return setToast("❌ Motivation is required.");

    if (!address) return setToast("❌ Address is required.");

    // ✅ Backend payload mapping
    const payload = {
      name,
      email,
      mobile,
      address,
      currentCTC,
      experience,

      // ✅ No qualification field in form, so send job qualification or NA
      qualification: job?.qualification || "NA",

      location,

      // ✅ form field goal mapped to backend field bestGoal
      bestGoal: goal,

      motivation,

      // ✅ form field cv mapped to backend field fileUrl
      // If backend needs real uploaded URL, replace this with upload API response URL
      fileUrl: cvFile.name,
    };

    try {
      setSubmitting(true);

      const currentPageUrl =
        typeof window !== "undefined" ? window.location.href : "career-page";

      const otpRes = await sendOtp({
        name: payload.name,
        mobile: payload.mobile,
        location: currentPageUrl,
      });

      if (!otpRes.ok) {
        setToast(
          otpRes?.data?.message || "❌ Failed to send OTP. Please try again.",
        );
        return;
      }

      setPendingPayload(payload);
      setPendingFormEl(formEl);
      setOtp("");
      setOtpError("");
      setOtpOpen(true);
      setToast("✅ OTP sent successfully. Please verify OTP.");
    } catch (err) {
      setToast("❌ Failed to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmitAfterOtp = async () => {
    if (otp.length !== 4) {
      setToast("❌ Enter valid 4 digit OTP.");
      return;
    }

    if (!pendingPayload) {
      setToast("❌ Application data missing. Please fill the form again.");
      setOtpOpen(false);
      return;
    }

    const slug = job?.slug;

    if (!slug) {
      setToast("❌ Job slug is missing.");
      return;
    }

    if (!pendingPayload.name) return setToast("❌ Name is required.");

    if (!pendingPayload.email) return setToast("❌ Email is required.");

    if (!pendingPayload.mobile || pendingPayload.mobile.length !== 10) {
      return setToast("❌ Enter valid 10 digit mobile number.");
    }

    if (!pendingPayload.currentCTC) {
      return setToast("❌ Current CTC is required.");
    }

    if (!pendingPayload.location) {
      return setToast("❌ Current location is required.");
    }

    if (!pendingPayload.experience) {
      return setToast("❌ Experience is required.");
    }

    if (!pendingPayload.bestGoal) {
      return setToast("❌ Goal is required.");
    }

    if (!pendingPayload.fileUrl) {
      return setToast("❌ CV is required.");
    }

    if (!pendingPayload.motivation) {
      return setToast("❌ Motivation is required.");
    }

    if (!pendingPayload.address) {
      return setToast("❌ Address is required.");
    }
    // if (!pendingPayload.fileUrl) return setToast("❌ CV file URL is required.");

    try {
      setSubmitting(true);
      setToast("");
      setOtpError("");

      const submitUrl = `/api/customer/career/join-our-team/${encodeURIComponent(
        slug,
      )}/submit?otp=${encodeURIComponent(otp)}`;

      console.log("CAREER FRONTEND SUBMIT URL:", submitUrl);
      console.log("CAREER FRONTEND PAYLOAD:", pendingPayload);

      const res = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pendingPayload),
      });

      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      console.log("CAREER FRONTEND STATUS:", res.status);
      console.log("CAREER FRONTEND RESPONSE:", data);

      const backendFailed =
        data?.success === false ||
        String(data?.status || "").toLowerCase() === "fail";

      if (!res.ok || backendFailed) {
        const message =
          data?.message ||
          data?.error ||
          "Application submission failed. Please try again.";

        setOtpError(`❌ ${message}`);
        return;
      }

      pendingFormEl?.reset();

      setOtp("");
      setPendingPayload(null);
      setPendingFormEl(null);
      setOtpOpen(false);
      setApplyOpen(false);

      setToast("");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
      }, 3000);
    } catch (err) {
      setToast(
        err?.message
          ? `❌ ${err.message}`
          : "❌ Application submission failed.",
      );
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
          <h3 className="text-lg font-semibold text-slate-900">
            Job Details :
          </h3>

          <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
            Corpseed ITES Pvt. Ltd. is a technology platform, make things easier
            for Entrepreneurs and businesses. Just like a seed is required to
            grow a tree similarly, there are few prerequisites like "Business
            Planning, finalizing the legal structure of the business, Govt
            Licenses/Permits, Legal compliance, financial structure &
            Integration of right technology to operate the business". These
            prerequisites act as a seed for an organization to grow
            successfully. These are the basic mandatory requirements a business
            must follow, in order to sustain in the current competitive
            environment. Our goal is to help entrepreneurs in managing these
            most important business requirements, at an affordable price for
            better growth, compliance, and sustainability.
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
                    Applying for:{" "}
                    <span className="font-semibold">{job?.title}</span>
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
                      What is your current CTC ?{" "}
                      <span className="text-red-500">*</span>
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
                      Goal motivates you to be the best?{" "}
                      <span className="text-red-500">*</span>
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
                      submitting && "opacity-70 cursor-not-allowed",
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

      {otpOpen ? (
        <div className="fixed inset-0 z-[10000]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => (!submitting ? setOtpOpen(false) : null)}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Verify OTP
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    OTP sent to {pendingPayload?.mobile}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOtpOpen(false)}
                  disabled={submitting}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-6">
                <input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Enter 4 digit OTP"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {otpError ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {otpError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleFinalSubmitAfterOtp}
                  disabled={submitting}
                  className={cn(
                    "mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700",
                    submitting && "cursor-not-allowed opacity-70",
                  )}
                >
                  {submitting ? "Submitting..." : "Verify & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {successOpen ? (
        <div className="fixed inset-0 z-[10001]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSuccessOpen(false)}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl">
              <div className="px-6 py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-3xl font-bold text-green-600">✓</span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Application Submitted Successfully
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Thank you for applying. Our HR team will review your
                  application and contact you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => setSuccessOpen(false)}
                  className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
