import { NextResponse } from "next/server";
import { getSitemapMeta } from "../lib/sitemapApi";

// ✅ ISR for this route (very important)
export const revalidate = 3600; // 1 hour

function normalizeToArray(data) {
  if (Array.isArray(data?.urls)) return data.urls;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.sitemap)) return data.sitemap;
  if (Array.isArray(data)) return data;
  return [];
}

// ✅ Do NOT depend on request headers for static build
function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";

  return env.replace(/\/$/, "");
}

function escapeXml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const baseUrl = getBaseUrl();

  const meta = await getSitemapMeta();
  const urls = normalizeToArray(meta);

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/sitemap`, priority: "0.6", changefreq: "monthly" },
  ];

  const dynamicUrls = urls
    .map((x) => {
      const loc = x?.loc || x?.url;
      if (!loc) return null;

      const abs = loc.startsWith("http") ? loc : `${baseUrl}${loc}`;
      const lastmod = x?.lastmod || x?.lastModified || null;

      return {
        loc: abs,
        lastmod: lastmod ? new Date(lastmod).toISOString() : null,
        changefreq: x?.changefreq || x?.changeFrequency || "weekly",
        priority:
          typeof x?.priority === "number"
            ? x.priority.toFixed(1)
            : "0.7",
      };
    })
    .filter(Boolean);

  const all = [...staticUrls, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map((u) => {
    return `  <url>
    <loc>${escapeXml(u.loc)}</loc>${
      u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : ""
    }${
      u.changefreq ? `\n    <changefreq>${escapeXml(u.changefreq)}</changefreq>` : ""
    }${
      u.priority ? `\n    <priority>${escapeXml(u.priority)}</priority>` : ""
    }
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
