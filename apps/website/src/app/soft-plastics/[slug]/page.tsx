import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLure, lures } from "@/data/lures";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";

export function generateStaticParams() {
  return lures.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lure = getLure(params.slug);
  if (!lure) return { title: "Lure not found" };
  return {
    title: lure.name,
    description: lure.tagline,
    openGraph: { title: `${lure.name} · T&J's Tackle`, description: lure.tagline },
  };
}

const spec = (label: string, value: string) => ({ label, value });

export default function LurePage({ params }: { params: { slug: string } }) {
  const lure = getLure(params.slug);
  if (!lure) notFound();

  const specs = [
    spec("Shape-DNA", lure.shapeDna),
    spec("SKU", lure.sku),
    spec("Length", `${lure.lengthInches}"`),
    spec("Per bag", `${lure.countPerBag}`),
    spec("Buoyancy", lure.buoyancy),
    spec("Water", lure.waterType),
    spec("Depth", lure.depthRange),
    spec("Family", `${lure.family} Series`),
  ];

  // Schema.org structured data for SEO.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: lure.name,
    sku: lure.sku,
    description: lure.description,
    brand: { "@type": "Brand", name: "T&J's Tackle" },
    offers: {
      "@type": "Offer",
      price: (lure.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/soft-plastics" className="hover:text-copper">
          Soft Plastics
        </Link>{" "}
        / <span className="text-navy">{lure.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div>
          <div className="flex h-80 flex-col justify-between rounded-2xl bg-gradient-to-br from-navy to-navy-700 p-8 text-parchment shadow-crest">
            <div className="flex gap-2">
              {lure.new && <span className="chip !border-copper !bg-copper !text-parchment">New</span>}
              {lure.limited && (
                <span className="chip !border-sea !bg-sea !text-parchment">Limited Drop</span>
              )}
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-copper-200">
                {lure.family} Series · {lure.category}
              </p>
              <p className="mt-2 font-display text-4xl uppercase tracking-tight">{lure.name}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-navy/10 p-4">
            <h3 className="text-sm text-navy">
              Colors <span className="text-ink/50">({lure.colors.length})</span>
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {lure.colors.map((c) => (
                <div key={c.code} className="flex items-center gap-2">
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-navy/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs">
                    <span className="block font-medium text-navy">{c.name}</span>
                    <span className="text-ink/50">{c.code}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow">{lure.family} Series</p>
          <h1 className="mt-2 text-4xl text-navy">{lure.name}</h1>
          <p className="mt-2 text-lg text-ink/75">{lure.tagline}</p>
          <p className="mt-5 font-display text-3xl text-navy">{formatPrice(lure.priceCents)}</p>

          <AddToCart lure={lure} />

          <p className="mt-6 text-ink/80">{lure.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map((s) => (
              <div key={s.label} className="rounded-lg border border-navy/10 bg-parchment/60 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-ink/50">{s.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-navy">{s.value}</dd>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <DetailList title="Target species" items={lure.targetSpecies} />
            <DetailList title="Rigging" items={lure.riggingMethods} />
            <DetailList title="Best seasons" items={lure.seasons} />
            <DetailList title="Water clarity" items={lure.clarity} />
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm text-navy">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="chip">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
