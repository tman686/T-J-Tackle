import Link from "next/link";
import type { Lure } from "@/data/lures";
import { formatPrice } from "@/lib/format";

export function LureCard({ lure }: { lure: Lure }) {
  return (
    <Link
      href={`/soft-plastics/${lure.slug}`}
      className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
    >
      {/* Product image placeholder — swatch strip stands in for photography (Phase 6). */}
      <div className="relative h-40 bg-gradient-to-br from-navy to-navy-700 p-4">
        <div className="absolute right-3 top-3 flex gap-1">
          {lure.new && <span className="chip !border-copper !bg-copper !text-parchment">New</span>}
          {lure.limited && (
            <span className="chip !border-sea !bg-sea !text-parchment">Limited</span>
          )}
        </div>
        <div className="flex h-full flex-col justify-between">
          <span className="font-display text-xs uppercase tracking-[0.2em] text-copper-200">
            {lure.family} Series
          </span>
          <div className="flex items-end gap-1.5">
            {lure.colors.slice(0, 6).map((c) => (
              <span
                key={c.code}
                title={`${c.name} (${c.code})`}
                className="h-7 w-7 rounded-full border border-parchment/40"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg text-navy">{lure.name}</h3>
          <span className="font-display text-navy">{formatPrice(lure.priceCents)}</span>
        </div>
        <p className="mt-1 text-sm text-ink/70">{lure.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip">{lure.category}</span>
          <span className="chip">{lure.waterType}</span>
          <span className="chip">{lure.colors.length} colors</span>
        </div>
        <span className="mt-4 font-display text-sm font-semibold uppercase tracking-wide text-copper group-hover:underline">
          View lure →
        </span>
      </div>
    </Link>
  );
}
