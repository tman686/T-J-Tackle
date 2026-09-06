# @jt/database

The canonical data model for T&J's Tackle — manufacturing-first.

The website (Phase 1) reads a typed sample catalog that mirrors these models, so
moving to a live database in Phase 2 is a data-source swap, not a rewrite.

## Commands

```bash
npm run validate   # validate schema (runs in CI, no DB needed)
npm run format     # prisma format
npm run generate   # generate the Prisma client (needs deps installed)
npm run migrate:dev  # create/apply migrations (Phase 2, needs DATABASE_URL)
npm run seed       # load sample data (Phase 2)
```

## Model map

- **Catalog / design:** `ProductFamily`, `Lure`, `ActionProfile`
- **Engineering:** `Mold`, `MoldMaintenance`, `PlastisolFormula`, `Color`, `Prototype`, `FieldNote`
- **Manufacturing:** `ProductionBatch`, `QualityCheck`
- **Inventory / supply:** `InventoryItem`, `Supplier`
- **Commerce:** `ProductVariant`, `Customer`, `Order`, `OrderLine`, `Review`
- **Data advantage:** `CatchReport`

Identifiers follow the company taxonomy: `JT-CRW-APEX-G2-V4` (Shape-DNA),
`JT-MOLD-00001`, `JT-PROT-00001`, formula families like `F-D-S-2`, color codes
like `GP-003`.

See [`../../ROADMAP.md`](../../ROADMAP.md) for what each model unlocks in later phases.
