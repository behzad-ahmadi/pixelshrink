import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Compressor from "@/components/Compressor";
import Faq from "@/components/Faq";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Compress Image to 50KB — Resume & ID Uploads",
  description:
    "Hit a 50KB upload limit for resumes, ID proofs & signatures. Free exact-size compression that runs privately in-browser.",
  path: "/compress-image-to-50kb",
});

const FAQS = [
  {
    question: "What kinds of uploads require 50KB?",
    answer:
      "Job portals, scholarship applications, and identity-verification flows commonly cap resume photos, ID scans, and signatures at 50KB. It is large enough for a recognizable 800×800 portrait at decent quality, yet small enough to keep application databases fast. If your portal says 50KB, this locked target mode guarantees the output fits.",
  },
  {
    question: "How does the exact 50KB targeting work?",
    answer:
      "The engine binary searches JPEG/WebP encoder quality across seven rounds to find the highest quality whose output fits in 51,200 bytes. Only if the lowest usable quality still overflows does it scale dimensions down in 12% steps and search again. Most photos hit 50KB at full resolution with quality to spare.",
  },
  {
    question: "Will my resume photo still look professional at 50KB?",
    answer:
      "Yes. 50KB buys roughly 500,000–800,000 pixels at good quality — an 800×800 headshot, for example. At LinkedIn display sizes (a few hundred pixels), the compression is essentially invisible. Keep the original framing tight and well-lit, and the compressed version will look sharp.",
  },
  {
    question: "JPEG, PNG, or WebP for job portals?",
    answer:
      "Always JPEG for third-party portals, HR systems, and government sites — they universally accept .jpg and frequently reject anything else. WebP is technically smaller, but compatibility beats efficiency when someone else's software parses your file. Reserve WebP for assets on websites you control.",
  },
  {
    question: "Can I compress a scanned PDF or document photo to 50KB?",
    answer:
      "Yes — photograph or export the page as an image, crop tightly to the document edges so no desk or background wastes bytes, then run the 50KB target. For text documents, keep contrast high and avoid shadows; JPEG artifacts attack small text first, so inspect the fine print at full zoom before submitting.",
  },
  {
    question: "Do my files get uploaded anywhere?",
    answer:
      "No. Decoding, compression, and re-encoding all run locally in your browser tab. Your resume photo and ID scans never travel over the network, and the output is stripped of EXIF metadata like GPS coordinates — safer to share than the original.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compress Image to 50KB — PixelShrink",
  url: canonical("/compress-image-to-50kb"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser tool that fits any image under an exact 50KB budget for resumes, ID proofs, and signatures.",
};

export default function CompressTo50KBPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compress Image", href: "/compress-image" }, { label: "Compress to 50KB" }]} />
      </div>
      <ToolShell
        title="Compress Image to 50KB"
        intro="Hit a 50KB upload limit for resumes, ID proofs, and signatures. The engine finds the highest quality that fits — free and fully private."
        relatedExclude="/compress-image-to-50kb"
        guide={
          <>
            <h2>The 50KB limit: where job applications live or die</h2>
            <p>
              Fifty kilobytes is the unofficial standard of the application economy. Job portals, scholarship
              boards, background-verification vendors, and university admissions systems converged on it
              because it sits at a humane equilibrium: small enough that a million applicants&apos; photos fit
              in fifty gigabytes of database storage, large enough that a headshot still looks like the
              person. Understanding that equilibrium changes how you approach the limit. Unlike the brutal
              20KB tier, 50KB does not demand sacrifice — a well-framed 800 × 800 portrait compresses to
              50KB at quality levels where artifacts are invisible on any screen that will display it. The
              applicants who struggle at 50KB are almost never fighting the limit itself; they are fighting
              avoidable waste — uncropped backgrounds, multi-megapixel sources uploaded raw, or PNG screenshots
              where JPEG belongs. Fix the waste and the limit becomes generous.
            </p>
            <h2>Anatomy of a perfect resume photo at 50KB</h2>
            <p>
              Recruiters spend seconds on each photo, and compression artifacts register subconsciously as
              carelessness — blocky skin or ringing around your collar reads as a bad scan even when the
              hiring manager cannot name the cause. The defense starts before compression. Shoot against a
              plain light background in soft daylight, frame head-and-shoulders with the face filling a third
              of the frame, and keep the camera at eye level. Export or crop to roughly 600–800 pixels square:
              larger only wastes the byte budget on pixels LinkedIn and applicant-tracking systems will
              downsample anyway. Then run the 50KB target in JPEG mode. The engine will typically land in the
              75–88% quality band, where a portrait is visually indistinguishable from the original at display
              size. Inspect the result at 100% zoom focusing on eyes, teeth, and fabric texture — if those
              survive, the photo is submission-ready. Save the compressed copy with a clear filename like
              firstname-lastname-photo.jpg so it is unmistakable in your uploads folder.
            </p>
            <h2>ID proofs and document scans: text is the enemy of bytes</h2>
            <p>
              Photographs of PAN cards, driver&apos;s licenses, passports, and certificates behave very
              differently from portraits under compression. Smooth photo regions shrink happily, but tiny
              printed text, guilloche patterns, holograms, and card edges are high-frequency chaos that
              devours bytes. A tilted phone photo of an ID on a wooden desk is the worst of all worlds: the
              encoder spends your 50KB describing wood grain and shadows instead of the document. The fix is
              physical, not digital. Place the document on a flat dark contrasting surface, light it evenly
              from both sides to kill shadows, hold the phone parallel to the surface, and fill the frame —
              the card should occupy 80%+ of the pixels. Crop to the card edges before compressing. These
              steps routinely cut the required bytes in half, which the target engine converts directly into
              higher text legibility at the same 50KB. After compressing, zoom to the smallest print — card
              numbers, expiry dates, microtext — and confirm every character is unambiguous. A verifier who
              cannot read your ID number rejects the upload regardless of its byte count.
            </p>
            <h2>Why JPEG wins every portal submission</h2>
            <p>
              It is tempting to reach for WebP or PNG at 50KB, since both can be excellent formats. Resist it
              for anything another organization ingests. Applicant-tracking systems, university portals, and
              verification APIs were built over decades around JPEG assumptions: file sniffers that check
              magic bytes, image pipelines that call decade-old decode libraries, and validation rules
              written as “extension must be .jpg.” A WebP file, however superior technically, fails these
              checks and produces the most maddening rejection of all — a file that is valid, small, and
              beautiful, refused for its container. PNG passes validation but wastes the budget: a lossless
              photo scan at 50KB must be tiny in dimensions to fit, while the same budget as JPEG buys triple
              the pixels. The hierarchy is clear: JPEG for submissions, WebP for your own site, PNG only for
              graphics with transparency or razor text that JPEG would smear.
            </p>
            <h2>Batch strategy for multi-document applications</h2>
            <p>
              Real applications rarely need one file — a typical packet is a photo, a signature, and two or
              three ID proofs, each with its own 50KB cap. Work through them as an assembly line rather than
              one-offs. First, gather all sources at full quality in one folder. Second, crop each to content
              — faces tight, documents edge-to-edge, signatures margin-free — before compressing anything,
              because cropping is the highest-leverage step and it is easier to do consistently in one pass.
              Third, run each through the 50KB target and rename outputs systematically: photo-50kb.jpg,
              signature-50kb.jpg, pan-front-50kb.jpg. Fourth, verify every file twice: size under the cap in
              your file manager, and legibility at full zoom. Finally, keep the whole packet in one folder
              with the application reference number until the process concludes — portals lose files, ask for
              re-uploads, and question submissions months later. A disciplined packet turns a stressful
              multi-upload form into ten calm minutes.
            </p>
            <h2>When 50KB is not the right target</h2>
            <p>
              Not every “compress to 50KB” search means 50KB is correct. If the portal states a range like
              “20KB–50KB,” aim for the middle, not the ceiling — a 35KB file clears validation with margin
              against kilobyte-rounding quirks. If the portal caps dimensions too (say 413 × 531 pixels),
              resize to those dimensions first; compressing a 3000-pixel photo to 50KB and hoping the portal
              downsamples it is how applicants end up rejected on technicalities. If the upload is a
              full-page resume PDF rendered as an image, reconsider: text documents often stay sharper as
              actual PDFs or as PNG at modest dimensions, since JPEG artifacts attack letterforms first. And
              if quality inspection ever shows mushy text at 50KB, the answer is a tighter crop or a cleaner
              source photo — never a different compressor. The math of 50KB is fixed; the only variables are
              how many pixels you ask it to describe and how much noise you leave in the frame.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Compressor defaultMode="target" defaultTargetKB={50} lockTargetKB />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
