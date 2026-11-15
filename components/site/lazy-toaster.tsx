"use client";

import dynamic from "next/dynamic";

// Toasts only follow form or admin actions, so the toaster loads after the page is interactive (NFR-1).
const Toaster = dynamic(() => import("@/components/ui/sonner").then((m) => m.Toaster), {
  ssr: false,
});

export function LazyToaster() {
  return <Toaster />;
}
