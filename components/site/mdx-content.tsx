import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import { mediaUrl } from "@/lib/media";
import { remarkSafeJsx } from "@/lib/mdx-safe";

type Props<T extends keyof React.JSX.IntrinsicElements> = ComponentProps<T>;

function MdxLink({ href = "", children }: Props<"a">) {
  const cls = "font-medium underline underline-offset-4 hover:text-muted-foreground";
  // Only web, email and phone links; blocks javascript: and data: URLs.
  if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return <>{children}</>;
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Images in articles: unknown dimensions, so a 16:9 box is reserved and the image fits inside. */
function MdxImage({ src, alt }: Props<"img">) {
  if (typeof src !== "string" || !src) return null;
  return (
    <span className="relative my-8 block aspect-video overflow-hidden rounded-xl bg-muted">
      <Image
        src={mediaUrl(src)}
        alt={alt ?? ""}
        fill
        sizes="(min-width: 768px) 720px, 100vw"
        className="object-contain"
      />
    </span>
  );
}

const components = {
  h1: (props: Props<"h2">) => (
    <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h2: (props: Props<"h2">) => (
    <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props: Props<"h3">) => <h3 className="mt-8 mb-3 text-xl font-semibold" {...props} />,
  h4: (props: Props<"h4">) => <h4 className="mt-6 mb-2 font-semibold" {...props} />,
  p: (props: Props<"p">) => <p className="my-5 leading-7" {...props} />,
  ul: (props: Props<"ul">) => <ul className="my-5 list-disc space-y-2 pl-6" {...props} />,
  ol: (props: Props<"ol">) => <ol className="my-5 list-decimal space-y-2 pl-6" {...props} />,
  li: (props: Props<"li">) => <li className="leading-7" {...props} />,
  a: MdxLink,
  img: MdxImage,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote className="my-6 border-l-4 pl-4 text-muted-foreground italic" {...props} />
  ),
  hr: () => <hr className="my-10" />,
  code: (props: Props<"code">) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  pre: (props: Props<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl bg-muted p-4 text-sm [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  table: (props: Props<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: Props<"th">) => (
    <th className="border-b px-3 py-2 text-left font-semibold" {...props} />
  ),
  td: (props: Props<"td">) => <td className="border-b px-3 py-2 align-top" {...props} />,
};

/**
 * Renders MDX stored in the database (posts.body_mdx, jobs.description_mdx).
 * JavaScript expressions are blocked (`blockJS`) and raw JSX is filtered to a short allowlist
 * (`remarkSafeJsx`), so content can use Markdown but cannot run code or embed other sites.
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <div className="text-base text-foreground">
      <MDXRemote
        source={source}
        components={components}
        options={{
          blockJS: true,
          blockDangerousJS: true,
          mdxOptions: { remarkPlugins: [remarkGfm, remarkSafeJsx] },
        }}
      />
    </div>
  );
}
