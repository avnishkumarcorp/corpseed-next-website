import { ChevronDown } from "lucide-react";
import SafeHtmlShadow from "../components/SafeHtmlShadow";

// small helper to keep only displayStatus === "1" and not deleted (optional)
const normalizeFaqs = (faqs) => {
  const list = Array.isArray(faqs) ? faqs : [];
  return list
    .filter((f) => String(f?.displayStatus) === "1")
    .filter((f) => Number(f?.deleteStatus) !== 1) // keep safe; adjust if needed
    .map((f) => ({
      id: f?.uuid || f?.id,
      question: (f?.title || "").trim(),
      answerHtml: f?.description || "",
    }))
    .filter((x) => x.question);
};

export default function ServiceFaqs({
  faqs,
  heading = "Frequently Asked Questions",
}) {
  const items = normalizeFaqs(faqs);

  if (!items.length) return null;

  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {heading}
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl">
            Quick answers to common questions about this service.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          <div className="space-y-3">
            {items.map((item, idx) => (
              <details
                key={item.id || idx}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm open:shadow-md transition"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-2.5 py-2 bg-[#fafafa]">
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {item.question}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white">
                    <ChevronDown className="h-5 w-5 text-gray-600 transition-transform duration-200 group-open:rotate-180" />
                  </span>
                </summary>

                <div className="px-2 pb-5 pt-0 text-sm sm:text-base text-gray-700 leading-relaxed bg-white">
                  {/* ✅ answer is HTML from API */}
                  <SafeHtmlShadow html={item.answerHtml} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
