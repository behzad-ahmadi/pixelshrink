import type { Metadata } from "next";
import Converter from "@/components/Converter";
import { Breadcrumbs, Faq, RelatedLinks } from "@/components/page-bits";
import { CONVERT_PAIRS, TOOLS, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "WebP to JPG Converter — Free, Private, No Upload",
  description:
    "Convert WebP to JPG free in your browser. No uploads, no signup — flatten transparency & download universal JPEGs.",
  path: "/convert/webp-to-jpg",
});

const FAQS = [
  {
    question: "Why convert WebP to JPG?",
    answer:
      "JPG opens everywhere: older email clients, office software, print shops, and government upload portals that reject WebP. Converting gives you a universally compatible file in one click.",
  },
  {
    question: "Will I lose quality converting WebP to JPG?",
    answer:
      "Both formats are lossy, so re-encoding can soften fine detail slightly. At 90% quality or above the difference is invisible for normal viewing — keep the original WebP if you plan to edit further.",
  },
  {
    question: "What happens to transparency in my WebP?",
    answer:
      "JPEG cannot store transparency, so transparent areas are composited onto a white background. If you need to keep the alpha channel, convert to PNG instead.",
  },
  {
    question: "Is this WebP to JPG converter private?",
    answer:
      "Yes. Your file is decoded and re-encoded locally with the canvas API. It never leaves your device, no account is needed, and you can convert up to 10 files per batch with a single ZIP download.",
  },
  {
    question: "What quality setting should I use?",
    answer:
      "Keep quality at 90% for everyday sharing — the output is visually identical to the WebP original in almost every case. Raise to 92–95% for images you plan to print or edit further, since every lossy generation discards a little detail. Going below 85% visibly softens textures and text edges, so only do it when file size matters more than fidelity.",
  },
  {
    question: "Can I convert multiple WebP files at once?",
    answer:
      "Yes — drop up to 10 WebP files into the tool above. They are converted one after another on your device, and each download keeps its original filename with only the extension changed (image.webp becomes image.jpg). With 2 or more done, a Download-all-as-ZIP button appears — no upload queue, no waiting on a server.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebP to JPG Converter — PixelShrink",
  url: canonical("/convert/webp-to-jpg"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser WebP to JPG converter. Universally compatible JPEGs with private canvas encoding, no uploads.",
};

export default function WebpToJpgPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Convert Image", href: "/convert-image" },
          { label: "WebP to JPG" },
        ]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          WebP to JPG converter
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Turn WebP downloads into universally compatible JPEG files. Upload
          your .webp, pick a quality level, and download a .jpg that works in
          every app, inbox, and upload form — processed entirely on your device.
        </p>
      </header>

      <div className="mt-8">
        <Converter
          fromLabel="WebP"
          outputs={["image/jpeg"]}
          accept="image/webp,image/*"
          defaultQuality={90}
          heading="Convert WebP to JPG"
          subheading="Transparent areas flatten onto white. Quality 90% is visually lossless for most images."
        />
      </div>

      <section aria-labelledby="why-heading" className="mt-12">
        <h2
          id="why-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          When to convert WebP to JPG
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Upload forms that reject WebP",
              text: "Exam portals, job applications, and government sites often accept only JPG or PDF. Convert first instead of hitting an error at submit time.",
            },
            {
              title: "Email & office compatibility",
              text: "Some email clients and document tools still mishandle WebP attachments. JPG embeds reliably in Word, PowerPoint, and PDFs.",
            },
            {
              title: "Printing photos",
              text: "Print shops and kiosks expect JPG or PNG. A 90–95% quality JPG keeps prints sharp while staying compact.",
            },
            {
              title: "Sharing with anyone",
              text: "JPG opens on every phone, tablet, and desktop made in the last twenty years — no 'file not supported' surprises.",
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
          How to convert WebP to JPG
        </h2>
        <ol className="mt-4 space-y-3">
          {[
            "Choose your .webp file using the converter above (drag & drop or browse).",
            "Keep quality at 90% for sharing, or raise it to 95% for printing.",
            "Press Convert, preview the size saving, then download your .jpg.",
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

      <section aria-labelledby="compat-heading" className="mt-12">
        <h2
          id="compat-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Where JPG still wins over WebP
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          WebP is technically superior, but compatibility decides formats in
          the real world. Exam portals, job applications, and government upload
          forms frequently whitelist .jpg and reject everything else — hitting
          that error at submit time is the most common reason people convert.
          Older email clients and office suites embed JPG reliably while
          mishandling WebP attachments, and print shops universally expect JPG
          or PNG. The practical rule: keep WebP for assets you control (your
          own site, modern apps) and convert to JPG the moment a file leaves
          your hands toward someone else&apos;s system.
        </p>
      </section>

      <Faq items={FAQS} />
      <RelatedLinks
        links={[
          ...CONVERT_PAIRS.filter((p) => p.href !== "/convert/webp-to-jpg"),
          ...TOOLS.filter((t) =>
            ["/compress-image", "/resize-image", "/compress-image-to-100kb"].includes(t.href),
          ),
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
