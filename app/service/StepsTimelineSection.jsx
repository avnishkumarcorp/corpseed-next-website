"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StepDot({ active }) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      {/* outer */}
      <span
        className={cn(
          "absolute h-10 w-10 rounded-full border transition-all duration-300",
          active ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
        )}
      />
      {/* inner */}
      <span
        className={cn(
          "relative h-3 w-3 rounded-full transition-all duration-300",
          active ? "bg-blue-600" : "bg-slate-300"
        )}
      />
    </div>
  );
}

function StepCard({ step, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full cursor-pointer text-left",
        "rounded-2xl border bg-white p-6 shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-[2px] hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        active ? "border-blue-500 shadow-md" : "border-slate-200"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
              active
                ? "bg-blue-50 text-blue-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            STEP {step.no}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {step.desc}
          </p>

          {/* optional meta row (phone/email etc.) */}
          {step.meta ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {step.meta.map((m, idx) => (
                <span key={idx} className="text-blue-500">
                  {m}
                </span>
              ))}
            </div>
          ) : null}

          {/* optional links */}
          {step.links?.length ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {step.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default function StepsTimelineSection({ steps: stepsProp }) {
  const steps = useMemo(
    () =>
      stepsProp?.length
        ? stepsProp
        : [
            {
              no: 1,
              title: "Connect With Corpseed",
              desc: "Connect with the Corpseed team to discuss your requirements at IVR: 7558640644 or hello@corpseed.com. It takes 20–25 minutes to discuss the requirement.",
              meta: ["IVR: 7558640644", "Email: hello@corpseed.com"],
            },
            {
              no: 2,
              title: "Dedicated Manager",
              desc: "Once you discuss the requirement, we will align a dedicated Account Manager to understand your business needs and assist throughout the process.",
            },
            {
              no: 3,
              title: "Real Time Update",
              desc: "Track the progress of your application and always know what’s in progress and what’s done.",
            },
            {
              no: 4,
              title: "Job Completed",
              desc: "Once the job is completed, you will receive registrations & certifications directly to your email ID and at your doorstep.",
            },
          ],
    [stepsProp]
  );

  const [active, setActive] = useState(steps?.[0]?.no ?? 1);

  return (
    <section className="bg-white pb-6">
      <div className="mx-auto max-w-6xl ">
        {/* Timeline */}
        <div className="mt-10">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[20px] top-0 h-full w-[2px] bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />

            <div className="space-y-6">
              {steps.map((s) => {
                const isActive = active === s.no;
                return (
                  <div key={s.no} className="relative flex gap-6">
                    {/* Rail */}
                    <div className="relative z-10">
                      <StepDot active={isActive} />
                    </div>

                    {/* Card */}
                    <div className="flex-1">
                      <StepCard
                        step={s}
                        active={isActive}
                        onClick={() => setActive(s.no)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
