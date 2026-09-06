/**
 * Sample soft-plastic catalog for T&J's Tackle.
 * Mirrors the Lure model in packages/database/prisma/schema.prisma so the site
 * runs with no database in Phase 1. Swap this module for a DB query in Phase 2.
 *
 * All designs, names, and colors are original to T&J's Tackle.
 */

export type WaterType = "Freshwater" | "Saltwater" | "Both";
export type Buoyancy = "Floating" | "Slow Sink" | "Neutral" | "Fast Sink";

export interface ColorOption {
  code: string; // internal, e.g. "GP-001"
  name: string; // marketing name
  hex: string;
  bestClarity: Array<"Clear" | "Stained" | "Muddy" | "Night">;
}

export interface Lure {
  slug: string;
  sku: string;
  shapeDna: string; // JT-<cat>-<family>-G<gen>-V<rev>
  name: string;
  family: string; // Forge / Drift / Current / Phantom / Leviathan / Apex
  category: string; // Craw, Worm, Swimbait, Creature, Stickbait, Shad
  tagline: string;
  description: string;
  lengthInches: number;
  countPerBag: number;
  priceCents: number;
  buoyancy: Buoyancy;
  waterType: WaterType;
  targetSpecies: string[];
  seasons: Array<"Spring" | "Summer" | "Fall" | "Winter">;
  clarity: Array<"Clear" | "Stained" | "Muddy">;
  depthRange: string;
  riggingMethods: string[];
  colors: ColorOption[];
  new?: boolean;
  limited?: boolean;
}

const NATURAL: ColorOption[] = [
  { code: "GP-001", name: "Marsh Standard", hex: "#5c5a34", bestClarity: ["Clear", "Stained"] },
  { code: "GP-003", name: "Marsh Goblin", hex: "#4a4326", bestClarity: ["Stained", "Muddy"] },
  { code: "WM-002", name: "Watermelon Red", hex: "#6b7a3a", bestClarity: ["Clear"] },
  { code: "SH-001", name: "Threadfin", hex: "#c9d3d6", bestClarity: ["Clear"] },
];

const REACTION: ColorOption[] = [
  { code: "CH-001", name: "Torch Chartreuse", hex: "#c6d43a", bestClarity: ["Stained", "Muddy"] },
  { code: "FT-001", name: "Fire Craw", hex: "#a83a1f", bestClarity: ["Stained", "Muddy"] },
  { code: "BL-004", name: "Midnight", hex: "#161a22", bestClarity: ["Muddy"] },
];

const SALT: ColorOption[] = [
  { code: "MU-001", name: "Mullet Silver", hex: "#b9c2c6", bestClarity: ["Clear"] },
  { code: "SR-002", name: "Shrimp Natural", hex: "#d8b48c", bestClarity: ["Clear", "Stained"] },
  { code: "CB-001", name: "Reef Chartreuse", hex: "#cad84a", bestClarity: ["Stained"] },
];

export const lures: Lure[] = [
  {
    slug: "apex-craw-35",
    sku: "JT-APEX-CRW-35",
    shapeDna: "JT-CRW-APEX-G2-V4",
    name: 'Apex Craw 3.5"',
    family: "Apex",
    category: "Craw",
    tagline: "A flat-clawed flipping craw with a hard defensive kick.",
    description:
      "The Apex Craw is our confidence flipping bait. Wide, ribbed claws displace water on the fall and stand up in a defensive posture at rest. Salted for a natural sink and heavily reinforced at the hook slot for repeat fish.",
    lengthInches: 3.5,
    countPerBag: 8,
    priceCents: 599,
    buoyancy: "Slow Sink",
    waterType: "Freshwater",
    targetSpecies: ["Largemouth Bass", "Smallmouth Bass"],
    seasons: ["Spring", "Summer", "Fall"],
    clarity: ["Clear", "Stained"],
    depthRange: "0–20 ft",
    riggingMethods: ["Texas Rig", "Flip / Pitch", "Carolina Rig", "Jig Trailer"],
    colors: [...NATURAL, ...REACTION],
    new: true,
  },
  {
    slug: "forge-worm-7",
    sku: "JT-FORGE-WRM-70",
    shapeDna: "JT-WRM-FORGE-G1-V2",
    name: 'Forge Worm 7"',
    family: "Forge",
    category: "Worm",
    tagline: "A ribbed power worm with a high-lift paddle-curl tail.",
    description:
      "Built for heavy cover and big fish. The thick body carries a heavy hook, and the high-lift tail thumps on the slowest drag. Extra-durable formula holds up to flipping into wood and rock.",
    lengthInches: 7,
    countPerBag: 7,
    priceCents: 649,
    buoyancy: "Slow Sink",
    waterType: "Freshwater",
    targetSpecies: ["Largemouth Bass"],
    seasons: ["Summer", "Fall"],
    clarity: ["Stained", "Muddy"],
    depthRange: "2–25 ft",
    riggingMethods: ["Texas Rig", "Flip / Pitch", "Shaky Head"],
    colors: [...NATURAL, ...REACTION],
  },
  {
    slug: "drift-minnow-4",
    sku: "JT-DRIFT-MIN-40",
    shapeDna: "JT-MIN-DRIFT-G1-V3",
    name: 'Drift Minnow 4"',
    family: "Drift",
    category: "Stickbait",
    tagline: "A finesse minnow with a dead-stick shimmy and slow glide.",
    description:
      "Our clear-water finesse bait. Weightless, it walks and glides with the lightest twitch, then quivers on the fall. Neutral density keeps it in the strike zone longer for pressured fish.",
    lengthInches: 4,
    countPerBag: 10,
    priceCents: 549,
    buoyancy: "Neutral",
    waterType: "Freshwater",
    targetSpecies: ["Largemouth Bass", "Smallmouth Bass", "Crappie"],
    seasons: ["Spring", "Summer"],
    clarity: ["Clear"],
    depthRange: "0–10 ft",
    riggingMethods: ["Weightless", "Wacky Rig", "Ned Rig", "Drop Shot"],
    colors: [...NATURAL],
  },
  {
    slug: "current-swimbait-45",
    sku: "JT-CURR-SWB-45",
    shapeDna: "JT-SWB-CURRENT-G2-V1",
    name: 'Current Swimbait 4.5"',
    family: "Current",
    category: "Swimbait",
    tagline: "A paddle-tail swimbait tuned for a hard low-speed thump.",
    description:
      "A boot-tail swimmer that rolls and thumps from a dead-slow retrieve to a burn. Balanced belly slot rigs weedless and true. A reaction bait for open water and schooling fish.",
    lengthInches: 4.5,
    countPerBag: 6,
    priceCents: 699,
    buoyancy: "Fast Sink",
    waterType: "Both",
    targetSpecies: ["Largemouth Bass", "Striped Bass", "Redfish"],
    seasons: ["Spring", "Summer", "Fall", "Winter"],
    clarity: ["Clear", "Stained"],
    depthRange: "1–30 ft",
    riggingMethods: ["Jig Head", "Weighted Swimbait Hook", "Underspin"],
    colors: [...NATURAL, ...SALT],
    new: true,
  },
  {
    slug: "phantom-creature-4",
    sku: "JT-PHAN-CRE-40",
    shapeDna: "JT-CRE-PHANTOM-G1-V1",
    name: 'Phantom Creature 4"',
    family: "Phantom",
    category: "Creature",
    tagline: "An experimental creature bait with independent flapping appendages.",
    description:
      "The Phantom is our prototype-lab creature bait: twin flappers, ribbed body, and floating claws that never stop moving. A bulky flipping profile for the biggest bites. Limited early runs.",
    lengthInches: 4,
    countPerBag: 7,
    priceCents: 679,
    buoyancy: "Slow Sink",
    waterType: "Freshwater",
    targetSpecies: ["Largemouth Bass"],
    seasons: ["Spring", "Summer"],
    clarity: ["Stained", "Muddy"],
    depthRange: "0–15 ft",
    riggingMethods: ["Texas Rig", "Flip / Pitch", "Punch Rig"],
    colors: [...NATURAL, ...REACTION],
    limited: true,
  },
  {
    slug: "leviathan-jerkshad-6",
    sku: "JT-LEVI-JSH-60",
    shapeDna: "JT-SHD-LEVIATHAN-G1-V2",
    name: 'Leviathan Jerk Shad 6"',
    family: "Leviathan",
    category: "Shad",
    tagline: "A big-profile saltwater jerk shad with a wide erratic dart.",
    description:
      "Our saltwater flagship. A large jerk-shad profile that darts hard and slides on slack line. Tough, salt-heavy formula stands up to toothy inshore predators.",
    lengthInches: 6,
    countPerBag: 5,
    priceCents: 749,
    buoyancy: "Slow Sink",
    waterType: "Saltwater",
    targetSpecies: ["Redfish", "Speckled Trout", "Snook", "Tarpon"],
    seasons: ["Spring", "Summer", "Fall"],
    clarity: ["Clear", "Stained"],
    depthRange: "0–12 ft",
    riggingMethods: ["Weighted Swimbait Hook", "Jig Head", "Weedless"],
    colors: [...SALT, ...NATURAL],
  },
];

export function getLure(slug: string): Lure | undefined {
  return lures.find((l) => l.slug === slug);
}

export const families = [
  { code: "Forge", name: "Forge Series", note: "Power fishing · heavy cover · big fish" },
  { code: "Drift", name: "Drift Series", note: "Finesse · natural presentation · clear water" },
  { code: "Current", name: "Current Series", note: "Swimbaits · open water · reaction" },
  { code: "Phantom", name: "Phantom Series", note: "Creature baits · experimental actions" },
  { code: "Apex", name: "Apex Series", note: "All-around confidence baits" },
  { code: "Leviathan", name: "Leviathan Series", note: "Big profile · saltwater · predators" },
];
