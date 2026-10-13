import type { Metadata } from "next";
import Link from "next/link";
import { lures } from "@/data/lures";

export const metadata: Metadata = {
  title: "Prototype Lab",
  description:
    "Inside the T&J's Tackle Prototype Lab — how original soft-plastic lures go from sketch to CAD to mold to field test to production.",
};

const pipeline = [
  { n: "01", t: "Observation", d: "We watch how fish react to forage, cover, and conditions." },
  { n: "02", t: "Sketch & CAD", d: "Concepts are drawn, then modeled in CAD with real dimensions." },
  { n: "03", t: "Prototype mold", d: "An aluminum prototype mold is cut so we can pour real baits." },
  { n: "04", t: "Tank testing", d: "Fall rate, roll, and action are measured — not guessed." },
  { n: "05", t: "Field testing", d: "Pro staff and local anglers log catches and failure points." },
  { n: "06", t: "Revision", d: "We change one variable at a time and re-test." },
  { n: "07", t: "Pilot run", d: "A small production run validates manufacturability and QC." },
  { n: "08", t: "Launch", d: "The bait ships — and generation two starts on day one." },
];

export default function PrototypeLabPage() {
  const experimental = lures.filter((l) => l.limited || l.family === "Phantom");

  return (
    <div className="container-page py-12">
      <p className="eyebrow">Research &amp; development</p>
      <h1 className="mt-2 text-4xl text-navy">The Prototype Lab</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Our advantage isn&apos;t a single lure — it&apos;s the system that keeps
        producing better ones. Every bait carries a Shape-DNA code, a mold
        history, and a plastisol formula, so nothing we learn is ever lost.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl text-navy">The innovation pipeline</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((step) => (
            <div key={step.n} className="card p-5">
              <span className="font-display text-2xl text-copper">{step.n}</span>
              <h3 className="mt-1 text-lg text-navy">{step.t}</h3>
              <p className="mt-1 text-sm text-ink/70">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl text-navy">In the lab now</h2>
        <p className="mt-2 max-w-2xl text-ink/70">
          Experimental shapes and limited early runs. Get them before they go
          into full production.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experimental.map((l) => (
            <Link key={l.slug} href={`/soft-plastics/${l.slug}`} className="card p-5 hover:-translate-y-1 transition-transform">
              <p className="font-mono text-xs text-copper">{l.shapeDna}</p>
              <h3 className="mt-1 text-lg text-navy">{l.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{l.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
