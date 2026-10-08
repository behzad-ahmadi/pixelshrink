import type { Metadata } from "next";

export const BRAND = "PixelShrink";
export const TAGLINE = "Free image tools that never upload your files.";
export const SITE_URL = "https://pixelshrink.app";
export const CONTACT_EMAIL = "hello@pixelshrink.app";

export interface ToolLink {
  href: string;
  label: string;
  short: string;
  description: string;
}

export const TOOLS: ToolLink[] = [
  {
    href: "/compress-image",
    label: "Compress Image",
    short: "Compress",
    description: "Shrink JPEG, PNG, and WebP files with a quality slider or an exact KB target.",
  },
  {
    href: "/resize-image",
    label: "Resize Image",
    short: "Resize",
    description: "Change pixel dimensions with aspect-ratio lock and social-media presets.",
  },
  {
    href: "/crop-image",
    label: "Crop Image",
    short: "Crop",
    description: "Trim photos to 1:1, 4:3, 16:9, or a free selection — right in your browser.",
  },
  {
    href: "/convert-image",
    label: "Convert Image",
    short: "Convert",
    description: "Switch between JPEG, PNG, and WebP without uploading anything.",
  },
  {
    href: "/compress-image-to-20kb",
    label: "Compress to 20KB",
    short: "20KB",
    description: "Force an image under 20KB for exam forms and application portals.",
  },
  {
    href: "/compress-image-to-50kb",
    label: "Compress to 50KB",
    short: "50KB",
    description: "Hit a 50KB upload limit for resumes, ID proofs, and signatures.",
  },
  {
    href: "/compress-image-to-100kb",
    label: "Compress to 100KB",
    short: "100KB",
    description: "Get under 100KB for marketplace listings and CMS uploads.",
  },
];

export const CONVERT_PAIRS: ToolLink[] = [
  {
    href: "/convert/heic-to-jpg",
    label: "HEIC to JPG",
    short: "HEIC→JPG",
    description: "Convert iPhone HEIC photos into universal JPG files.",
  },
  {
    href: "/convert/webp-to-jpg",
    label: "WebP to JPG",
    short: "WebP→JPG",
    description: "Turn WebP downloads into universally compatible JPEG files.",
  },
  {
    href: "/convert/png-to-jpg",
    label: "PNG to JPG",
    short: "PNG→JPG",
    description: "Convert heavy PNG screenshots and exports into small JPEGs.",
  },
  {
    href: "/convert/jpg-to-webp",
    label: "JPG to WebP",
    short: "JPG→WebP",
    description: "Modernize JPEG photos into lighter WebP files for the web.",
  },
];

export interface NavItem {
  href: string;
  label: string;
}

export const HEADER_NAV: NavItem[] = [
  { href: "/compress-image", label: "Compress" },
  { href: "/resize-image", label: "Resize" },
  { href: "/convert-image", label: "Convert" },
  { href: "/crop-image", label: "Crop" },
  { href: "/guides/reduce-image-size-without-losing-quality", label: "Guides" },
];

export function canonical(path: string): string {
  return `${SITE_URL}${path}`;
}

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata({ title, description, path }: PageMeta): Metadata {
  const url = canonical(path);
  return {
    title: { absolute: `${title} | ${BRAND}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${BRAND}`,
      description,
      url,
      siteName: BRAND,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${BRAND}`,
      description,
    },
  };
}
