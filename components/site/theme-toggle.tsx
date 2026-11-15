"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const order = ["system", "light", "dark"] as const;
const labels = { system: "System", light: "Light", dark: "Dark" } as const;
type Theme = (typeof order)[number];

const noop = () => () => {};

/**
 * One-button theme switch: System → Light → Dark. A plain button (no menu library) keeps it out of
 * the critical JavaScript on every page (NFR-1).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known in the browser; render a neutral label on the server.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const current: Theme = mounted && order.includes(theme as Theme) ? (theme as Theme) : "system";
  const next = order[(order.indexOf(current) + 1) % order.length];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={mounted ? `Theme: ${labels[current]}. Switch to ${labels[next]}` : "Change theme"}
      title={mounted ? `Theme: ${labels[current]}` : undefined}
    >
      {current === "system" ? (
        <MonitorIcon aria-hidden />
      ) : (
        <>
          <SunIcon className="dark:hidden" aria-hidden />
          <MoonIcon className="hidden dark:block" aria-hidden />
        </>
      )}
    </Button>
  );
}
