"use client";

import React, { useMemo, useRef, useState } from "react";
import { Phone, ShieldCheck } from "lucide-react";
import { sendOtp, verifyOtp } from "@/app/lib/enquiryOtp";

function cn(...s) {
  return s.filter(Boolean).join(" ");
}

/* ---------------- MODAL HELPERS ---------------- */

function Backdrop({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
      <div className="flex items-start justify-between border-b px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ---------------- OTP INPUT ---------------- */

function OTPInput({ value, onChange, length = 4 }) {
  const refs = useRef([]);

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ""}
          inputMode="numeric"
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
          className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
        />
      ))}
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function EnquiryForm({ serviceName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    message: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("idle"); // idle | otp | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resData, setResData] = useState(null);

  const cleanMobile = useMemo(
    () => String(form.mobile || "").replace(/\D/g, "").slice(0, 10),
    [form.mobile]
  );

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* -------- SUBMIT FORM (SEND OTP) -------- */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Name is required.");
    if (cleanMobile.length !== 10)
      return setError("Enter valid 10 digit mobile number.");

    setError("");
    setLoading(true);

    // ✅ Send all fields (only name+mobile required by API)
    const res = await sendOtp({
      name: form.name,
      mobile: cleanMobile,
      email: form.email,
      location: form.location,
      message: form.message || `Enquiry for ${serviceName}`,
    });

    setLoading(false);

    if (!res.ok) {
      // backend might return json or text
      try {
        const j = JSON.parse(res.data || "{}");
        setError(j?.message || "Failed to send OTP. Try again.");
      } catch {
        setError(res.data || "Failed to send OTP. Try again.");
      }
      return;
    }

    // backend returns text/json (your previous code parses)
    try {
      setResData(JSON.parse(res.data));
    } catch {
      setResData({ name: form.name });
    }

    setOtp("");
    setStep("otp");
  };

  /* -------- VERIFY OTP -------- */
  const handleVerify = async () => {
    if (otp.length !== 4) return setError("Enter 4 digit OTP.");

    setLoading(true);
    setError("");

    const res = await verifyOtp({
      mobile: cleanMobile,
      otp,
      name: resData?.name || form.name,
    });

    setLoading(false);

    if (res.status === 200) {
      setStep("success");
      // ✅ reset form
      setForm({ name: "", email: "", mobile: "", location: "", message: "" });
      setOtp("");
      setResData(null);
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-lg font-bold text-gray-900">Enquiry Now for</p>
        <p className="text-lg font-bold text-blue-600">{serviceName}?</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Name*</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Please enter your full name"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">
              Email*
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Please enter your email id"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">
              Mobile*
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500">
              <Phone className="h-4 w-4 text-gray-500" />
              <input
                name="mobile"
                value={form.mobile}
                onChange={onChange}
                className="w-full text-sm outline-none"
                placeholder="+91 Phone"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">
              Location*
            </label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Please enter your city"
              required
            />
          </div>

          {/* optional message (if you want) */}
          {/* <div>
            <label className="text-xs font-semibold text-gray-600">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Write message..."
              rows={3}
            />
          </div> */}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Get Free Consultation"}
          </button>

          <div className="flex items-start gap-2 text-xs text-gray-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-green-600" />
            <p>
              Your details are safe with us. By submitting you agree to our
              Terms & Privacy Policy.
            </p>
          </div>
        </form>
      </div>

      {/* ===== OTP MODAL ===== */}
      <Backdrop open={step === "otp"} onClose={() => setStep("idle")}>
        <Modal
          title="Verify OTP"
          subtitle={`OTP sent to ${cleanMobile}`}
          onClose={() => setStep("idle")}
        >
          <div className="space-y-4">
            <OTPInput value={otp} onChange={setOtp} />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </Modal>
      </Backdrop>

      {/* ===== SUCCESS MODAL ===== */}
      <Backdrop open={step === "success"} onClose={() => setStep("idle")}>
        <Modal
          title="Enquiry Received!"
          subtitle="Our legal advisor will contact you shortly."
          onClose={() => setStep("idle")}
        >
          <div className="flex flex-col items-center py-6">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl">
              ✓
            </div>
          </div>
        </Modal>
      </Backdrop>
    </>
  );
}
