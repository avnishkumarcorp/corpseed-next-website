"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function titleCase(s = "") {
  return s
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeKey(s = "") {
  return s.trim().toLowerCase();
}

function groupByJobTitle(jobs) {
  const map = new Map();
  for (const j of jobs || []) {
    const key = normalizeKey(j?.jobTitle || "other");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(j);
  }
  return map;
}

// static-looking descriptions (not from API) but auto-mapped to real tabs
const CATEGORY_BLURBS = {
  sales: "Be a legal advisor to customers and help them transform, develop, & boost their businesses.",
  delivery: "Stand at the fore front of making business accessible. Every interaction is an opportunity to make a difference.",
  hr: "Do you enjoy bringing people together? We identify talent, create rewarding benefits, and make tools to support employees.",
  marketing: "Connecting our solution-driven mission, world-class brands and customers.",
  it: "Build products from conception to launch. Thrive in AI-driven strategy to deliver the next wave of dynamic services.",
  legal: "Manage vital business relationships and troubleshoot complex legal problems for our valuable customers.",
  other: "Explore opportunities across roles and teams at Corpseed.",
};

export default function CareerClient({ jobs = [] }) {
  const groups = useMemo(() => groupByJobTitle(jobs), [jobs]);

  const tabKeys = useMemo(() => {
    const keys = Array.from(groups.keys());
    keys.sort((a, b) => a.localeCompare(b));
    return ["all", ...keys];
  }, [groups]);

  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  const filteredJobs = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = jobs;
    if (active !== "all") {
      list = groups.get(active) || [];
    }

    if (!query) return list;

    return list.filter((j) => {
      const blob = [
        j?.title,
        j?.position,
        j?.qualification,
        j?.experience,
        j?.jobLocation,
        j?.jobTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return blob.includes(query);
    });
  }, [jobs, groups, active, q]);

  const topCategories = useMemo(() => {
    // show 6 cards like your screenshot: pick common keys if present, else first 6
    const preferred = ["sales", "delivery", "hr", "marketing", "it", "legal"];
    const available = Array.from(groups.keys());

    const picked = preferred.filter((k) => available.includes(k));
    const rest = available.filter((k) => !picked.includes(k));

    return [...picked, ...rest].slice(0, 6);
  }, [groups]);

  return (
    <>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 md:pt-14">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">
              Career@<span className="text-blue-600">Corpseed</span>
            </h1>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </section>

      {/* CATEGORY CARDS (like screenshot 1) */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCategories.map((k) => {
            const count = (groups.get(k) || []).length;
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setActive(k);
                  // small UX: scroll to jobs list
                  document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "text-left rounded-2xl border border-slate-200 bg-white",
                  "p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xl font-semibold text-blue-600">
                    {titleCase(k)}
                  </p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {count} role{count === 1 ? "" : "s"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {CATEGORY_BLURBS[k] || CATEGORY_BLURBS.other}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  View openings <span className="text-slate-400">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* TABS + JOBS (like screenshot 2) */}
      <section id="openings" className="mx-auto max-w-7xl px-6 pb-14">
        {/* Tabs */}
        <div className="sticky top-[72px] z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {tabKeys.map((key) => {
                  const isActive = active === key;
                  const label = key === "all" ? "All" : titleCase(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActive(key)}
                      className={cn(
                        "shrink-0 rounded-full px-6 py-2 text-sm font-semibold transition cursor-pointer",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-50 border border-transparent"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="w-full lg:w-[420px]">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by role, location, qualification…"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm
                             outline-none transition
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 uppercase">
                    {job.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-6 line-clamp-3">
                    Corpseed ITES Pvt. Ltd. is a technology platform, make things easier for Entrepreneurs and businesses.
                    Just like a seed is required to grow a tree similarly, there are few prerequisites like “Business Planning,
                    finalizing the legal structure of the business, Govt Licenses/Permits, Legal compliance, financial structure
                    & Integration of right technology…”
                  </p>

                  {/* Meta row */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.jobLocation ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {job.jobLocation}
                      </span>
                    ) : null}
                    {job.experience ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {job.experience}
                      </span>
                    ) : null}
                    {job.qualification ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {job.qualification}
                      </span>
                    ) : null}
                    {job.noOfPosition ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {job.noOfPosition} position{String(job.noOfPosition) === "1" ? "" : "s"}
                      </span>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      href={`/join-our-team/${job.slug}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Explore
                    </Link>

                    <Link
                      href={`/join-our-team/${job.slug}?apply=1`}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5
                                 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No jobs found
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Try changing the category tab or search keyword.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActive("all");
                    setQ("");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold
                             text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
