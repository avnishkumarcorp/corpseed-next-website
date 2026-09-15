"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, Menu, X } from "lucide-react";

function normalizeHash(hash = "") {
  return String(hash || "")
    .replace(/^#/, "")
    .trim();
}

function findByExactId(root, hash) {
  if (!root || !hash) return null;

  // Fast direct lookup for normal document
  if (root.getElementById) {
    const direct = root.getElementById(hash);
    if (direct) return direct;
  }

  // Safer lookup for IDs containing +, /, :, spaces, etc.
  const allWithId = root.querySelectorAll?.("[id]") || [];

  for (const el of allWithId) {
    if (el.id === hash) return el;
  }

  return null;
}

function findTargetByHash(hash = "") {
  const cleanHash = normalizeHash(hash);

  if (!cleanHash || typeof document === "undefined") return null;

  // 1. Normal DOM
  const normalTarget = findByExactId(document, cleanHash);
  if (normalTarget) return normalTarget;

  // 2. Article wrapper DOM
  const articleRoot = document.querySelector("[data-article-content]");
  if (articleRoot) {
    const articleTarget = findByExactId(articleRoot, cleanHash);
    if (articleTarget) return articleTarget;

    // 3. Article wrapper Shadow DOM
    if (articleRoot.shadowRoot) {
      const shadowTarget = findByExactId(articleRoot.shadowRoot, cleanHash);
      if (shadowTarget) return shadowTarget;
    }
  }

  // 4. Search all open shadow roots
  const allElements = document.querySelectorAll("*");

  for (const el of allElements) {
    if (!el.shadowRoot) continue;

    const shadowTarget = findByExactId(el.shadowRoot, cleanHash);
    if (shadowTarget) return shadowTarget;
  }

  return null;
}

function scrollToTarget(target, headerOffset = 90) {
  const y =
    target.getBoundingClientRect().top +
    window.scrollY -
    Number(headerOffset || 0);

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}

export default function NewTocClient({
  items = [],
  headerOffset = 90,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeHash, setActiveHash] = useState("");

  const tocItems = useMemo(() => {
    return Array.isArray(items)
      ? items
          .map((item) => ({
            ...item,
            hash: normalizeHash(item?.hash),
          }))
          .filter((item) => item?.title && item?.hash)
      : [];
  }, [items]);

  const handleScrollTo = (item) => {
    const cleanHash = normalizeHash(item.hash);

    const target = findTargetByHash(cleanHash);

    if (target) {
      window.history.replaceState(null, "", `#${cleanHash}`);
      scrollToTarget(target, headerOffset);
      setActiveHash(cleanHash);
      return;
    }

    // Fallback: content may render slightly late because BlogContentClient is dynamic
    setTimeout(() => {
      const retryTarget = findTargetByHash(cleanHash);

      if (retryTarget) {
        window.history.replaceState(null, "", `#${cleanHash}`);
        scrollToTarget(retryTarget, headerOffset);
        setActiveHash(cleanHash);
      } else {
        console.warn("ToC target not found:", cleanHash);
      }
    }, 150);
  };

  useEffect(() => {
    if (!tocItems.length) return;

    const handleScroll = () => {
      let currentHash = "";

      for (const item of tocItems) {
        const target = findTargetByHash(item.hash);

        if (!target) continue;

        const top = target.getBoundingClientRect().top;

        if (top <= Number(headerOffset || 0) + 40) {
          currentHash = item.hash;
        }
      }

      if (currentHash) {
        setActiveHash(currentHash);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tocItems, headerOffset]);

  if (!tocItems.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Table of Contents
            </p>
            <p className="text-xs text-slate-500">{tocItems.length} sections</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          aria-label={
            isOpen ? "Minimize table of contents" : "Open table of contents"
          }
          aria-expanded={isOpen}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {isOpen ? (
        <div className="max-h-[calc(100vh-230px)] overflow-auto px-3 py-3">
          <ol className="space-y-1">
            {tocItems.map((item, index) => {
              const isActive = activeHash === item.hash;

              return (
                <li
                  key={`${item.hash}-${index}`}
                  style={{
                    paddingLeft: `${
                      Math.max(0, Number(item.level || 1) - 1) * 16
                    }px`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleScrollTo(item)}
                    title={item.title}
                    className={`group flex w-full cursor-pointer items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <ChevronRight
                      className={`mt-0.5 h-4 w-4 flex-none transition ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />

                    <span className="line-clamp-2 leading-5">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
