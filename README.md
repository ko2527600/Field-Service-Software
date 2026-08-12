# Ledgio — Customer & Renewal Tracker

A mobile-first Progressive Web App for fire extinguisher sales & servicing businesses to track customers, the extinguishers/units they own, renewal status, and service history — installable on phone and desktop from the same codebase.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS, `vite-plugin-pwa` (manifest + service worker)
- **Backend:** Node.js + Express (TypeScript), REST API under `/api/v1`
- **Database:** PostgreSQL via Prisma ORM
- **Shared:** `packages/shared` — Zod schemas, enums, and status/renewal-date logic used by both apps

## Project structure

```
apps/api/       Express + Prisma backend
apps/web/       React + Vite PWA frontend
packages/shared Shared TS types, Zod schemas, status/renewal-date logic
docker-compose.yml   Local Postgres for development
```

## Local development

```bash
npm install
cp .env.example apps/api/.env
docker compose up -d db          # Postgres on localhost:5432
npm run prisma:migrate           # apply schema
npm run prisma:seed              # optional: seed demo customers/units
npm run dev                      # API on :4000, web on :5173 (proxies /api)
```

Open http://localhost:5173.

## Testing

```bash
npm test
```

## PWA install check

```bash
npm run build --workspace apps/web
npm run preview --workspace apps/web
```

Open the preview URL in Chrome, check DevTools → Application → Manifest & Service Workers, and run a Lighthouse PWA audit.

## Scope

This build covers the full Customer & Renewal Tracker: customer records, per-customer extinguisher/unit tracking, automatic renewal status (Active / Due Soon / Expired), service visit logging, a prioritized contact dashboard, filtering/sorting, and CSV export. The Invoice Generator described in the same product spec is a separate, later phase — the data model is designed not to block adding it.
