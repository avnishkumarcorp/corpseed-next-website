import DOMPurify from "isomorphic-dompurify";
import styles from "./SafeHtml.module.css";

export default function SafeHtml({ html }) {
  const clean = DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });

  return (
    <div className={styles.bsWrapper}>
      <div
        className="bs prose max-w-none prose-headings:scroll-mt-28 prose-a:text-blue-600 prose-a:underline"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
}
