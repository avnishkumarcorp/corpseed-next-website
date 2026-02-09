"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export default function OtpModal({
  open,
  mobile,
  name,
  loading,
  onClose,
  onVerify, // (otp) => Promise
  onResend, // () => Promise
}) {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!open) return;
    setOtp("");
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const canVerify = otp.trim().length >= 4 && !loading;

  return (
    <div className="fixed inset-0 z-[10000]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Verify OTP</p>
              <p className="text-xs text-gray-600 mt-0.5">
                OTP sent to <span className="font-semibold">{mobile}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <div className="px-6 py-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP *
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              placeholder="Enter OTP"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={onResend}
                disabled={loading}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-60"
              >
                Resend OTP
              </button>

              <button
                type="button"
                onClick={() => onVerify?.(otp)}
                disabled={!canVerify}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Name: <span className="font-medium">{name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
