"use client";

import { useEffect, useState } from "react";
import { extractProductViewSlugs } from "../lib/utils";
import { getServiceCardBySlug } from "../lib/serviceSlugCard.jsx";

export default function ProductServiceCards({ html }) {
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      const slugs = extractProductViewSlugs(html);

      if (slugs.length === 0) return;

      setLoading(true);

      const data = await getServiceCardBySlug(slugs);

      setCards(data || {});
      setLoading(false);
    }

    fetchCards();
  }, [html]);

  if (loading) return <p>Loading services...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(cards).map(([slug, item]) => (
        <div key={slug} className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{item.name}</h3>

          <p className="text-sm text-gray-600 mt-2">{item.description}</p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-3 inline-block"
            >
              View Service
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
