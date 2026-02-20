"use client";

import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";
import { MapPin, Phone, Mail, HelpCircle, ShieldCheck } from "lucide-react";
import { sendOtp, submitContactUsEnquiry, verifyOtp } from "@/app/lib/enquiryOtp";

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
      <div className="flex items-start justify-between border-b px-6 py-4 bg-slate-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
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
          className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg font-semibold
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
        />
      ))}
    </div>
  );
}

/* ---------------- INPUTS ---------------- */

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function ContactUsClient({ data }) {
  const addresses = data?.addresses || [];

  // ✅ One form for all: name, mobile mandatory; others optional
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
    () =>
      String(form.mobile || "")
        .replace(/\D/g, "")
        .slice(0, 10),
    [form.mobile],
  );

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ---------------- SEND OTP ---------------- */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Name is required.");
    if (cleanMobile.length !== 10)
      return setError("Enter valid 10 digit mobile number.");

    setError("");
    setLoading(true);

    const res = await sendOtp({
      name: form.name,
      mobile: cleanMobile,
      email: form.email,
      location: form.location,
      message: form.message,
    });

    setLoading(false);

    if (!res.ok) {
      try {
        const j = JSON.parse(res.data || "{}");
        setError(j?.message || "Failed to send OTP. Try again.");
      } catch {
        setError(res.data || "Failed to send OTP. Try again.");
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

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError("Enter 4 digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    // 1️⃣ VERIFY OTP
    const res = await verifyOtp({
      mobile: cleanMobile,
      otp,
      name: resData?.name || form.name,
    });

    if (!res.ok) {
      setLoading(false);
      setError("Invalid OTP. Please try again.");
      return;
    }

    // 2️⃣ CALL CONTACT-US API AFTER VERIFY
    const contactRes = await submitContactUsEnquiry({
      otp,
      name: form.name,
      email: form.email,
      mobile: cleanMobile,
      city: form.location, // backend expects city
      message: form.message,
      location: form.location,
    });

    setLoading(false);

    if (!contactRes.ok) {
      setError(`Submit failed (${contactRes.status})`);
      return;
    }

    const backendStatus = contactRes.data?.status?.toLowerCase();

    if (["success", "pass", "duplicate"].includes(backendStatus)) {
      setStep("success");
      setForm({
        name: "",
        email: "",
        mobile: "",
        location: "",
        message: "",
      });
      setOtp("");
      return;
    }

    setError(contactRes.data?.message || "Something went wrong.");
  };

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Thanks for your interest in Corpseed. Share your requirement and
              we’ll contact you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* FORM */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-200 bg-slate-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Leave Us a Message
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Verify with OTP for quick assistance.
                </p>
              </div>

              <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-4">
                <Field label="Name" required>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none
                                 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>

                  <Field label="Location">
                    <input
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      placeholder="City / Location"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none
                                 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </Field>
                </div>

                <Field label="Mobile" required>
                  <div
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3
                                  focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
                  >
                    <span className="text-sm text-gray-600">🇮🇳 +91</span>
                    <div className="h-5 w-px bg-gray-200" />
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={onChange}
                      inputMode="numeric"
                      placeholder="10 digit mobile number"
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </Field>

                <Field label="Message">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                    placeholder="Tell us what you need"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none resize-none
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </Field>

                {error && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white
                             hover:bg-blue-700 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Submit"}
                </button>

                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-green-600" />
                  <p>
                    Your details are safe with us. By submitting you agree to
                    our Terms & Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* OFFICES */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-200 bg-slate-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Our Offices
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Reach the nearest Corpseed location
                </p>
              </div>

              <div className="p-6 sm:p-8  space-y-6">
                {addresses.length ? (
                  addresses.map((a) => (
                    <Office
                      key={a?.uuid || a?.id}
                      city={a?.title}
                      phone={a?.mobile}
                      email={a?.email}
                      address={a?.address}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-600">
                    No office addresses found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOT LINKS */}
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCard text="Have questions?" linkText="FAQs" href="/faq" />
          <HelpCard
            text="For job opportunities"
            linkText="Open roles"
            href="/join-our-team"
          />
          <HelpCard
            text="For business partnerships"
            linkText="Forum"
            href="/partner"
          />
        </div>
      </section>

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
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white
                         hover:bg-blue-700 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </Modal>
      </Backdrop>

      {/* ===== SUCCESS MODAL ===== */}
      <Backdrop open={step === "success"} onClose={() => setStep("idle")}>
        <Modal
          title="Message Sent!"
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
    </main>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function Office({ city, phone, email, address }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <p className="font-semibold text-gray-900">{city}</p>
      </div>

      <div className="mt-3 pl-12 space-y-2">
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-blue-600" /> {phone}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-blue-600" /> {email}
        </p>
        <p className="text-sm text-gray-600 whitespace-pre-line">{address}</p>
      </div>
    </div>
  );
}

function HelpCard({ text, linkText, href }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6 flex items-center gap-4">
      <HelpCircle className="w-6 h-6 text-blue-600" />
      <p className="text-gray-700 text-sm">
        {text}{" "}
        <Link
          href={href}
          className="text-blue-700 font-semibold underline cursor-pointer"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}
