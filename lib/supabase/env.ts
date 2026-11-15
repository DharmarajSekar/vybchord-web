// NEXT_PUBLIC_* values must be read with literal `process.env.X` access so Next.js can inline them.

export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error("Missing env var NEXT_PUBLIC_SUPABASE_URL");
  return value;
}

export function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) throw new Error("Missing env var NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return value;
}
