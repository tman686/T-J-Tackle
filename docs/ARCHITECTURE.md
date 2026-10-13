# T&J's Tackle — Architecture

## Guiding idea

Build a **company operating system**, not a website. Every department — from
mold design to the storefront — will eventually be a module on one platform
sharing one data model. Phase 1 ships the customer-facing surface and the
canonical data model; later phases add internal apps against the same schema.

## Monorepo (npm workspaces, Turborepo-ready)

```
apps/
  website        ✅ Next.js 14 storefront + brand (this phase)
  admin          🧊 product/content management
  warehouse      🧊 receiving / picking / packing / shipping
  mold-manager   🧊 mold lifecycle & CAD file management
  inventory      🧊 raw materials & finished goods
  crm            🧊 customer & dealer relationships
  analytics      🧊 executive KPIs

packages/
  database       ✅ Prisma schema — canonical domain model (this phase)
  ui             🧊 shared React component library
  auth           🧊 authentication (Clerk/BetterAuth)
  ai             🧊 recommendation / forecasting clients
  cad            🧊 CAD/STEP/STL handling
  pricing        🧊 pricing & margin engine
  inventory      🧊 inventory domain logic
  shipping       🧊 carrier integrations
  quality        🧊 QC domain logic
  manufacturing  🧊 production domain logic

services/
  api            🧊 NestJS gateway
  image-processing 🧊
  ai-engine      🧊 FastAPI ML services
  forecasting    🧊
  notifications  🧊
  automation     🧊
```

Legend: ✅ built now · 🧊 flagged for later (see [`../ROADMAP.md`](../ROADMAP.md)).

## Target stack (from the brief)

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** NestJS + FastAPI (AI), PostgreSQL, Prisma ORM, Redis, RabbitMQ
- **Infra:** Docker, Kubernetes (future), GitHub Actions, Cloudflare, AWS
- **Payments:** Stripe · **Auth:** Clerk or BetterAuth

Phase 1 uses the frontend slice (Next.js + TS + Tailwind) plus the Prisma schema.
Backend services are stubbed by the data model and roadmap so they can be added
without reshaping the domain.

## Data model — the backbone

The canonical model lives in
[`packages/database/prisma/schema.prisma`](../packages/database/prisma/schema.prisma).
It is deliberately manufacturing-centric. Core entities:

- **Lure** — SKU, Shape-DNA, generation/revision, species, water, action specs
- **Mold** — `JT-MOLD-*`, cavities, material, shots, wear %, maintenance
- **PlastisolFormula** — composable formula families, density, cure params
- **Color** — structured code + marketing name, pigment/glitter, water ratings
- **Prototype** — `JT-PROT-*`, R&D lifecycle, field-test linkage
- **ProductionBatch** + **QualityCheck** — traceability from drum to bag
- **InventoryItem** — raw materials → finished goods
- **CatchReport** — proprietary angler performance data
- **Product / ProductVariant / Order** — the commerce layer over the catalog

The website currently reads a typed sample catalog
(`apps/website/src/data/lures.ts`) that mirrors this schema, so swapping to a
live database in Phase 2 is a data-source change, not a rewrite.

## Why manufacturing-first

The competitive moat is not a single lure — it's the **systems**: mold library,
formula database, color science, and the compounding catch/production data. The
architecture makes those first-class so knowledge is never lost and every
generation of a lure improves on measured data.
