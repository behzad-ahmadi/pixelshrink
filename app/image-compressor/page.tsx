import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Compressor from "@/components/Compressor";
import Faq from "@/components/Faq";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Compress Image — Shrink JPG, PNG & WebP Online",
  description:
    "Free online image compressor for JPG, PNG & WebP. Adjust quality or choose a KB target, compare file sizes, and download privately with no signup.",
  path: "/image-compressor",
});

const FAQS = [
  {
    question: "How do I compress an image without changing its dimensions?",
    answer:
      "Use Quality slider mode, select JPG or WebP, and choose a quality setting. This mode keeps the original width and height. Compare the output with your original before downloading; reducing quality can discard visible detail.",
  },
  {
    question: "What happens when I choose an exact KB target?",
    answer:
      "The compressor searches quality settings for a file that fits your budget. If necessary, target mode also reduces pixel dimensions. Check the target status and final dimensions: very small budgets are not always achievable. Use quality mode if the original dimensions must stay fixed.",
  },
  {
    question: "Can I compress multiple images at once?",
    answer:
      "Yes. Add up to 10 images per batch, with a maximum of 50MB per file. Each file is processed individually with the selected settings. Download successful results separately, or use Download all as ZIP when two or more images are ready.",
  },
  {
    question: "Why does the quality slider not make my PNG smaller?",
    answer:
      "PNG is lossless at its output dimensions and does not use the lossy quality setting. For photos, try JPG or WebP if your destination accepts it. Target mode can reduce PNG dimensions; the combined resize and compress tool also lets you choose dimensions yourself.",
  },
  {
    question: "Is the image compressor free and private?",
    answer:
      "Yes. Compression runs locally in your browser with no image uploads, account, or watermark. Re-encoding removes the original EXIF metadata. Keep the untouched original if you need its metadata or full detail later.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compress Image — PixelShrink",
  url: canonical("/image-compressor"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description: "Free browser-based image compression with a quality slider, KB targets, batch processing, and ZIP downloads for JPG, PNG, and WebP.",
};

export default function ImageCompressorPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compress Image" }]} />
      </div>
      <ToolShell
        title="Compress Image Online"
        intro="Shrink JPG, PNG, and WebP files with a quality slider or a KB target. Compare before and after sizes, then download individual images or a batch ZIP. Free, private, and entirely in your browser."
        relatedExclude="/image-compressor"
        guide={
          <>
            <h2>Compress an image in four steps</h2>
            <ol>
              <li><strong>Choose images.</strong> Drop up to 10 files into the tool, or click to browse. Each file can be up to 50MB.</li>
              <li><strong>Pick a mode.</strong> Use the quality slider to control appearance, or enter a KB target for an upload limit.</li>
              <li><strong>Select an output format.</strong> Choose JPG, WebP, or PNG, then compare the original and exported sizes and dimensions.</li>
              <li><strong>Download the result.</strong> Inspect faces and small text before downloading. Keep your originals so you can try another setting later.</li>
            </ol>
            <h2>Quality slider or KB target?</h2>
            <p>
              Quality mode preserves the original pixel dimensions. Start around 80–85% for JPG or WebP
              photos, then compare the result at its intended display size. File-size savings depend on
              the source image, format, and browser; a file that is already compressed may not get smaller.
            </p>
            <p>
              Target mode tries to fit a byte budget, adjusting quality and then reducing dimensions when
              needed. It can report a missed target, so verify the output before submitting to a form.
              Use the presets for <Link href="/compress-image-to-20kb">20KB</Link>,{" "}
              <Link href="/compress-image-to-50kb">50KB</Link>, or{" "}
              <Link href="/compress-image-to-100kb">100KB</Link> when those match your upload limit.
            </p>
            <h2>Choose JPG, PNG, or WebP</h2>
            <p>
              JPG is a common choice for photos and forms that require JPEG. WebP supports transparency
              and adjustable compression for web images. PNG preserves pixel detail and transparency,
              but the quality slider does not reduce PNG size. JPG replaces transparency with white.
              Animated inputs are exported as a still image. Check your destination&apos;s accepted formats.
            </p>
            <h2>Need to choose width and height too?</h2>
            <p>
              This page keeps the familiar compression controls. To set custom dimensions and compress
              in the same run, use <Link href="/compress-image">resize and compress image online free</Link>.
              That tool includes width, height, and aspect-ratio controls. For a longer walkthrough,
              read the <Link href="/guides/reduce-image-size-without-losing-quality">image-size reduction guide</Link>.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Compressor defaultMode="quality" defaultQuality={80} defaultTargetKB={100} />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
