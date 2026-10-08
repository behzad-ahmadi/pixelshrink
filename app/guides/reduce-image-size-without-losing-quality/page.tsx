import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Faq } from "@/components/page-bits";
import { BRAND, SITE_URL, buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Reduce Image Size Without Losing Quality (Guide)",
  description:
    "Learn to shrink images without visible quality loss: formats, quality, resizing & exact-KB targets. Free tools included.",
  path: "/guides/reduce-image-size-without-losing-quality",
});

const HOW_TO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to reduce image size without losing quality",
  description:
    "A practical workflow for shrinking JPEG, PNG, and WebP images: pick the right format, tune quality, resize sensibly, and hit exact KB targets — all in the browser.",
  totalTime: "PT10M",
  tool: [
    { "@type": "HowToTool", name: "PixelShrink Compress Image tool" },
    { "@type": "HowToTool", name: "PixelShrink Resize Image tool" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Check the image you are starting with",
      text: "Look at the file's format, pixel dimensions, and byte size before touching anything. A 4000px PNG screenshot and a 1200px JPEG photo need completely different treatment.",
    },
    {
      "@type": "HowToStep",
      name: "Pick the right output format",
      text: "Use JPEG for photos, PNG only when you need transparency or pixel-perfect graphics, and WebP when you want the smallest file for modern browsers.",
    },
    {
      "@type": "HowToStep",
      name: "Lower quality to the sweet spot",
      text: "Compress a JPEG or WebP to 85 percent quality first, then compare it against the original at full zoom before going lower.",
    },
    {
      "@type": "HowToStep",
      name: "Resize dimensions that are larger than needed",
      text: "Scale the image down to the largest size it will actually be displayed at — for example 1920px wide for a blog hero or 1080px wide for a listing photo.",
    },
    {
      "@type": "HowToStep",
      name: "Hit an exact KB target when a form demands it",
      text: "Use an exact-target compressor for upload limits like 20KB, 50KB, or 100KB instead of guessing with the quality slider.",
    },
    {
      "@type": "HowToStep",
      name: "Verify the result before submitting",
      text: "Zoom to 100 percent, check faces and text, confirm the byte size, and keep the original file in case you need to re-export.",
    },
  ],
};

const GUIDE_FAQS = [
  {
    question: "How much can I shrink an image without visible loss?",
    answer:
      "For photos, lowering JPEG or WebP quality to 80–85% typically cuts 50–70% of the bytes with no difference at normal viewing distance. Resizing oversized dimensions can cut another 50% or more on top of that.",
  },
  {
    question: "Which format gives the smallest file?",
    answer:
      "WebP is usually smallest for photos at matched quality — about 25–35% smaller than JPEG. For screenshots with flat colors, JPEG at 85% beats PNG by a wide margin; PNG is only worth it when you need transparency or lossless edges.",
  },
  {
    question: "Why does my image look bad after compressing?",
    answer:
      "The usual causes are quality set below 70%, resizing upward instead of downward, or converting a file that was already heavily compressed. Start from the highest-quality original you have and compress once, not repeatedly.",
  },
  {
    question: "Do online compressors see or store my photos?",
    answer:
      "Server-side tools must receive your file to process it. PixelShrink instead runs entirely in your browser with canvas encoding: files never leave your device and re-encoding strips EXIF metadata automatically.",
  },
];

export default function ReduceImageSizeGuidePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides/reduce-image-size-without-losing-quality" },
          { label: "Reduce image size without losing quality" },
        ]}
      />
      <header className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Guide · 10-minute read
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          How to reduce image size without losing quality
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Oversized images slow down pages, bounce off upload forms, and clog
          inboxes. This guide shows a repeatable workflow — format, quality,
          dimensions, then exact KB targets — that shrinks almost any image with
          no visible difference. Every step works with the free tools on this
          site, processed privately in your browser.
        </p>
      </header>

      <nav aria-label="Guide contents" className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:bg-slate-900 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">In this guide</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li><a href="#why-files-are-big" className="text-blue-700 hover:underline dark:text-blue-400">Why image files are bigger than they need to be</a></li>
          <li><a href="#choose-format" className="text-blue-700 hover:underline dark:text-blue-400">Step 1 — Choose the right format</a></li>
          <li><a href="#quality" className="text-blue-700 hover:underline dark:text-blue-400">Step 2 — Find the quality sweet spot</a></li>
          <li><a href="#dimensions" className="text-blue-700 hover:underline dark:text-blue-400">Step 3 — Resize dimensions to what you actually need</a></li>
          <li><a href="#exact-targets" className="text-blue-700 hover:underline dark:text-blue-400">Step 4 — Hit exact KB targets for upload forms</a></li>
          <li><a href="#mistakes" className="text-blue-700 hover:underline dark:text-blue-400">Mistakes that destroy quality</a></li>
          <li><a href="#workflow" className="text-blue-700 hover:underline dark:text-blue-400">The 5-minute workflow, start to finish</a></li>
        </ol>
      </nav>

      <article className="guide mt-4">
        <h2 id="why-files-are-big">1. Why image files are bigger than they need to be</h2>
        <p>
          Three things determine how many bytes an image costs: pixel
          dimensions, format, and compression level. A 4000 × 3000 photo
          contains twelve million pixels; displayed at 800 pixels wide on a blog,
          roughly nine out of ten of those pixels are thrown away by the browser
          — yet you still paid to download all of them. Cameras and phones save
          at maximum quality by default, screenshots save as lossless PNG, and
          design tools export at 2x or 3x density. Each default is sensible in
          isolation and wasteful in combination.
        </p>
        <p>
          The good news is that human vision is forgiving. We barely notice the
          difference between 95% and 85% JPEG quality at normal viewing
          distance, and we cannot see pixels that are never displayed. Reducing
          image size without losing quality is therefore not a trick — it is
          the routine removal of data nobody would ever perceive. The workflow
          below does it in the right order so each step compounds the last.
        </p>

        <h2 id="choose-format">2. Step 1 — Choose the right format</h2>
        <p>
          Format choice is the highest-leverage decision you will make, and it
          comes before touching any slider. JPEG is the right answer for
          photographs and anything with smooth gradients: its lossy encoder is
          tuned exactly for that kind of content. PNG is the right answer only
          when you need transparency or pixel-perfect edges — logos, icons,
          interface screenshots with thin text. WebP is the modern all-rounder:
          typically 25–35% smaller than JPEG at matched quality, with
          transparency support included.
        </p>
        <p>
          Concrete rules of thumb: a photo saved as PNG is almost always a
          mistake — converting it to JPEG at 85% quality commonly cuts
          70–90% of the file. A WebP download that an upload form rejects
          should become a JPEG, not a re-screenshotted PNG. And a graphic with
          transparency that must stay transparent should never become a JPEG,
          which has no alpha channel and will flatten everything onto white. If
          you are unsure, convert first and compress second: use the{" "}
          <Link href="/convert-image">image converter</Link>, the{" "}
          <Link href="/convert/png-to-jpg">PNG to JPG converter</Link>, or the{" "}
          <Link href="/convert/jpg-to-webp">JPG to WebP converter</Link> to get
          the format right, then move on.
        </p>

        <h2 id="quality">3. Step 2 — Find the quality sweet spot</h2>
        <p>
          The quality slider controls how aggressively the encoder discards
          detail. At 95–100% you keep nearly everything and save nearly
          nothing; at 60% and below, blocky artifacts and smeared gradients
          become obvious. The useful range is narrower than most people expect:
          start at 85% for JPEG and WebP. Compare the result against the
          original at full zoom — faces, text overlays, sky gradients — and
          only then decide whether to go lower. For hero images and product
          photos, 85–90% is the professional standard. For thumbnails,
          avatars, and decorative images, 75–80% is usually indistinguishable
          in context.
        </p>
        <p>
          Two subtleties matter. First, always compress from the
          highest-quality original you have. Re-compressing an already
          compressed file compounds artifacts: a photo saved at 70%, then
          re-saved at 70%, looks worse than a single pass at the same setting.
          Second, PNG has no quality slider because it is lossless — if a PNG
          is too big, the answer is converting to JPEG or WebP, not hunting
          for a PNG quality option that does not exist. Open the{" "}
          <Link href="/compress-image">compress image tool</Link>, set 85%,
          and judge with your own eyes before touching anything else.
        </p>

        <h2 id="dimensions">4. Step 3 — Resize dimensions to what you actually need</h2>
        <p>
          Pixel dimensions multiply file size. Halving both width and height
          quarters the pixel count, which typically cuts the compressed file to
          a third or less of its original size — often a bigger saving than any
          quality adjustment. Yet most images are far larger than their display
          context: a 4032px phone photo shown at 800px, a 3000px export used as
          a 400px listing thumbnail. Resizing to the display size is pure waste
          removal with zero visible cost, because the extra pixels were never
          rendered in the first place.
        </p>
        <p>
          Pick a target from the destination, not from habit. Blog heroes and
          listing photos rarely need more than 1600–1920px on the long edge;
          CMS content images are happy at 1200px; thumbnails and avatars at
          400–800px. Keep the aspect ratio locked unless you deliberately want
          to crop, and never upscale a small image to hit a target — invented
          pixels add blur, not detail. The{" "}
          <Link href="/resize-image">resize image tool</Link> preserves aspect
          ratio by default and offers presets for common contexts, so match the
          dimensions first and re-check the byte size before deciding whether
          further compression is even needed.
        </p>

        <h2 id="exact-targets">5. Step 4 — Hit exact KB targets for upload forms</h2>
        <p>
          Exam portals, job applications, and government sites do not ask for
          &ldquo;roughly small&rdquo; — they demand under 20KB, 50KB, or 100KB,
          and reject anything over. Guessing with a quality slider wastes
          submissions: too high and the form errors out, too low and your
          scanned signature turns to mush. An exact-target compressor solves
          this by binary-searching quality (and, if needed, gently scaling
          dimensions) until the output lands under the limit at the best
          achievable fidelity.
        </p>
        <p>
          Use the purpose-built pages for the common thresholds:{" "}
          <Link href="/compress-image-to-20kb">compress to 20KB</Link> for exam
          forms and admit cards,{" "}
          <Link href="/compress-image-to-50kb">compress to 50KB</Link> for
          resumes, ID proofs, and signatures, and{" "}
          <Link href="/compress-image-to-100kb">compress to 100KB</Link> for
          marketplace listings and CMS uploads. Start from a clean scan or
          photo, let the tool find the highest quality that fits, then verify
          text legibility at full zoom. If tiny text goes soft at 20KB, rescan
          at higher contrast or crop empty margins first — both give the
          encoder fewer wasted pixels and more budget for the content that
          matters.
        </p>

        <h2 id="mistakes">6. Mistakes that destroy quality</h2>
        <p>
          Most &ldquo;compression ruined my photo&rdquo; stories trace back to
          one of four avoidable errors. The first is compressing the same file
          repeatedly — every lossy pass adds artifacts, so always keep the
          original and export fresh copies. The second is screenshotting
          instead of converting: photographing pixels with an OS screenshot
          tool throws away resolution and bakes in display scaling, where a
          proper <Link href="/convert-image">format conversion</Link> preserves
          every pixel. The third is upscaling: enlarging a 500px image to
          2000px cannot recover detail that was never there, and the blurry
          result compresses poorly too.
        </p>
        <p>
          The fourth mistake is ignoring transparency. Converting a transparent
          PNG or WebP to JPEG flattens the alpha channel onto white — correct
          behavior, but a nasty surprise on a dark-themed site or a logo. Check
          the checkerboard: if the preview shows transparency you rely on,
          convert to WebP or keep PNG instead. Finally, remember that
          re-encoding strips EXIF metadata (camera settings, GPS, orientation).
          That is a privacy win for sharing, but if you need the metadata for
          archival purposes, keep an untouched copy of the original.
        </p>

        <h2 id="workflow">7. The 5-minute workflow, start to finish</h2>
        <p>
          Put it together and the routine takes minutes. First, inspect the
          file: format, dimensions, byte size. Second, convert to the right
          format — JPEG for photos, WebP for web delivery, PNG only for
          transparency. Third, compress at 85% quality and compare against the
          original at full zoom. Fourth, resize to the display size if the
          dimensions exceed it. Fifth, if a form demands an exact limit, run
          the exact-target tool for{" "}
          <Link href="/compress-image-to-20kb">20KB</Link>,{" "}
          <Link href="/compress-image-to-50kb">50KB</Link>, or{" "}
          <Link href="/compress-image-to-100kb">100KB</Link>. Verify faces,
          text, and file size, then ship it.
        </p>
        <p>
          Everything in this workflow runs locally in your browser on{" "}
          {BRAND}: no uploads, no accounts, no watermarks, no per-day limits.
          Your files never leave your device, EXIF data is stripped on export,
          and you can re-run any step as often as you like. Start with the{" "}
          <Link href="/compress-image">compress image tool</Link> for the
          general case, or jump straight to the exact-KB page your form
          demands. Smaller images, same visible quality, five minutes of work.
        </p>
      </article>

      <aside aria-label="Try the tools" className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6 dark:bg-blue-950 dark:border-blue-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Try it now — free, private, no signup</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          <li><Link href="/compress-image" className="font-medium text-blue-700 hover:underline dark:text-blue-400">Compress Image — quality slider or exact KB target →</Link></li>
          <li><Link href="/resize-image" className="font-medium text-blue-700 hover:underline dark:text-blue-400">Resize Image — dimensions &amp; presets →</Link></li>
          <li><Link href="/convert-image" className="font-medium text-blue-700 hover:underline dark:text-blue-400">Convert Image — JPG, PNG &amp; WebP →</Link></li>
        </ul>
      </aside>

      <Faq items={GUIDE_FAQS} />

      <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
        Source: {SITE_URL}
        {canonical("/guides/reduce-image-size-without-losing-quality")}
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOW_TO_JSON_LD) }}
      />
    </div>
  );
}
