import type { MetadataRoute } from "next";
import { SITE_URL, TOOLS, CONVERT_PAIRS } from "@/lib/site";

const GUIDE_PATHS: string[] = [
  "/guides/reduce-image-size-without-losing-quality",
];

const LEGAL_PATHS: Array<{ path: string; priority: number }> = [
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Static date: new Date() is not allowed during prerendering
  // with Cache Components enabled.
  const now = new Date("2026-10-08T00:00:00Z");
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...TOOLS.map((tool) => ({
      url: `${SITE_URL}${tool.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...CONVERT_PAIRS.map((pair) => ({
      url: `${SITE_URL}${pair.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...GUIDE_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...LEGAL_PATHS.map((entry) => ({
      url: `${SITE_URL}${entry.path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: entry.priority,
    })),
  ];
}
