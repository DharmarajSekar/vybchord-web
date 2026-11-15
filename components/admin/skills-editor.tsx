"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateApplicationSkills } from "@/lib/admin/actions/records";

/** FR-A7 inline skills tags for a bench candidate (comma-separated). */
export function SkillsEditor({ id, skills }: { id: string; skills: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState(skills.join(", "));
  const [pending, startTransition] = useTransition();
  const dirty = value !== skills.join(", ");

  const save = () =>
    startTransition(async () => {
      const result = await updateApplicationSkills({ id, skills: value.split(",") });
      if (result.ok) {
        toast.success(result.message ?? "Saved");
        router.refresh();
      } else toast.error(result.message);
    });

  return (
    <form
      className="flex min-w-56 gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Input
        aria-label="Skills, comma separated"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="React, AWS…"
        className="h-8"
      />
      {dirty && (
        <Button type="submit" size="sm" disabled={pending}>
          Save
        </Button>
      )}
    </form>
  );
}
