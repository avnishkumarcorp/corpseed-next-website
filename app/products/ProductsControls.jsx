// app/products/products-controls.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function ProductsControls({ initialFilter = "", services = [], size = 20 }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [value, setValue] = useState(initialFilter || "");

  // keep input synced if user clicks service pills etc.
  useEffect(() => {
    setValue(initialFilter || "");
  }, [initialFilter]);

  const quickChips = useMemo(() => {
    // show top 6 chips only (you can increase)
    return (services || []).slice(0, 6);
  }, [services]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());
      next.set("page", "1");
      next.set("size", String(size));
      next.set("filter", value || "");
      router.push(`${pathname}?${next.toString()}`);
    }, 450);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search products (e.g., BIS, EPR, Certification...)"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
            <button
              type="button"
              onClick={() => setValue("")}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              Clear
            </button>

            {quickChips.map((s) => (
              <button
                key={s?.id || s?.slug}
                type="button"
                onClick={() => setValue(s?.serviceName || "")}
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
