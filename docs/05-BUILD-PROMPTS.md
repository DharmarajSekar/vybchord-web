# Vybchord Website — Step-by-step build prompts

Paste these into Cursor / Claude Code **one at a time**, in order. Finish and test each before moving on.

**Setup before Prompt 1:** create the repo, then put these files in it:
```
CLAUDE.md                      (repo root)
docs/01-BRD.md
docs/02-FRD.md
docs/03-TECH-SPEC.md
docs/04-supabase-schema.sql
```

---

### Prompt 1 — Scaffold
> Read CLAUDE.md and docs/03-TECH-SPEC.md. Scaffold a Next.js App Router project with TypeScript strict, Tailwind, shadcn/ui (init + button, card, input, textarea, select, checkbox, sheet, dialog, badge, tabs, table, dropdown-menu, sonner), next-themes, ESLint + Prettier. Create the exact folder structure from section 2 of the tech spec, `.env.example` from section 3, and `next.config.ts` with `output: 'standalone'` and the security headers from section 5. Add npm scripts `typecheck` and `lint`. Run build and fix errors.

### Prompt 2 — Supabase
> Create `supabase/migrations/0001_init.sql` from docs/04-supabase-schema.sql. Create `lib/supabase/server.ts`, `client.ts` and `admin.ts` (service role, server-only) with @supabase/ssr. Generate TypeScript types for all tables in `lib/supabase/types.ts`. Add a typed data-access layer in `lib/data/` for products, case studies, posts, jobs and site settings (public reads only).

### Prompt 3 — Layout, header, footer, theme
> Build the site layout per FRD FR-G1 to FR-G5: sticky header with nav and "Book a demo" button, mobile sheet menu, footer reading legal name, CIN, registered office, GSTIN, email, phone and socials from `site_settings`, light/dark toggle, WhatsApp floating button on mobile, and a consent banner that loads GA4 and Clarity only after consent.

### Prompt 4 — Home page
> Build the Home page per FRD FR-P1: hero ("AI-native software, production-ready from day one" — refine copy), products showcase from the `products` table, cards for Project Services and Hire Engineers, a differentiators section, a proof strip and a final CTA band. Mobile-first, static with ISR.

### Prompt 5 — Products
> Build /products and /products/[slug] per FR-P2 and FR-P3 with generateStaticParams, Product JSON-LD, screenshot gallery, modules grid, deployment options, licensing/IP-transfer section and FAQs accordion. Primary CTA opens the demo form.

### Prompt 6 — Services and Hire Engineers
> Build /services, /services/[slug] per FR-P4/P5 (service content can live in a typed `content/services.ts` file) and /hire-engineers per FR-P6 with roles, skills matrix, engagement model cards, onboarding timeline, NDA/IP and replacement-guarantee sections.

### Prompt 7 — Forms and lead pipeline
> Implement forms F1 to F6 from FRD section 4: zod schemas, React Hook Form UIs, server actions following tech-spec section 4 (honeypot, Turnstile, rate limit, private upload, insert, Resend founder alert + visitor auto-reply with React Email templates, redirect to /thank-you/[form]). Add the contact page FR-P11 with topic routing. Test each form end to end.

### Prompt 8 — Case studies, Careers, Insights
> Build /case-studies (filter by industry and business line) and detail; /careers with filters and /careers/[slug] with JobPosting JSON-LD and the apply form (F4); /insights list and /insights/[slug] rendering MDX with reading time and related posts.

### Prompt 9 — About, legal, 404, SEO
> Build /about per FR-P8, legal pages per FR-P12 (Privacy Policy aligned to India's DPDP Act 2023 with Grievance Officer details from site_settings, Terms, Cookies), a custom 404, `app/sitemap.ts`, `app/robots.ts`, Organization JSON-LD in the root layout and OG images.

### Prompt 10 — Admin panel
> Build /admin per FRD section 5 (FR-A1 to FR-A9): magic-link login restricted to ADMIN_EMAILS and the `admins` table, middleware protection, dashboard, leads inbox with filters/status/notes/CSV export/signed-URL downloads, CRUD for products, case studies, posts, jobs, applications with status flow, talent bench, settings and audit log. Use shadcn data tables.

### Prompt 11 — Quality pass
> Audit against FRD NFR-1 to NFR-12 and the go-live checklist in tech-spec section 7. Fix accessibility, performance (Lighthouse mobile ≥ 90) and security header issues. Verify anon users cannot read leads or applications. Run lint, typecheck and build clean.

### Prompt 12 — Deploy to Hostinger
> Follow docs/03-TECH-SPEC.md section 6 for my plan (<Business/Cloud OR VPS>). Give me the exact steps and any config files needed, then a post-deploy smoke-test checklist.
