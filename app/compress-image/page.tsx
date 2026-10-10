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
    "Free online image compressor. Shrink JPG, PNG & WebP with a quality slider or exact KB target. Private, in-browser, no upload.",
  path: "/compress-image",
});

const FAQS = [
  {
    question: "How does online image compression work?",
    answer:
      "JPEG and WebP are lossy formats: the encoder discards high-frequency detail your eyes barely notice, then stores what remains very efficiently. Lowering the quality setting discards more detail, so the file shrinks. PNG is lossless, so it can only shrink by reducing dimensions or color complexity. This tool runs the same encoders your browser uses for the web, entirely on your device.",
  },
  {
    question: "What quality setting should I choose?",
    answer:
      "For photographs, 70–85% is the sweet spot: files typically drop 60–80% with differences visible only when pixel-peeping. Below 60%, skies and skin can show banding and blocky artifacts. For graphics with text or sharp lines, prefer PNG or WebP at 90%+ to keep edges crisp.",
  },
  {
    question: "Should I choose JPEG, PNG, or WebP output?",
    answer:
      "Use JPEG for maximum compatibility — every device and portal accepts it. Use WebP when you control the destination (your own site, modern apps) because it is roughly 25–35% smaller than JPEG at equal quality. Use PNG only when you need transparency or pixel-perfect graphics like logos and screenshots with text.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. Your file is decoded, compressed, and re-encoded by JavaScript running in your own browser tab. Nothing is transmitted anywhere, which makes the tool safe for private documents like IDs and signatures.",
  },
  {
    question: "Why is my PNG still large after compressing?",
    answer:
      "PNG compression is lossless, so quality sliders cannot shrink it — the pixels must be stored exactly. Switch to the exact-KB target mode, which reduces dimensions until the PNG fits, or convert photographic PNGs to JPEG/WebP, which are typically 5–10x smaller for photos.",
  },
  {
    question: "Will compression remove EXIF and metadata?",
    answer:
      "Yes. Browser encoders write only pixel data, so camera settings, GPS coordinates, and timestamps in the original EXIF block are stripped from the output. That shrinks the file slightly and protects your privacy when sharing photos publicly.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compress Image — PixelShrink",
  url: canonical("/compress-image"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser image compressor with a quality slider and exact KB target modes for JPEG, PNG, and WebP.",
};

export default function CompressImagePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compress Image" }]} />
      </div>
      <ToolShell
        title="Compress Image Online"
        intro="Shrink JPG, PNG, and WebP files in seconds with a quality slider or an exact kilobyte target. Free, private, and entirely in your browser."
        relatedExclude="/compress-image"
        guide={
          <>
            <h2>How image compression actually works</h2>
            <p>
              Every digital photo carries far more data than your eyes can perceive. A 12-megapixel phone photo
              stores 36 million color values, including subtle noise in shadows, micro-texture in skies, and
              high-frequency detail that vanishes the moment an image is displayed at normal size. Lossy
              compression exploits this gap: the encoder transforms the image into frequency components, keeps
              the ones that matter visually, and quantizes the rest away. The quality percentage you choose
              controls how aggressive that quantization is. At 85%, a typical JPEG keeps virtually all visible
              detail while discarding roughly two-thirds of the bytes. At 60%, it starts merging similar tones
              into visible blocks — fine for thumbnails, risky for hero images. Understanding this trade-off is
              the whole skill of compressing images well: you are deciding how much invisible data to throw
              away, and the right answer depends entirely on where the image will be seen.
            </p>
            <h2>Quality slider or exact KB target?</h2>
            <p>
              This tool offers two compression modes because different situations demand different guarantees.
              The quality slider is the photographer&apos;s mode: you pick a visual standard — say 80% — and
              accept whatever file size results. It is ideal when appearance matters most, such as portfolio
              images, blog illustrations, or prints. Every image compressed at the same quality looks
              consistently good, even though file sizes vary with content. The exact-KB target mode is the
              form-filler&apos;s mode: you declare a byte budget — 20KB, 50KB, 100KB — and the tool binary
              searches encoder quality to land at the highest quality that fits. If even the lowest usable
              quality cannot squeeze the pixels into your budget, it progressively scales dimensions down
              until the target is met. Use target mode whenever a portal, exam form, or upload limit dictates
              the size; use quality mode whenever your eyes dictate it.
            </p>
            <h2>Choosing the right output format</h2>
            <p>
              Format choice often matters more than the quality number. JPEG is the universal default: every
              browser, phone, printer, and government portal since the 1990s reads it, and its encoder is
              superb for photographs. Its weaknesses are graphics with sharp edges — text screenshots, logos,
              charts — where it smears ringing artifacts around high-contrast boundaries, and its lack of
              transparency support. WebP fixes both problems partially: it compresses photos 25–35% smaller
              than JPEG at equal visual quality, supports transparency, and handles graphics more gracefully.
              Its only drawback is compatibility with older or bureaucratic systems that explicitly demand
              “.jpg” uploads. PNG is lossless and therefore the largest: a photo saved as PNG can be five to
              ten times bigger than the same photo as JPEG. Reserve PNG for images that must be pixel-perfect —
              line art, UI screenshots with small text, images with transparency — and never for plain
              photographs unless a system forces it. When the format itself is the problem, <Link href="/convert-image">convert formats</Link> first, and when the framing wastes pixels, <Link href="/crop-image">crop tightly</Link> before compressing.
            </p>
            <h2>How to compress an image in four steps</h2>
            <ol>
              <li>
                <strong>Drop your image</strong> onto the tool above or click to browse. Anything up to 50MB
                works, including JPEG, PNG, WebP, GIF, BMP, and AVIF sources.
              </li>
              <li>
                <strong>Pick a mode.</strong> Drag the quality slider while watching the before/after sizes, or
                switch to target mode and type your KB budget for an guaranteed fit.
              </li>
              <li>
                <strong>Choose the output format.</strong> Stick with JPEG for uploads to third parties; choose
                WebP for your own website where every kilobyte of page weight counts.
              </li>
              <li>
                <strong>Download and verify.</strong> Open the result at full size once. If faces, text, or
                product details look soft, re-compress five quality points higher — it costs seconds.
              </li>
            </ol>
            <h2>Pro tips for dramatically smaller files</h2>
            <p>
              The biggest wins come before you touch the quality slider. First, <Link href="/resize-image">resize oversized images</Link>: a
              4000-pixel phone photo destined for a 1200-pixel web slot carries ten times the pixels it needs,
              and no quality setting compensates for that. Shrinking dimensions first, then compressing, routinely
              beats compressing alone by a factor of three. Second, prefer WebP for anything you publish
              yourself — the same photo at the same visual quality is roughly a third lighter than JPEG, which
              directly improves page-load times and search rankings. Third, remember that re-encoding strips
              EXIF metadata automatically, so photos of people or places lose their embedded GPS and camera
              data — a quiet privacy bonus when sharing publicly. Finally, keep your originals: lossy
              compression is a one-way street, so archive the full-quality file and treat compressed copies as
              disposable derivatives for specific destinations.
            </p>
            <h2>Quality sweet spots worth memorizing</h2>
            <p>
              After compressing thousands of images, practitioners converge on the same numbers. Use 85% for
              hero images and anything viewers will inspect closely. Use 75–80% for article illustrations,
              product photos, and social posts — the savings are large and the difference is essentially
              invisible on phones. Use 60–70% for thumbnails, avatars, and background textures where the image
              renders small. Drop to 50% only for strict byte targets where fitting matters more than fidelity,
              and pair it with dimension reduction rather than quality reduction alone. For PNG graphics with
              flat colors, none of this applies — export at full quality and shrink the canvas instead, since
              PNG quality sliders change nothing. Internalize these five bands and you will rarely need to
              experiment more than once per image.
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
