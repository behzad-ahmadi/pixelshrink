import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import Resizer from "@/components/Resizer";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Resize Image — Change Pixels for Social & Web",
  description:
    "Resize images to exact pixels with aspect lock & presets for Instagram, YouTube & LinkedIn. Free, private, in-browser.",
  path: "/resize-image",
});

const FAQS = [
  {
    question: "What does locking the aspect ratio do?",
    answer:
      "It preserves your photo's proportions: changing the width automatically recomputes the height (and vice versa) so circles stay circular and faces don't stretch. Unlock it only when you deliberately need a different shape — for example, forcing an image into a banner slot — and expect distortion or plan to crop afterward.",
  },
  {
    question: "Will resizing make my image blurry?",
    answer:
      "Downsizing (more pixels to fewer) with high-quality resampling looks crisp — it can even reduce noise. Upscaling (fewer to more) invents pixels by interpolation, so edges soften; a 2x upscale looks acceptable, beyond that softness becomes obvious. This tool warns you whenever your target exceeds the original dimensions.",
  },
  {
    question: "Which preset should I use for Instagram?",
    answer:
      "Use 1080×1080 for square feed posts, 1080×1350 for portrait posts (maximum feed real estate), and 1080×1920 for Stories and Reels. Instagram recompresses everything, so uploading exactly these dimensions avoids a second destructive resize by their pipeline.",
  },
  {
    question: "What size is a passport photo in pixels?",
    answer:
      "A 2×2 inch passport photo at 300 DPI is 600×600 pixels — which is exactly what the Passport Photo preset produces. Many application portals accept this or nearby sizes; always check whether your specific form wants exact pixels, a size range, or a physical size at a given DPI.",
  },
  {
    question: "Should I resize before or after compressing?",
    answer:
      "Resize first, then compress. Resizing changes the pixel count — the single biggest driver of file size — so doing it first lets the encoder optimize quality for the final canvas. Compressing a 4000-pixel photo and then downsizing wastes the quality budget on pixels nobody will see.",
  },
  {
    question: "Are my images uploaded anywhere?",
    answer:
      "No. Resizing runs entirely in your browser via canvas: pixels are resampled locally and re-encoded on your device. Your photos never touch a server, and EXIF metadata like location is stripped from the output.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Resize Image — PixelShrink",
  url: canonical("/resize-image"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser image resizer with aspect-ratio lock and presets for Instagram, YouTube, LinkedIn, and passport photos.",
};

export default function ResizeImagePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Resize Image" }]} />
      </div>
      <ToolShell
        title="Resize Image Online"
        intro="Change any photo's pixel dimensions with aspect-ratio lock and one-tap presets for Instagram, YouTube, LinkedIn, and passport photos."
        relatedExclude="/resize-image"
        guide={
          <>
            <h2>Pixels, dimensions, and why resizing matters</h2>
            <p>
              An image&apos;s dimensions — its width and height in pixels — determine everything downstream:
              how large it renders, how much it weighs, and whether platforms accept or mangle it. A phone
              photo at 4032 × 3024 carries twelve million pixels; displayed in a 1200-pixel article slot, ten
              of those twelve million are discarded by the browser at render time, yet the visitor still
              downloads all of them. Resizing is the act of matching pixel supply to display demand, and it is
              the highest-leverage optimization in all of image handling. Halving each dimension quarters the
              pixel count, which typically cuts file size by 60–75% before quality settings even enter the
              picture. Nobody resizes because they enjoy the dialog box; they resize because every downstream
              system — upload validators, social pipelines, page-speed scores — rewards images that arrive at
              the right size.
            </p>
            <h2>Aspect ratio: the geometry you must respect</h2>
            <p>
              Aspect ratio is the relationship between width and height, and breaking it is the classic
              resizing failure: faces stretched wide, products squeezed thin, circles turned to ovals. The
              lock in this tool exists to make that failure nearly impossible — with it on, editing one
              dimension recomputes the other from the original proportions, so a 3:2 photo stays 3:2 at any
              size. Turn the lock off only when distortion is acceptable or intended, such as stretching a
              gradient background to fill a banner. When you genuinely need a different shape — a square
              avatar from a landscape photo — the correct operation is cropping, not unlocked resizing: cut
              pixels instead of deforming them. Remember the scaling law too: dimensions scale linearly but
              pixels scale quadratically, so a “slightly bigger” 2x upscale actually asks the resampler to
              invent 75% of the output from thin air. Respect the math and your images stay crisp.
            </p>
            <h2>Platform presets, decoded</h2>
            <p>
              Every platform publishes ideal dimensions, and uploading exactly those dimensions avoids a
              silent second resize by their pipeline — which is always cruder than yours. Instagram feed
              squares want 1080 × 1080; portrait posts get maximum screen space at 1080 × 1350; Stories and
              Reels fill phones at 1080 × 1920. YouTube thumbnails render across devices from 1280 × 720, the
              16:9 HD frame that keeps text legible from phones to TVs. LinkedIn banners span 1584 × 396 — an
              extreme panorama where centered subjects survive cropping on mobile — while link previews use
              1200 × 627. Passport and visa photos standardize on the 2 × 2 inch square, 600 × 600 pixels at
              print resolution. The presets above encode these numbers so you tap once instead of looking them
              up, and each exists because deviating means the platform rescales your work with settings you
              cannot control.
            </p>
            <h2>How to resize an image in four steps</h2>
            <ol>
              <li>
                <strong>Drop your image</strong> into the tool above. Note the original dimensions shown under
                the dropzone — they are your baseline for every decision below.
              </li>
              <li>
                <strong>Tap a preset or type pixels.</strong> Presets fill both fields instantly; custom sizes
                work too, with the aspect lock keeping proportions honest as you type.
              </li>
              <li>
                <strong>Pick format and quality.</strong> JPEG for photos and uploads to third parties, WebP
                for your own site, PNG for graphics with text. Mid-80s quality suits nearly everything.
              </li>
              <li>
                <strong>Resize and inspect.</strong> Open the result at 100%: edges should look clean, text
                legible, and — if you upsized — softness acceptable for the destination size.
              </li>
            </ol>
            <h2>Downsizing vs. upsizing: opposite physics</h2>
            <p>
              Downsizing is generous physics: many source pixels merge into each output pixel, averaging away
              noise and fine grain, which is why a 4000-pixel photo reduced to 1000 pixels often looks
              sharper than a native 1000-pixel shot. High-quality bicubic resampling — what browsers use —
              preserves edge contrast beautifully on the way down, so downsize fearlessly whenever the
              destination is smaller than the source. Upsizing is the reverse: one source pixel must become
              four, and interpolation can only blend neighbors, never recover lost texture. Hair, fabric, and
              distant foliage go waxy; text halos. The practical rule is the 2x rule: upscales up to double
              look fine at normal viewing distances, while 3–4x demands AI upscalers rather than classic
              resampling. When a platform needs bigger than you have, upscale modestly, add slight output
              sharpening if your editor allows, and view at the actual display size — never judge an upscale
              pixel-peeping at 200%.
            </p>
            <h2>Resizing inside a complete image workflow</h2>
            <p>
              Resizing rarely travels alone — it sits between capture and delivery in a chain where order
              matters. The professional sequence is: <Link href="/crop-image">crop first</Link> (remove unwanted content so no pixels are
              wasted), resize second (match the destination dimensions while detail is maximal), sharpen
              third if your editor supports it (resampling softens micro-contrast slightly), and <Link href="/compress-image">compress
              last</Link> (spend the byte budget on the final pixel count). Reversing resize and compress is the
              common amateur error: compressing a giant original discards detail the resizer then averages
              from damaged data. Similarly, resizing the same file repeatedly accumulates generational
              softness — always return to the largest clean source for each new size rather than chaining
              derivatives. Keep masters archived, name outputs by dimension (hero-1920.jpg, thumb-400.jpg),
              and this tool handles the resize-and-encode step for every size in the set.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Resizer />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
