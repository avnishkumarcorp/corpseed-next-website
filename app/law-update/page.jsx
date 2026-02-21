// app/law-updates/page.jsx
import Link from "next/link";
import { getLawUpdatesList, stripHtml } from "../lib/lawUpdates";

export const dynamic = "force-dynamic";

function normalizeSearchParams(searchParams) {
  const params = new URLSearchParams();

  if (!searchParams) return params;

  for (const [k, v] of Object.entries(searchParams)) {
    if (v === undefined || v === null || v === "") continue;

    // Next can give array values
    if (Array.isArray(v)) {
      v?.forEach((x) => {
        if (x !== undefined && x !== null && x !== "")
          params.append(k, String(x));
      });
    } else {
      params.set(k, String(v));
    }
  }

  return params;
}

function buildHref(searchParams, nextParams = {}) {
  const params = normalizeSearchParams(searchParams);

  Object?.entries(nextParams)?.forEach(([k, v]) => {
    if (v === "" || v === null || v === undefined) params?.delete(k);
    else params.set(k, String(v));
  });

  return `?${params.toString()}`;
}

function FilterBar({ searchParams, deptOptions = [] }) {
  // Server component version (no client JS): simple & fast
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const dept = searchParams?.dept || "";
  const size = searchParams?.size || "6";

  return (
    <form className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-600">
              From
            </label>
            <input
              name="from"
              type="date"
              defaultValue={from}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-600">
              To
            </label>
            <input
              name="to"
              type="date"
              defaultValue={to}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-600">
              Department
            </label>
            <select
              name="dept"
              defaultValue={dept}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="">All Departments</option>
              {deptOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* keep size too */}
          <input type="hidden" name="size" value={size} />
          <input type="hidden" name="page" value="1" />

          <div className="flex gap-2 lg:col-span-2 lg:justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white
                         hover:bg-blue-700 cursor-pointer"
            >
              Search
            </button>

            <Link
              href="?page=1&size=6"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700
                         hover:bg-slate-50 cursor-pointer"
            >
              Reset
            </Link>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Tip: Use date range and department to narrow down results.
        </p>
      </div>
    </form>
  );
}

function Pagination({ pageData, searchParams }) {
  const current = Number(pageData?.currentPage || 1);
  const total = Number(pageData?.totalPages || 1);
  const nums = pageData?.pageNumbers || [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(searchParams, { page: 1 })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current <= 1
            ? "pointer-events-none border-slate-200 text-slate-400 bg-white"
            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer",
        ].join(" ")}
      >
        First
      </Link>

      <Link
        href={buildHref(searchParams, { page: Math.max(1, current - 1) })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current <= 1
            ? "pointer-events-none border-slate-200 text-slate-400 bg-white"
            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer",
        ].join(" ")}
      >
        Previous
      </Link>

      {nums.map((n) => (
        <Link
          key={n}
          href={buildHref(searchParams, { page: n })}
          className={[
            "rounded-xl border px-3 py-2 text-sm font-semibold",
            n === current
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
          ].join(" ")}
        >
          {n}
        </Link>
      ))}

      <Link
        href={buildHref(searchParams, { page: Math.min(total, current + 1) })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current >= total
            ? "pointer-events-none border-slate-200 text-slate-400 bg-white"
            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer",
        ].join(" ")}
      >
        Next
      </Link>

      <Link
        href={buildHref(searchParams, { page: total })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current >= total
            ? "pointer-events-none border-slate-200 text-slate-400 bg-white"
            : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer",
        ].join(" ")}
      >
        Last
      </Link>
    </div>
  );
}

export default async function LawUpdatesPage({ searchParams }) {
  const page = Number(searchParams?.page || 1);
  const size = Number(searchParams?.size || 6);
  const from = searchParams?.from || "";
  const to = searchParams?.to || "";
  const dept = searchParams?.dept || "";

  const data = await getLawUpdatesList({ page, size, from, to, dept });

  const pageData = data?.page || {};
  const list = pageData?.lawUpdates || [];

  // department options: build from list (fast) — if you have dedicated API, swap later
  const deptOptions = Array.from(
    new Set(list.map((x) => x?.department).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <section className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            Law Updates
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Latest notifications, circulars, orders and compliance changes.
          </p>

          <div className="mt-8">
            <FilterBar searchParams={searchParams} deptOptions={deptOptions} />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="space-y-4">
          {list.length ? (
            list.map((item) => {
              const summaryText = stripHtml(item?.summary || "");

              return (
                <div
                  key={item?.uuid || item?.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        Subject
                      </p>

                      <Link
                        href={`/law-update/${item?.slug}`}
                        className="mt-1 block text-lg font-semibold leading-snug text-slate-900 hover:text-blue-700 cursor-pointer"
                      >
                        {item?.title}
                      </Link>

                      <p className="mt-3 text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">
                          Summary:
                        </span>{" "}
                        <span className="line-clamp-3">{summaryText}</span>
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {item?.department ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            Department: {item.department}
                          </span>
                        ) : null}

                        {item?.authority ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            Authority: {item.authority}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-slate-400">🏷️</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {item?.publishDate || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                No results found
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Try adjusting date range or department filter.
              </p>
            </div>
          )}
        </div>

        {pageData?.totalPages > 1 ? (
          <div className="mt-10">
            <Pagination pageData={pageData} searchParams={searchParams} />
          </div>
        ) : null}

        {/* CTA like your UI but modern */}
        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm font-semibold text-slate-900">
            Subscribe to Us
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Find different law updates directly in your inbox. Subscribe now.
          </p>
        </div>
      </div>
    </section>
  );
}
