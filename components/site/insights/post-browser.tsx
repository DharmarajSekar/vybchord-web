"use client";

import { FilterSelect } from "@/components/site/filter-select";
import { useUrlFilters } from "@/components/site/use-url-filters";
import type { PostSummary } from "@/lib/data/posts";
import { PostGrid } from "./post-card";

/** Category filter for /insights, kept in the URL. */
export function PostBrowser({ posts }: { posts: PostSummary[] }) {
  const { values, setFilter } = useUrlFilters(["category"] as const);
  const categories = [
    ...new Set(posts.map((post) => post.category).filter(Boolean) as string[]),
  ].sort();
  const filtered = values.category
    ? posts.filter((post) => post.category === values.category)
    : posts;

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 max-w-xs">
          <FilterSelect
            label="Category"
            value={values.category}
            allLabel="All categories"
            options={categories.map((category) => ({ value: category, label: category }))}
            onChange={(value) => setFilter("category", value)}
          />
        </div>
      )}
      <PostGrid posts={filtered} />
    </>
  );
}
