import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/soft-plastics", label: "All Soft Plastics" },
      { href: "/soft-plastics?water=Freshwater", label: "Freshwater" },
      { href: "/soft-plastics?water=Saltwater", label: "Saltwater" },
      { href: "/find-my-lure", label: "Find My Lure" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/prototype-lab", label: "Prototype Lab" },
      { href: "/dealers", label: "Dealer Program" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help & Warranty" },
      { href: "/find-my-lure", label: "Rigging Guide" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-parchment-200 bg-navy text-parchment">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Image
            src="/brand/tj-tackle-logo.png"
            alt="T&amp;J&apos;s Tackle"
            width={200}
            height={106}
            className="h-20 w-auto rounded-lg bg-parchment/95 p-1"
          />
          <p className="mt-4 max-w-xs text-sm text-parchment/80">
            Original soft-plastic lures for freshwater &amp; saltwater. Designed,
            molded, and poured in-house. Est. 2023.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm text-copper-200">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-parchment/80 transition-colors hover:text-copper-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-parchment/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-parchment/60 sm:flex-row">
          <p>© {new Date().getFullYear()} T&amp;J&apos;s Tackle. All rights reserved.</p>
          <p>For Freshwater &amp; Saltwater · Quality Fishing Gear &amp; Equipment</p>
        </div>
      </div>
    </footer>
  );
}
