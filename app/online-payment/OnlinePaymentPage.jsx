// app/online-payment/page.jsx
import Image from "next/image";
import Link from "next/link";

// ✅ replace with your actual qr image import/path
import qrImg from "../assets/QR_code.jpg"; // example

export default function OnlinePaymentPage() {
  const steps = [
    {
      step: "Step 1",
      title: "Scan the QR Code",
      desc: "Open any UPI app and scan the QR code to initiate the payment.",
    },
    {
      step: "Step 2",
      title: "Select your payment mode",
      desc: "After scanning, choose UPI / bank / card (as supported by your app).",
    },
    {
      step: "Step 3",
      title: "Payment Done",
      desc: "Confirm the amount and enter your UPI PIN. Payment will be completed instantly.",
    },
  ];

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Online <span className="text-blue-600">Payment</span>
            </h1>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Scan & pay securely using UPI. Simple steps, instant confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Steps (timeline style) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  How to Pay
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  UPI Supported
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {steps.map((s, idx) => (
                  <div key={s.step} className="relative pl-10">
                    {/* line */}
                    {idx !== steps.length - 1 ? (
                      <span className="absolute left-[14px] top-10 h-[calc(100%-12px)] w-[2px] bg-slate-200" />
                    ) : null}

                    {/* dot */}
                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    </span>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {s.step}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {s.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  Secure payment
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  This website supports SSL encryption for secure transactions.
                </p>
              </div>
            </div>
          </div>

          {/* Right: QR Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Scan & Pay
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Use any BHIM / Google Pay / PhonePe / Paytm UPI app.
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  QR Payment
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/5] w-full bg-white">
                  <Image
                    src={qrImg}
                    alt="BHIM UPI QR"
                    fill
                    className="object-contain p-3"
                    priority
                  />
                </div>
              </div>

              {/* Support Card */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Facing any issue?
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  If you encounter any error or failure, contact us or call:
                  <span className="ml-1 font-semibold text-slate-900">
                    7558-640-644
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Contact Us
                  </Link>
                  <a
                    href="tel:7558640644"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* Footer note */}
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Note: Please ensure you enter the correct amount while paying.
                Keep the transaction reference for verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
