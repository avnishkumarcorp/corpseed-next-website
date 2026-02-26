"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  ArrowRight,
  Handshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PartnerRegisterModal from "./PartnerRegisterModal";
import icon1 from "../assets/Group 1006.svg";
import icon2 from "../assets/Group 1007.svg";
import icon3 from "../assets/Group 1008.svg";
import icon4 from "../assets/Group 1009.svg";
import Image from "next/image";

const advantages = [
  {
    title: "Earning Money",
    desc: "Earn upto 20% commission for every job you outsource to other partners.",
    icon: icon1,
  },
  {
    title: "Intelligent Reporting",
    desc: "Learn about new time-saving reporting at your fingertips.",
    icon: icon2,
  },
  {
    title: "Growth Potential",
    desc: "Become part of the network of one of the fastest growing companies.",
    icon: icon3,
  },
  {
    title: "Easy Registration",
    desc: "Register in less than 10 minutes, All you need is to have a business of your own.",
    icon: icon4,
  },
];

const steps = [
  {
    title: "Outsource A Service",
    desc: "List your service on our portal and you are done. Our Help Team will always be there if anything goes wrong.",
    icon: Handshake,
  },
  {
    title: "Easy Delivery of Service",
    desc: "Enjoy hassle free delivery of service. Let another expert partner of CorpSeed handle it end to end and you will be paid up to 15%. Isn't that simple ?",
    icon: ShieldCheck,
  },
];

export default function PartnerWithUsClient({}) {
  let location = `${process.env.NEXT_PUBLIC_API_BASE_URL}/partner`;
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <main className="bg-white">
      <PartnerRegisterModal
        open={open}
        onClose={closeModal}
        location={location}
        page={"partner"}
      />

      {/* HERO */}
      <section className="relative border-b border-gray-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                Partner Network • India
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                PARTNER WITH US
              </h1>

              <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                Are you an attorney with a zeal to help people with legal
                services and a strong statistic to prove it? Let's talk. We're
                looking for attorneys across India to provide our
                customers/Partners with sound legal advice, consulting,
                representation and other related legal services.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="#advantages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-gray-900 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  See Benefits
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600">
                <Pill text="Fast onboarding" />
                <Pill text="Dedicated support" />
                <Pill text="Transparent payouts" />
              </div>
            </div>

            {/* Right card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-slate-50">
                  <p className="text-sm font-semibold text-gray-900">
                    Partner Snapshot
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Why professionals join Corpseed
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <StatRow
                    icon={CheckCircle2}
                    title="Commission opportunity"
                    value="Upto 20%"
                  />
                  <StatRow
                    icon={CheckCircle2}
                    title="Onboarding"
                    value="Under 10 minutes"
                  />
                  <StatRow
                    icon={CheckCircle2}
                    title="Delivery model"
                    value="Hassle-free"
                  />
                  <StatRow
                    icon={CheckCircle2}
                    title="Reporting"
                    value="Time-saving insights"
                  />

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={openModal}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-black transition cursor-pointer"
                    >
                      Register Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      By registering, you agree to basic partner terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Right */}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Advantages Of Being Part Of Our Community
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              A partner experience designed for speed, clarity, and growth.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item) => (
              <AdvCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 md:py-14 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              Joining Corpseed Is Really Easy
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Simple steps. Clear process. Strong partner support.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {steps.map((s, idx) => (
              <StepCard key={s.title} step={idx + 1} {...s} />
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Register Now <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-gray-900 font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Ready to become a Corpseed Partner?
              </h3>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Join the network and start delivering compliance and legal
                services with a smoother, faster workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-black transition cursor-pointer"
            >
              Register Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------ Small UI components ------------------ */

function Pill({ text }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
      {text}
    </span>
  );
}

function StatRow({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

function AdvCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      {/* BIG IMAGE */}
      <div className="relative h-48 w-full bg-blue-50">
        <Image src={icon} alt={title} fill className="object-contain p-6" />
      </div>

      {/* CONTENT */}
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">STEP {step}</p>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        <div className="h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-sm font-bold text-gray-900">
          {step}
        </div>
      </div>

      <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
