import type { Metadata } from "next";
import Converter from "@/components/Converter";
import { Breadcrumbs, Faq, RelatedLinks } from "@/components/page-bits";
import { CONVERT_PAIRS, TOOLS, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "JPG to WebP Converter — Modernize Photos Free",
  description:
    "Convert JPG to WebP free in your browser. Cut photo size 25–35% for faster sites. Private canvas encoding, no uploads.",
  path: "/convert/jpg-to-webp",
});

const FAQS = [
  {
    question: "Why convert JPG to WebP?",
    answer:
      "WebP uses a more modern encoder than JPEG, so the same photo is typically 25–35% smaller at equal visual quality. Smaller images mean faster pages, lower bandwidth bills, and better Core Web Vitals scores.",
  },
  {
    question: "Do all browsers support WebP?",
    answer:
      "Yes, effectively: every current version of Chrome, Edge, Firefox, Safari, and Opera displays WebP. Only very old browsers (pre-2020) lack support, so keep a JPG fallback if that audience matters to you.",
  },
  {
    question: "What quality should I use?",
    answer:
      "WebP at 80–85% matches an 85–90% JPEG visually while staying smaller. Start at 85% for hero images and product photos, 75–80% for thumbnails and decorative images.",
  },
  {
    question: "Is my photo uploaded to a server?",
    answer:
      "No. Encoding runs locally via the canvas API in your browser. Nothing is uploaded, no account is required, and EXIF metadata is stripped from the output automatically.",
  },
  {
    question: "Can I convert in bulk or keep the original filename?",
    answer:
      "Drop up to 10 files into the tool above — they are converted one after another on your device, and each download keeps its original filename with only the extension changed (photo.jpg becomes photo.webp). With 2 or more done, a Download-all-as-ZIP button appears. Everything runs locally with no upload queue, so a batch takes seconds.",
  },
  {
    question: "Should I replace all my site images with WebP?",
    answer:
      "For photos, hero images, and thumbnails — yes. WebP at 80–85% looks identical to JPG at 85–90% while weighing a third less, which directly improves Largest Contentful Paint. Keep PNG only for images that need lossless edges or transparency with legacy support, and keep a JPG fallback only if you serve visitors on browsers older than 2020.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JPG to WebP Converter — PixelShrink",
  url: canonical("/convert/jpg-to-webp"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser JPG to WebP converter. Cut photo size 25–35% for faster sites with private canvas encoding.",
};

export default function JpgToWebpPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Convert Image", href: "/convert-image" },
          { label: "JPG to WebP" },
        ]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          JPG to WebP converter
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Modernize JPEG photos into lighter WebP files for the web. Upload a
          .jpg, choose quality, and download a .webp that looks identical at
          roughly two-thirds the size — encoded privately on your device.
        </p>
      </header>

      <div className="mt-8">
        <Converter
          fromLabel="JPG"
          outputs={["image/webp"]}
          accept="image/jpeg,image/*"
          defaultQuality={85}
          heading="Convert JPG to WebP"
          subheading="WebP keeps transparency too, and 85% quality is the sweet spot for web photos."
        />
      </div>

      <section aria-labelledby="why-heading" className="mt-12">
        <h2
          id="why-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Why WebP wins for the web
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "25–35% smaller files",
              text: "Google's WebP encoder squeezes the same pixels into fewer bytes than JPEG at matched quality — free bandwidth savings on every pageview.",
            },
            {
              title: "Faster page loads",
              text: "Product photos and hero images are usually the heaviest page assets. WebP conversion is often the single biggest speed win available.",
            },
            {
              title: "Transparency + photos in one format",
              text: "Unlike JPG, WebP supports alpha transparency, so icons, logos, and cut-outs can live alongside photos in a single pipeline.",
            },
            {
              title: "Universal browser support",
              text: "All modern browsers render WebP natively — no plugins, no fallbacks needed for the vast majority of audiences.",
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

      <section aria-labelledby="steps-heading" className="mt-12">
        <h2
          id="steps-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          How to convert JPG to WebP
        </h2>
        <ol className="mt-4 space-y-3">
          {[
            "Drop your .jpg or .jpeg file into the converter above.",
            "Set quality to 85% for photos (80% for thumbnails).",
            "Press Convert and download the lighter .webp file.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white dark:bg-blue-500">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="quality-heading" className="mt-12">
        <h2
          id="quality-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Quality and file-size guide
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          WebP quality maps roughly 5 points below JPG: WebP at 80% looks like
          JPG at 85%, and WebP at 85% matches JPG at 90%. A 2MB JPG photo
          typically becomes a 1.2–1.4MB WebP at 85% with no visible change, and
          dropping to 80% pushes it near 1MB for thumbnails and decorative
          images. Start at 85% for anything prominent — hero images, product
          photos, portfolio work — and reserve 75–80% for avatars and
          below-the-fold decoration. Because conversion re-encodes pixels,
          always convert from the highest-quality original you have, not from
          an already recompressed copy.
        </p>
      </section>

      <Faq items={FAQS} />
      <RelatedLinks
        links={[
          ...CONVERT_PAIRS.filter((p) => p.href !== "/convert/jpg-to-webp"),
          ...TOOLS.filter((t) =>
            ["/compress-image", "/resize-image", "/crop-image"].includes(t.href),
          ),
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
