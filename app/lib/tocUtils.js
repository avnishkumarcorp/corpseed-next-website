function decodeHtml(value = "") {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value = "") {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(tag = "", attr = "") {
  const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = String(tag || "").match(regex);
  return match ? match[1] : "";
}

function getHashFromHref(href = "") {
  const value = String(href || "");
  const hashIndex = value.indexOf("#");

  if (hashIndex === -1) return "";

  return value.slice(hashIndex + 1).trim();
}

function rewriteHrefToCurrentUrl(href = "", currentUrl = "") {
  const hash = getHashFromHref(href);

  if (!hash) return href;

  return `${currentUrl}#${hash}`;
}

function getLevelFromLi(liOpenTag = "") {
  const style = getAttribute(liOpenTag, "style");
  const marginMatch = style.match(/margin-left\s*:\s*(\d+)px/i);

  if (!marginMatch) return 1;

  const marginLeft = Number(marginMatch[1] || 0);

  return Math.max(1, Math.round(marginLeft / 40));
}

function tocHtmlToJson(tocHtml = "", currentUrl = "") {
  const input = String(tocHtml || "");

  const liRegex = /<li\b([^>]*)>([\s\S]*?)<\/li>/gi;
  const items = [];

  let match;
  let index = 0;

  while ((match = liRegex.exec(input)) !== null) {
    index += 1;

    const liAttrs = match[1] || "";
    const liInnerHtml = match[2] || "";
    const liOpenTag = `<li ${liAttrs}>`;

    const anchorMatch = liInnerHtml.match(/<a\b([^>]*)>([\s\S]*?)<\/a>/i);

    if (!anchorMatch) continue;

    const anchorAttrs = anchorMatch[1] || "";
    const anchorInnerHtml = anchorMatch[2] || "";

    const rawHref = getAttribute(`<a ${anchorAttrs}>`, "href");
    const hash = getHashFromHref(rawHref);
    const title = decodeHtml(stripHtml(anchorInnerHtml));

    if (!title || !hash) continue;

    items.push({
      id: getAttribute(liOpenTag, "id") || `toc-item-${index}`,
      title,
      href: currentUrl ? rewriteHrefToCurrentUrl(rawHref, currentUrl) : rawHref,
      hash,
      level: getLevelFromLi(liOpenTag),
    });
  }

  return items;
}

export function splitTocAndBody(html = "", currentUrl = "") {
  let input = String(html || "");

  input = input.replace(/<base[^>]*>/gi, "");

  const tocMatch = input.match(
    /<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>|<div[^>]*id=["']main-toc["'][^>]*>[\s\S]*?<\/div>/i,
  );

  const tocHtmlRaw = tocMatch ? tocMatch[0] : "";

  const tocItems = tocHtmlRaw ? tocHtmlToJson(tocHtmlRaw, currentUrl) : [];

  let bodyHtml = tocHtmlRaw ? input.replace(tocHtmlRaw, "") : input;

  bodyHtml = bodyHtml.replace(
  /<p[^>]*>\s*<span[^>]*class=["']formView["'][^>]*>[\s\S]*?<\/span>\s*<\/p>/gi,
  "<!--BLOG_CONTACT_FORM-->",
);

  bodyHtml = bodyHtml.replace(/<base[^>]*>/gi, "");

  return {
    tocItems,
    bodyHtml,
  };
}