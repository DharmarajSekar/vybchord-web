import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      {post.cover_image && (
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={mediaUrl(post.cover_image)}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted-foreground">
          {[post.category, formatDate(post.published_at)].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          <Link
            href={`/insights/${post.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0)
    return <p className="text-muted-foreground">No articles in this category yet.</p>;
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
