import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeCost,
  grossMargin,
  markup,
  priceForMargin,
  keystone,
  charmPrice,
  wholesalePriceSheet,
  breakEvenUnits,
  moldPayoffShots,
  priceProduct,
  type CostInputs,
} from "./pricing.js";
import { exampleSummaries } from "./examples.js";

const baseInputs: CostInputs = {
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
  overheadPerBait: 0.02,
  scrapRate: 0.04,
};

test("computeCost breakdown sums to cost per bait (within rounding)", () => {
  const c = computeCost(baseInputs);
  const parts =
    c.plastisol + c.salt + c.colorant + c.moldAmortization + c.labor + c.packaging + c.overhead;
  // costPerBait includes scrap absorption, so it must be >= raw parts.
  assert.ok(c.costPerBait >= parts, "cost per bait covers raw parts");
  // Scrap uplift is modest at 4%.
  assert.ok(c.costPerBait <= parts * 1.06);
  assert.equal(c.costPerBag, Math.round(c.costPerBait * 8 * 100) / 100);
});

test("cost per bait is in a sane sub-dollar range for a small craw", () => {
  const c = computeCost(baseInputs);
  assert.ok(c.costPerBait > 0.05 && c.costPerBait < 0.5, `unexpected cost ${c.costPerBait}`);
});

test("higher scrap rate raises cost", () => {
  const low = computeCost({ ...baseInputs, scrapRate: 0 }).costPerBait;
  const high = computeCost({ ...baseInputs, scrapRate: 0.2 }).costPerBait;
  assert.ok(high > low);
});

test("grossMargin and markup are consistent", () => {
  assert.equal(grossMargin(10, 4), 0.6);
  assert.equal(markup(10, 4), 1.5);
  assert.equal(grossMargin(0, 4), 0);
  assert.equal(markup(10, 0), 0);
});

test("priceForMargin hits the target margin", () => {
  const price = priceForMargin(3.5, 0.65);
  assert.ok(Math.abs(grossMargin(price, 3.5) - 0.65) < 0.01);
});

test("keystone doubles by default", () => {
  assert.equal(keystone(3.25), 6.5);
  assert.equal(keystone(3, 3), 9);
});

test("charmPrice returns .99 not below cost floor", () => {
  assert.equal(charmPrice(6.23), 6.99);
  assert.equal(charmPrice(6.99), 6.99);
  assert.equal(charmPrice(6.23, 7.1), 7.99);
  assert.equal((charmPrice(5.0) * 100) % 100, 99);
});

test("wholesale sheet discounts MSRP and stays above cost", () => {
  const sheet = wholesalePriceSheet(6.99, 2.2);
  assert.equal(sheet.length, 3);
  // Deeper tiers cost the dealer less per unit.
  assert.ok(sheet[0].unitPrice > sheet[2].unitPrice);
  // Even the distributor tier is above our cost (positive contribution).
  for (const tier of sheet) {
    assert.ok(tier.contributionPerUnit > 0, `${tier.name} loses money`);
    assert.ok(tier.marginPct > 0);
  }
});

test("breakEvenUnits and unprofitable guard", () => {
  assert.equal(breakEvenUnits(1000, 6.99, 2.2), Math.ceil(1000 / (6.99 - 2.2)));
  assert.equal(breakEvenUnits(1000, 2, 3), Infinity);
});

test("moldPayoffShots is finite for positive contribution", () => {
  const shots = moldPayoffShots(1800, 0.3, 12);
  assert.ok(Number.isFinite(shots) && shots > 0);
  assert.equal(moldPayoffShots(1800, 0, 12), Infinity);
});

test("priceProduct end-to-end yields target-ish margin and full sheet", () => {
  const s = priceProduct(baseInputs, { targetMargin: 0.68, charmPricing: true });
  assert.ok(s.msrp > s.cost.costPerBag);
  assert.ok(s.marginPct >= 0.6, `margin too low: ${s.marginPct}`);
  assert.equal(s.wholesale.length, 3);
  assert.equal((s.msrp * 100) % 100, 99, "charm pricing applied");
});

test("example products all price profitably at every wholesale tier", () => {
  for (const { name, summary } of exampleSummaries()) {
    assert.ok(summary.marginPct > 0.5, `${name} retail margin too thin`);
    for (const tier of summary.wholesale) {
      assert.ok(tier.contributionPerUnit > 0, `${name} ${tier.name} unprofitable`);
    }
  }
});
