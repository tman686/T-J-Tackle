import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "T&J's Tackle is a builder-owned soft-plastic lure company for freshwater and saltwater. Original designs, molded and poured in-house since 2023.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Est. 2023</p>
          <h1 className="mt-2 text-4xl text-navy">Built by anglers, poured in-house.</h1>
          <p className="mt-4 text-ink/75">
            T&amp;J&apos;s Tackle started with a simple idea: don&apos;t re-sell someone
            else&apos;s baits — design and manufacture original soft plastics that
            catch fish in the water we actually fish. Freshwater and saltwater,
            from the bass pond to the flats.
          </p>
          <p className="mt-4 text-ink/75">
            We build like a manufacturing company first. Every lure has an
            original mold, a documented plastisol formula, and a color developed
            for real water clarity. That discipline is what lets us keep getting
            better, generation after generation.
          </p>
        </div>
        <div className="rounded-2xl bg-parchment/70 p-6 shadow-crest ring-1 ring-navy/10">
          <Image
            src="/brand/tj-tackle-logo.png"
            alt="T&amp;J&apos;s Tackle crest"
            width={720}
            height={380}
            className="h-auto w-full rounded-xl"
          />
        </div>
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Original", d: "Every shape, action, and color is ours. We never copy protected designs." },
          { t: "Quality", d: "Reinforced hook slots and durable formulas mean more fish per bag." },
          { t: "Improving", d: "Field notes and catch reports drive the next revision of every bait." },
        ].map((v) => (
          <div key={v.t} className="card p-6">
            <h3 className="text-lg text-navy">{v.t}</h3>
            <p className="mt-2 text-sm text-ink/70">{v.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
