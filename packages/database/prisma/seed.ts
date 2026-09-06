/**
 * Seed the T&J's Tackle database with the launch catalog.
 *
 * Mirrors apps/website/src/data/lures.ts so a freshly migrated Supabase database
 * matches the live storefront. Idempotent — safe to run repeatedly (upserts on
 * unique keys). Requires DATABASE_URL (see docs/DEPLOYMENT.md).
 *
 *   npm run migrate:deploy --workspace @jt/database
 *   npm run seed           --workspace @jt/database
 */
import { PrismaClient, BuoyancyClass, WaterType } from "@prisma/client";

const prisma = new PrismaClient();

const FAMILIES = [
  { code: "FORGE", name: "Forge Series", positioning: "Power fishing, heavy cover, big fish." },
  { code: "DRIFT", name: "Drift Series", positioning: "Finesse, natural presentation, clear water." },
  { code: "CURRENT", name: "Current Series", positioning: "Swimbaits, open water, reaction." },
  { code: "PHANTOM", name: "Phantom Series", positioning: "Creature baits, experimental actions." },
  { code: "APEX", name: "Apex Series", positioning: "All-around confidence baits." },
  { code: "LEVIATHAN", name: "Leviathan Series", positioning: "Big profile, saltwater, predators." },
];

const COLORS = [
  { code: "GP-001", marketingName: "Marsh Standard", family: "Green Pumpkin", hex: "#5c5a34", clearWaterRating: 9, stainedWaterRating: 8, muddyWaterRating: 5, nightRating: 4 },
  { code: "GP-003", marketingName: "Marsh Goblin", family: "Green Pumpkin", hex: "#4a4326", clearWaterRating: 6, stainedWaterRating: 9, muddyWaterRating: 7, nightRating: 5 },
  { code: "WM-002", marketingName: "Watermelon Red", family: "Watermelon", hex: "#6b7a3a", clearWaterRating: 9, stainedWaterRating: 6, muddyWaterRating: 3, nightRating: 2 },
  { code: "SH-001", marketingName: "Threadfin", family: "Shad", hex: "#c9d3d6", clearWaterRating: 9, stainedWaterRating: 5, muddyWaterRating: 2, nightRating: 2 },
  { code: "CH-001", marketingName: "Torch Chartreuse", family: "Chartreuse", hex: "#c6d43a", clearWaterRating: 5, stainedWaterRating: 9, muddyWaterRating: 8, nightRating: 4 },
  { code: "FT-001", marketingName: "Fire Craw", family: "Fire Tiger", hex: "#a83a1f", clearWaterRating: 5, stainedWaterRating: 8, muddyWaterRating: 8, nightRating: 4 },
  { code: "BL-004", marketingName: "Midnight", family: "Black", hex: "#161a22", clearWaterRating: 4, stainedWaterRating: 6, muddyWaterRating: 8, nightRating: 9 },
  { code: "MU-001", marketingName: "Mullet Silver", family: "Mullet", hex: "#b9c2c6", clearWaterRating: 9, stainedWaterRating: 5, muddyWaterRating: 2, nightRating: 2 },
  { code: "SR-002", marketingName: "Shrimp Natural", family: "Shrimp", hex: "#d8b48c", clearWaterRating: 8, stainedWaterRating: 7, muddyWaterRating: 4, nightRating: 3 },
  { code: "CB-001", marketingName: "Reef Chartreuse", family: "Chartreuse", hex: "#cad84a", clearWaterRating: 6, stainedWaterRating: 9, muddyWaterRating: 7, nightRating: 4 },
];

const FORMULAS = [
  { code: "D-S-2", name: "Durable + Salted, gen 2", hardness: 45, saltPercent: 6.5, density: 1.05, stretchRating: 7, floatingRating: 2, shelfLifeDays: 720, costPerBait: 0.18 },
  { code: "F-E-1", name: "Floating + Extra-soft, gen 1", hardness: 30, saltPercent: 0, density: 0.95, stretchRating: 9, floatingRating: 9, shelfLifeDays: 540, costPerBait: 0.16 },
  { code: "D-S-3", name: "Durable + Salted, saltwater gen 3", hardness: 50, saltPercent: 8, density: 1.08, stretchRating: 6, floatingRating: 2, shelfLifeDays: 720, costPerBait: 0.22 },
];

interface LureSeed {
  sku: string;
  shapeDna: string;
  name: string;
  family: string;
  category: string;
  generation: number;
  revision: number;
  formula: string;
  lengthInches: number;
  buoyancy: BuoyancyClass;
  waterType: WaterType;
  targetSpecies: string[];
  waterClarity: string[];
  seasons: string[];
  depthRange: string;
  riggingMethods: string[];
  colorCodes: string[];
  priceCents: number;
  countPerBag: number;
}

const LURES: LureSeed[] = [
  {
    sku: "JT-APEX-CRW-35", shapeDna: "JT-CRW-APEX-G2-V4", name: 'Apex Craw 3.5"', family: "APEX", category: "Craw",
    generation: 2, revision: 4, formula: "D-S-2", lengthInches: 3.5, buoyancy: BuoyancyClass.SLOW_SINK, waterType: WaterType.FRESHWATER,
    targetSpecies: ["Largemouth Bass", "Smallmouth Bass"], waterClarity: ["Clear", "Stained"], seasons: ["Spring", "Summer", "Fall"],
    depthRange: "0-20 ft", riggingMethods: ["Texas Rig", "Flip/Pitch", "Carolina Rig", "Jig Trailer"],
    colorCodes: ["GP-001", "GP-003", "WM-002", "SH-001", "CH-001", "FT-001", "BL-004"], priceCents: 599, countPerBag: 8,
  },
  {
    sku: "JT-FORGE-WRM-70", shapeDna: "JT-WRM-FORGE-G1-V2", name: 'Forge Worm 7"', family: "FORGE", category: "Worm",
    generation: 1, revision: 2, formula: "D-S-2", lengthInches: 7, buoyancy: BuoyancyClass.SLOW_SINK, waterType: WaterType.FRESHWATER,
    targetSpecies: ["Largemouth Bass"], waterClarity: ["Stained", "Muddy"], seasons: ["Summer", "Fall"],
    depthRange: "2-25 ft", riggingMethods: ["Texas Rig", "Flip/Pitch", "Shaky Head"],
    colorCodes: ["GP-001", "GP-003", "WM-002", "SH-001", "CH-001", "FT-001", "BL-004"], priceCents: 649, countPerBag: 7,
  },
  {
    sku: "JT-DRIFT-MIN-40", shapeDna: "JT-MIN-DRIFT-G1-V3", name: 'Drift Minnow 4"', family: "DRIFT", category: "Stickbait",
    generation: 1, revision: 3, formula: "F-E-1", lengthInches: 4, buoyancy: BuoyancyClass.NEUTRAL, waterType: WaterType.FRESHWATER,
    targetSpecies: ["Largemouth Bass", "Smallmouth Bass", "Crappie"], waterClarity: ["Clear"], seasons: ["Spring", "Summer"],
    depthRange: "0-10 ft", riggingMethods: ["Weightless", "Wacky Rig", "Ned Rig", "Drop Shot"],
    colorCodes: ["GP-001", "GP-003", "WM-002", "SH-001"], priceCents: 549, countPerBag: 10,
  },
  {
    sku: "JT-CURR-SWB-45", shapeDna: "JT-SWB-CURRENT-G2-V1", name: 'Current Swimbait 4.5"', family: "CURRENT", category: "Swimbait",
    generation: 2, revision: 1, formula: "D-S-2", lengthInches: 4.5, buoyancy: BuoyancyClass.FAST_SINK, waterType: WaterType.BOTH,
    targetSpecies: ["Largemouth Bass", "Striped Bass", "Redfish"], waterClarity: ["Clear", "Stained"], seasons: ["Spring", "Summer", "Fall", "Winter"],
    depthRange: "1-30 ft", riggingMethods: ["Jig Head", "Weighted Swimbait Hook", "Underspin"],
    colorCodes: ["GP-001", "GP-003", "WM-002", "SH-001", "MU-001", "SR-002", "CB-001"], priceCents: 699, countPerBag: 6,
  },
  {
    sku: "JT-PHAN-CRE-40", shapeDna: "JT-CRE-PHANTOM-G1-V1", name: 'Phantom Creature 4"', family: "PHANTOM", category: "Creature",
    generation: 1, revision: 1, formula: "D-S-2", lengthInches: 4, buoyancy: BuoyancyClass.SLOW_SINK, waterType: WaterType.FRESHWATER,
    targetSpecies: ["Largemouth Bass"], waterClarity: ["Stained", "Muddy"], seasons: ["Spring", "Summer"],
    depthRange: "0-15 ft", riggingMethods: ["Texas Rig", "Flip/Pitch", "Punch Rig"],
    colorCodes: ["GP-001", "GP-003", "WM-002", "SH-001", "CH-001", "FT-001", "BL-004"], priceCents: 679, countPerBag: 7,
  },
  {
    sku: "JT-LEVI-JSH-60", shapeDna: "JT-SHD-LEVIATHAN-G1-V2", name: 'Leviathan Jerk Shad 6"', family: "LEVIATHAN", category: "Shad",
    generation: 1, revision: 2, formula: "D-S-3", lengthInches: 6, buoyancy: BuoyancyClass.SLOW_SINK, waterType: WaterType.SALTWATER,
    targetSpecies: ["Redfish", "Speckled Trout", "Snook", "Tarpon"], waterClarity: ["Clear", "Stained"], seasons: ["Spring", "Summer", "Fall"],
    depthRange: "0-12 ft", riggingMethods: ["Weighted Swimbait Hook", "Jig Head", "Weedless"],
    colorCodes: ["MU-001", "SR-002", "CB-001", "GP-001", "SH-001"], priceCents: 749, countPerBag: 5,
  },
];

async function main() {
  for (const f of FAMILIES) {
    await prisma.productFamily.upsert({ where: { code: f.code }, update: f, create: f });
  }
  for (const c of COLORS) {
    await prisma.color.upsert({ where: { code: c.code }, update: c, create: c });
  }
  for (const fm of FORMULAS) {
    await prisma.plastisolFormula.upsert({ where: { code: fm.code }, update: fm, create: fm });
  }

  for (const l of LURES) {
    const family = await prisma.productFamily.findUniqueOrThrow({ where: { code: l.family } });
    const formula = await prisma.plastisolFormula.findUniqueOrThrow({ where: { code: l.formula } });

    // One mold per lure design.
    const moldId = `JT-MOLD-${l.sku}`;
    const mold = await prisma.mold.upsert({
      where: { moldId },
      update: {},
      create: {
        moldId,
        name: `${l.name} mold`,
        material: "6061 Aluminum",
        aluminumGrade: "6061-T6",
        cavities: l.countPerBag >= 8 ? 12 : 8,
        expectedLife: 40000,
      },
    });

    const lure = await prisma.lure.upsert({
      where: { shapeDna: l.shapeDna },
      update: {},
      create: {
        sku: l.sku,
        shapeDna: l.shapeDna,
        name: l.name,
        category: l.category,
        generation: l.generation,
        revision: l.revision,
        familyId: family.id,
        formulaId: formula.id,
        moldId: mold.id,
        lengthInches: l.lengthInches,
        buoyancy: l.buoyancy,
        waterType: l.waterType,
        targetSpecies: l.targetSpecies,
        waterClarity: l.waterClarity,
        seasons: l.seasons,
        depthRange: l.depthRange,
        riggingMethods: l.riggingMethods,
      },
    });

    // One sellable variant per color.
    for (const code of l.colorCodes) {
      const color = await prisma.color.findUniqueOrThrow({ where: { code } });
      const variantSku = `${l.sku}-${code}`;
      await prisma.productVariant.upsert({
        where: { sku: variantSku },
        update: { priceCents: l.priceCents, countPerBag: l.countPerBag },
        create: {
          sku: variantSku,
          lureId: lure.id,
          colorId: color.id,
          countPerBag: l.countPerBag,
          priceCents: l.priceCents,
        },
      });
    }
  }

  const [families, colors, lures, variants] = await Promise.all([
    prisma.productFamily.count(),
    prisma.color.count(),
    prisma.lure.count(),
    prisma.productVariant.count(),
  ]);
  // eslint-disable-next-line no-console
  console.log(`Seeded: ${families} families, ${colors} colors, ${lures} lures, ${variants} variants.`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
