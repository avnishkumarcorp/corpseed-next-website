"use client";

import { useState } from "react";
import { getLifeAtCorpseed } from "../lib/life-at-corpseed";
import StoryRow from "../components/StoryRow";


export default function LifeStoriesClient({
  initialStories,
  totalPages,
}) {
  const [stories, setStories] = useState(initialStories);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = page < totalPages;

  const handleLoadMore = async () => {
    if (!hasMore) return;

    setLoading(true);

    const nextPage = page + 1;
    const data = await getLifeAtCorpseed({
      page: nextPage,
      size: 5,
    });

    if (data?.lifeUsers?.length) {
      setStories((prev) => [...prev, ...data.lifeUsers]);
      setPage(nextPage);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="space-y-8">
        {stories.map((u, idx) => (
          <StoryRow
            key={u.id}
            item={{
              id: u.id,
              title: u.title,
              slug: u.slug,
              desc: u.summary,
              tags: (u.categories || []).map((x) =>
                x?.startsWith("#") ? x : `#${x}`
              ),
              image: u.pictureName,
              reverse: idx % 2 === 1,
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-10">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 rounded-xl border border-gray-300 bg-white hover:bg-slate-50 font-semibold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}