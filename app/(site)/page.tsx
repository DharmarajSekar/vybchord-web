import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home",
    alternates: { canonical: "/" },
  };
}

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Site under construction</h1>
    </div>
  );
}
