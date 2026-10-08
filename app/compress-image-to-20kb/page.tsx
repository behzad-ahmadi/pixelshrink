import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Compressor from "@/components/Compressor";
import Faq from "@/components/Faq";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Compress Image to 20KB Online — Exact Size",
  description:
    "Shrink any photo under 20KB for exam forms & portals. Exact binary-search compression, free & private in your browser.",
  path: "/compress-image-to-20kb",
});

const FAQS = [
  {
    question: "How can a photo possibly fit in 20KB?",
    answer:
      "By combining both levers of compression: encoder quality is binary-searched down to the highest value that fits, and if quality alone cannot get there, dimensions are progressively scaled down (each step multiplies width and height by 0.88) until the budget is met. A 600×600 portrait at moderate JPEG quality lands comfortably under 20KB.",
  },
  {
    question: "Will a 20KB photo still be accepted by exam portals?",
    answer:
      "Yes, provided the portal's limit is 20KB and it accepts JPEG — which is what this tool outputs by default. Portals check file size and dimensions, not visual quality. Keep the output at the portal's required dimensions (often around 200×230 px or 3.5×4.5 cm at low DPI) and verify the downloaded file reads under 20KB before uploading.",
  },
  {
    question: "Should I use JPEG or WebP for a 20KB target?",
    answer:
      "Use JPEG for any official form, government portal, or exam application — they almost always require .jpg and may reject WebP outright. WebP compresses smaller at tiny sizes, so it is the better choice only when you control the destination, such as your own site's thumbnails or avatars.",
  },
  {
    question: "Why does the tool shrink my photo's dimensions?",
    answer:
      "There is a floor to how small any given pixel count can compress: random photographic detail simply needs bytes. When seven rounds of quality binary search cannot hit 20KB at full size, reducing dimensions is the only remaining lever. The tool does this in gentle 12% steps so it keeps as much resolution as the budget allows.",
  },
  {
    question: "My signature turned to mush at 20KB. What helps?",
    answer:
      "Signatures are thin dark lines on white — JPEG's worst case at low quality. Scan or photograph the signature at high resolution first, crop tightly to remove empty paper margins (fewer white pixels means fewer wasted bytes), and keep it black-on-white rather than blue ink. Cropping margins alone often halves the size.",
  },
  {
    question: "Is it safe to upload ID photos to this tool?",
    answer:
      "Nothing is uploaded at all — the entire compression runs in your browser tab via canvas and file APIs. Your passport photo never leaves your device, and re-encoding strips EXIF metadata like GPS coordinates from the output file as a side benefit.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compress Image to 20KB — PixelShrink",
  url: canonical("/compress-image-to-20kb"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser tool that forces any image under an exact 20KB budget using quality binary search plus dimension scaling.",
};

export default function CompressTo20KBPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compress Image", href: "/compress-image" }, { label: "Compress to 20KB" }]} />
      </div>
      <ToolShell
        title="Compress Image to 20KB"
        intro="Force any photo under a strict 20KB limit for exam forms, application portals, and eKYC uploads. Exact-size engine, private and free."
        relatedExclude="/compress-image-to-20kb"
        guide={
          <>
            <h2>Why 20KB is the hardest common upload limit</h2>
            <p>
              Twenty kilobytes is where casual compression stops working. A modern phone photo opens at three
              to six megabytes, so reaching 20KB means discarding over 99% of the bytes — roughly a 200-to-1
              reduction. No quality slider alone bridges that gap without turning faces into watercolor, which
              is why applicants so often bounce between a photo that looks fine at 80KB and an unrecognizable
              smear at 15KB. Government and exam portals impose these limits for good infrastructure reasons:
              millions of applicants uploading multi-megabyte scans would drown their servers and make
              verification queues crawl. The limit is a forcing function, and the correct response is not to
              drag quality to zero but to attack both levers — quality and dimensions — in a controlled,
              measurable way. That is exactly what the exact-target engine above does: it binary searches
              seven quality levels at full resolution first, preserving every pixel it can, and only then
              spends resolution, in gentle 12% steps, to close the remaining gap.
            </p>
            <h2>The exam-form photo workflow that actually works</h2>
            <p>
              Start from the largest, cleanest source you have — a fresh photograph beats a WhatsApp forward
              that has already been compressed twice. Frame the shot correctly before you compress: most
              Indian exam and government forms specify a recent passport-style photograph around 3.5 × 4.5 cm
              with the face occupying most of the frame, plus a signature in black ink on white paper. Crop
              away everything that is not required — wide margins of wall, desk, or blank paper consume bytes
              without helping verification. A tightly cropped 600 × 700 portrait carries less than half the
              pixels of the loose original, which means the encoder can spend twice the bits per pixel at the
              same file size. Then drop the cropped file into the tool above, confirm JPEG output, and
              download. Check two things before uploading to the portal: the file size reads under 20KB in
              your file manager, and the face is still recognizable at full zoom. If it is not, the source —
              not the compressor — is usually at fault.
            </p>
            <h2>Understanding the dimensions behind the limit</h2>
            <p>
              File size and pixel dimensions are linked by information density, and tiny budgets demand modest
              dimensions. As a rule of thumb, a clean JPEG portrait holds acceptable quality at roughly 0.05
              to 0.1 bytes per pixel for verification purposes. At 20KB (about 20,480 bytes), that budget buys
              roughly 200,000–400,000 pixels — a 500 × 500 to 640 × 640 image. Portals know this, which is why
              their photo specifications cluster around 200 × 230 pixels minimums: they are asking for exactly
              what fits. Do not fight this by upscaling a small image first; invented pixels compress poorly
              and verification software gains nothing from them. Conversely, do not upload a 3000-pixel photo
              and hope the portal downsamples gracefully — many portals reject oversized dimensions outright
              or scale them with crude algorithms that look worse than a deliberate reduction. Match the
              portal&apos;s stated pixel range, then let the target engine tune quality to fit the bytes.
            </p>
            <h2>Signatures: the special hell of 20KB</h2>
            <p>
              Photographs compress relatively well because skin and backgrounds are smooth gradients. Ink
              signatures are the opposite: razor-thin high-contrast strokes surrounded by vast white paper,
              which is close to JPEG&apos;s worst case. Three techniques rescue them. First, capture at high
              resolution and crop brutally tight — every millimeter of empty margin is bytes spent on nothing,
              and signatures typically ship with enormous margins. Second, sign with a thick black marker
              rather than a ballpoint: bolder strokes survive quantization, while hairline blue strokes
              dissolve into gray ghosts. Third, keep the signature strictly black on white; colored paper,
              ruled lines, or shadows force the encoder to spend bits describing background texture instead
              of your strokes. If the portal allows it, a PNG of a tight black-and-white signature can
              sometimes beat JPEG at these sizes, since flat white compresses losslessly to almost nothing —
              but default to JPEG unless the portal says otherwise.
            </p>
            <h2>The DPI myth that wastes applicants&apos; time</h2>
            <p>
              Countless forum threads advise changing an image to “200 DPI” to shrink it, which reflects a
              misunderstanding worth killing: DPI metadata does not change a single pixel or byte of image
              data. Dots-per-inch is merely a printing hint stored in the file header — a 600 × 600 image at
              72 DPI and the same image at 300 DPI are byte-identical apart from one header number. Web
              portals ignore DPI entirely; they measure pixels and bytes. What actually matters is pixel
              dimensions and encoder quality, both of which you control directly in this workflow. Any time a
              guide tells you to adjust DPI for an online upload, it is confusing print preparation with web
              preparation. Ignore it, crop your pixels, set your target, and move on with your application.
            </p>
            <h2>Troubleshooting portal rejections</h2>
            <p>
              When a portal rejects your file, the fix is usually format or dimensions rather than size. “File
              type not supported” means the extension or MIME sniffing failed — ensure the download ends in
              .jpg and re-upload exactly that file rather than a renamed copy. “Dimensions invalid” means you
              missed the portal&apos;s pixel window; resize first, then re-run the 20KB target so quality is
              optimized for the final canvas. “File too large” on a file that reads under 20KB locally is
              almost always a kilobytes-vs-kibibytes rounding difference — regenerate with a small safety
              margin by aiming slightly under, or simply re-run the tool, since the engine targets exact bytes
              with headroom. And if the preview looks acceptable but the portal&apos;s own preview looks
              terrible, that is the portal&apos;s renderer, not your file; every applicant&apos;s photo gets
              the same treatment. Keep a copy of each submitted file with the application number — if
              verification questions arise months later, you will want to show exactly what you uploaded.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Compressor defaultMode="target" defaultTargetKB={20} lockTargetKB />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
