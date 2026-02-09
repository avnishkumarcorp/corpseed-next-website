"use client";

import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FaqAccordion({ data }) {
  const section = data?.sections?.[0];
  const items = section?.items || [];

  const [openId, setOpenId] = useState(items?.[0]?.id || "");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((x) => {
      const a = (x?.answer || "").toLowerCase();
      const b = (x?.question || "").toLowerCase();
      return a.includes(query) || b.includes(query);
    });
  }, [items, q]);

  return (
    <div className="w-full">
      {/* Search box */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />

        <div className="p-5 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Search FAQ
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions… (e.g., payment, cashback, complaints)"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm
                         outline-none transition
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setQ("")}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm
                         text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            {q.trim()
              ? `Showing ${filtered.length} result(s) for “${q.trim()}”`
              : "Tip: try “payment”, “cashback”, “complaints”…"}
          </div>
        </div>

        {/* Accordion list */}
        <div className="p-4 md:p-6">
          <p className="text-xl md:text-2xl font-semibold text-slate-900">
            {section?.title || "FAQ"}
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
            {filtered.length ? (
              filtered.map((item, idx) => {
                const isOpen = openId === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white",
                      idx !== 0 && "border-t border-slate-200"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? "" : item.id)}
                      className={cn(
                        "w-full flex items-center justify-between gap-4",
                        "px-4 md:px-6 py-4 text-left",
                        "hover:bg-slate-50 transition cursor-pointer"
                      )}
                    >
                      <span className="text-sm md:text-base font-medium text-slate-900">
                        {item.question}
                      </span>

                      <span
                        className={cn(
                          "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full",
                          "border border-slate-200 bg-white",
                          "transition"
                        )}
                        aria-hidden="true"
                      >
                        <svg
                          className={cn(
                            "h-4 w-4 text-slate-700 transition-transform",
                            isOpen ? "rotate-180" : "rotate-0"
                          )}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      className={cn(
                        "grid transition-all duration-200 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 md:px-6 pb-5 text-sm md:text-base text-slate-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-sm text-slate-600">
                No matching questions found.
              </div>
            )}
          </div>

          {/* Footer links like your screenshot */}
          <div className="mt-8 space-y-3 text-sm md:text-base text-slate-700">
            <p>
              For job opportunities, please view our{" "}
              <a
                href="/career"
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                open roles
              </a>
              .
            </p>
            <p>
              For business partnerships, please visit our{" "}
              <a
                href="/forum"
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                forum
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
