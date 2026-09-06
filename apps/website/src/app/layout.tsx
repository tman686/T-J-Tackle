import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jttackle.com"),
  title: {
    default: "T&J's Tackle — Original Soft-Plastic Fishing Lures",
    template: "%s · T&J's Tackle",
  },
  description:
    "T&J's Tackle designs and manufactures original soft-plastic fishing lures for freshwater and saltwater. Built by anglers, engineered for the bite. Est. 2023.",
  keywords: [
    "soft plastic lures",
    "fishing lures",
    "bass lures",
    "saltwater lures",
    "T&J's Tackle",
    "custom color plastics",
  ],
  openGraph: {
    title: "T&J's Tackle — Original Soft-Plastic Fishing Lures",
    description:
      "Original soft-plastic lures for freshwater & saltwater. Manufactured, not resold. Est. 2023.",
    type: "website",
    images: ["/brand/tj-tackle-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "T&J's Tackle",
    url: "https://jttackle.com",
    logo: "https://jttackle.com/brand/tj-tackle-logo.png",
    description:
      "Original soft-plastic fishing lures for freshwater and saltwater. Designed, molded, and poured in-house. Est. 2023.",
    foundingDate: "2023",
    slogan: "Original soft plastics, engineered for the bite.",
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "T&J's Tackle",
    url: "https://jttackle.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jttackle.com/soft-plastics?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, siteJsonLd]) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
