# Vybchord Website — Quality audit (Prompt 11)

**Date:** 15 Nov 2026 · Audit of the build against FRD §7 (NFR-1 to NFR-12) and tech spec §7 (go-live gate).

Testing used the production build (`output: 'standalone'`) against an in-memory Supabase/Resend emulator, Cloudflare's Turnstile test keys and headless Edge, plus PGlite (Postgres 17) running the real migrations. Items marked **Owner action** need the live services or the domain.

## Go-live gate (tech spec §7)

| Check | Status | Evidence |
|---|---|---|
| CIN, registered office, GSTIN in footer from `site_settings` | Done in code · **Owner action**: fill in Settings | Footer reads `site_settings`; GSTIN row appears once set |
| All 6 forms tested end to end | Done (emulated) · **Owner action**: repeat once on live Supabase + Resend | 30/30 browser checks: DB row, founder alert, auto-reply, thank-you page, uploads, spam controls |
| RLS: anon cannot read leads/applications | Done (PGlite) · **Owner action**: run the SQL below on the live project | 49/49 checks on migrations 0001–0004 |
| Lighthouse mobile ≥ 90 on Home, Product, Hire Engineers, Contact | **Passed** | Performance 91 / 91 / 92 / 92; Accessibility, Best practices, SEO 100 on all four |
| sitemap.xml submitted in Search Console | **Owner action** | `/sitemap.xml` lists every public page |
| Legal pages published; consent banner working | Done · **Owner action**: legal review | Analytics load only after "Accept"; withdrawal reloads without them |

## Non-functional requirements

| ID | Status | Notes |
|---|---|---|
| NFR-1 Performance | Met for the Lighthouse gate | Lab scores above. CLS 0 everywhere. Lab LCP is 3.3–3.5 s under Lighthouse's simulated slow 4G; it is mostly the React/Next.js runtime (~180 KB). The 2.5 s LCP target is a field metric: confirm in Search Console (Core Web Vitals) after launch. Fixed in this pass: Google Maps loads on request (−400 KB on Contact/About), menu/theme/toaster code no longer in first load, consent banner no longer the LCP element. |
| NFR-2 SEO | Met | Per-page metadata and canonicals, OG/Twitter cards with generated images, JSON-LD (Organization, Product, Article, JobPosting, BreadcrumbList), sitemap, robots. |
| NFR-3 Job SEO | Met | JobPosting on every open job; closed/expired roles return 404. |
| NFR-4 Accessibility (WCAG 2.1 AA) | Met (automated) | axe-core: no violations on 10 public and 8 admin views, light and dark. Fixed: destructive button contrast (4.0 → 4.8:1), map placeholder contrast, list markup. Manual screen-reader pass recommended before launch. |
| NFR-5 Security | Met | All six security headers on every response type, no `X-Powered-By`. No CSP violations (fixed zod's eval probe). Secrets and the admin allow-list absent from client bundles. RLS on every table. Private `uploads` bucket; admin downloads use 60-second signed URLs. Every admin action re-checks the session and re-validates input. |
| NFR-6 Privacy (DPDP Act 2023) | Met in code · **Owner action**: schedule retention, legal review | Purpose-specific consent with timestamp; Privacy Policy with Grievance Officer. New: erasure on request (delete a lead or application with its files, audited without personal data); retention deletes CVs after 12 months, unconfirmed newsletter sign-ups after 30 days, rate-limit records after a day. Run it daily via cron (below). |
| NFR-7 Availability | Ready · **Owner action** | `GET /api/health` returns 200 when the app and database respond, 503 otherwise. Point an uptime monitor at it. |
| NFR-8 Browsers | Expected to meet | Uses features supported by the latest two versions of the listed browsers. Verify on real iOS Safari and Android Chrome before launch. |
| NFR-9 Responsive | Met | No horizontal overflow at 360 / 768 / 1024 / 1440 px on all page types. |
| NFR-10 Code quality | Met | TS strict, ESLint, Prettier clean; no file over ~250 lines except generated `types.ts`. |
| NFR-11 Backups | Ready · **Owner action** | Admin dashboard: "Download backup (JSON)" (all tables) plus the leads CSV export. Enable Supabase daily backups (Pro plan). |
| NFR-12 Email (SPF/DKIM/DMARC) | **Owner action** | DNS records per tech spec §6. |

## Owner actions before launch

1. **Supabase**: run migrations `0001`–`0004`; Auth → Site URL and redirect `https://<domain>/auth/callback`; Auth → custom SMTP (Resend); enable daily backups.
2. **Verify RLS on the live project** (SQL editor), expected result `0` for each:
   ```sql
   set role anon;
   select count(*) from leads;
   select count(*) from applications;
   reset role;
   ```
3. **Environment**: every variable in `.env.example`, including `ADMIN_EMAILS` and a 32+ character `CRON_SECRET`.
4. **Daily retention** (Hostinger cron):
   `curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/retention`
5. **Uptime monitor** on `https://<domain>/api/health`.
6. **Content**: company details and Grievance Officer in Settings; founder bio (`content/about.ts`); logo.
7. **Legal review** of the Privacy Policy, Terms and Cookie Policy.
8. **After launch**: submit the sitemap in Search Console; check Core Web Vitals field data after 28 days.
