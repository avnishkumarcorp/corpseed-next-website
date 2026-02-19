"use client";

import React, { useState } from "react";
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
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
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
  const refs = React.useRef([]);

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

export default function EnquiryOtpInline({ onVerified }) {
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState(true);

  const [otp, setOtp] = React.useState("");
  const [step, setStep] = React.useState("idle"); // idle | otp | success
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resData,setResData]=useState()

  const cleanMobile = mobile.replace(/\D/g, "").slice(0, 10);

  /* -------- SUBMIT FORM -------- */
  const handleSubmit = async () => {
  if (!name.trim()) return setError("Name is required.");
  if (cleanMobile.length !== 10)
    return setError("Enter valid 10 digit mobile number.");

  setError("");
  setLoading(true);
  const res = await sendOtp({ name, mobile: cleanMobile });
  setLoading(false);

  if (!res.ok) {
    setError(res?.data?.message || "Failed to send OTP. Try again.");
    return;
  }
  // ✅ res.data is already JSON object
  setResData(JSON?.parse(res?.data));
  setStep("otp");
};


  /* -------- VERIFY OTP -------- */
  const handleVerify = async () => {
    if (otp.length !== 4) return setError("Enter 4 digit OTP.");

    setLoading(true);
    setError("");

    const res = await verifyOtp({ mobile: cleanMobile, otp,name:resData?.name });
    setLoading(false);

    if (res.status === 200) {
      setStep("success");
      onVerified?.({ name, mobile: cleanMobile, whatsapp });
      setMobile("")
      setName("")
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      {/* ===== ALWAYS VISIBLE FORM ===== */}
      <div className="bg-white p-5">
        <h3 className="text-base font-semibold text-gray-900">
          Schedule a call back
        </h3>

        <div className="mt-4 space-y-4">
          <input
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
          />

          <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500">
            <div className="flex items-center text-nowrap gap-1 bg-gray-50 px-3 text-sm ">
              🇮🇳 +91
            </div>
            <input
              placeholder="Phone Number *"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              inputMode="numeric"
              className="h-11 w-full px-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Get updates on WhatsApp</span>
            <button
              onClick={() => setWhatsapp(!whatsapp)}
              className={cn(
                "h-6 w-11 rounded-full relative transition cursor-pointer",
                whatsapp ? "bg-blue-600" : "bg-gray-300",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white transition",
                  whatsapp ? "left-6" : "left-1",
                )}
              />
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Submit"}
          </button>
        </div>
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
