"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function ProductsControls({
  initialFilter = "",
  services = [],
  size = 20,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // mode controls whether the input writes to q or filter
  const [mode, setMode] = useState("q"); // "q" | "filter"
  const [value, setValue] = useState(initialFilter || "");

  // Keep input synced with URL changes (sidebar click etc.)
  useEffect(() => {
    const urlQ = (sp.get("q") || "").trim();
    const urlFilter = (sp.get("filter") || "").trim();

    if (urlQ) {
      setMode("q");
      setValue(urlQ);
      return;
    }

    if (urlFilter) {
      setMode("filter");
      setValue(urlFilter);
      return;
    }

    setMode("q");
    setValue("");
  }, [sp]);

  const quickChips = useMemo(() => (services || []).slice(0, 6), [services]);

  // Debounce push to URL
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());
      next.set("page", "1");
      next.set("size", String(size));

      const v = (value || "").trim();

      // ✅ clear both if empty
      if (!v) {
        next.delete("q");
        next.delete("filter");
        router.push(`${pathname}?${next.toString()}`);
        return;
      }

      if (mode === "q") {
        // ✅ typing search -> q
        next.set("q", v);
        next.delete("filter");
      } else {
        // ✅ chip/service filter -> filter
        next.set("filter", v);
        next.delete("q");
      }

      router.push(`${pathname}?${next.toString()}`);
    }, 450);

    return () => clearTimeout(t);
  }, [value, mode, sp, router, pathname, size]);

  const clearAll = () => {
    setMode("q");
    setValue("");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={value}
              onChange={(e) => {
                setMode("q"); // ✅ typing always becomes q-search
                setValue(e.target.value);
              }}
              placeholder="Search products (e.g., BIS, EPR, Certification...)"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            />
            {mode === "filter" && value ? (
              <div className="mt-2 text-[11px] text-gray-500">
                Filtering by service: <span className="font-semibold">{value}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              Clear
            </button>

            {quickChips.map((s) => (
              <button
                key={s?.id || s?.slug}
                type="button"
                onClick={() => {
                  setMode("filter"); // ✅ chip = filter
                  setValue(s?.serviceName || "");
                }}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                title={s?.serviceName}
              >
                {s?.serviceName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
