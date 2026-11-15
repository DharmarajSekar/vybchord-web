# Vybchord Website — Business Requirements Document (BRD)

**Company:** VYBCHORD TECHNOLOGIES & SERVICES PRIVATE LIMITED (Chennai, India)
**Version:** 0.2 · **Owner:** Dharmaraj Sekar, Founder · **Date:** 15 Nov 2026

---

## 1. Executive summary

The website is Vybchord's primary sales and credibility asset. It must win enterprise trust for **three business lines**:

1. **Products (primary focus)** — Vybchord-owned AI-native platforms (e.g. VaultHRMS, PropFlow).
2. **Project services** — end-to-end custom software builds for clients.
3. **Staff augmentation** — Vybchord engineers deployed into larger companies' project teams.

Vybchord builds AI-native, production-ready software for HRTech, legal tech and real estate tech, selling to enterprises and institutions via SaaS subscription, licensing and IP-transfer models.

## 2. Business objectives

| # | Objective | Why it matters |
|---|---|---|
| BO-1 | Establish Vybchord as a credible, registered enterprise vendor | Procurement checks legal entity, CIN, office, security posture |
| BO-2 | Generate product demo and licensing enquiries | Products are the current focus and highest-value deals |
| BO-3 | Generate custom project enquiries | Project revenue funds product development |
| BO-4 | Generate staff augmentation enquiries | Recurring, predictable monthly revenue |
| BO-5 | Build a talent pipeline of engineers | Staffing deals need deployable people |
| BO-6 | Showcase AI-native delivery speed | Differentiates from traditional IT services firms |
| BO-7 | Founder can update content without a developer | Solo founder needs fast updates |

## 3. Business lines

| | Products (primary) | Project services | Staff augmentation |
|---|---|---|---|
| What we sell | VaultHRMS (enterprise HCM), PropFlow (real estate CRM), more to follow | Custom web apps, SaaS, AI features, enterprise portals | Engineers deployed into client teams |
| Buyer | CHRO, CIO, CTO, real estate heads, institutions | Founders, product heads, SME/enterprise IT | Engineering managers, delivery heads, procurement |
| Commercial model | SaaS, enterprise licence, white-label, IP transfer | Fixed bid per milestone, or T&M | Monthly rate per resource, dedicated team, contract-to-hire |
| Primary CTA | Book a demo / Licensing enquiry | Start a project / Get an estimate | Request engineers |
| Proof needed | Screens, modules, security, deployment options | Case studies, process, timelines | Skills matrix, terms, replacement guarantee, NDA readiness |

## 4. Target audiences

| Persona | Wants to | Must leave with | Key pages |
|---|---|---|---|
| Enterprise product buyer | Judge fit and safety of a product | Booked demo / licensing call | Products, Contact |
| Project client | Check Vybchord can deliver a full product | Submitted project brief | Services, Case studies |
| Staffing client | Fill skill gaps fast | Resource request | Hire Engineers |
| Procurement / vendor onboarding | Verify the legal entity | CIN, office, GST, policies | About, Footer, Legal |
| Engineer / job seeker | Find a role or deployment | Submitted application | Careers |

## 5. Scope

**In scope (v1):** public marketing site for all three lines; lead forms with email alerts and admin inbox; careers with CV upload; admin-managed products, case studies, blog, jobs; demo booking; SEO, analytics, legal pages, DPDP-aligned consent; company email and transactional email.

**Out of scope (later phases):** client portal / timesheets; online payments; public talent database; multi-language; full CRM.

## 6. Success metrics

| KPI | Target |
|---|---|
| Demo / project / staffing enquiries per month | Set after 90-day baseline |
| Lead response time | < 1 business day |
| Lighthouse mobile (all 4 categories) | ≥ 90 |
| LCP on 4G mobile | < 2.5 s |
| Brand search rank | #1 within 60 days |

## 7. Assumptions, constraints, risks

**Assumptions:** CIN fields filled once incorporation certificate is issued; client work shown only with approval or anonymised; one person handles all leads in v1.

**Constraints:** Stack fixed — Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase. Hosting, domain and mailboxes on Hostinger (already purchased). Content must be founder-editable.

| Risk | Mitigation |
|---|---|
| Three lines dilute the message | Product-first home page, one clear path per line |
| Solo company looks small | Show legal entity, process, security, NDA readiness, replacement guarantee |
| Few case studies at launch | Use own products as proof; anonymised client work |
| Personal data in forms/CVs | Consent notice, private storage, retention policy, grievance contact |
| Form spam | Turnstile CAPTCHA, honeypot, rate limiting |
