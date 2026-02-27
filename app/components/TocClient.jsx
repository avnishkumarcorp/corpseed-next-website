import SafeHtmlShadow from "./SafeHtmlShadow";

export default function TocClient({ html }) {
  return (
    <div className="prose prose-slate prose-sm max-w-none">
      <SafeHtmlShadow html={html} />
    </div>
  );
}
