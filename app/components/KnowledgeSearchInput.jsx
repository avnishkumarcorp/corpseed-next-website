"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function KnowledgeSearchInput({ initialValue = "" }) {
  const router = useRouter();
  const [q, setQ] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (q.length < 3) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/blog-search?keyword=${encodeURIComponent(q)}`,
        );
        const data = await res.json();
        setResults(data || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [q]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search blog..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600"
        />
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.map((item) => (
            <div
              key={item.slug}
              onClick={() => {
                setOpen(false);
                router.push(`/knowledge-centre/${item.slug}`);
              }}
              className="cursor-pointer px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              <div className="font-medium line-clamp-1">{item.title}</div>
              <div className="text-xs text-slate-500 line-clamp-1">
                {item.summary}
              </div>
            </div>
          ))}

          {loading && (
            <div className="px-4 py-3 text-sm text-slate-500">Searching...</div>
          )}
        </div>
      )}
    </div>
  );
}
