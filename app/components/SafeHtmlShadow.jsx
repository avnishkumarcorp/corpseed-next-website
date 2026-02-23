"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import styles from "./SafeHtml.module.css";

const LEGACY_BASE =
  process.env.NEXT_PUBLIC_LEGACY_BASE_URL || "https://www.admin.corpseed.com";

// ✅ Only CSS here (remove JS from this list)
const CSS_URLS = [
  "https://www.admin.corpseed.com/assets/css/bootstrap.min.css",
  "https://www.admin.corpseed.com/assets/css/main.css",
  "https://www.admin.corpseed.com/chat_boat/css/main.css",
  "https://www.admin.corpseed.com/assets/css/owl.carousel.min.css",
  "https://www.admin.corpseed.com/assets/css/intlTelInput.css",
  "https://www.admin.corpseed.com/chat_boat/css/chatBot.css",
  "https://www.admin.corpseed.com/assets/css/temp.css",
];

// Turn any relative/partial URL into absolute corpseed URL
function toAbsoluteUrl(raw) {
  const v = (raw || "").trim();
  if (!v) return v;

  // keep absolute / special schemes
  if (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("data:") ||
    v.startsWith("blob:") ||
    v.startsWith("mailto:") ||
    v.startsWith("tel:")
  ) {
    return v;
  }

  // protocol-relative: //cdn...
  if (v.startsWith("//")) return `https:${v}`;

  // resolve relative against corpseed base
  try {
    return new URL(v, LEGACY_BASE).href;
  } catch {
    return v;
  }
}

// Fix src/srcset/href/poster and also inline style url(...)
function fixRelativeAssets(rootEl) {
  if (!rootEl) return;

  // img/src, video poster, iframe src, etc.
  const attrTargets = [
    ["img", "src"],
    ["img", "data-src"],
    ["source", "src"],
    ["video", "poster"],
    ["iframe", "src"],
    ["a", "href"],
    ["link", "href"],
  ];

  for (const [selector, attr] of attrTargets) {
    rootEl.querySelectorAll(selector).forEach((el) => {
      const val = el.getAttribute(attr);
      if (!val) return;
      el.setAttribute(attr, toAbsoluteUrl(val));
    });
  }

  // srcset handling
  rootEl.querySelectorAll("[srcset]").forEach((el) => {
    const srcset = el.getAttribute("srcset");
    if (!srcset) return;

    // format: "url1 1x, url2 2x" OR "url 480w"
    const fixed = srcset
      .split(",")
      .map((part) => {
        const p = part.trim();
        if (!p) return p;
        const [u, descriptor] = p.split(/\s+/, 2);
        const abs = toAbsoluteUrl(u);
        return descriptor ? `${abs} ${descriptor}` : abs;
      })
      .join(", ");

    el.setAttribute("srcset", fixed);
  });

  // inline style url(...)
  rootEl.querySelectorAll("[style]").forEach((el) => {
    const style = el.getAttribute("style");
    if (!style || !style.includes("url(")) return;

    const fixed = style.replace(/url\((['"]?)(.*?)\1\)/g, (m, q, url) => {
      const abs = toAbsoluteUrl(url);
      const quote = q || "";
      return `url(${quote}${abs}${quote})`;
    });

    el.setAttribute("style", fixed);
  });
}

export default function SafeHtmlShadow({ html }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const clean = DOMPurify.sanitize(html || "", {
      USE_PROFILES: { html: true },
    });

    const iconUrl = "/assets/icons/info-circle.svg";
    const shadowRoot =
      hostRef.current.shadowRoot ||
      hostRef.current.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = "";

    // ✅ Put your overrides + absolute checklist icon
    const base = document.createElement("style");
    base.textContent = `
      :host { display: block; }
      .content-scope { font-size:16px; line-height:1.75; }
      img { max-width: 100%; height: auto; }

      .vediosec  {
        background: #fff;
        padding: 10px;
        text-align: center;
        width: 100%;
        max-width: 640px;
        max-height: 360px;
        border: 1px solid #2b63f9;
        cursor: pointer;
        display: inline-block;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }

      .page-header article img {
        margin: 0.4rem 1rem 0 0;
        padding: 0;
        max-width: 100%;
      }

      .page-header article p,
      .page-header article span {
        font-size: 16px;
        line-height: 28px;
        color: #212529;
        margin-bottom: 1rem;
        text-align: left;
      }

      .page-header article .checklist li,
      .page-header article ul li {
        position: relative;
        padding: 0.1rem;
        font-size: 16px;
        color: #212529;
        display: block;
        line-height: 28px;
      }

      .content-scope ul { list-style: none; padding-left: 0; margin-left: 0; }
  .content-scope li { position: relative; padding-left: 24px; }

  .content-scope li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.45em;
    width: 15px;
    height: 15px;
    background: url("${iconUrl}") no-repeat center;
    background-size: cover;
  }
      .page-header h2 {
        font-weight: 400;
        color: #303134;
        font-size: 24px;
      }

      .blog-desc h1 {
        letter-spacing: 0.2px !important;
        margin-bottom: 0.5rem !important;
        font-weight: 500 !important;
      }

    #main-toc {
    background: #f3f3f391;
    border: 0;
    border-left: 5px solid #2b63f9;
    padding: 15px 10px 5px;
    margin: 2rem 0;
    position: relative;
  }

  p.toc_title {
    margin-bottom: 10px;
    cursor: pointer;
}
    #main-toc ul, #main-toc ol {
    font-weight: 400;
}

#sideTableOfContents ul li::before {
    content: "";
    width: 15px !important;
    height: 15px !important;
    display: inline-block !important;
    margin-right: 8px !important;
    vertical-align: bottom !important;
    background: url("${iconUrl}") no-repeat center;
    background-size: cover !important;
    border-radius: 50% !important;
    margin-bottom: 0.2rem !important;
}

#main-toc ul li, #main-toc ol li{
    padding: 3px;
   }

   #main-toc ul li a, #main-toc ol li a {
    color: #444;
    font-size: 14px;
    line-height: 24px;
    margin-left:24px;
}

.blog-desc .text {
    font-size: 16px;
    line-height: 25px;
    color: #212529;
    margin: 1.5rem 0px;
}

.blog-text text{
    font-size: 16px;
    line-height: 25px;
    color: #212529;
    margin: 1.5rem 0px;
}

.blog-text text img{
margin: 0 auto;
    padding: 7px;
}

.page-header .blog-text img{
    margin: 0 auto;
    padding: 7px;
    max-width: 100%;
}

.blog-text img {
    display: block !important;
}
    article.blog-post img{
    max-width: 100% !important;
}

.blog-text img {
    display: block !important;
}

    `;
    shadowRoot.appendChild(base);

    // ✅ Append CSS links WITHOUT crossorigin (prevents CORS failures)
    const links = CSS_URLS.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      shadowRoot.appendChild(link);
      return link;
    });

    const wrapper = document.createElement("div");
    wrapper.className = "content-scope";
    wrapper.innerHTML = clean;

    // ✅ Fix all relative asset paths inside the HTML
    fixRelativeAssets(wrapper);

    wrapper.style.visibility = "hidden";
    shadowRoot.appendChild(wrapper);

    const show = () => (wrapper.style.visibility = "visible");

    let loaded = 0;
    if (links.length === 0) show();

    links.forEach((l) => {
      l.onload = () => {
        loaded += 1;
        if (loaded === links.length) show();
      };
      l.onerror = () => {
        loaded += 1;
        if (loaded === links.length) show();
      };
    });

    const t = setTimeout(show, 1200);
    return () => clearTimeout(t);
  }, [html]);

  return <div ref={hostRef} className={styles.bsWrapper} />;
}
