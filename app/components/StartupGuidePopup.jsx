"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sendOtp, verifyOtp } from "@/app/lib/enquiryOtp";

/* ---------------- MODAL SHELL (matches screenshot) ---------------- */

function Backdrop({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="w-full max-w-[820px] overflow-hidden rounded-md bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-[18px] font-medium text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="h-px bg-slate-200" />

      {/* Body */}
      <div className="px-8 py-6">{children}</div>
    </div>
  );
}

/* ---------------- OTP INPUT ---------------- */

function OTPInput({ value, onChange, length = 4 }) {
  const refs = useRef([]);

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ""}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            const next = value.split("");
            next[i] = v;
            onChange(next.join("").slice(0, length));
            if (v && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          className="h-12 w-12 rounded border border-slate-300 text-center text-lg font-semibold outline-none focus:border-blue-500"
        />
      ))}
    </div>
  );
}

/* ---------------- VALIDATORS ---------------- */

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());

export default function StartupGuidePopup({ open, onClose }) {
  const [step, setStep] = useState("form"); // form | otp | success
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [otp, setOtp] = useState("");
  const [resData, setResData] = useState(null);

  const cleanMobile = useMemo(
    () =>
      String(form.mobile || "")
        .replace(/\D/g, "")
        .slice(0, 10),
    [form.mobile],
  );

  // reset when closed
  useEffect(() => {
    if (!open) return;
    setStep("form");
    setLoading(false);
    setBannerError("");
    setOtp("");
    setResData(null);
    setFieldErrors({ name: "", email: "", mobile: "" });
    // keep form values if you want, or reset:
    // setForm({ name: "", email: "", mobile: "" });
  }, [open]);

  const setField = (name, value) => {
    setBannerError("");
    setFieldErrors((p) => ({ ...p, [name]: "" }));

    if (name === "mobile") {
      const digits = String(value || "")
        .replace(/\D/g, "")
        .slice(0, 10);
      setForm((p) => ({ ...p, mobile: digits }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const next = { name: "", email: "", mobile: "" };
    let ok = true;

    if (!String(form.name || "").trim()) {
      next.name = "Full Name is required.";
      ok = false;
    }

    if (!isValidEmail(form.email)) {
      next.email = "Enter a valid email address.";
      ok = false;
    }

    if (cleanMobile.length !== 10) {
      next.mobile = "Enter valid 10 digit mobile number.";
      ok = false;
    }

    setFieldErrors(next);
    return ok;
  };

  /* ---------------- 1) DOWNLOAD CLICK = SEND OTP ---------------- */
  const handleDownload = async () => {
    if (!validate()) return;

    setLoading(true);
    setBannerError("");

    const res = await sendOtp({
      name: form.name,
      mobile: cleanMobile,
      email: form.email,
      // optional fields (if your OTP api ignores, fine)
      location: "",
      message: "Startup Guide Download",
    });

    setLoading(false);

    if (!res.ok) {
      try {
        const j = JSON.parse(res.data || "{}");
        setBannerError(j?.message || "Failed to send OTP. Try again.");
      } catch {
        setBannerError(res.data || "Failed to send OTP. Try again.");
      }
      return;
    }

    try {
      setResData(JSON.parse(res.data));
    } catch {
      setResData({ name: form.name });
    }

    setOtp("");
    setStep("otp");
  };

  /* ---------------- 2) VERIFY OTP = POST DATA ---------------- */
  const handleVerify = async () => {
    if (otp.length !== 4) return setBannerError("Enter 4 digit OTP.");

    setLoading(true);
    setBannerError("");

    const vres = await verifyOtp({
      mobile: cleanMobile,
      otp,
      name: resData?.name || form.name,
    });

    if (vres.status !== 200) {
      setLoading(false);
      setBannerError("Invalid OTP. Please try again.");
      return;
    }

    // ✅ post final payload via Next route (no CORS)
    try {
      const postRes = await fetch("/api/enquiry/startup-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: cleanMobile,
          // add anything else your backend expects:
          source: "startup-guide",
        }),
      });

      const j = await postRes.json().catch(() => ({}));

      if (!postRes.ok || j?.ok === false) {
        setLoading(false);

        // 🔥 Trigger PDF download
        const pdfUrl =
          "https://erp-corpseed.s3.ap-south-1.amazonaws.com/1771321684648Corpseed_guide.pdf";

        // Method 1 (Best & Clean)
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "Corpseed_Startup_Guide.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success UI
        setStep("success");

        setBannerError(j?.message || "Failed to submit. Please try again.");
        return;
      }

      setLoading(false);
      setStep("success");
    } catch {
      setLoading(false);
      setBannerError("Network error. Please try again.");
    }
  };

  return (
    <Backdrop open={open} onClose={onClose}>
      <ModalShell
        title={step === "otp" ? "Verify OTP" : "Start Up Guide"}
        onClose={onClose}
      >
        {/* ---------- FORM ---------- */}
        {step === "form" && (
          <>
            <p className="text-[13px] text-slate-600">
              Please Fill in the form and send us, we&apos;ll get back to you as
              soon as possible.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="text-[13px] text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter your name"
                  className={[
                    "mt-1 w-full rounded border px-3 py-2 text-sm outline-none",
                    fieldErrors.name
                      ? "border-red-300"
                      : "border-slate-300 focus:border-blue-500",
                  ].join(" ")}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-[13px] text-slate-700">
                  Email Address
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Enter your email"
                  className={[
                    "mt-1 w-full rounded border px-3 py-2 text-sm outline-none",
                    fieldErrors.email
                      ? "border-red-300"
                      : "border-slate-300 focus:border-blue-500",
                  ].join(" ")}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="text-[13px] text-slate-700">
                  Mobile No <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  placeholder="Phone Number"
                  inputMode="numeric"
                  maxLength={10}
                  className={[
                    "mt-1 w-full rounded border px-3 py-2 text-sm outline-none",
                    fieldErrors.mobile
                      ? "border-red-300"
                      : "border-slate-300 focus:border-blue-500",
                  ].join(" ")}
                />
                {fieldErrors.mobile && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.mobile}
                  </p>
                )}
              </div>
            </div>

            {bannerError && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {bannerError}
              </div>
            )}

            {/* Footer buttons like screenshot */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={loading}
                className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Download"}
              </button>
            </div>
          </>
        )}

        {/* ---------- OTP ---------- */}
        {step === "otp" && (
          <>
            <p className="text-[13px] text-slate-600">
              OTP sent to <span className="font-semibold">{cleanMobile}</span>
            </p>

            <div className="mt-6">
              <OTPInput value={otp} onChange={setOtp} />
            </div>

            {bannerError && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {bannerError}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Submitting..." : "Verify"}
              </button>
            </div>
          </>
        )}

        {/* ---------- SUCCESS ---------- */}
        {step === "success" && (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-3xl">
              ✓
            </div>
            <p className="mt-4 text-sm text-slate-700">
              Submitted successfully.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalShell>
    </Backdrop>
  );
}
