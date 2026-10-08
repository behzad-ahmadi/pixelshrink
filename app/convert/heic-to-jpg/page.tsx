import type { Metadata } from "next";
import Converter from "@/components/Converter";
import { Breadcrumbs, Faq, RelatedLinks } from "@/components/page-bits";
import { CONVERT_PAIRS, TOOLS, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "HEIC to JPG Converter — iPhone Photos to JPG Free",
  description:
    "Convert HEIC to JPG free in your browser. Turn iPhone photos into universal JPEGs. Private on-device decoding, no uploads.",
  path: "/convert/heic-to-jpg",
});

const FAQS = [
  {
    question: "Why does my iPhone save photos as HEIC?",
    answer:
      "Since iOS 11, iPhones default to HEIC (High Efficiency Image Container) because it stores the same quality as JPEG in roughly half the bytes. That saves storage and bandwidth — but many Windows apps, upload portals, email clients, and web tools still cannot open HEIC, which is why converting to JPG is so often necessary.",
  },
  {
    question: "How does HEIC to JPG conversion work here?",
    answer:
      "Your .heic file is decoded on your device with a WebAssembly HEIC decoder, then re-encoded to JPEG through the browser canvas at your chosen quality. Nothing is uploaded: the whole pipeline runs locally in your tab, and re-encoding strips EXIF location metadata automatically.",
  },
  {
    question: "What quality should I use?",
    answer:
      "Use 90–92% for everyday sharing — visually identical to the HEIC original. Raise to 95% for photos you plan to print or edit further, since HEIC already discarded some detail when the photo was taken and every extra generation costs a little more. Avoid going below 85% unless file size matters more than fidelity.",
  },
  {
    question: "Will Live Photos or bursts convert too?",
    answer:
      "Each conversion handles the still image in the .heic container. For Live Photos, your iPhone stores the still and the video segment together — export or share the still frame as a .heic first, then convert it here. Bursts save as a sequence of stills; convert each frame you want to keep.",
  },
  {
    question: "Do I lose quality converting HEIC to JPG?",
    answer:
      "Barely. HEIC and JPG are both lossy, so re-encoding softens fine detail by a tiny amount — invisible at 90%+ for normal viewing. The HEIC original stays untouched on your phone, so you always keep the highest-quality master and convert copies for sharing.",
  },
  {
    question: "Is my photo uploaded anywhere?",
    answer:
      "No. Decoding and encoding both run locally on your device. No account, no queue, no file-size tricks — files up to 50MB are accepted and the download keeps your original filename with a .jpg extension.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HEIC to JPG Converter — PixelShrink",
  url: canonical("/convert/heic-to-jpg"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser HEIC to JPG converter for iPhone photos. Private on-device decoding, no uploads.",
};

export default function HeicToJpgPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Convert Image", href: "/convert-image" },
          { label: "HEIC to JPG" },
        ]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          HEIC to JPG converter
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Turn iPhone HEIC photos into JPG files that open everywhere. Drop in
          your .heic, pick a quality level, and download a universal .jpg —
          decoded and encoded privately on your device.
        </p>
      </header>

      <div className="mt-8">
        <Converter
          fromLabel="HEIC"
          outputs={["image/jpeg"]}
          accept=".heic,.heif,image/*"
          defaultQuality={92}
          heading="Convert HEIC to JPG"
          subheading="HEIC is decoded on-device, then re-encoded to JPG. Quality 92% is visually lossless for iPhone photos."
        />
      </div>

      <section aria-labelledby="why-heading" className="mt-12">
        <h2
          id="why-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100"
        >
          Why HEIC needs converting
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Upload forms reject HEIC",
              text: "Exam portals, job applications, and government sites whitelist .jpg and bounce everything else. Convert before submit day instead of discovering the error at midnight.",
            },
            {
              title: "Windows and email choke on it",
              text: "Many Windows photo viewers, older email clients, and office suites cannot display HEIC attachments. JPG embeds and previews reliably everywhere.",
            },
            {
              title: "Half the size, double the hassle",
              text: "HEIC's efficiency is real — same quality at half the bytes of JPG — but that advantage evaporates the moment you need to share outside Apple's ecosystem.",
            },
            {
              title: "Printing expects JPG or PNG",
              text: "Print shops, kiosks, and photo books universally accept JPG. A 92–95% quality JPG keeps iPhone prints sharp while staying compact.",
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
          How to convert HEIC to JPG
        </h2>
        <ol className="mt-4 space-y-3">
          {[
            "Drop your .heic or .heif file into the converter above.",
            "Keep quality at 92% for sharing, or raise it to 95% for printing.",
            "Press Convert, wait a moment for on-device decoding, then download your .jpg.",
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
          Quality, Live Photos, and file size
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          An iPhone HEIC photo is already efficiently packed: a 12MP shot that
          would be a 5–6MB JPG often sits at 2–3MB as HEIC. Converting at 92%
          typically lands near the JPG-equivalent size with no visible change,
          because the HEIC master holds more detail than JPG can express. For
          Live Photos, convert the still frame — the video segment stays in
          your Photos library untouched. And keep the original .heic as your
          archive: convert copies for sharing, portals, and printing, but never
          delete the master until you are sure you will not need it again.
        </p>
      </section>

      <Faq items={FAQS} />
      <RelatedLinks
        links={[
          ...CONVERT_PAIRS.filter((p) => p.href !== "/convert/heic-to-jpg"),
          ...TOOLS.filter((t) =>
            ["/compress-image", "/compress-image-to-100kb", "/resize-image"].includes(t.href),
          ),
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
