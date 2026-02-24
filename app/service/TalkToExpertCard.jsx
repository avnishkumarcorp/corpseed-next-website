"use client";

export default function TalkToExpertCard({ onClick, isAboutUs,isCategory }) {
  return isAboutUs || isCategory ? (
    <button
      className="px-6 py-3 rounded-xl bg-blue-300 hover:bg-blue-600 !text-white font-semibold transition cursor-pointer"
      onClick={onClick}
    >
      Talk to an expert
    </button>
  ) : (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 !text-white shadow-sm flex flex-col justify-between">
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold opacity-90 !text-white">Need help?</p>
        <p className="mt-1 text-lg font-extrabold tracking-tight !text-white">
          Talk to an Expert
        </p>
        <p className="mt-2 text-xs leading-5 !text-white/90">
          Get free guidance on the right service, improved documents & timeline.
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 w-full rounded-xl !bg-white/95 px-4 py-2 text-sm font-semibold text-blue-700 shadow-md hover:bg-white cursor-pointer"
      >
        Get Free Consultation
      </button>
    </div>
  );
}
