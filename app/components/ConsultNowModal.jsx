"use client";

import { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { sendOtp,verifyOtp, submitPartnerEnquiry, submitConsultNowEnquiry } from "../lib/enquiryOtp";

function Input({ label, required, value, onChange, type = "text", placeholder }) {
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
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
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
  categoryId
}) {
  const [step, setStep] = useState(1); // 1=form, 2=otp, 3=success
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const [otp, setOtp] = useState("");

  const canSendOtp = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      mobile.trim().length >= 10 &&
      city.trim().length >= 2
    );
  }, [name, mobile, city]);

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
      setErr("Please fill required fields (Name, Mobile, City).");
      return;
    }

    try {
      setLoading(true);
      const r = await sendOtp({
        name,
        mobile,
        email,
        location: city,
        message,
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

    // 2️⃣ CONDITIONAL API CALL
    let response;

    if (consultNow) {
      // 🔥 CONSULT NOW FLOW
      response = await submitConsultNowEnquiry({
        otp,
        name,
        email,
        mobile,
        message,
        location: city,
        categoryId
      });
    } else {
      // 🔥 PARTNER FLOW (existing)
      response = await submitPartnerEnquiry({
        otp,
        name,
        email,
        mobile,
        message,
        location: city,
      });
    }

    if (!response.ok) {
      setErr(response.data || `Submit failed (${response.status})`);
      setLoading(false);
      return;
    }

    // 3️⃣ SUCCESS
    setStep(3);
    setLoading(false);

  } catch (e) {
    setErr("Something went wrong.");
    setLoading(false);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {step !== 3 ? (
              <p className="mt-1 text-sm text-slate-600">
                Please fill the form and send us, we&apos;ll get back to you as soon as possible.
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
        <div className="px-6 py-5 max-h-[70vh] overflow-auto" style={{maxHeight:"60vh",overflow:'auto'}}>
          {err ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2" >
              <Input
                label="Full Name"
                required
                value={name}
                onChange={setName}
                placeholder="Enter your name"
              />
              <Input
                label="Email Address"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                type="email"
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
                OTP sent to <span className="font-semibold">{mobile}</span>. Please enter OTP to continue.
              </p>

              <div className="mt-4">
                <Input
                  label="Enter OTP"
                  required
                  value={otp}
                  onChange={setOtp}
                  placeholder="6-digit OTP"
                />
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Name: <span className="font-semibold">{name}</span> • City:{" "}
                <span className="font-semibold">{city}</span>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <p className="mt-6 text-lg font-semibold text-emerald-600">
                Thanks so much for sharing your experience with us !!
              </p>
              <p className="mt-2 text-sm text-blue-600">
                We hope to see you again soon !!
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
    </div>
  );
}
