import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { MdxContent } from "@/components/site/mdx-content";
import { PostCard } from "@/components/site/insights/post-card";
import { SubscribeSection } from "@/components/site/insights/subscribe-section";
import { Section } from "@/components/site/section";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/site-settings";
import { formatDate, readingMinutes } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { articleJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? undefined;
  const url = `/insights/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.cover_image ? [{ url: mediaUrl(post.cover_image) }] : undefined,
    },
  };
}

/** FR-P10 article: category, tags, author, reading time, MDX body and related posts. */
export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const [post, settings] = await Promise.all([
    getPostBySlug((await params).slug),
    getSiteSettings(),
  ]);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const minutes = readingMinutes(post.body_mdx);

  return (
    <>
      <JsonLd data={articleJsonLd(post, settings?.legal_name)} />
      <article aria-labelledby="page-title">
        <header className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
          <Breadcrumbs
            crumbs={[
              { name: "Insights", href: "/insights" },
              { name: post.title, href: `/insights/${post.slug}` },
            ]}
          />
          {post.category && (
            <p className="mt-8 text-sm font-medium text-muted-foreground">{post.category}</p>
          )}
          <h1
            id="page-title"
            className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-xl text-pretty text-muted-foreground">{post.excerpt}</p>
          )}
          <p className="mt-6 flex flex-wrap gap-x-3 text-sm text-muted-foreground">
            {post.author && <span>By {post.author}</span>}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            <span>{minutes} min read</span>
          </p>
        </header>

        {post.cover_image && (
          <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={mediaUrl(post.cover_image)}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <MdxContent source={post.body_mdx} />
          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t pt-6" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary">{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <Section
          id="related"
          eyebrow="Keep reading"
          title="Related articles"
          className="bg-muted/40"
        >
          <ul className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <PostCard post={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <SubscribeSection />
    </>
  );
}
