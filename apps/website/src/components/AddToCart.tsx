"use client";

import { useState } from "react";
import type { Lure } from "@/data/lures";

/**
 * Phase 1 add-to-cart stub: no payment backend yet (Stripe is a Phase 2 task,
 * see ROADMAP.md). This captures the color/quantity selection UX so wiring a
 * real cart later is drop-in.
 */
export function AddToCart({ lure }: { lure: Lure }) {
  const [color, setColor] = useState(lure.colors[0]?.code ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-6 rounded-xl border border-navy/10 bg-parchment/60 p-4">
      <label className="block text-sm text-navy" htmlFor="color">
        Color
      </label>
      <select
        id="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="mt-1 w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
      >
        {lure.colors.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>

      <div className="mt-4 flex items-end gap-3">
        <div>
          <label className="block text-sm text-navy" htmlFor="qty">
            Qty
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-20 rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="btn-copper flex-1"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>

      {added && (
        <p className="mt-3 text-xs text-ink/60">
          Checkout is coming soon — Stripe payments land in Phase 2.
        </p>
      )}
    </div>
  );
}
