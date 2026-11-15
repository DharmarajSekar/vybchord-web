const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const UTM_STORAGE = "vybchord-utm";

/** First-touch UTM parameters for this browser session (FRD §4 rule 2). */
export function readUtm(): Record<string, string> {
  const search = new URLSearchParams(window.location.search);
  const fromUrl = Object.fromEntries(
    UTM_KEYS.flatMap((key) => {
      const value = search.get(key);
      return value ? [[key, value]] : [];
    }),
  );
  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE);
    if (stored) return JSON.parse(stored) as Record<string, string>;
    if (Object.keys(fromUrl).length) {
      window.sessionStorage.setItem(UTM_STORAGE, JSON.stringify(fromUrl));
    }
  } catch {
    // Storage blocked: fall back to the current URL.
  }
  return fromUrl;
}

/** Parsed form values → FormData for the server action. Arrays become repeated keys. */
export function toFormData(values: object): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) value.forEach((item) => data.append(key, String(item)));
    else if (value instanceof File) data.append(key, value);
    else data.append(key, String(value));
  }
  return data;
}
