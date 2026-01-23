import SafeHtmlShadow from "../components/SafeHtmlShadow";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceContent({ tabs = [] }) {
  const mapped = tabs.map((t) => ({ ...t, id: t?.id || slugify(t?.title) }));

  return (
    <div className="space-y-8">
      {mapped.map((t) => (
        <section
          key={t?.id}
          id={t?.id}
          className="scroll-mt-[140px] rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {t?.title}
          </h2>

          <div className="mt-4">
            <SafeHtmlShadow html={t?.description} />
          </div>
        </section>
      ))}
    </div>
  );
}
