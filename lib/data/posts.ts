import "server-only";
import { cache } from "react";
import { createPublicClient, type PublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/types";

type PostRow = Tables<"posts">;

/** A post visible to the public: `published_at` is set and not in the future. */
export type Post = Omit<PostRow, "tags" | "published_at"> & {
  tags: string[];
  published_at: string;
};

export type PostSummary = Omit<Post, "body_mdx" | "created_at" | "updated_at">;

const SUMMARY_COLUMNS =
  "id, slug, title, excerpt, cover_image, category, tags, author, published_at, seo_title, seo_description";

function publishedPosts<Columns extends string>(supabase: PublicClient, columns: Columns) {
  return supabase
    .from("posts")
    .select(columns)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString());
}

function normalise<T extends { tags: string[] | null; published_at: string | null }>(row: T) {
  return { ...row, tags: row.tags ?? [], published_at: row.published_at ?? "" };
}

/** Published posts, newest first. Excludes the MDX body. */
export const getPosts = cache(async (): Promise<PostSummary[]> => {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await publishedPosts(supabase, SUMMARY_COLUMNS).order("published_at", {
    ascending: false,
  });
  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return data.map(normalise);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await publishedPosts(supabase, "*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Failed to load post "${slug}": ${error.message}`);
  return data ? normalise(data) : null;
});

/** Other posts ranked by shared tags, then same category, then recency. */
export async function getRelatedPosts(post: PostSummary, limit = 3): Promise<PostSummary[]> {
  const tags = new Set(post.tags);
  const score = (candidate: PostSummary) =>
    candidate.tags.filter((tag) => tags.has(tag)).length * 2 +
    (post.category && candidate.category === post.category ? 1 : 0);

  const posts = await getPosts();
  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts();
  return posts.map((post) => post.slug);
}
