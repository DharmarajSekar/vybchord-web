# Vybchord Website — Functional Requirements Document (FRD)

**Version:** 0.2 · **Date:** 15 Nov 2026 · Read with `01-BRD.md` and `03-TECH-SPEC.md`.

---

## 1. Sitemap

```
/                          Home
/products                  Products overview
/products/[slug]           Product detail (vaulthrms, propflow, ...)
/services                  Services overview
/services/[slug]           Service detail
/hire-engineers            Staff augmentation
/case-studies              Case studies list
/case-studies/[slug]       Case study detail
/about                     Company
/careers                   Careers + open roles
/careers/[slug]            Job detail + apply form
/insights                  Blog list
/insights/[slug]           Article
/contact                   Contact (routed enquiry form)
/thank-you/[form]          Per-form thank-you page
/legal/privacy             Privacy Policy
/legal/terms               Terms of Use
/legal/cookies             Cookie Policy
/legal/grievance           Grievance Officer
/admin/*                   Private admin (auth required)
```

## 2. Global requirements

- **FR-G1 Header:** logo; nav = Products, Services, Hire Engineers, Case Studies, Company, Careers; primary button "Book a demo"; secondary "Contact". Sticky; mobile sheet menu.
- **FR-G2 Footer:** legal name VYBCHORD TECHNOLOGIES & SERVICES PRIVATE LIMITED, CIN, registered office address, GSTIN (when issued), email, phone, social links, legal links. Values come from `site_settings` table.
- **FR-G3 Theme:** light + dark mode (shadcn/ui tokens, `next-themes`).
- **FR-G4 WhatsApp:** floating click-to-chat button on mobile.
- **FR-G5 Consent banner:** cookie/analytics consent on first visit; analytics scripts load only after consent.

## 3. Page requirements

| ID | Page | Must contain | Primary CTA |
|---|---|---|---|
| FR-P1 | Home | Hero (AI-native, production-ready software); product showcase first; services + staffing cards; differentiators; proof strip; final CTA band | Book a demo |
| FR-P2 | Products | Card per product: name, domain, one-liner, status (Live / Pilot / Coming soon) | View product |
| FR-P3 | Product detail | Problem, modules/features, screenshots/video, deployment options (SaaS / on-prem / white-label), security notes, licensing & IP-transfer options, FAQs | Book a demo / Licensing enquiry |
| FR-P4 | Services | Service lines (custom product dev, AI integration, SaaS builds, modernisation, UI/UX); process (Discover → Design → Build → Launch → Support); engagement models | Start a project |
| FR-P5 | Service detail | Scope, deliverables, typical timeline, stack, related case studies | Get an estimate |
| FR-P6 | Hire Engineers | Roles (full-stack, frontend, backend, AI/ML, QA, DevOps, UI/UX); skills matrix; engagement models (dedicated, team, contract-to-hire); onboarding timeline; NDA/IP terms; replacement guarantee; remote/onsite/hybrid | Request engineers |
| FR-P7 | Case studies | Filter by industry + business line; detail: client (or anonymised), challenge, solution, stack, outcome, screenshots | Start a similar project |
| FR-P8 | About | Story, founder profile, mission, legal entity details, office map, approach | Contact |
| FR-P9 | Careers | Culture, working model; roles list with filters (role, type: full-time/contract/deployment, location); job detail | Apply |
| FR-P10 | Insights | Articles with category, tags, author, reading time, related posts | Subscribe |
| FR-P11 | Contact | Form with topic selector (Product / Project / Staffing / Careers / Other), email, phone, address, map, booking link | Submit |
| FR-P12 | Legal | Privacy, Terms, Cookies, Grievance Officer | — |
| FR-P13 | 404 / Thank-you | Helpful 404; per-form thank-you with next steps + booking link | Book a call |

## 4. Forms

Every form: client + server validation (zod) → spam check (Turnstile + honeypot + rate limit) → save to Supabase → email founder → auto-reply to visitor → redirect to `/thank-you/[form]`.

| Form | Required | Optional | Auto-reply promise |
|---|---|---|---|
| F1 Product demo / licensing | name, work_email, company, product, interest_type (demo / licence / ip_transfer) | phone, company_size, timeline, message | Reply in 1 business day + booking link |
| F2 Project enquiry | name, work_email, company, project_type, description | budget_range, timeline, attachment (PDF/DOC ≤10 MB), phone | Discovery call in 1 business day |
| F3 Staff augmentation | name, work_email, company, roles[], headcount, start_date | duration_months, engagement_model, work_mode, location, skills, budget_per_resource | Matching profiles in 48 hours |
| F4 Job application | name, email, phone, job_id, cv (PDF/DOC ≤5 MB), experience_years | linkedin, github, portfolio, notice_period, location, expected_ctc | Acknowledgement |
| F5 General contact | name, email, topic, message | phone, company | Reply in 1 business day |
| F6 Newsletter | email | — | Double opt-in |

Rules:
1. Block disposable email domains on F1–F3.
2. Store `source_page`, UTM params, `form_type`, `consent_at`.
3. Lead status flow: `new → contacted → qualified → proposal → won | lost`.
4. Uploads go to a **private** Supabase Storage bucket; admin access via signed URLs only.
5. Every form shows a consent checkbox with the purpose text and a Privacy Policy link.

## 5. Admin panel (`/admin`)

Auth: Supabase Auth, email magic link / OTP, single `admin` role in v1.

| ID | Module | Functions |
|---|---|---|
| FR-A1 | Dashboard | Leads this week per business line, new applications, open jobs |
| FR-A2 | Leads | List, filter (type, status, date), detail, status change, notes, download attachments, CSV export |
| FR-A3 | Products | CRUD: name, slug, summary, modules, screenshots, status, SEO fields |
| FR-A4 | Case studies | CRUD, anonymised flag, industry, business line, publish toggle |
| FR-A5 | Insights | MDX/rich text, categories, tags, cover, scheduled publish, SEO |
| FR-A6 | Jobs | CRUD, type, close role; applications per job; status `new → screening → interview → offer | rejected | bench` |
| FR-A7 | Talent bench | Applicants marked bench, filter by skill |
| FR-A8 | Settings | Company details (CIN, GSTIN, address, phone), socials, announcement bar |
| FR-A9 | Audit log | Admin actions with timestamp |

## 6. Integrations

| Purpose | Tool | Phase |
|---|---|---|
| DB, auth, storage | Supabase Cloud | v1 |
| Transactional email | Resend (from company domain) | v1 |
| Mailboxes | Hostinger Email | v1 |
| Booking | Cal.com embed | v1 |
| Analytics | GA4 (consent-gated) + Microsoft Clarity | v1 |
| Search | Google Search Console, Bing Webmaster | v1 |
| Spam | Cloudflare Turnstile | v1 |
| Chat | WhatsApp click-to-chat | v1 |
| AI assistant | Claude API chatbot on site content | v2 |
| CRM | Zoho CRM / HubSpot sync | v2 |

## 7. Non-functional requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-1 | Performance | Lighthouse mobile ≥ 90; LCP < 2.5 s, CLS < 0.1, INP < 200 ms; `next/image`; SSG/ISR for marketing pages |
| NFR-2 | SEO | Per-page metadata, OG/Twitter cards, JSON-LD (Organization, Product, Article, JobPosting, BreadcrumbList), sitemap.xml, robots.txt, canonical URLs |
| NFR-3 | Job SEO | JobPosting schema on each job (Google Jobs) |
| NFR-4 | Accessibility | WCAG 2.1 AA |
| NFR-5 | Security | HTTPS + HSTS; CSP and security headers; server-side validation; RLS on every table; secrets in env vars only; private buckets |
| NFR-6 | Privacy (DPDP Act 2023) | Purpose-specific consent, consent timestamp, Privacy Policy with Grievance Officer, deletion on request, CV retention 12 months |
| NFR-7 | Availability | 99.9% target; uptime monitoring |
| NFR-8 | Browsers | Latest 2 of Chrome, Edge, Safari, Firefox; iOS Safari; Android Chrome |
| NFR-9 | Responsive | Mobile-first; test at 360 / 768 / 1024 / 1440 px |
| NFR-10 | Code quality | TS strict, ESLint, Prettier, reusable components, content from DB |
| NFR-11 | Backups | Daily Supabase backups; CSV/JSON export |
| NFR-12 | Email | SPF, DKIM, DMARC on the domain |

## 8. Release plan

| Phase | Contents |
|---|---|
| 0 Foundation | Logo, colours, mailboxes, DNS + SPF/DKIM/DMARC, copy and screenshots |
| 1 Launch v1 | All public pages, forms + alerts, admin, legal + consent, SEO + analytics |
| Go-live gate | CIN in footer, every form tested end-to-end, Lighthouse ≥ 90 mobile |
| 2 Grow | Claude AI assistant, CRM sync, more case studies, LinkedIn tracking |
| 3 Client portal | Staffing client login, timesheets, invoices, product trial sign-up |
