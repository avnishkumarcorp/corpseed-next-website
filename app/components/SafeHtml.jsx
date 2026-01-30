import DOMPurify from "isomorphic-dompurify";
import styles from "./SafeHtml.module.css";

export default function SafeHtml({ html }) {
  const clean = DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });

  return (
    <div className={styles.bsWrapper}>
      <div
        className="bs"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
}
