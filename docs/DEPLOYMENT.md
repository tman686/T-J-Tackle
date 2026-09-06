# T&J's Tackle — Deployment (Render + Supabase)

This guide takes T&J's Tackle live: **Supabase** for the Postgres database and
**Render** for the Next.js web service. The site boots and serves the full
storefront with or without a database connected, so you can deploy the web
service first and wire the database when ready.

---

## Part 1 — Supabase (database)

1. **Create a project.** Supabase → *New project*. Name it `jt-tackle`, pick a
   region near your customers, and set a strong database password (save it).
2. **Get the connection strings.** Project → *Connect* (or *Project Settings →
   Database*). Copy two strings:
   - **Pooled / Transaction** (port `6543`) → this is `DATABASE_URL`. Append
     `?pgbouncer=true&connection_limit=1`.
   - **Direct connection** (port `5432`) → this is `DIRECT_URL` (used for
     migrations).
3. **Apply the schema.** A baseline migration is already committed at
   `packages/database/prisma/migrations/0000_init`, so a fresh database stands
   up with one command. From your machine, with both values in
   `packages/database/.env`:
   ```bash
   npm install
   npm run db:generate  --workspace @jt/database   # generate Prisma client
   npm run migrate:deploy --workspace @jt/database  # apply the committed migration
   npm run seed         --workspace @jt/database    # load the launch catalog
   ```
   The seed loads the same 6 lures, 6 families, 10 colors, and their variants
   that the storefront shows, so the database matches the live site. It is
   idempotent — safe to re-run.

> The Prisma datasource is already configured for Supabase: pooled `DATABASE_URL`
> at runtime, `DIRECT_URL` for migrations (`packages/database/prisma/schema.prisma`).

## Part 2 — Render (web service)

The repo ships a Blueprint at [`render.yaml`](../render.yaml).

1. Push the repo to GitHub (done — this branch/PR).
2. Render → **New + → Blueprint** → select this repository. Render reads
   `render.yaml` and creates the `jt-tackle-website` web service:
   - Build: `npm ci && npm run build`
   - Start: `npm run start --workspace @jt/website`
   - Health check: `/api/health`
3. **Set secrets** on the service (Environment tab): paste `DATABASE_URL` and
   `DIRECT_URL` from Supabase. They're marked `sync: false` so they must be set
   in the dashboard, never committed.
4. **Deploy.** Render builds and serves the site. Visit `/api/health` — it
   returns `{ "status": "ok", "databaseConfigured": true }` once the DB URL is set.

### Custom domain

Render → service → *Settings → Custom Domains* → add `jttackle.com` and point
your DNS (CNAME) as instructed. Update the `metadataBase`/sitemap URLs in
`apps/website/src/app/layout.tsx` and `sitemap.ts` to the live domain.

---

## Environments & secrets

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Render secret, local `.env` | Pooled runtime connection (6543) |
| `DIRECT_URL` | Render secret, local `.env` | Direct connection for migrations (5432) |
| `NODE_ENV` | Render (set to `production`) | Runtime mode |

See [`.env.example`](../.env.example) for the full template. Phase 2 adds Stripe
keys the same way.

## Notes

- **The site does not require a database to run.** The storefront reads a typed
  sample catalog today; connecting Supabase is what unlocks live orders,
  inventory, and catch data in Phase 2.
- **Free tiers** are fine to launch. Render's free web service sleeps on
  inactivity; upgrade to keep it always-on before a real launch.
- **CI stays green without secrets** — `prisma validate` uses placeholder URLs;
  real connection strings live only in Render/your machine.
