"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { lures, type Lure } from "@/data/lures";
import { LureCard } from "@/components/LureCard";

const WATER = ["Freshwater", "Saltwater", "Both"] as const;

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

export function SoftPlasticsBrowser() {
  const params = useSearchParams();
  const initialFamily = params.get("family") ?? "All";
  const initialWater = params.get("water") ?? "All";

  const [family, setFamily] = useState(initialFamily);
  const [water, setWater] = useState(initialWater);
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...unique(lures.map((l) => l.category))], []);
  const familyList = useMemo(() => ["All", ...unique(lures.map((l) => l.family))], []);

  const results: Lure[] = useMemo(() => {
    return lures.filter((l) => {
      if (family !== "All" && l.family !== family) return false;
      if (category !== "All" && l.category !== category) return false;
      if (water !== "All" && l.waterType !== water && l.waterType !== "Both") return false;
      return true;
    });
  }, [family, category, water]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Filters */}
      <aside className="space-y-6">
        <FilterGroup label="Water" value={water} options={["All", ...WATER]} onChange={setWater} />
        <FilterGroup label="Family" value={family} options={familyList} onChange={setFamily} />
        <FilterGroup
          label="Category"
          value={category}
          options={categories}
          onChange={setCategory}
        />
      </aside>

      {/* Results */}
      <div>
        <p className="mb-4 text-sm text-ink/60">
          {results.length} {results.length === 1 ? "lure" : "lures"}
        </p>
        {results.length === 0 ? (
          <div className="card p-8 text-center text-ink/60">
            No lures match those filters yet — try widening your search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((lure) => (
              <LureCard key={lure.slug} lure={lure} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm text-navy">{label}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5 lg:flex-col lg:items-start">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
              value === opt
                ? "bg-navy text-parchment"
                : "text-navy hover:bg-navy/10"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
