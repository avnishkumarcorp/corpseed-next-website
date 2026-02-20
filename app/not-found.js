"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6">

      {/* Background blur elements */}
      <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-100 blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-100 blur-3xl opacity-50" />

      <div className="relative z-10 text-center max-w-xl">
        <h1 className="text-[110px] font-extrabold tracking-tight text-blue-600">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600 leading-relaxed">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}