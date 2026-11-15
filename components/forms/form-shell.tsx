"use client";

import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/forms/types";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/validations/shared";
import { readUtm, toFormData } from "./form-data";
import { Turnstile, type TurnstileHandle } from "./turnstile";

type FormShellProps<Input extends FieldValues, Output extends FieldValues> = {
  form: UseFormReturn<Input, unknown, Output>;
  action: (formData: FormData) => Promise<ActionResult>;
  label: string;
  submitLabel: string;
  children: ReactNode;
};

/**
 * Wraps every lead form: client validation, honeypot, Turnstile, attribution, the server action
 * call (which redirects on success) and server-side field errors.
 */
export function FormShell<Input extends FieldValues, Output extends FieldValues>({
  form,
  action,
  label,
  submitLabel,
  children,
}: FormShellProps<Input, Output>) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [token, setToken] = useState<string | null>(null);
  // Turnstile loads on first interaction, keeping its script off the initial page load.
  const [engaged, setEngaged] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const engage = engaged ? undefined : () => setEngaged(true);

  const submit = (values: Output) => {
    setFormError(null);
    if (!token) {
      setFormError("The security check is still loading. Please wait a moment and try again.");
      return;
    }
    const data = toFormData(values);
    const honeypot = formRef.current ? new FormData(formRef.current).get(HONEYPOT_FIELD) : "";
    data.set(HONEYPOT_FIELD, String(honeypot ?? ""));
    data.set(TURNSTILE_FIELD, token);
    data.set("source_page", window.location.pathname);
    data.set("utm", JSON.stringify(readUtm()));

    startTransition(async () => {
      const result = await action(data);
      // Success redirects, so only failures return here.
      if (!result || result.ok !== false) return;
      for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as Path<Input>, { type: "server", message }, { shouldFocus: true });
      }
      setFormError(result.message);
      toast.error(result.message);
      turnstileRef.current?.reset();
      setToken(null);
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submit)(event);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocusCapture={engage}
      onPointerDownCapture={engage}
      noValidate
      aria-label={label}
      className="relative space-y-6"
    >
      {children}

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      {engaged && <Turnstile ref={turnstileRef} onToken={setToken} />}

      {formError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 w-full px-5 text-base sm:w-auto"
      >
        {pending ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
