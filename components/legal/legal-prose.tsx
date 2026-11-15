import type { ReactNode } from "react";

/** Typography for legal documents, using the site's design tokens. */
export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <div className="text-base leading-7 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-20 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_table]:my-6 [&_table]:w-full [&_table]:text-sm [&_td]:border-b [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}

/** Horizontally scrollable table wrapper for narrow screens. */
export function LegalTable({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
