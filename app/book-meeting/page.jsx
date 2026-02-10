// app/book-meeting/page.jsx

import EnquiryForm from "../components/enquiry-form/EnquiryForm";


export const metadata = {
  title: "Book a Free Meeting | Corpseed",
  description:
    "Book a free meeting with Corpseed experts. Share your details and we’ll connect to discuss your requirements.",
  alternates: { canonical: "/book-meeting" },
};

const STEPS = [
  {
    step: "STEP 1",
    title: "Connect With Corpseed",
    desc: (
      <>
        Connect with the Corpseed team to discuss your requirements on IVR:{" "}
        <a
          className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
          href="tel:7558640644"
        >
          7558640644
        </a>{" "}
        or{" "}
        <a
          className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
          href="mailto:hello@corpseed.com"
        >
          hello@corpseed.com
        </a>
        . It takes 20–25 minutes.
      </>
    ),
  },
  {
    step: "STEP 2",
    title: "Dedicated Manager",
    desc: `After discussion, we assign a dedicated account manager to understand your needs, provide solutions, and assist end-to-end.`,
  },
  {
    step: "STEP 3",
    title: "Real Time Update",
    desc: `Track progress of your application and stay updated on what’s in progress and what’s completed.`,
  },
  {
    step: "STEP 4",
    title: "Job Completed",
    desc: `Once completed, you receive registrations & certifications directly on your email and at your doorstep.`,
  },
];

export default function BookMeetingPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200/70 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Book meeting now
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600 sm:text-base">
            Thanks for your interest in Corpseed
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Form card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold tracking-tight">
                  Get A Free Meeting
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Share your details — we’ll get back shortly.
                </p>
              </div>

              <div className="p-6">
                {/* ✅ Your reusable form */}
                {/* If your EnquiryForm accepts props, pass them here */}
                <EnquiryForm />

                {/* Small helper text */}
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  By submitting, you agree to be contacted by Corpseed for
                  service-related communication.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Steps timeline */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-slate-50 p-5 sm:p-6">
              {/* vertical line */}
              <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-slate-200 sm:block" />

              <div className="space-y-5">
                {STEPS.map((s, idx) => (
                  <div
                    key={s.step}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* step dot */}
                    <div className="absolute left-6 top-7 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-blue-600 bg-white sm:block" />

                    <div className="p-5 sm:p-6 sm:pl-12">
                      <p className="text-xs font-semibold tracking-wide text-blue-600">
                        {s.step}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight">
                        {s.title}
                      </h3>

                      <div className="mt-2 text-sm leading-6 text-slate-600">
                        {s.desc}
                      </div>

                      {/* {idx === 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href="tel:7558640644"
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
                          >
                            Call now
                          </a>
                          <a
                            href="mailto:hello@corpseed.com"
                            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                          >
                            Email us
                          </a>
                        </div>
                      ) : null} */}
                    </div>

                    {/* subtle bottom highlight */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer links (like your screenshot) */}
            <div className="mt-8 text-sm text-slate-700">
              <p>
                Have questions? Visit our{" "}
                <a
                  href="/faq"
                  className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  FAQs
                </a>
                . If you’re an existing customer and have feedback, please let
                us know.
              </p>

              <div className="mt-4 space-y-2">
                <p>
                  For job opportunities, please view our{" "}
                  <a
                    href="/join-our-team"
                    className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    open roles
                  </a>
                  .
                </p>
                <p>
                  For business partnerships, please visit our{" "}
                  <a
                    href="/partner"
                    className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    forum
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
