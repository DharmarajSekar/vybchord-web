# Vybchord Website

Company website for Vybchord Technologies & Services. Specs live in [`docs/`](docs/); AI coding rules in [`CLAUDE.md`](CLAUDE.md).

## Getting started

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

## Scripts

| Command             | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Local dev server                            |
| `npm run build`     | Production build (`output: 'standalone'`)   |
| `npm run start`     | Serve the production build                  |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm run format`    | Prettier (with Tailwind class sorting)      |

Deployment to Hostinger is described in `docs/03-TECH-SPEC.md` section 6.
