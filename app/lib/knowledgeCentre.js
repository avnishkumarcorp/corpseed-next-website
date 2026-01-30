export async function getKnowledgeCentreList({ page = 1, q = "", categorySlug = "", tag = "" }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = new URL(`${base}/api/updated-knowledge-centre`);

  if (page) url.searchParams.set("page", String(page));
  if (q) url.searchParams.set("q", q);
  if (categorySlug) url.searchParams.set("categorySlug", categorySlug);
  if (tag) url.searchParams.set("tag", tag);

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return {
      title: "Corpseed || Knowledge Center",
      metaDescription: "",
      metaKeyword: "",
      currentPage: page,
      totalPages: 1,
      pageNumbers: [1],
      blogs: [],
      categories: [],
      hotTags: [],
      topBlogs: [],
    };
  }

  return res.json();
}







export async function getKnowledgeCentreBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${base}/api/updated-knowledge-centre/${slug}`, {
    // Good for SEO pages, keep it cached a bit (change if you want)
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  return res.json();
}
