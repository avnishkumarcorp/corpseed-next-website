"use client";
import { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import {
  sendOtp,
  verifyOtp,
  submitPartnerEnquiry,
  submitConsultNowEnquiry,
  submitBookMeetingEnquiry,
} from "../lib/enquiryOtp";
import { createPortal } from "react-dom";

function Input({
  label,
  required,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition text-[#212529]
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default function ConsultNowModal({
  open,
  onClose,
  title = "Consult Now",
  consultNow = false,
  categoryId,
  bookMeeting,
  location,
  page,
  slug,
}) {
  const [step, setStep] = useState(1); // 1=form, 2=otp, 3=success
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const [otp, setOtp] = useState("");

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Email is required.");
      return false;
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(valid ? "" : "Please enter a valid email address.");
    return valid;
  };

  const canSendOtp = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      mobile.trim().length >= 10 &&
      city.trim().length >= 2 &&
      email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  }, [name, mobile, city, email]);

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setErr("");
    setName("");
    setEmail("");
    setMobile("");
    setCity("");
    setMessage("");
    setOtp("");
  };

  useEffect(() => {
    if (!open) resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSendOtp = async () => {
    setErr("");
    if (!canSendOtp) {
      validateEmail(email); // trigger email error message
      setErr("Please fill all required fields correctly.");
      return;
    }

    try {
      setLoading(true);
      const r = await sendOtp({
        name,
        mobile,
        email,
        city,
        message,
        location,
      });

      if (!r.ok) {
        setErr(r.data || `Send OTP failed (${r.status})`);
        setLoading(false);
        return;
      }

      setStep(2);
      setLoading(false);
    } catch (e) {
      setErr("Send OTP failed.");
      setLoading(false);
    }
  };

  const handleVerifyAndSubmit = async () => {
    setErr("");

    if (!otp.trim()) {
      setErr("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ VERIFY OTP
      const v = await verifyOtp({ mobile, otp, name });

      if (!v.ok) {
        setErr(v.data || `OTP verification failed (${v.status})`);
        setLoading(false);
        return;
      }

      // 2️⃣ CALL CORRECT ENQUIRY API
      let response;

      if (bookMeeting) {
        response = await submitBookMeetingEnquiry({
          name,
          email,
          mobile,
          city,
          message,
          otp,
          location,
          page,
          slug,
        });
      } else if (consultNow) {
        response = await submitConsultNowEnquiry({
          otp,
          name,
          email,
          mobile,
          message,
          location,
          categoryId,
          city,
          page,
          slug,
          // 🔥 ADD THIS
        });
      } else {
        response = await submitPartnerEnquiry({
          otp,
          name,
          email,
          mobile,
          message,
          location,
          page,
          slug,
        });
      }

      // 3️⃣ HANDLE HTTP ERROR
      if (!response.ok) {
        setErr(`Submit failed (${response.status})`);
        setLoading(false);
        return;
      }

      // 4️⃣ HANDLE BACKEND BUSINESS STATUS
      const backendStatus = response.data?.status?.toLowerCase();

      if (["success", "duplicate", "pass"].includes(backendStatus)) {
        setStep(3);
        setLoading(false);
        return;
      }

      // 5️⃣ UNEXPECTED RESPONSE
      setErr(response.data?.message || "Something went wrong.");
      setLoading(false);
    } catch (e) {
      console.error("Submit Error:", e);
      setErr("Something went wrong.");
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {step !== 3 ? (
              <p className="mt-1 text-sm text-slate-600">
                Please fill the form and send us, we&apos;ll get back to you as
                soon as possible.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* body */}
        <div
          className="px-6 py-5 max-h-[70vh] overflow-auto"
          style={{ maxHeight: "60vh", overflow: "auto" }}
        >
          {err ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={setName}
                placeholder="Enter your name"
              />
              <Input
                label="Email Address"
                required
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  validateEmail(val);
                }}
                placeholder="Enter your email"
                type="email"
                error={emailError}
              />
              <Input
                label="Mobile No"
                required
                value={mobile}
                onChange={setMobile}
                placeholder="Phone Number"
              />
              <Input
                label="City"
                required
                value={city}
                onChange={setCity}
                placeholder="Entry city"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Message"
                  value={message}
                  onChange={setMessage}
                  placeholder="Write your message..."
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="max-w-lg">
              <p className="text-sm text-slate-700">
                OTP sent to <span className="font-semibold">{mobile}</span>.
                Please enter OTP to continue.
              </p>

              <div className="mt-4">
                <Input
                  label="Enter OTP"
                  required
                  value={otp}
                  onChange={setOtp}
                  placeholder="4-digit OTP"
                />
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Name: <span className="font-semibold">{name}</span> • City:{" "}
                <span className="font-semibold">{city}</span>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="py-12 text-center animate-fadeIn">
              {/* Icon wrapper */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-200/50">
                {/* Soft pulse ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>

                {/* Icon */}
                <CheckCircle2 className="relative h-12 w-12 text-white" />
              </div>

              {/* Title */}
              <h3 className="mt-8 text-xl font-semibold text-slate-900">
                Thank You! 🎉
              </h3>

              {/* Subtitle */}
              <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your request has been submitted successfully. Our team will
                reach out to you shortly.
              </p>

              {/* Small soft divider */}
              <div className="mt-6 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

              {/* Optional small note */}
              <p className="mt-4 text-xs text-slate-500">
                We appreciate your trust in Corpseed.
              </p>
            </div>
          ) : null}
        </div>

        {/* footer */}
        {step !== 3 ? (
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify & Submit"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
