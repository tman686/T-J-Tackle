# T&J's Tackle — Unit Economics & Path to Profitability

This is the financial backbone of the company. It is not marketing copy — the
numbers below are produced by the pricing engine in
[`packages/pricing`](../packages/pricing) from real cost inputs, and the engine
is covered by tests that run in CI. As real supplier quotes and cycle times come
in, update `packages/pricing/src/examples.ts` and these figures update with it.

> Manufacturing-first pricing rule: **price is driven by true cost + target
> margin, never guessed.** Every lure must clear a healthy retail margin *and*
> stay profitable at every wholesale tier.

## Cost model (per bait)

Fully-loaded cost absorbs seven components, plus scrap:

| Component | Driver |
| --------- | ------ |
| Plastisol | grams/bait × (1 − salt%) × $/lb |
| Salt | grams/bait × salt% × $/lb |
| Colorant / glitter / additives | allocated per bait |
| Mold amortization | mold cost ÷ (expected shots × cavities) |
| Labor | (labor $/hr ÷ 3600 × cycle sec) ÷ cavities |
| Packaging | bag + label + insert ÷ baits per bag |
| Overhead | allocated per bait |
| **Scrap uplift** | good units carry rejected units: ÷ (1 − scrap rate) |

## Worked examples (engine output, early garage-scale assumptions)

Assumptions: premium plastisol at **$6.50/lb**, operator at **$22/hr** fully
loaded, **4–5% scrap**, small-batch molds.

### Apex Craw 3.5" — 8 per bag

| | Value |
| --- | --- |
| Cost per bait | **$0.245** |
| Cost per bag | **$1.96** |
| MSRP | **$6.99** |
| Retail gross margin | **72.0%** |
| Contribution per bag | **$5.03** |

Wholesale sheet:

| Tier | Min units | Unit price | Margin | Contribution |
| --- | --- | --- | --- | --- |
| Guide / Pro Staff (30% off) | 12 | $4.89 | 60% | $2.93 |
| Dealer (40% off) | 48 | $4.19 | 53% | $2.23 |
| Distributor (50% off) | 288 | $3.50 | 44% | $1.54 |

### Forge Worm 7" — 7 per bag

Cost/bait **$0.316**, cost/bag **$2.21**, MSRP **$6.99**, retail margin **68.4%**,
contribution/bag **$4.78**. Profitable to the distributor tier (37% margin).

### Leviathan Jerk Shad 6" — 5 per bag

Cost/bait **$0.439**, cost/bag **$2.19**, MSRP **$6.99**, retail margin **68.7%**,
contribution/bag **$4.80**. Profitable to the distributor tier (37% margin).

## What this tells us

- **Direct-to-consumer is the profit engine.** At $6.99 with ~$2/bag cost, every
  DTC bag throws off ~$5 of contribution. Website sales should be pushed hard.
- **Mold cost is negligible per bait** (fractions of a cent) once a mold runs
  tens of thousands of shots — so the real early costs are **labor, packaging,
  and plastisol**. Cutting cycle time and buying plastisol in volume move the
  needle most.
- **Packaging (~$0.05–0.10/bait) rivals material cost.** Negotiating bag/label
  pricing is one of the highest-ROI cost levers early on.
- **Wholesale stays profitable to 50% off**, which means a dealer network can
  scale volume without selling at a loss — critical for regional growth.

## Break-even framing

The engine exposes `breakEvenUnits(fixedCosts, price, variableCostPerBag)`.
Example: with **$2,500/mo** of fixed costs (rent, utilities, software,
insurance) and DTC contribution of **~$5.03/bag**, break-even is:

```
ceil(2500 / 5.03) ≈ 497 bags / month  (~17 bags/day)
```

At the Dealer tier ($2.23 contribution) the same fixed nut needs ~1,121
bags/month — which is why the channel mix matters as much as the price.

## Levers to improve margin (ranked by early impact)

1. **Volume plastisol purchasing** — drop $/lb as monthly poundage grows.
2. **Packaging negotiation / right-sizing** — biggest controllable per-bait cost.
3. **Cycle-time reduction** — more cavities and faster cures cut labor/bait.
4. **Scrap reduction via QC** — every point of yield is pure margin.
5. **Channel mix** — bias toward DTC and limited drops; use wholesale for reach.
6. **Premium / limited-edition pricing** — the Phantom and Leviathan lines can
   carry higher MSRPs than the table above.

## How to recompute

```bash
npm run pricing:test        # verify the engine
# edit packages/pricing/src/examples.ts with real quotes, then re-run
```

All figures here regenerate from the engine — keep them in sync when inputs change.
