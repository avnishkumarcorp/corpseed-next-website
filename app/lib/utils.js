import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractProductViewSlugs(html = "") {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const productViewElements = doc.querySelectorAll(".productView");

  const slugs = Array.from(productViewElements)
    .flatMap((el) => el.textContent.split("#"))
    .map((slug) => slug.trim())
    .filter(Boolean);

  return [...new Set(slugs)];
}