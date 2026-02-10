import SafeHtmlShadow from "../components/SafeHtmlShadow";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceContent({ tabs = [] }) {
  const mapped = tabs.map((t) => ({
    ...t,
    id: t?.id || slugify(t?.title),
  }));

  return (
    <div>
      {mapped.map((t, i) => (
        <div key={t.id}>
          {/* Divider (not for first section) */}
          {i !== 0 && (
            <div className="my-4 border-t border-gray-200" />
          )}

          <section id={t.id} className="scroll-mt-[140px]">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {t.title}
            </h2>

            <div className="mt-3">
              <SafeHtmlShadow html={t.description} />
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
