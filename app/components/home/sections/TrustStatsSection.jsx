"use client";

import React from "react";

/**
 * Audit #8 + #13 — verified credibility metrics packaged into one
 * fast-scanning band, placed immediately below the hero rather than
 * buried near the footer.
 */
const STATS = [
  {
    value: 15000,
    suffix: "+",
    label: "Businesses served",
    hint: "Since 2017, across India",
  },
  {
    value: 500,
    suffix: "+",
    label: "Compliance services",
    hint: "Environmental to product approvals",
  },
  {
    value: 28,
    suffix: "",
    label: "States covered",
    hint: "Local CA/CS in every state",
  },
  {
    value: 200,
    suffix: "+",
    label: "In-house experts",
    hint: "Lawyers, CAs, CSs & engineers",
  },
];

function formatNumber(n) {
  return n.toLocaleString("en-IN");
}

/**
 * Counts up once, when the band first scrolls into view. Falls back to the
 * final value immediately for reduced-motion users and older browsers, so
 * the number is never missing.
 */
function useCountUp(target, { durationMs = 1400 } = {}) {
  const ref = React.useRef(null);
  const [value, setValue] = React.useState(target);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    setValue(0);

    let raf;
    let started = false;

    const run = (startedAt) => {
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        // easeOutExpo — fast start, gentle settle
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setValue(Math.round(target * eased));

        if (progress < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          observer.disconnect();
          run(performance.now());
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return { ref, value };
}

function Stat({ stat }) {
  const { ref, value } = useCountUp(stat.value);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center gap-1 bg-white px-4 py-6 text-center transition-colors duration-300 hover:bg-blue-50/50 sm:py-7"
    >
      <span className="text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-bold leading-none tracking-tight text-slate-900">
        {formatNumber(value)}
        <span className="text-blue-600">{stat.suffix}</span>
      </span>

      <span className="mt-1.5 text-[14px] font-semibold text-slate-700">
        {stat.label}
      </span>

      <span className="text-[12.5px] leading-snug text-slate-500">
        {stat.hint}
      </span>
    </div>
  );
}

export default function TrustStatsSection() {
  return (
    <section
      aria-label="Corpseed by the numbers"
      className="w-full bg-gradient-to-b from-blue-50/70 to-white"
    >
      <div className="cs-container py-8 md:py-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.6)] lg:grid-cols-4">
          {STATS.map((stat) => (
            <Stat key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
