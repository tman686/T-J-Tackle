import Link from "next/link";
import Image from "next/image";
import { lures, families } from "@/data/lures";
import { LureCard } from "@/components/LureCard";

export default function HomePage() {
  const featured = lures.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy/10">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Est. 2023 · Freshwater &amp; Saltwater</p>
            <h1 className="mt-4 text-5xl leading-[0.95] text-navy sm:text-6xl">
              Original soft plastics,{" "}
              <span className="text-copper">engineered for the bite.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/75">
              T&amp;J&apos;s Tackle designs, molds, and pours original soft-plastic
              lures in-house. No re-sold baits — every shape, action, and color
              is ours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/soft-plastics" className="btn-copper">
                Shop Soft Plastics
              </Link>
              <Link href="/find-my-lure" className="btn-outline">
                Find My Lure
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink/70">
              <span>✓ Poured in the USA</span>
              <span>✓ Original molds &amp; formulas</span>
              <span>✓ Field-tested</span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md rounded-2xl bg-parchment/70 p-6 shadow-crest ring-1 ring-navy/10">
              <Image
                src="/brand/tj-tackle-logo.png"
                alt="T&amp;J&apos;s Tackle crest"
                width={720}
                height={380}
                priority
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-page grid gap-5 py-14 sm:grid-cols-3">
        {[
          {
            t: "Manufacturing first",
            d: "Every lure is engineered from an original mold and plastisol formula — durability, salt, and action are dialed in, not guessed.",
          },
          {
            t: "Built for conditions",
            d: "Baits are tuned to species, water clarity, season, and depth. Use Find My Lure to match your water.",
          },
          {
            t: "Always improving",
            d: "Field notes and catch reports feed the next generation. Our lures get better every revision.",
          },
        ].map((f) => (
          <div key={f.t} className="card p-6">
            <h3 className="text-lg text-navy">{f.t}</h3>
            <p className="mt-2 text-sm text-ink/70">{f.d}</p>
          </div>
        ))}
      </section>

      {/* Featured lures */}
      <section className="container-page py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">The lineup</p>
            <h2 className="mt-2 text-3xl text-navy">New &amp; featured</h2>
          </div>
          <Link href="/soft-plastics" className="hidden font-display text-sm font-semibold uppercase tracking-wide text-copper hover:underline sm:block">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((lure) => (
            <LureCard key={lure.slug} lure={lure} />
          ))}
        </div>
      </section>

      {/* Families */}
      <section className="container-page py-14">
        <p className="eyebrow">Product families</p>
        <h2 className="mt-2 text-3xl text-navy">Series built for a job</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((fam) => (
            <Link
              key={fam.code}
              href={`/soft-plastics?family=${fam.code}`}
              className="group flex items-center justify-between rounded-lg border border-navy/10 bg-parchment/60 p-5 transition-colors hover:border-copper"
            >
              <div>
                <h3 className="text-xl text-navy">{fam.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{fam.note}</p>
              </div>
              <span className="font-display text-copper opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Dealer CTA */}
      <section className="container-page pb-10">
        <div className="overflow-hidden rounded-2xl bg-navy px-8 py-12 text-parchment">
          <div className="max-w-2xl">
            <p className="eyebrow !text-copper-200">Dealer program</p>
            <h2 className="mt-2 text-3xl text-parchment">
              Stock T&amp;J&apos;s Tackle in your shop
            </h2>
            <p className="mt-3 text-parchment/80">
              Wholesale pricing, marketing assets, and restock support for tackle
              shops and guides. Original products your customers can&apos;t buy
              anywhere else.
            </p>
            <Link href="/dealers" className="btn-copper mt-6">
              Become a dealer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
