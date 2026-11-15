# Vybchord Website — Technical Specification

Read with `01-BRD.md` and `02-FRD.md`. This file tells the developer / AI coding agent exactly how to build and deploy.

---

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15+ (App Router), React Server Components, TypeScript `strict` |
| Styling | Tailwind CSS v4, shadcn/ui, `next-themes`, Lucide icons, Framer Motion (subtle) |
| Forms | React Hook Form + zod (shared schemas client/server) |
| Data | Supabase Cloud — Postgres, Auth, Storage, RLS (`@supabase/ssr`) |
| Content | Supabase tables; long-form articles as MDX stored in `posts.body_mdx` |
| Email | Resend + React Email templates |
| Spam | Cloudflare Turnstile + honeypot + rate limit (Supabase table or in-memory LRU) |
| Analytics | GA4 + Microsoft Clarity, loaded after consent |
| Hosting | Hostinger (domain, mailboxes, Node.js app) |
| Repo | GitHub, `main` = production |

## 2. Folder structure

```
vybchord-web/
├─ app/
│  ├─ (site)/                 # public pages, shared header/footer layout
│  │  ├─ page.tsx             # Home
│  │  ├─ products/[slug]/page.tsx
│  │  ├─ services/[slug]/page.tsx
│  │  ├─ hire-engineers/page.tsx
│  │  ├─ case-studies/[slug]/page.tsx
│  │  ├─ about/page.tsx
│  │  ├─ careers/[slug]/page.tsx
│  │  ├─ insights/[slug]/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ thank-you/[form]/page.tsx
│  │  └─ legal/[doc]/page.tsx
│  ├─ admin/                  # protected by middleware
│  │  ├─ layout.tsx
│  │  ├─ page.tsx             # dashboard
│  │  ├─ leads/ products/ case-studies/ insights/ jobs/ bench/ settings/
│  ├─ auth/callback/route.ts
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ layout.tsx
├─ components/
│  ├─ ui/                     # shadcn
│  ├─ site/                   # header, footer, hero, cards, cta-band, consent-banner
│  ├─ forms/                  # demo-form, project-form, staffing-form, apply-form, contact-form
│  └─ admin/
├─ lib/
│  ├─ supabase/{server,client,admin}.ts
│  ├─ validations/            # zod schemas per form
│  ├─ actions/                # server actions per form
│  ├─ email/                  # resend client + templates
│  ├─ seo.ts                  # metadata + JSON-LD helpers
│  └─ turnstile.ts
├─ supabase/
│  └─ migrations/0001_init.sql   # = 04-supabase-schema.sql
├─ public/
├─ middleware.ts              # protects /admin
├─ next.config.ts             # security headers (served with next start)
└─ .env.example
```

## 3. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://<your-domain>
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only, never exposed
RESEND_API_KEY=
LEAD_ALERT_EMAIL=sales@<your-domain>
MAIL_FROM="Vybchord <hello@<your-domain>>"
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_CAL_LINK=
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
ADMIN_EMAILS=dharmaraj@<your-domain>   # comma-separated allow-list
```

## 4. Form submission flow (server action)

1. Parse `FormData` with the zod schema; reject on error.
2. Reject if honeypot field filled.
3. Verify Turnstile token server-side.
4. Rate-limit by IP (e.g. 5 submissions / 10 min).
5. Upload attachment (if any) to private bucket `uploads/` with service-role client.
6. Insert into `leads` (or `applications`) with service-role client.
7. Send founder alert + visitor auto-reply via Resend (do not fail the request if email fails; log it).
8. `redirect('/thank-you/<form>')`.

## 5. Security headers (`next.config.ts`)

`Strict-Transport-Security`, `Content-Security-Policy` (allow self, Supabase, Turnstile, GA, Clarity, Cal.com), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.

## 6. Deployment on Hostinger

### Option A — Business / Cloud plan (managed Node.js Web App)
1. Push the repo to GitHub.
2. hPanel → Websites → Create site → **Web App** → Import Git repository → select repo + `main`.
3. Framework auto-detects Next.js. Build: `npm run build`; Start: `npm run start`. Node 20+.
4. Add all env vars from section 3 in the app's Environment settings.
5. Connect the domain; enable free SSL.
6. Every push to `main` redeploys; pull requests get preview builds.

### Option B — VPS (Ubuntu)
```bash
# one-time
sudo apt update && sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2
git clone <repo> /var/www/vybchord && cd /var/www/vybchord
cp .env.example .env.production   # fill values
npm ci && npm run build
pm2 start npm --name vybchord -- start && pm2 save && pm2 startup
```
Nginx site (`/etc/nginx/sites-available/vybchord`):
```nginx
server {
  server_name <your-domain> www.<your-domain>;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/vybchord /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d <your-domain> -d www.<your-domain>
```
Redeploy: `git pull && npm ci && npm run build && pm2 reload vybchord`.

### DNS (Hostinger hPanel)
- A record `@` → app/VPS IP (Option A sets this automatically when the domain is connected).
- CNAME `www` → root domain.
- MX → Hostinger Mail (keep defaults).
- TXT SPF: include Hostinger + Resend; add Resend DKIM records; DMARC `v=DMARC1; p=quarantine; rua=mailto:dmarc@<your-domain>`.

## 7. Definition of done (go-live gate)
- [ ] CIN, registered office, GSTIN shown in footer from `site_settings`
- [ ] All 6 forms tested end-to-end (DB row, founder email, auto-reply, thank-you page)
- [ ] RLS verified: anon cannot `select` leads/applications
- [ ] Lighthouse mobile ≥ 90 on Home, Product, Hire Engineers, Contact
- [ ] sitemap.xml submitted in Search Console
- [ ] Legal pages published; consent banner working
