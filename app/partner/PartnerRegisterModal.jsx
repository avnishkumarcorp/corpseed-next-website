"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import OtpModal from "./OtpModal";
import { sendOtp, verifyOtp, submitPartnerEnquiry } from "../lib/enquiryOtp";

const OCCUPATIONS = [
  "Chartered Accountant",
  "Company Secretary",
  "Lawyer",
  "Consultant",
  "Business Owner",
  "Freelancer",
  "Other",
];

export default function PartnerRegisterModal({
  open,
  onClose,
  location,
  page,
}) {
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    occupation: "Chartered Accountant",
    message: "",
    agree: false,
  });

  useEffect(() => {
    if (!open) return;

    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter full name.";
    if (!form.email.trim()) return "Please enter email address.";
    if (!form.mobile.trim()) return "Please enter mobile number.";
    if (!form.occupation.trim()) return "Please select occupation.";
    if (!form.message.trim()) return "Please enter message.";
    if (!form.agree) return "Please agree to terms and services.";
    return "";
  };

  // ✅ Step 1: Send OTP & open OTP modal
  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    try {
      setLoading(true);

      // sendOtp hits /api/enquiry/send-otp (your route)
      const r = await sendOtp({
        name: form.fullName,
        mobile: form.mobile,
        email: form.email,
        location: location || "",
        message: form.message,
      });

      if (!r.ok) {
        console.error("sendOtp failed:", r.status, r.data);
        alert("Failed to send OTP. Please try again.");
        return;
      }

      setOtpOpen(true);
    } catch (e) {
      console.error(e);
      alert("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerify = async (otp) => {
    const cleanOtp = String(otp || "").trim();
    if (!cleanOtp) return alert("Please enter OTP");

    try {
      setLoading(true);

      const r = await verifyOtp({
        mobile: form.mobile,
        otp: cleanOtp,
        name: form.fullName,
      });

      if (!r.ok) {
        console.error("verifyOtp failed:", r.status, r.data);
        alert("Invalid OTP. Please try again.");
        return;
      }

      setVerifiedOtp(cleanOtp);

      // ✅ Step 3: Submit partner enquiry
      const submitRes = await submitPartnerEnquiry({
        otp: cleanOtp,
        name: form.fullName,
        email: form.email,
        mobile: form.mobile,
        message: form.message,
        location: location || "",
        postDate: today,
        modifyDate: today,
        page: page,
      });

      if (!submitRes.ok) {
        console.error(
          "partner submit failed:",
          submitRes.status,
          submitRes.data,
        );
        alert("OTP verified but submit failed. Please try again.");
        return;
      }

      alert("Registered successfully!");
      setOtpOpen(false);
      onClose?.();

      // reset
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        occupation: "Chartered Accountant",
        message: "",
        agree: false,
      });
      setVerifiedOtp("");
    } catch (e) {
      console.error(e);
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const r = await sendOtp({
        name: form.fullName,
        mobile: form.mobile,
        email: form.email,
        location: location || "",
        message: form.message,
      });

      if (!r.ok) {
        console.error("resendOtp failed:", r.status, r.data);
        alert("Failed to resend OTP.");
        return;
      }

      alert("OTP resent successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OTP Modal */}
      <OtpModal
        open={otpOpen}
        mobile={form.mobile}
        name={form.fullName}
        loading={loading}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />

      {/* Main modal */}
      <div className="fixed inset-0 z-[9999]">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-sm font-semibold tracking-wide text-gray-900">
                PARTNER WITH CORPSEED
              </h3>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={onSubmit} className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Please fill in the form and send us, we'll get back to you as
                soon as possible.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="Enter your name"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Email Address *">
                  <input
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Mobile No *">
                  <input
                    value={form.mobile}
                    onChange={set("mobile")}
                    placeholder="Phone Number"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </Field>

                <Field label="Select your occupation *">
                  <select
                    value={form.occupation}
                    onChange={set("occupation")}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >
                    {OCCUPATIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Message *">
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={set("agree")}
                      className="h-4 w-4 cursor-pointer"
                    />
                    Please agree to terms and services
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Sending OTP..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}
