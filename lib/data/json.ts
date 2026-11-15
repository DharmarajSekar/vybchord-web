import type { Json } from "@/lib/supabase/types";

type JsonObject = { [key: string]: Json | undefined };

function isObject(value: Json | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads a jsonb array of objects whose listed keys are all strings; skips malformed items. */
export function parseStringRecords<K extends string>(
  value: Json | null,
  keys: readonly K[],
): Record<K, string>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is JsonObject =>
      isObject(item) && keys.every((key) => typeof item[key] === "string"),
  ) as Record<K, string>[];
}

/** Reads a jsonb object of string values (e.g. socials, links); drops non-string entries. */
export function parseStringMap(value: Json | null): Record<string, string> {
  if (!isObject(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}
