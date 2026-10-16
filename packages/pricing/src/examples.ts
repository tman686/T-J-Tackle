/**
 * Worked unit-economics examples for T&J's Tackle products.
 * These use realistic small-batch soft-plastics numbers so the pricing engine
 * produces meaningful figures for docs and the internal margin tooling.
 * Tune these as real supplier quotes and cycle times come in.
 */
import { priceProduct, type CostInputs, type PricingSummary } from "./pricing.js";

export interface ExampleProduct {
  slug: string;
  name: string;
  inputs: CostInputs;
  targetMargin: number;
}

// Shared shop assumptions (early garage-scale operation).
const SHOP = {
  plastisolCostPerLb: 6.5, // premium plastisol, small volume
  saltCostPerLb: 0.4,
  laborRatePerHour: 22, // fully loaded operator
  overheadPerBait: 0.02,
  scrapRate: 0.04,
};

export const EXAMPLE_PRODUCTS: ExampleProduct[] = [
  {
    slug: "apex-craw-35",
    name: 'Apex Craw 3.5"',
    targetMargin: 0.68,
    inputs: {
      gramsPerBait: 6.0,
      plastisolCostPerLb: SHOP.plastisolCostPerLb,
      saltPercent: 6.5,
      saltCostPerLb: SHOP.saltCostPerLb,
      colorantCostPerBait: 0.03,
      moldCost: 1800,
      moldExpectedShots: 40000,
      cavities: 12,
      laborRatePerHour: SHOP.laborRatePerHour,
      cycleTimeSec: 95,
      packagingCostPerBag: 0.42,
      baitsPerBag: 8,
      overheadPerBait: SHOP.overheadPerBait,
      scrapRate: SHOP.scrapRate,
    },
  },
  {
    slug: "forge-worm-7",
    name: 'Forge Worm 7"',
    targetMargin: 0.68,
    inputs: {
      gramsPerBait: 9.5,
      plastisolCostPerLb: SHOP.plastisolCostPerLb,
      saltPercent: 5.0,
      saltCostPerLb: SHOP.saltCostPerLb,
      colorantCostPerBait: 0.035,
      moldCost: 1600,
      moldExpectedShots: 40000,
      cavities: 10,
      laborRatePerHour: SHOP.laborRatePerHour,
      cycleTimeSec: 90,
      packagingCostPerBag: 0.42,
      baitsPerBag: 7,
      overheadPerBait: SHOP.overheadPerBait,
      scrapRate: SHOP.scrapRate,
    },
  },
  {
    slug: "leviathan-jerkshad-6",
    name: 'Leviathan Jerk Shad 6"',
    targetMargin: 0.66,
    inputs: {
      gramsPerBait: 12.0,
      plastisolCostPerLb: SHOP.plastisolCostPerLb,
      saltPercent: 8.0,
      saltCostPerLb: SHOP.saltCostPerLb,
      colorantCostPerBait: 0.05,
      moldCost: 2200,
      moldExpectedShots: 35000,
      cavities: 8,
      laborRatePerHour: SHOP.laborRatePerHour,
      cycleTimeSec: 110,
      packagingCostPerBag: 0.48,
      baitsPerBag: 5,
      overheadPerBait: SHOP.overheadPerBait,
      scrapRate: 0.05,
    },
  },
];

/** Compute pricing summaries for all example products. */
export function exampleSummaries(): Array<{ slug: string; name: string; summary: PricingSummary }> {
  return EXAMPLE_PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    summary: priceProduct(p.inputs, { targetMargin: p.targetMargin, charmPricing: true }),
  }));
}
