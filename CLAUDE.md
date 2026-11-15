# CLAUDE.md — Vybchord Website (AI coding rules)

> Put this file at the repo root. For Cursor, copy the same content to `.cursor/rules/vybchord.mdc`.

## Project
Company website for **VYBCHORD TECHNOLOGIES & SERVICES PRIVATE LIMITED** (Chennai). Three business lines: **Products (primary)**, **Project services**, **Staff augmentation**. Specs live in `/docs`:
- `docs/01-BRD.md` — why and for whom
- `docs/02-FRD.md` — pages, forms, admin, NFRs (source of truth for features; IDs like FR-P3)
- `docs/03-TECH-SPEC.md` — stack, folders, env vars, deployment
- `docs/04-supabase-schema.sql` — database (source of truth for tables)

Always read the relevant spec section before building a feature, and reference its FR ID in the commit message.

## Stack (non-negotiable)
Next.js App Router · TypeScript strict · Tailwind CSS · shadcn/ui · Supabase (`@supabase/ssr`) · React Hook Form + zod · Resend · Hosted on **Hostinger** (Node.js). Do not add other UI kits or ORMs.

## Rules
1. Server Components by default; `"use client"` only for interactivity.
2. Marketing pages are static (SSG/ISR, `revalidate`), not per-request SSR.
3. All form writes go through **server actions** using the service-role Supabase client in `lib/supabase/admin.ts`. Never expose the service-role key to the client.
4. One zod schema per form in `lib/validations/`, shared by client and server.
5. Every form: honeypot + Turnstile + rate limit + consent checkbox with purpose text.
6. Uploads → private `uploads` bucket; read via signed URLs in admin only.
7. Every table has RLS. Never disable RLS to "make it work".
8. Use shadcn/ui components and design tokens; support light and dark mode.
9. Every page exports `generateMetadata`; add JSON-LD where FRD NFR-2 says so.
10. Accessibility: semantic HTML, labelled inputs, visible focus, alt text.
11. `next/image` for all images; no layout shift.
12. No hard-coded company details — read from `site_settings`.
13. Keep components small; no file over ~250 lines.
14. Production-ready only: no TODO stubs, no lorem ipsum in shipped pages (use clear placeholders like `[Add case study]` only in seed data).

## Brand voice
Confident, plain, enterprise-ready. Short sentences. Lead with outcomes (speed, production-ready delivery, AI-native). No hype words like "revolutionary".

## Commands
- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
- Before finishing any task: run `lint`, `typecheck` and `build`; fix all errors.
