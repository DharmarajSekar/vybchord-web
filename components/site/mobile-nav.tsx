"use client";

import dynamic from "next/dynamic";
import { MenuIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// The sheet (Base UI dialog) loads on first tap, keeping it out of every page's first load (NFR-1).
const MobileNavSheet = dynamic(() => import("./mobile-nav-sheet").then((m) => m.MobileNavSheet), {
  ssr: false,
});

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={trigger}
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
      >
        <MenuIcon aria-hidden />
      </Button>
      {loaded && <MobileNavSheet open={open} onOpenChange={setOpen} returnFocus={trigger} />}
    </>
  );
}
