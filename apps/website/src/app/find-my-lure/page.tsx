import type { Metadata } from "next";
import { FindMyLure } from "@/components/FindMyLure";

export const metadata: Metadata = {
  title: "Find My Lure",
  description:
    "Answer a few questions about your water — species, clarity, season, and depth — and T&J's Tackle will recommend the right soft plastic.",
};

export default function FindMyLurePage() {
  return (
    <div className="container-page py-12">
      <p className="eyebrow">Lure selector</p>
      <h1 className="mt-2 text-4xl text-navy">Find My Lure</h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Tell us about your water and we&apos;ll match you to a bait — and the
        colors that fish best in your clarity. This is the first version of a
        recommendation engine that will learn from real catch data over time.
      </p>
      <FindMyLure />
    </div>
  );
}
