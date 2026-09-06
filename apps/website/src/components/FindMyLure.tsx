"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { lures, type Lure } from "@/data/lures";
import { formatPrice } from "@/lib/format";

type Water = "Freshwater" | "Saltwater";
type Clarity = "Clear" | "Stained" | "Muddy";
type Season = "Spring" | "Summer" | "Fall" | "Winter";

const SPECIES: Record<Water, string[]> = {
  Freshwater: ["Largemouth Bass", "Smallmouth Bass", "Crappie"],
  Saltwater: ["Redfish", "Speckled Trout", "Snook", "Tarpon", "Striped Bass"],
};

interface Scored {
  lure: Lure;
  score: number;
  colorPicks: { code: string; name: string; hex: string }[];
  reasons: string[];
}

function scoreLure(
  lure: Lure,
  water: Water,
  species: string,
  clarity: Clarity,
  season: Season,
): Scored {
  let score = 0;
  const reasons: string[] = [];

  if (lure.waterType === water || lure.waterType === "Both") {
    score += 3;
  } else {
    score -= 5;
  }

  if (lure.targetSpecies.includes(species)) {
    score += 4;
    reasons.push(`Proven on ${species}`);
  }
  if (lure.clarity.includes(clarity)) {
    score += 2;
    reasons.push(`Dialed for ${clarity.toLowerCase()} water`);
  }
  if (lure.seasons.includes(season)) {
    score += 2;
    reasons.push(`In season now (${season})`);
  }

  // Pick colors that fish best in the chosen clarity.
  const colorPicks = lure.colors
    .filter((c) => c.bestClarity.includes(clarity) || c.bestClarity.includes("Night"))
    .slice(0, 4)
    .map((c) => ({ code: c.code, name: c.name, hex: c.hex }));
  if (colorPicks.length === 0) {
    colorPicks.push(...lure.colors.slice(0, 3).map((c) => ({ code: c.code, name: c.name, hex: c.hex })));
  }

  return { lure, score, colorPicks, reasons };
}

export function FindMyLure() {
  const [water, setWater] = useState<Water>("Freshwater");
  const [species, setSpecies] = useState<string>(SPECIES.Freshwater[0]);
  const [clarity, setClarity] = useState<Clarity>("Clear");
  const [season, setSeason] = useState<Season>("Summer");
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    return lures
      .map((l) => scoreLure(l, water, species, clarity, season))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [water, species, clarity, season]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Form */}
      <div className="card h-fit p-6">
        <Field label="Water">
          <div className="grid grid-cols-2 gap-2">
            {(["Freshwater", "Saltwater"] as Water[]).map((w) => (
              <Choice
                key={w}
                active={water === w}
                onClick={() => {
                  setWater(w);
                  setSpecies(SPECIES[w][0]);
                }}
              >
                {w}
              </Choice>
            ))}
          </div>
        </Field>

        <Field label="Target species">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
          >
            {SPECIES[water].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Water clarity">
          <div className="grid grid-cols-3 gap-2">
            {(["Clear", "Stained", "Muddy"] as Clarity[]).map((c) => (
              <Choice key={c} active={clarity === c} onClick={() => setClarity(c)}>
                {c}
              </Choice>
            ))}
          </div>
        </Field>

        <Field label="Season">
          <div className="grid grid-cols-2 gap-2">
            {(["Spring", "Summer", "Fall", "Winter"] as Season[]).map((s) => (
              <Choice key={s} active={season === s} onClick={() => setSeason(s)}>
                {s}
              </Choice>
            ))}
          </div>
        </Field>

        <button type="button" onClick={() => setSubmitted(true)} className="btn-copper mt-2 w-full">
          Find my lure
        </button>
      </div>

      {/* Results */}
      <div>
        {!submitted ? (
          <div className="card flex h-full min-h-[300px] items-center justify-center p-8 text-center text-ink/60">
            Set your conditions and hit “Find my lure” for tailored picks.
          </div>
        ) : results.length === 0 ? (
          <div className="card p-8 text-center text-ink/60">
            No strong match yet — try a different species or clarity.
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink/60">Top picks for your water:</p>
            {results.map((r, i) => (
              <div key={r.lure.slug} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="chip !border-copper !bg-copper !text-parchment">
                          Best match
                        </span>
                      )}
                      <h3 className="text-xl text-navy">{r.lure.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">{r.lure.tagline}</p>
                  </div>
                  <span className="font-display text-navy">{formatPrice(r.lure.priceCents)}</span>
                </div>

                {r.reasons.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {r.reasons.map((reason) => (
                      <li key={reason} className="chip !border-sea/40 !text-sea">
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-ink/50">
                    Recommended colors for {clarity.toLowerCase()} water
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.colorPicks.map((c) => (
                      <span key={c.code} className="flex items-center gap-1.5 text-xs">
                        <span
                          className="h-5 w-5 rounded-full border border-navy/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/soft-plastics/${r.lure.slug}`}
                  className="mt-4 inline-block font-display text-sm font-semibold uppercase tracking-wide text-copper hover:underline"
                >
                  View {r.lure.name} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-sm text-navy">{label}</h3>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-navy text-parchment" : "border border-navy/20 text-navy hover:bg-navy/10"
      }`}
    >
      {children}
    </button>
  );
}
