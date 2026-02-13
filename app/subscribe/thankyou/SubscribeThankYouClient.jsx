"use client";

import Link from "next/link";

export default function SubscribeThankYouClient() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Thank You
        </h1>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-3xl rounded-md bg-sky-100/70 px-6 py-10 shadow-sm ring-1 ring-sky-200">
            {/* check icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 ring-1 ring-emerald-200">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-emerald-600"
                >
                  <path
                    d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m8.5 12.2 2.2 2.2 5-5.2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-6 text-center text-[16px] font-semibold text-slate-700">
              You are subscribed successfully.
            </p>
            <p className="mt-2 text-center text-[13px] text-slate-600">
              We will notify you all updates !!
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="inline-flex h-11 w-full max-w-xl items-center justify-center rounded-md bg-blue-600 px-6 text-[14px] font-semibold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
              >
                Go back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
