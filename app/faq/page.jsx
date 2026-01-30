import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFaqData } from "../lib/faq";

function safeText(v, fallback = "") {
  if (v == null) return fallback;
  return String(v);
}

// Normalize any API shape safely
function normalizeFaq(apiData) {
  // Common possibilities:
  // 1) { title, metaDescription, faqList: [{id, question, answer}] }
  // 2) { faqs: [...] }
  // 3) [{...}] directly
  const title = apiData?.title || "F.A.Q";
  const metaDescription =
    apiData?.metaDescription || "Frequently Asked Questions";

  const list =
    apiData?.faqList ||
    apiData?.faqs ||
    apiData?.data ||
    (Array.isArray(apiData) ? apiData : []);

  const items = (Array.isArray(list) ? list : [])
    .map((x, idx) => ({
      id: x?.id ?? x?.uuid ?? `${idx}`,
      question: safeText(x?.question || x?.title || x?.q, ""),
      answer: x?.answer || x?.description || x?.a || "",
      category: safeText(x?.category || x?.group || "", ""),
    }))
    .filter((x) => x.question);

  // Optional grouping (if category exists)
  const grouped = items.reduce((acc, item) => {
    const key = item.category || "Services We Provide";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return { title, metaDescription, items, grouped };
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }) {
  // If answer is HTML from API, we render it nicely using prose.
  const isHtml = typeof a === "string" && /<\/?[a-z][\s\S]*>/i.test(a);

  return (
    <details
      className="group border-b border-slate-200 last:border-b-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
        <p className="text-sm font-medium text-slate-900 sm:text-[15px]">
          {q}
        </p>

        <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition group-open:bg-slate-50">
          <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
        </span>
      </summary>

      <div className="px-5 pb-5">
        {isHtml ? (
          <div
            className="prose prose-slate max-w-none prose-p:leading-relaxed prose-a:text-blue-700"
            dangerouslySetInnerHTML={{ __html: a }}
          />
        ) : (
          <p className="text-sm leading-relaxed text-slate-600">{safeText(a, "")}</p>
        )}
      </div>
    </details>
  );
}

export async function generateMetadata() {
  const apiData = await getFaqData();
  const { title, metaDescription } = normalizeFaq(apiData || {});

  return {
    title: `${title} | Corpseed`,
    description: metaDescription,
  };
}

export default async function FaqPage() {
  const apiData = await getFaqData();
  const { title, metaDescription, grouped, items } = normalizeFaq(apiData || {});

  return (
    <div className="bg-white">
      {/* HERO (like screenshot but smoother) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="text-5xl font-semibold tracking-[0.35em] text-slate-900 sm:text-6xl">
              {title}
            </p>
            <p className="mt-4 text-base text-slate-500">
              {metaDescription}
            </p>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          {/* Empty state */}
          {items.length === 0 ? (
            <div className="mx-auto max-w-3xl">
              <Card className="p-8 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  FAQs will appear here soon
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Your API currently returns no FAQ items. Once Swagger has data,
                  it will automatically render here.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Go Home
                  </Link>
                  <a
                    href="#"
                    className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Contact Support
                  </a>
                </div>
              </Card>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              {Object.entries(grouped).map(([sectionTitle, sectionItems], si) => (
                <div key={sectionTitle} className={si === 0 ? "" : "mt-10"}>
                  {/* Section header like screenshot */}
                  <h2 className="text-center text-xl font-semibold text-slate-900 sm:text-2xl">
                    {sectionTitle}
                  </h2>
                  <div className="mx-auto mt-6 h-px w-full max-w-3xl bg-slate-200" />

                  {/* Accordion */}
                  <div className="mx-auto mt-8 max-w-3xl">
                    <Card className="overflow-hidden">
                      {sectionItems.map((x, idx) => (
                        <FaqItem
                          key={x.id}
                          q={x.question}
                          a={x.answer}
                          defaultOpen={si === 0 && idx === 0}
                        />
                      ))}
                    </Card>
                  </div>
                </div>
              ))}

              {/* Bottom links like screenshot */}
              <div className="mx-auto mt-10 max-w-3xl space-y-3 text-center text-sm text-slate-700">
                <p>
                  For job opportunities, please view our{" "}
                  <Link
                    href="/careers"
                    className="cursor-pointer font-medium text-blue-700 hover:underline"
                  >
                    open roles
                  </Link>
                  .
                </p>
                <p>
                  For business partnerships, please visit our{" "}
                  <Link
                    href="/forum"
                    className="cursor-pointer font-medium text-blue-700 hover:underline"
                  >
                    forum
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
