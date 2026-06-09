"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import SafeHtmlShadow from "../components/SafeHtmlShadow";
import { getServiceCardBySlug } from "../lib/serviceSlugCard";
const VideoPopup = dynamic(() => import("../components/VideoPopup"), {
  ssr: false,
});

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractSlugsFromText(text = "") {
  return text
    .replace(/<[^>]*>/g, "")
    .split("#")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitHtmlByCardViews(html = "") {
  const regex =
    /<span[^>]*class=["'][^"']*(productView|serviceView)[^"']*["'][^>]*>(.*?)<\/span>/gis;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "html",
        content: html.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: match[1] === "productView" ? "products" : "services",
      slugs: extractSlugsFromText(match[2]),
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < html.length) {
    parts.push({
      type: "html",
      content: html.slice(lastIndex),
    });
  }

  return parts;
}

export default function ServiceContent({ tabs = [] }) {
  const [serviceCards, setServiceCards] = useState({});
  const [loadingSlugs, setLoadingSlugs] = useState({});

  const mapped = useMemo(
    () =>
      tabs.map((t) => ({
        ...t,
        id: t.id || slugify(t.title || t.tabName),
        parts: splitHtmlByCardViews(t.description || ""),
      })),
    [tabs],
  );

  const allSlugs = useMemo(() => {
    return [
      ...new Set(
        mapped.flatMap((t) =>
          t.parts
            .filter((p) => p.type === "products" || p.type === "services")
            .flatMap((p) => p.slugs),
        ),
      ),
    ];
  }, [mapped]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCardsOneByOne() {
      if (!allSlugs.length) return;

      allSlugs.forEach((slug) => {
        setLoadingSlugs((prev) => ({
          ...prev,
          [slug]: true,
        }));
      });

      for (const slug of allSlugs) {
        try {
          const data = await getServiceCardBySlug([slug]);

          if (!cancelled && data?.[slug]) {
            setServiceCards((prev) => ({
              ...prev,
              [slug]: data[slug],
            }));
          }
        } catch (error) {
          console.error("Failed to fetch card for slug:", slug, error);
        } finally {
          if (!cancelled) {
            setLoadingSlugs((prev) => ({
              ...prev,
              [slug]: false,
            }));
          }
        }
      }
    }

    fetchCardsOneByOne();

    return () => {
      cancelled = true;
    };
  }, [allSlugs]);

  return (
    <div>
      {mapped.map((t, i) => (
        <div key={t.id}>
          {i !== 0 && <div className="my-4 border-t border-gray-200" />}

          <section id={t.id} className="scroll-mt-[140px]">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {t.title}
            </h2>

            <div className="mt-3">
              {t.parts.map((part, index) => {
                if (part.type === "html") {
                  return <SafeHtmlShadow key={index} html={part.content} />;
                }

                if (part.type === "products") {
                  return (
                    <ProductCards
                      key={index}
                      slugs={part.slugs}
                      serviceCards={serviceCards}
                      loadingSlugs={loadingSlugs}
                    />
                  );
                }

                return (
                  <ServiceCards
                    key={index}
                    slugs={part.slugs}
                    serviceCards={serviceCards}
                    loadingSlugs={loadingSlugs}
                  />
                );
              })}
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

function ProductCards({ slugs = [], serviceCards = {}, loadingSlugs = {} }) {
  if (!slugs.length) return null;

  return (
    <div className="my-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {slugs.map((slug) => {
          const item = serviceCards[slug];
          const isLoading = loadingSlugs[slug];

          if (isLoading && !item) {
            return (
              <div
                key={slug}
                className="min-w-[190px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            );
          }

          if (!item?.name) return null;

          return (
            <a
              key={slug}
              href={`/service/${slug}`}
              className="group min-w-[200px] max-w-[200px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="line-clamp-2 text-sm font-bold leading-6 text-gray-900 group-hover:text-blue-600">
                  {item.name}
                </h4>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
                    {item.description}
                  </p>
                )}

                <div className="mt-3 text-xs font-semibold text-blue-600">
                  Explore Product →
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ServiceCards({ slugs = [], serviceCards = {}, loadingSlugs = {} }) {
  if (!slugs.length) return null;

  return (
    <div className="my-6 grid grid-cols-1 gap-5 md:grid-cols-2">
      {slugs.map((slug) => {
        const item = serviceCards[slug];
        const isLoading = loadingSlugs[slug];

        if (isLoading && !item) {
          return (
            <div key={slug} className="border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          );
        }

        if (!item?.name) return null;

        const words = item.name.split(" ");

        return (
          <div
            key={slug}
            className="overflow-hidden border border-gray-200 bg-white transition hover:shadow-sm"
          >
            <div className="p-5">
              <p className="text-[17px] font-bold leading-7 text-gray-900">
                <span className="text-blue-600">
                  {words.slice(0, 2).join(" ")}
                </span>{" "}
                {words.slice(2).join(" ")}
              </p>

              {item.description && (
                <p className="mt-2 line-clamp-3 text-[15px] leading-7 text-gray-700">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
              {item.link ? (
                <VideoPopup
                  videoUrl={item.link}
                  videoText="Watch Video"
                  isService={true}
                />
              ) : (
                <span />
              )}

              <a
                href={`/service/${slug}`}
                className="flex items-center gap-1 text-sm font-medium text-blue-600"
              >
                Explore More
                <span className="text-lg leading-none">›</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
