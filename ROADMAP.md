# T&J's Tackle — Master Roadmap

This roadmap captures the **full company vision** from the founding brief
(Projects Titan / Leviathan / Poseidon) and turns it into a prioritized,
buildable backlog. The guiding rule from the brief is respected throughout:

> Build a **world-class soft-plastics business first**, and lay a technical
> foundation that can grow into a full tackle brand — without building features
> that distract from Phase 1.

Legend: ✅ done · 🚧 in progress · 🔜 next · 🧊 **flagged — build later**

---

## Phase 1 — Foundation (this repository)

The minimum viable operating system for a soft-plastics manufacturer.

| # | Deliverable | Status |
| - | ----------- | ------ |
| 1 | Premium brand website (Next.js, App Router, Tailwind) | ✅ |
| 2 | Soft-plastic product catalog + product pages | ✅ |
| 3 | "Find My Lure" species/season/water selector | ✅ |
| 4 | Manufacturing domain schema (lures, molds, plastisol, colors, inventory, QC) | ✅ |
| 5 | Brand design system (palette, type, voice) | ✅ |
| 6 | Architecture doc + future-ready monorepo layout | ✅ |
| 7 | GitHub standards (CI, issue/PR templates, CODEOWNERS) | ✅ |
| 8 | Pricing & unit-economics engine (cost/bait, margins, wholesale, break-even) | ✅ |
| 9 | Company financial model / path-to-profitability doc | ✅ |
| 10 | Deployment config — Render Blueprint + Supabase Prisma wiring | ✅ |
| 11 | Live Postgres (Supabase) + migrations applied to prod | 🚧 |
| 12 | Stripe checkout for direct-to-consumer sales | 🔜 |
| 13 | Auth (Clerk/BetterAuth) + customer dashboard | 🔜 |

## Phase 2 — Commerce & Operations

- 🔜 Cart, checkout, orders, order history (Stripe)
- 🔜 Customer dashboard: orders, warranty, wishlist, catch journal, rewards
- 🔜 Admin app (`apps/admin`) — product & content management
- 🔜 Inventory system: raw plastisol, pigments, glitter, hooks, bags, finished goods
- 🔜 Warehouse app (`apps/warehouse`) — barcodes, receiving, picking, packing, shipping
- 🔜 Shipping integration + return labels
- 🔜 Transactional email / notifications service

## Phase 3 — Manufacturing Intelligence

- 🧊 **Mold Manager** app — full mold lifecycle (CAD/STEP/STL, cavities, shots, wear %, maintenance, repolish schedule)
- 🧊 **Plastisol Chemistry Lab** — recipe database, viscosity, heating/cooling curves, shelf life
- 🧊 **Color Science Engine** — RGB/HEX/CMYK, pigment/pearl/glitter formulas, water-clarity ratings
- 🧊 **Manufacturing dashboard (MIS)** — production/day, cycle time, scrap/reject rate, cost per bait, profit per mold
- 🧊 **Injection Machine database** — hours, calibration, maintenance, energy, downtime
- 🧊 **Quality Control** — per-batch inspection records, dimension/weight/float/sink tests, photo docs
- 🧊 **Action Laboratory** — measured tail frequency, kick angle, body roll, fall rate, drag coefficient

## Phase 4 — Engineering & R&D (PLM)

- 🧊 Product Lifecycle Management: idea → sketch → CAD → sim → prototype mold → tank/field test → launch → retire
- 🧊 R&D Lab dashboard — prototypes, field-test results, approval status, patent notes
- 🧊 Original Shape Library — body/tail/appendage systems, Shape-DNA codes (`JT-CRW-APEX-G2-V4`)
- 🧊 Smart Formula Builder — configurable plastisol formulations with cost/density estimates
- 🧊 CAD & mold file management (versioned STEP/STL/Fusion/CAM)
- 🧊 Water-physics estimates (buoyancy, center of mass/drag, sink/glide) refined by testing
- 🧊 Design Review System — manufacturability, cost, margin, patent, launch checklists

## Phase 5 — Intelligence & Data Advantage

- 🧊 Fish Catch Database — voluntary angler catch reports (species, conditions, lure, color, result)
- 🧊 AI product recommendation engine + lure selector v2 (trained on catch data)
- 🧊 Inventory demand forecasting + production scheduling optimization
- 🧊 AI Manufacturing Copilot — natural-language questions over company data
- 🧊 Analytics: revenue, margin, LTV, repeat rate, best colors/shapes/regions, seasonality
- 🧊 Executive Command Center (CEO KPI dashboard)
- 🧊 AI Design Lab — concept generation, prototype comparison, feedback summarization

## Phase 6 — Channel & Brand Scale

- 🧊 Dealer / wholesale portal — custom pricing, bulk orders, inventory sync, marketing assets, reorder suggestions
- 🧊 Patent / IP management dashboard
- 🧊 Supplier portal — lead times, MOQ, quality/delivery ratings, contracts, risk scores
- 🧊 Digital Asset Management (DAM) — versioned logos, CAD, packaging, photo/video, permissions
- 🧊 Product Launch System — countdown, landing page, press kit, dealer/influencer kits
- 🧊 Content Production Studio — YouTube/TikTok/Reels/email/blog planning
- 🧊 Product photography pipeline (hero, 360°, macro, underwater, rigged, packaging)
- 🧊 Fishing Knowledge Base — species profiles, seasonal patterns, rigging, knots, gear selection

## Phase 7 — Global & Platform

- 🧊 Internationalization: multi-language, multi-currency, regional pricing, tax rules
- 🧊 Regional warehouses & international logistics
- 🧊 Mobile app (customer + field-team catch logging)
- 🧊 Tournament platform / pro-staff program
- 🧊 OEM manufacturing + licensing management
- 🧊 Hard baits, jig heads, spinnerbaits, terminal tackle, rods, reels, line, nets, apparel
- 🧊 CNC-machined products & marine electronics integration

---

## Original product & brand systems (design language — build alongside product)

These are **naming and taxonomy systems**, encoded in code/data as the catalog grows:

- **Shape-DNA:** `JT-<Category>-<Family>-G<Gen>-V<Version>` (e.g. `JT-CRW-APEX-G2-V4`)
- **Product families:** Forge (power), Drift (finesse), Current (swimbaits), Phantom (creature), Leviathan (saltwater/big profile), Apex, Pulse, Torrent
- **Color codes:** structured internal codes (`GP-001` Green Pumpkin Standard) with customer-facing marketing names (`Marsh Goblin`)
- **Formula families:** `F` floating · `D` durable · `S` salted · `E` extra-soft · `X` extreme-stretch (composable, e.g. `F-D-S-2`)
- **Mold IDs:** `JT-MOLD-00001` · **Prototypes:** `JT-PROT-00001`

The Phase 1 data model in [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma)
already encodes these identifiers so the taxonomy is consistent from day one.

---

## Guardrails carried from the brief

- **Original designs only.** Never copy competitors' protected lure designs or branding.
- **Manufacturing-first.** Engineering, molds, and formulas are first-class, not afterthoughts.
- **Data compounds.** Catch reports, production data, and QC records become proprietary knowledge.
- **Modular & scalable.** Every module has clear interfaces and can scale without a rewrite.
- **Ship focused.** If a feature doesn't serve Phase 1, it stays flagged here until its phase.
