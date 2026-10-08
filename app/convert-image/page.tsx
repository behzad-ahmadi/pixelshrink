import type { Metadata } from "next";
import Link from "next/link";
import Converter from "@/components/Converter";
import { Breadcrumbs, Faq, RelatedLinks } from "@/components/page-bits";
import { BRAND, CONVERT_PAIRS, TOOLS, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Convert Images: WebP, PNG & JPG in Browser",
  description:
    "Free image converter — switch between WebP, PNG & JPG locally. No uploads, no watermarks, batch up to 10 files with ZIP download.",
  path: "/convert-image",
});

const FAQS = [
  {
    question: "Which image format should I choose?",
    answer:
      "Use JPG for photos where small size matters, PNG for screenshots or graphics that need transparency or pixel-perfect edges, and WebP when you want the smallest file for the web and your audience uses modern browsers.",
  },
  {
    question: "Does converting change image quality?",
    answer:
      "Converting between lossy formats (JPG, WebP) re-encodes pixels, so a small quality loss is possible — keep quality at 85% or higher to stay visually identical. Converting to PNG is always lossless but usually produces larger files.",
  },
  {
    question: "What happens to transparency when converting to JPG?",
    answer:
      "JPEG has no alpha channel, so transparent areas are flattened onto a white background during conversion. If you need transparency, convert to PNG or WebP instead.",
  },
  {
    question: "Are my images uploaded anywhere?",
    answer:
      "No. Every conversion runs locally in your browser with canvas encoding. Files never leave your device, and re-encoding strips EXIF metadata automatically.",
  },
  {
    question: "Can I convert HEIC photos from my iPhone?",
    answer:
      "Yes. Drop a .heic or .heif file into the converter and it is decoded on your device into a JPEG-compatible image, then re-encoded to JPG, PNG, or WebP. iPhones shoot HEIC by default because it stores the same quality in roughly half the bytes of JPEG — but many portals, email clients, and Windows apps still reject it, so converting to JPG is the fastest fix.",
  },
  {
    question: "Which quality setting should I use?",
    answer:
      "For JPG and WebP output, 85–92% is the sweet spot: visually identical to the original for photos at a fraction of the size. Use 90%+ for images with text overlays or images you plan to edit further, and 75–80% for thumbnails where size matters more than perfection. PNG output is always lossless, so no quality setting applies.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Convert Image — PixelShrink",
  url: canonical("/convert-image"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser image converter between JPG, PNG, WebP, and HEIC. No uploads, no watermarks, batch up to 10 files with ZIP download.",
};

const RELATED = TOOLS.filter((t) => t.href !== "/convert-image");

export default function ConvertImagePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Convert Image" }]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          Convert images between JPG, PNG &amp; WebP
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Switch formats in seconds without uploading anything. Pick any output
          below, or jump straight to a preconfigured converter for the most
          common pairs. Everything runs on your device with canvas encoding.
        </p>
      </header>

      <div className="mt-8">
        <Converter
          fromLabel="Image"
          outputs={["image/jpeg", "image/png", "image/webp"]}
          defaultOutput="image/jpeg"
          heading="Universal image converter"
          subheading="Upload once, pick JPG, PNG, or WebP, tune quality, download."
        />
      </div>

      <section aria-labelledby="pairs-heading" className="mt-12">
        <h2
          id="pairs-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Popular conversions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {CONVERT_PAIRS.map((pair) => (
            <Link
              key={pair.href}
              href={pair.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:shadow dark:bg-slate-900 dark:border-slate-700 dark:hover:border-blue-600"
            >
              <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                {pair.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {pair.description}
              </p>
              <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                Open converter →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="mt-12">
        <h2
          id="compare-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          JPG vs PNG vs WebP vs HEIC — which to pick
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Every format is a different trade-off between size, quality, and
          compatibility. Photos with smooth gradients compress best as JPG or
          WebP; graphics with sharp edges and transparency need PNG or WebP;
          iPhone originals arrive as HEIC and usually need converting before
          anything else can open them. The table below summarizes the decision
          in one glance.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "JPG — universal compatibility",
              text: "Opens everywhere: portals, email, printers, office software, and every phone from the last twenty years. Lossy compression keeps photos small. No transparency. Default choice when you are unsure where the file will end up.",
            },
            {
              title: "PNG — lossless and transparent",
              text: "Preserves every pixel exactly and supports alpha transparency, which makes it ideal for logos, icons, and screenshots with text. The price is size: photographic PNGs are often 5–10x larger than the same image as JPG.",
            },
            {
              title: "WebP — smallest for the web",
              text: "Google's modern codec is typically 25–35% smaller than JPG at equal quality, supports transparency, and renders in all current browsers. Best for site images, avatars, and thumbnails where you control the destination.",
            },
            {
              title: "HEIC — iPhone default, convert it",
              text: "Apple's High Efficiency format stores excellent quality in tiny files, but Windows apps, upload forms, and many web tools reject it. Convert HEIC to JPG the moment you need to share, print, or upload.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="quality-heading" className="mt-12">
        <h2
          id="quality-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Quality settings that actually work
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          The quality slider is the single biggest lever on file size. For JPG
          and WebP output, 85–92% is visually identical to the original for
          almost every photo — differences only appear when pixel-peeping at
          200% zoom. Each 5-point drop below 80% roughly halves the remaining
          quality headroom, so move in small steps: convert once at 90%, check
          the result, and only go lower if the file is still too big. Avoid
          converting the same file twice (JPG → WebP → JPG), because every
          lossy generation discards fresh detail. When transparency matters,
          choose PNG or WebP instead of JPG — flattening an alpha channel onto
          white is irreversible, so keep a transparent master copy before you
          convert.
        </p>
      </section>

      <section aria-labelledby="how-heading" className="mt-12">
        <h2
          id="how-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          How conversion works
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Choose a file",
              text: "Drop a JPEG, PNG, WebP, GIF, BMP, or AVIF file up to 50MB.",
            },
            {
              step: "2",
              title: "Pick a format",
              text: "Select JPG, PNG, or WebP and set quality (85–92% is the sweet spot).",
            },
            {
              step: "3",
              title: "Download",
              text: "Canvas re-encodes the pixels locally and you save the new file.",
            },
          ].map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700"
            >
              <p className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500">
                {s.step}
              </p>
              <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {BRAND} never uploads your files: conversion happens entirely in your
          browser, and re-encoding strips EXIF metadata by default.
        </p>
      </section>

      <Faq items={FAQS} />
      <RelatedLinks links={RELATED} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
