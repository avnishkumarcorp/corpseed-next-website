"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import styles from "./SafeHtml.module.css";
import { forwardRef } from "react";
import logo from "../assets/logo.png";

const LEGACY_BASE =
  process.env.NEXT_PUBLIC_LEGACY_BASE_URL || "https://admin.corpseed.com";

// ✅ Only CSS here (remove JS from this list)
const CSS_URLS = [
  "https://admin.corpseed.com/assets/css/bootstrap.min.css",
  "https://admin.corpseed.com/assets/css/main.css",
  "https://admin.corpseed.com/chat_boat/css/main.css",
  "https://admin.corpseed.com/assets/css/owl.carousel.min.css",
  "https://admin.corpseed.com/assets/css/intlTelInput.css",
  "https://admin.corpseed.com/chat_boat/css/chatBot.css",
  "https://admin.corpseed.com/assets/css/temp.css",
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

const SafeHtmlShadow = forwardRef(({ html }, ref) => {
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

    p,h1,h2,h3,h4,h5,h6{
  color: #212529;
}

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

      .content-scope ul { list-style: none; padding-left: 0; margin-left: 0;color: #212529; }
  .content-scope li { position: relative; padding-left: 24px;color: #212529; }

  // .content-scope li::before {
  //   content: "";
  //   position: absolute;
  //   left: 0;
  //   top: 0.45em;
  //   width: 15px;
  //   height: 15px;
  //   background: url("${iconUrl}") no-repeat center;
  //   background-size: cover;
  //   color: #212529;
  // }


  .content-scope ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.content-scope ul li {
  position: relative;
  padding-left: 24px;
}

.content-scope ul li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 15px;
  height: 15px;
  background: url("${iconUrl}") no-repeat center;
  background-size: cover;
}

.content-scope ol li::before {
  content: none;
}

.content-scope ol {
  list-style: decimal;
  padding-left: 20px;
}

.content-scope h2 {
  font-weight: 400 !important;
  color: #303134;
  font-size: 24px;
}

.content-scope h2 strong,
.content-scope h2 b {
  font-weight: 400 !important;
}

      // .page-header h2 {
      //   font-weight: 400;
      //   color: #303134;
      //   font-size: 24px;
      // }


.content-scope h1,
.content-scope h2,
.content-scope h3,
.content-scope h4,
.content-scope h5,
.content-scope h6 {
  font-weight: 400 !important;
  color: #303134;
}

/* remove bold coming from CMS strong tags */
.content-scope h1 strong,
.content-scope h2 strong,
.content-scope h3 strong,
.content-scope h4 strong,
.content-scope h5 strong,
.content-scope h6 strong,
.content-scope h1 b,
.content-scope h2 b,
.content-scope h3 b,
.content-scope h4 b,
.content-scope h5 b,
.content-scope h6 b {
  font-weight: 400 !important;
}

.content-scope a {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.content-scope a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.content-scope table {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 1rem 0;
  background: #fff;
}

.content-scope table th,
.content-scope table td {
  border: 1px solid #000 !important;
  padding: 8px !important;
  text-align: center;
  color: #000 !important;
  background: #fff !important;
}

.content-scope table th {
  font-weight: 600;
  background: #f5f5f5;
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
    color: #212529;
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

.text-center{
display:flex;
justify-content: center;
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

    wrapper.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src?.includes("/assets/img/logo.png")) {
        img.setAttribute("src", logo.src);
      }
    });

    // 🔥 Replace legacy video block with working YouTube iframe
    wrapper.querySelectorAll(".vediosec").forEach((block) => {
      const parent = block.closest("[data-oembed-url]");
      const youtubeUrl = parent?.getAttribute("data-oembed-url");

      const playContainer = block.querySelector(".playbtn");

      if (playContainer && !playContainer.querySelector("svg")) {
        playContainer.insertAdjacentHTML(
          "beforeend",
          `<div style="width:100%; display:flex;
    align-items:center;
    justify-content:center;">
           <div style="
    height:60px;
    width:60px;
    background:#ffffff;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow:0 15px 40px rgba(0,0,0,0.15);
  ">
    <svg viewBox="0 0 24 24" fill="none" style="height:40px; width:40px;">
      <path d="M9 7L17 12L9 17V7Z" fill="#000"/>
    </svg>
  </div>
 </div>
  `,
        );
      }

      if (!youtubeUrl) return;

      block.addEventListener("click", () => {
        block.innerHTML = `
      <iframe
        width="100%"
        height="360"
        src="${youtubeUrl}?autoplay=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    `;
      });
    });

    const t = setTimeout(show, 1200);
    return () => clearTimeout(t);
  }, [html]);

  return (
    <div
      ref={(el) => {
        hostRef.current = el;
        if (ref) ref.current = el;
      }}
      className={styles.bsWrapper}
    />
  );
});

export default SafeHtmlShadow;
