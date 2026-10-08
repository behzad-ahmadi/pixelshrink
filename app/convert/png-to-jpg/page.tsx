import type { Metadata } from "next";
import Converter from "@/components/Converter";
import { Breadcrumbs, Faq, RelatedLinks } from "@/components/page-bits";
import { CONVERT_PAIRS, TOOLS, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "PNG to JPG Converter — Shrink Screenshots Free",
  description:
    "Convert PNG to JPG free in your browser. Shrink screenshots up to 80% with a quality slider. Private — no uploads.",
  path: "/convert/png-to-jpg",
});

const FAQS = [
  {
    question: "Why is my PNG so much bigger than a JPG?",
    answer:
      "PNG is lossless: it preserves every pixel exactly, which is great for screenshots and graphics but wasteful for photos. JPG discards detail your eyes cannot see, often cutting file size by 70–90%.",
  },
  {
    question: "What quality should I use for PNG to JPG?",
    answer:
      "Start at 85%: screenshots stay crisp and photos look identical to the original. Raise to 90–92% for images with text overlays, or lower to 75–80% when size matters more than perfection.",
  },
  {
    question: "Will transparency survive the conversion?",
    answer:
      "No — JPEG has no alpha channel, so transparent regions become white. If the transparency matters (logos, icons, overlays), keep the PNG or convert to WebP instead.",
  },
  {
    question: "Do PNG screenshots lose sharpness as JPG?",
    answer:
      "Flat-color areas and thin text can develop faint halos at low quality. At 85%+ the artifacts are negligible for sharing, docs, and listings — only keep PNG for pixel-perfect archival copies.",
  },
  {
    question: "What about photos saved as PNG by my phone or editor?",
    answer:
      "Some phones and editors save camera photos as PNG, which can be 5–10x larger than necessary. Converting those to JPG at 85–90% keeps every visible detail while cutting a 15MB PNG photo down to 1–2MB. Check whether the PNG has transparency first — if it does not, JPG is almost always the better container.",
  },
  {
    question: "Is there any upload or file-size limit?",
    answer:
      "Files up to 50MB are accepted, and because conversion runs locally in your browser there is no queue, no account, and no daily limit. A full-screen PNG screenshot converts in a second or two on any modern device, and the download keeps your original filename with a .jpg extension.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PNG to JPG Converter — PixelShrink",
  url: canonical("/convert/png-to-jpg"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser PNG to JPG converter. Shrink screenshots up to 80% with a quality slider — private, no uploads.",
};

export default function PngToJpgPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Convert Image", href: "/convert-image" },
          { label: "PNG to JPG" },
        ]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          PNG to JPG converter
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Heavy PNG screenshots and exports become small, shareable JPEGs.
          Drag in your .png, tune quality with the slider, and download a .jpg
          that is typically 70–90% smaller — all processed on your device.
        </p>
      </header>

      <div className="mt-8">
        <Converter
          fromLabel="PNG"
          outputs={["image/jpeg"]}
          accept="image/png,image/*"
          defaultQuality={85}
          heading="Convert PNG to JPG"
          subheading="Best for screenshots, exports, and photos. Transparency flattens onto white."
        />
      </div>

      <section aria-labelledby="why-heading" className="mt-12">
        <h2
          id="why-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          When PNG to JPG makes sense
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Screenshots for docs & tickets",
              text: "A 3MB fullscreen PNG becomes a ~300KB JPG at 85% — fast to attach, fast to load, still perfectly readable.",
            },
            {
              title: "Marketplace & CMS uploads",
              text: "Listing platforms cap image size and convert uploads to JPG anyway. Convert first to control quality yourself.",
            },
            {
              title: "Email attachments",
              text: "Shrink multi-megabyte PNG exports into inbox-friendly JPEGs without zipping or splitting messages.",
            },
            {
              title: "Photos saved as PNG",
              text: "Some editors and phones save photos as PNG. Converting to JPG at 85–90% keeps every visible detail at a fraction of the size.",
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
          How to convert PNG to JPG
        </h2>
        <ol className="mt-4 space-y-3">
          {[
            "Drop your .png file into the converter above.",
            "Set quality to 85% (or 90%+ for images with small text).",
            "Press Convert and download the smaller .jpg file.",
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
          Picking the right quality
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          The right setting depends on what is in the image. Screenshots with
          large flat areas and readable text stay crisp at 85% — the artifacts
          concentrate in gradients and anti-aliased edges where nobody looks.
          Photos embedded in PNG need only 85–90% to look identical to the
          original. Push to 90–92% when the image contains small text overlays,
          diagrams, or UI mockups you will zoom into; drop to 75–80% for
          images headed to listings or chat where speed beats perfection. As a
          rule of thumb, a 3MB fullscreen PNG becomes roughly 300KB at 85% and
          150KB at 75% — convert once at the higher setting, inspect text
          edges at full zoom, and only then go lower. One more thing to check
          before converting: transparency. JPEG has no alpha channel, so any
          transparent pixels are flattened onto a white background permanently.
          If the PNG is a logo, icon, or overlay where transparency matters,
          keep the PNG master or choose WebP output instead — both preserve
          the alpha channel while still shrinking the file for the web.
        </p>
      </section>

      <Faq items={FAQS} />
      <RelatedLinks
        links={[
          ...CONVERT_PAIRS.filter((p) => p.href !== "/convert/png-to-jpg"),
          ...TOOLS.filter((t) =>
            ["/compress-image", "/compress-image-to-100kb", "/resize-image"].includes(t.href),
          ),
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
