"use client";

import { useSyncExternalStore } from "react";

/** Bump when the purposes in the banner change, so every visitor is asked again. */
const CONSENT_VERSION = 1;
const STORAGE_KEY = "vybchord-consent";
const CHANGE_EVENT = "vybchord:consent-change";
const OPEN_EVENT = "vybchord:consent-open";

export type Consent = { version: number; analytics: boolean; decidedAt: string };

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent>;
    if (value.version !== CONSENT_VERSION || typeof value.analytics !== "boolean") return null;
    return {
      version: value.version,
      analytics: value.analytics,
      decidedAt: String(value.decidedAt),
    };
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** `undefined` while rendering on the server, `null` when the visitor has not decided yet. */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined);
  return raw === undefined ? undefined : parse(raw);
}

/** Records the visitor's choice with a timestamp (DPDP, NFR-6). */
export function saveConsent(analytics: boolean) {
  const previous = parse(readRaw());
  const consent: Consent = {
    version: CONSENT_VERSION,
    analytics,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  // Analytics scripts cannot be unloaded, so a withdrawal takes effect on a fresh page.
  if (previous?.analytics && !analytics) window.location.reload();
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentSettings(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
