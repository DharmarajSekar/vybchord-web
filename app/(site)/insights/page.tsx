import type { Metadata } from "next";
import { ogDefaults } from "@/lib/seo";
import { Suspense } from "react";
import { PageHeader } from "@/components/site/page-header";
import { PostGrid } from "@/components/site/insights/post-card";
import { PostBrowser } from "@/components/site/insights/post-browser";
import { SubscribeSection } from "@/components/site/insights/subscribe-section";
import { getPosts } from "@/lib/data/posts";

// Scheduled posts appear within an hour of their publish time.
export const revalidate = 3600;

const title = "Insights";
const description =
  "Notes on building AI-native, production-ready software for HR, legal and real estate teams.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/insights" },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: "/insights",
      type: "website",
    },
  };
}

/** FR-P10 article list with category filter and newsletter sign-up. */
export default async function InsightsPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Insights", href: "/insights" }]}
        title="Insights"
        description={description}
      />
      <section aria-label="Articles" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <Suspense fallback={<PostGrid posts={posts} />}>
              <PostBrowser posts={posts} />
            </Suspense>
          ) : (
            <p className="text-muted-foreground">
              Our first articles are on the way. Subscribe below to get them by email.
            </p>
          )}
        </div>
      </section>
      <SubscribeSection />
    </>
  );
}
