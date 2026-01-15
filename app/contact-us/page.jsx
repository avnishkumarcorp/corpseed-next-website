"use client";

import { MapPin, Phone, Mail, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import Link from "next/link";

export default function ContactUsPage() {
  const phoneRef = useRef(null);
  const itiRef = useRef(null);

  useEffect(() => {
    if (!phoneRef.current) return;

    itiRef.current = intlTelInput(phoneRef.current, {
      initialCountry: "in",
      separateDialCode: true,
      loadUtils: () => import("intl-tel-input/build/js/utils.js"),
    });

    return () => itiRef.current?.destroy();
  }, []);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Thanks for your interest in Corpseed
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* FORM */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-300 bg-white shadow-sm">
              <div className="p-6 sm:p-8 border-b border-gray-300 bg-slate-50 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  Leave Us a Message
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Our team will contact you shortly.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <Input label="Name *" placeholder="Enter your name" />
                <Input label="Email *" type="email" placeholder="Enter your email" />

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    placeholder="Enter phone number"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  />
                </div>

                <Textarea label="Message *" placeholder="Tell us what you need" />

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer">
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* OFFICES */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-300 bg-white shadow-sm">
              <div className="p-6 sm:p-8 border-b border-gray-300 bg-slate-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Our Offices
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Reach the nearest Corpseed location
                </p>
              </div>

              <div className="p-6 sm:p-8 max-h-[520px] overflow-y-auto space-y-8">
                <Office
                  city="NOIDA OFFICE"
                  phone="7558640644"
                  toll="+91 7558 640 644"
                  email="info@corpseed.com"
                  address="2nd Floor, A-154A, Sector-63, Noida, UP - 201301"
                />
                <Office
                  city="PUNE OFFICE"
                  phone="7558640644"
                  toll="+91 7558 640 644"
                  email="info@corpseed.com"
                  address="128 MG Road, Ground Floor, Camp Pune"
                />
                <Office
                  city="ODISHA OFFICE"
                  phone="7558640644"
                  toll="+91 7558 640 644"
                  email="info@corpseed.com"
                  address="Rourkela, Odisha - 769001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOT LINKS */}
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCard text="Have questions?" link="FAQs" />
          <HelpCard text="For job opportunities" link="Open roles" />
          <HelpCard text="For business partnerships" link="Forum" />
        </div>
      </section>
    </main>
  );
}

/* Components */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...props}
        rows={5}
        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
      />
    </div>
  );
}

function Office({ city, phone, toll, email, address }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <p className="font-semibold text-gray-900">{city}</p>
      </div>

      <div className="pl-12 space-y-2">
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-blue-600" /> {phone} (Toll: {toll})
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-blue-600" /> {email}
        </p>
        <p className="text-sm text-gray-600">{address}</p>
      </div>
    </div>
  );
}

function HelpCard({ text, link }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-slate-50 p-6 flex items-center gap-4">
      <HelpCircle className="w-6 h-6 text-blue-600" />
      <p className="text-gray-700">
        {text}{" "}
        <Link href={'/partner'} className="text-blue-700 font-semibold underline cursor-pointer">
          {link}
        </Link>
      </p>
    </div>
  );
}
