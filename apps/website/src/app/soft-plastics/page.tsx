import type { Metadata } from "next";
import { Suspense } from "react";
import { SoftPlasticsBrowser } from "@/components/SoftPlasticsBrowser";

export const metadata: Metadata = {
  title: "Soft Plastics",
  description:
    "Browse T&J's Tackle original soft-plastic lures — craws, worms, swimbaits, creatures, and saltwater baits. Filter by water, category, and species.",
};

export default function SoftPlasticsPage() {
  return (
    <div className="container-page py-12">
      <p className="eyebrow">The catalog</p>
      <h1 className="mt-2 text-4xl text-navy">Soft Plastics</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Every bait is an original design — molded and poured in-house. Filter by
        water type, category, or target species to find your next confidence bait.
      </p>

      <Suspense fallback={<p className="mt-8 text-ink/60">Loading catalog…</p>}>
        <SoftPlasticsBrowser />
      </Suspense>
    </div>
  );
}
