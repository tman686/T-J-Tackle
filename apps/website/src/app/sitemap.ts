import type { MetadataRoute } from "next";
import { lures } from "@/data/lures";

const BASE = "https://jttackle.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/soft-plastics",
    "/find-my-lure",
    "/prototype-lab",
    "/dealers",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const lureRoutes = lures.map((l) => ({
    url: `${BASE}/soft-plastics/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...lureRoutes];
}
