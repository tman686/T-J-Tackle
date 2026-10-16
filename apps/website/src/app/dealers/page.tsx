import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealer Program",
  description:
    "Stock T&J's Tackle original soft plastics in your shop. Wholesale pricing, marketing assets, and restock support for tackle shops and guides.",
};

const perks = [
  { t: "Wholesale pricing", d: "Tiered margins that work for independent shops and guides." },
  { t: "Original product", d: "Baits your customers can't buy anywhere else — no price-matching races." },
  { t: "Marketing assets", d: "Product photography, display suggestions, and social-ready content." },
  { t: "Restock support", d: "Reorder recommendations so your best sellers are never empty." },
];

export default function DealersPage() {
  return (
    <div className="container-page py-12">
      <p className="eyebrow">For retailers &amp; guides</p>
      <h1 className="mt-2 text-4xl text-navy">Dealer Program</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Carry a soft-plastics line that stands out on the peg. T&amp;J&apos;s Tackle
        products are original designs, poured in-house, with the quality and
        story your customers want.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {perks.map((p) => (
          <div key={p.t} className="card p-6">
            <h3 className="text-lg text-navy">{p.t}</h3>
            <p className="mt-2 text-sm text-ink/70">{p.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-navy p-8 text-parchment">
        <h2 className="text-2xl text-parchment">Apply to become a dealer</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Tell us about your shop and where you fish. We&apos;ll send wholesale
          pricing and a starter catalog. A full dealer portal — with live
          inventory sync and reorder tools — is on the way.
        </p>
        <Link href="/contact" className="btn-copper mt-6">
          Request wholesale info
        </Link>
      </div>
    </div>
  );
}
