import { useEffect, useState } from "react";
import { GRID_KEYS_ORDER } from "./config";

export function buildMenuMap(menuData) {
  const map = {};
  (menuData || []).forEach((item) => {
    if (item?.serviceMenu) map[item.serviceMenu] = item;
  });
  return map;
}

export function getSideKeys(categoryMap) {
  if (!categoryMap || typeof categoryMap !== "object") return [];
  return Object.keys(categoryMap);
}

export function isLinksArray(v) {
  return Array.isArray(v);
}

export function isGroupObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function normalizeGroups(apiData) {
  if (!apiData || typeof apiData !== "object") return [];

  const entries = Object.entries(apiData)
    .filter(([key]) =>
      key?.toLowerCase() !== "product based services"
    ) // ✅ remove product based services
    .map(([k, v]) => [
      k,
      Array.isArray(v) ? v : [],
    ]);

  const known = [];
  const unknown = [];

  for (const [k, arr] of entries) {
    if (!arr.length) continue;
    if (GRID_KEYS_ORDER.includes(k)) known.push([k, arr]);
    else unknown.push([k, arr]);
  }

  known.sort(
    (a, b) =>
      GRID_KEYS_ORDER.indexOf(a[0]) -
      GRID_KEYS_ORDER.indexOf(b[0])
  );

  unknown.sort((a, b) => a[0].localeCompare(b[0]));

  return [...known, ...unknown];
}

export function Chevron({ open }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "transition-transform duration-200",
        open ? "rotate-90" : "rotate-0",
      ].join(" ")}
      aria-hidden="true"
    >
      ▶
    </span>
  );
}
