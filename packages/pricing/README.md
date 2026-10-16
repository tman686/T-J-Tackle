# @jt/pricing

The unit-economics & pricing engine for T&J's Tackle. Pure, dependency-free
TypeScript so it can run anywhere — the website, an internal margin tool, or a
future admin app.

Answers the money questions directly: **what does a bait cost, what should it
sell for, and is it profitable at wholesale?**

## Use

```ts
import { priceProduct } from "@jt/pricing";

const summary = priceProduct(
  {
    gramsPerBait: 6,
    plastisolCostPerLb: 6.5,
    saltPercent: 6.5,
    saltCostPerLb: 0.4,
    colorantCostPerBait: 0.03,
    moldCost: 1800,
    moldExpectedShots: 40000,
    cavities: 12,
    laborRatePerHour: 22,
    cycleTimeSec: 95,
    packagingCostPerBag: 0.42,
    baitsPerBag: 8,
    scrapRate: 0.04,
  },
  { targetMargin: 0.68, charmPricing: true },
);

summary.cost.costPerBag; // 1.96
summary.msrp;            // 6.99
summary.marginPct;       // 0.72
summary.wholesale;       // Guide / Dealer / Distributor price sheet
```

## API

- `computeCost(inputs)` — full per-bait / per-bag cost breakdown (with scrap).
- `grossMargin`, `markup` — margin math.
- `priceForMargin(cost, target)` / `keystone(cost, mult)` — retail pricing.
- `charmPrice(price, floor)` — nearest `.99` at or above a cost floor.
- `wholesalePriceSheet(msrp, costPerBag, tiers?)` — dealer tiers with margins.
- `breakEvenUnits(fixed, price, variableCost)` — units to break even.
- `moldPayoffShots(moldCost, contributionPerBait, cavities)` — mold payback.
- `priceProduct(inputs, opts)` — end-to-end summary.

## Test

```bash
npm run test --workspace @jt/pricing   # node:test, runs in CI
```

See [`../../docs/UNIT-ECONOMICS.md`](../../docs/UNIT-ECONOMICS.md) for the
company financial model built on this engine.
