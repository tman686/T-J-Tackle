"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const nav = [
  { href: "/soft-plastics", label: "Soft Plastics" },
  { href: "/find-my-lure", label: "Find My Lure" },
  { href: "/prototype-lab", label: "Prototype Lab" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-parchment/85 backdrop-blur">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="T&amp;J&apos;s Tackle home">
          <Image
            src="/brand/tj-tackle-logo.png"
            alt="T&amp;J&apos;s Tackle"
            width={140}
            height={74}
            priority
            className="h-11 w-auto"
          />
          <span className="sr-only">T&amp;J&apos;s Tackle</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:text-copper"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/soft-plastics" className="btn-copper !px-4 !py-2">
            Shop
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-md border border-navy/20 p-2 text-navy"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-navy" />
          <span className="mt-1.5 block h-0.5 w-6 bg-navy" />
          <span className="mt-1.5 block h-0.5 w-6 bg-navy" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-navy/10 bg-parchment md:hidden">
          <div className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 font-display text-sm font-semibold uppercase tracking-wide text-navy"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/soft-plastics" className="btn-copper my-2" onClick={() => setOpen(false)}>
              Shop
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
