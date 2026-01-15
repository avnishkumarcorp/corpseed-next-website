"use client";

import { Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function EnquiryForm({ serviceName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: call your API
    console.log("Enquiry:", { ...form, serviceName });
  };

  return (
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
          <label className="text-xs font-semibold text-gray-600">Email*</label>
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
          <label className="text-xs font-semibold text-gray-600">Phone*</label>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500">
            <Phone className="h-4 w-4 text-gray-500" />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full text-sm outline-none"
              placeholder="+91 Phone"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">City*</label>
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Please enter your city"
            required
          />
        </div>

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          type="submit"
        >
          Get Free Consultation
        </button>

        <div className="flex items-start gap-2 text-xs text-gray-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-green-600" />
          <p>
            Your details are safe with us. By submitting you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
}
