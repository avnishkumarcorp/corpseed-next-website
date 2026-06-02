// app/law-update/page.jsx
import Link from "next/link";
import { getLawUpdatesList, stripHtml } from "../lib/lawUpdates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getParamValue(value, fallback = "") {
  if (Array.isArray(value)) return value[0] || fallback;
  return value ?? fallback;
}

function normalizeSearchParams(searchParams) {
  const params = new URLSearchParams();

  if (!searchParams) return params;

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          params.append(key, String(item));
        }
      });
    } else {
      params.set(key, String(value));
    }
  });

  return params;
}

function buildHref(searchParams, nextParams = {}) {
  const params = normalizeSearchParams(searchParams);

  Object.entries(nextParams).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `/law-update?${query}` : "/law-update";
}

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function isWithinDateRange(itemDateValue, from, to) {
  if (!from && !to) return true;

  const itemDate = parseDate(itemDateValue);
  if (!itemDate) return false;

  const fromDate = from ? parseDate(from) : null;
  const toDate = to ? parseDate(to) : null;

  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0);
  }

  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
  }

  if (fromDate && itemDate < fromDate) return false;
  if (toDate && itemDate > toDate) return false;

  return true;
}

function applyFilters(list = [], { from = "", to = "", dept = "" }) {
  return list.filter((item) => {
    const matchesDept = dept
      ? String(item?.department || "")
          .trim()
          .toLowerCase() === String(dept).trim().toLowerCase()
      : true;

    const matchesDate = isWithinDateRange(item?.publishDate, from, to);

    return matchesDept && matchesDate;
  });
}

function paginateList(list = [], page = 1, size = 6) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeSize = Math.max(Number(size) || 6, 1);

  const totalItems = list.length;
  const totalPages = Math.max(Math.ceil(totalItems / safeSize), 1);

  const currentPage = Math.min(safePage, totalPages);
  const startIndex = (currentPage - 1) * safeSize;
  const endIndex = startIndex + safeSize;

  const paginatedList = list.slice(startIndex, endIndex);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return {
    lawUpdates: paginatedList,
    currentPage,
    totalPages,
    totalItems,
    pageNumbers,
  };
}

function FilterBar({ searchParams, deptOptions = [] }) {
  const from = getParamValue(searchParams?.from, "");
  const to = getParamValue(searchParams?.to, "");
  const dept = getParamValue(searchParams?.dept, "");
  const size = getParamValue(searchParams?.size, "6");

  const safeDeptOptions = Array.from(
    new Set([...deptOptions, dept].filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <form
      method="GET"
      action="/law-update"
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <label
              htmlFor="from"
              className="block text-xs font-semibold text-slate-600"
            >
              From
            </label>

            <input
              id="from"
              name="from"
              type="date"
              defaultValue={from}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor="to"
              className="block text-xs font-semibold text-slate-600"
            >
              To
            </label>

            <input
              id="to"
              name="to"
              type="date"
              defaultValue={to}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="lg:col-span-4">
            <label
              htmlFor="dept"
              className="block text-xs font-semibold text-slate-600"
            >
              Department
            </label>

            <select
              id="dept"
              name="dept"
              defaultValue={dept}
              className="mt-1 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Departments</option>

              {safeDeptOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <input type="hidden" name="size" value={size} />
          <input type="hidden" name="page" value="1" />

          <div className="flex gap-2 lg:col-span-2 lg:justify-end">
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>

            <Link
              href="/law-update?page=1&size=6"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
  const nums = Array.isArray(pageData?.pageNumbers) ? pageData.pageNumbers : [];

  if (total <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(searchParams, { page: 1 })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current <= 1
            ? "pointer-events-none border-slate-200 bg-white text-slate-400"
            : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        First
      </Link>

      <Link
        href={buildHref(searchParams, { page: Math.max(1, current - 1) })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current <= 1
            ? "pointer-events-none border-slate-200 bg-white text-slate-400"
            : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        Previous
      </Link>

      {nums.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildHref(searchParams, { page: pageNumber })}
          className={[
            "rounded-xl border px-3 py-2 text-sm font-semibold",
            pageNumber === current
              ? "border-blue-600 bg-blue-600 text-white"
              : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={buildHref(searchParams, {
          page: Math.min(total, current + 1),
        })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current >= total
            ? "pointer-events-none border-slate-200 bg-white text-slate-400"
            : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        Next
      </Link>

      <Link
        href={buildHref(searchParams, { page: total })}
        className={[
          "rounded-xl border px-3 py-2 text-sm font-semibold",
          current >= total
            ? "pointer-events-none border-slate-200 bg-white text-slate-400"
            : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ].join(" ")}
      >
        Last
      </Link>
    </div>
  );
}

export default async function LawUpdatesPage({ searchParams }) {
  const resolvedParams = (await searchParams) || {};

  const page = Number(getParamValue(resolvedParams?.page, "1")) || 1;
  const size = Number(getParamValue(resolvedParams?.size, "6")) || 6;
  const from = getParamValue(resolvedParams?.from, "");
  const to = getParamValue(resolvedParams?.to, "");
  const dept = getParamValue(resolvedParams?.dept, "");

  /*
    Important:
    Fetch a larger list because we are applying filter in this page.
    If you fetch only 6 records and then filter, your filter will check only those 6 records.
  */
  const data = await getLawUpdatesList({
    page: 1,
    size: 1000,
  });

  const apiPageData = data?.page || {};
  const allList = Array.isArray(apiPageData?.lawUpdates)
    ? apiPageData.lawUpdates
    : [];

  const deptOptions = Array.from(
    new Set(allList.map((item) => item?.department).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredList = applyFilters(allList, {
    from,
    to,
    dept,
  });

  const pageData = paginateList(filteredList, page, size);
  const list = pageData.lawUpdates;

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
            Law Updates
          </h1>

          <p className="mt-2 text-center text-sm text-slate-600">
            Latest notifications, circulars, orders and compliance changes.
          </p>

          <div className="mt-8">
            <FilterBar
              searchParams={resolvedParams}
              deptOptions={deptOptions}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-900">{list.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {filteredList.length}
            </span>{" "}
            result(s)
          </p>

          {(from || to || dept) && (
            <Link
              href="/law-update?page=1&size=6"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {list.length > 0 ? (
            list.map((item) => {
              const summaryText = stripHtml(item?.summary || "");

              return (
                <div
                  key={item?.uuid || item?.id || item?.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        Subject
                      </p>

                      <Link
                        href={`/law-update/${item?.slug}`}
                        className="mt-1 block cursor-pointer text-lg font-semibold leading-snug text-slate-900 hover:text-blue-700"
                      >
                        {item?.title || "Untitled Law Update"}
                      </Link>

                      <p className="mt-3 text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">
                          Summary:
                        </span>{" "}
                        <span className="line-clamp-3">
                          {summaryText || "No summary available."}
                        </span>
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

        <div className="mt-10">
          <Pagination pageData={pageData} searchParams={resolvedParams} />
        </div>

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
