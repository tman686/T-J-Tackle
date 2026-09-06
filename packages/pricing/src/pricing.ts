/**
 * T&J's Tackle — unit-economics & pricing engine.
 *
 * Manufacturing-first pricing: a lure's price should be driven by its true cost
 * to produce (plastisol, salt, colorant, mold amortization, labor, packaging,
 * overhead) plus a target margin — not guessed. These pure functions power
 * costing, retail/wholesale pricing, and break-even analysis.
 *
 * Money convention: inputs and outputs are in US dollars as numbers. Because a
 * single bait can cost fractions of a cent, we keep full precision internally
 * and only round at reporting boundaries via `roundCents`.
 */

export function roundCents(dollars: number): number {
  return Math.round(dollars * 100) / 100;
}

/**
 * Nearest "charm" price ending in .99 that is not below `min` (a cost floor).
 * e.g. charmPrice(6.23) -> 6.99, charmPrice(6.23, 7.10) -> 7.99.
 */
export function charmPrice(dollars: number, min = 0): number {
  let candidate = Math.floor(dollars) + 0.99;
  while (candidate < dollars || candidate < min) candidate += 1;
  return roundCents(candidate);
}

// ---------------------------------------------------------------------------
// Cost inputs
// ---------------------------------------------------------------------------

export interface CostInputs {
  /** Grams of plastisol per finished bait (volume × density). */
  gramsPerBait: number;
  /** Plastisol cost in $/lb. */
  plastisolCostPerLb: number;
  /** Salt as a percentage of bait mass (0–100). */
  saltPercent?: number;
  /** Salt cost in $/lb. */
  saltCostPerLb?: number;
  /** Colorant + glitter + additive cost allocated per bait, in $. */
  colorantCostPerBait?: number;

  /** Fully-loaded cost of the mold, in $. */
  moldCost: number;
  /** Expected number of shots (injection cycles) over the mold's life. */
  moldExpectedShots: number;
  /** Cavities per shot (baits produced per cycle). */
  cavities: number;

  /** Fully-loaded labor rate, in $/hour. */
  laborRatePerHour: number;
  /** Cycle time per shot, in seconds. */
  cycleTimeSec: number;

  /** Packaging cost per bag (bag + label + insert), in $. */
  packagingCostPerBag: number;
  /** Number of baits per retail bag. */
  baitsPerBag: number;

  /** Allocated overhead per bait (rent, utilities, etc.), in $. Default 0. */
  overheadPerBait?: number;
  /** Expected scrap/reject rate (0–1). Good units absorb scrap cost. Default 0. */
  scrapRate?: number;
}

export interface CostBreakdown {
  plastisol: number;
  salt: number;
  colorant: number;
  moldAmortization: number;
  labor: number;
  packaging: number;
  overhead: number;
  /** Cost of one sellable bait including scrap absorption, in $. */
  costPerBait: number;
  /** Cost of one retail bag (costPerBait × baitsPerBag), in $. */
  costPerBag: number;
}

const GRAMS_PER_LB = 453.592;

/** Compute the fully-loaded cost to produce one sellable bait and one bag. */
export function computeCost(input: CostInputs): CostBreakdown {
  const saltPercent = input.saltPercent ?? 0;
  const saltCostPerLb = input.saltCostPerLb ?? 0;
  const colorant = input.colorantCostPerBait ?? 0;
  const overhead = input.overheadPerBait ?? 0;
  const scrapRate = clamp(input.scrapRate ?? 0, 0, 0.95);

  const lbsPerBait = input.gramsPerBait / GRAMS_PER_LB;
  const plastisolLbs = lbsPerBait * (1 - saltPercent / 100);
  const saltLbs = lbsPerBait * (saltPercent / 100);

  const plastisol = plastisolLbs * input.plastisolCostPerLb;
  const salt = saltLbs * saltCostPerLb;

  const moldAmortization = input.moldCost / (input.moldExpectedShots * input.cavities);

  const laborPerShot = (input.laborRatePerHour / 3600) * input.cycleTimeSec;
  const labor = laborPerShot / input.cavities;

  const packaging = input.packagingCostPerBag / input.baitsPerBag;

  // Raw cost before absorbing scrap.
  const raw = plastisol + salt + colorant + moldAmortization + labor + packaging + overhead;
  // Good units carry the cost of rejected units: divide by yield.
  const yieldRate = 1 - scrapRate;
  const costPerBait = raw / yieldRate;

  return {
    plastisol: roundFrac(plastisol),
    salt: roundFrac(salt),
    colorant: roundFrac(colorant),
    moldAmortization: roundFrac(moldAmortization),
    labor: roundFrac(labor),
    packaging: roundFrac(packaging),
    overhead: roundFrac(overhead),
    costPerBait: roundFrac(costPerBait),
    costPerBag: roundCents(costPerBait * input.baitsPerBag),
  };
}

// ---------------------------------------------------------------------------
// Margins & pricing
// ---------------------------------------------------------------------------

/** Gross margin as a fraction (0–1): (price − cost) / price. */
export function grossMargin(price: number, cost: number): number {
  if (price <= 0) return 0;
  return (price - cost) / price;
}

/** Markup as a fraction: (price − cost) / cost. */
export function markup(price: number, cost: number): number {
  if (cost <= 0) return 0;
  return (price - cost) / cost;
}

/**
 * Price required to hit a target gross margin.
 * targetMargin is a fraction (e.g. 0.65 for 65%).
 */
export function priceForMargin(cost: number, targetMargin: number): number {
  const m = clamp(targetMargin, 0, 0.99);
  return roundCents(cost / (1 - m));
}

/** Keystone (and multiples) pricing: price = cost × multiple. */
export function keystone(cost: number, multiple = 2): number {
  return roundCents(cost * multiple);
}

// ---------------------------------------------------------------------------
// Wholesale / dealer tiers
// ---------------------------------------------------------------------------

export interface WholesaleTier {
  name: string;
  /** Minimum units (bags) to qualify. */
  minUnits: number;
  /** Discount off MSRP as a fraction (0–1). */
  discount: number;
}

export const DEFAULT_TIERS: WholesaleTier[] = [
  { name: "Guide / Pro Staff", minUnits: 12, discount: 0.3 },
  { name: "Dealer", minUnits: 48, discount: 0.4 },
  { name: "Distributor", minUnits: 288, discount: 0.5 },
];

export interface TierPricing {
  name: string;
  minUnits: number;
  unitPrice: number;
  /** Contribution margin per unit at this tier, in $. */
  contributionPerUnit: number;
  /** Gross margin fraction at this tier. */
  marginPct: number;
}

/** Build a wholesale price sheet from an MSRP and per-bag cost. */
export function wholesalePriceSheet(
  msrp: number,
  costPerBag: number,
  tiers: WholesaleTier[] = DEFAULT_TIERS,
): TierPricing[] {
  return tiers.map((t) => {
    const unitPrice = roundCents(msrp * (1 - t.discount));
    return {
      name: t.name,
      minUnits: t.minUnits,
      unitPrice,
      contributionPerUnit: roundCents(unitPrice - costPerBag),
      marginPct: grossMargin(unitPrice, costPerBag),
    };
  });
}

// ---------------------------------------------------------------------------
// Break-even
// ---------------------------------------------------------------------------

/**
 * Units (bags) that must sell at `price` to cover `fixedCosts`, given a
 * variable cost per bag. Returns Infinity if the unit is unprofitable.
 */
export function breakEvenUnits(fixedCosts: number, price: number, variableCostPerUnit: number): number {
  const contribution = price - variableCostPerUnit;
  if (contribution <= 0) return Infinity;
  return Math.ceil(fixedCosts / contribution);
}

/** Shots a mold must run to fully amortize its cost at a given contribution/bait. */
export function moldPayoffShots(moldCost: number, contributionPerBait: number, cavities: number): number {
  const perShot = contributionPerBait * cavities;
  if (perShot <= 0) return Infinity;
  return Math.ceil(moldCost / perShot);
}

// ---------------------------------------------------------------------------
// One-call summary
// ---------------------------------------------------------------------------

export interface PricingSummary {
  cost: CostBreakdown;
  msrp: number;
  marginPct: number;
  markupPct: number;
  contributionPerBag: number;
  wholesale: TierPricing[];
}

/**
 * End-to-end: from raw manufacturing inputs and a target retail margin, produce
 * a full pricing summary (cost breakdown, MSRP, margins, wholesale sheet).
 */
export function priceProduct(
  input: CostInputs,
  opts: { targetMargin?: number; charmPricing?: boolean; tiers?: WholesaleTier[] } = {},
): PricingSummary {
  const targetMargin = opts.targetMargin ?? 0.65;
  const cost = computeCost(input);

  let msrp = priceForMargin(cost.costPerBag, targetMargin);
  if (opts.charmPricing) {
    msrp = charmPrice(msrp, cost.costPerBag);
  }

  return {
    cost,
    msrp,
    marginPct: grossMargin(msrp, cost.costPerBag),
    markupPct: markup(msrp, cost.costPerBag),
    contributionPerBag: roundCents(msrp - cost.costPerBag),
    wholesale: wholesalePriceSheet(msrp, cost.costPerBag, opts.tiers),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Round to 4 decimal places for sub-cent per-bait figures. */
function roundFrac(n: number): number {
  return Math.round(n * 10000) / 10000;
}
