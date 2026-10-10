import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Cropper from "@/components/Cropper";
import Faq from "@/components/Faq";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Crop Image Online — Free 1:1, 4:3, 16:9 Cropper",
  description:
    "Crop photos to 1:1, 4:3, 16:9 or free select with live preview. Free, private in-browser cropping, no upload.",
  path: "/crop-image",
});

const FAQS = [
  {
    question: "How do I crop an image with this tool?",
    answer:
      "Drop your photo in, then drag directly on the image to draw your selection box — drag inside the box to move it. Pick a ratio preset (1:1, 4:3, 3:2, 16:9) to constrain the shape or leave Free for any rectangle. Fine-tune with the sliders, watch the live preview, then download the exact pixels you selected.",
  },
  {
    question: "Which aspect ratio should I choose?",
    answer:
      "1:1 for profile pictures, Instagram posts, and passport-style crops. 4:3 for a classic photo look and many form uploads. 3:2 matches DSLR output and prints beautifully at 6×4 inches. 16:9 for YouTube thumbnails, presentation slides, and desktop wallpapers. Free when the destination has its own unusual shape and you are eyeballing the composition.",
  },
  {
    question: "Does cropping reduce image quality?",
    answer:
      "Cropping itself is lossless — it keeps the selected pixels exactly as they were. Quality only changes at export when JPEG or WebP re-encodes the crop; at 90%+ quality that re-encode is visually transparent. PNG export is fully lossless. The main effect is resolution: a tight crop has fewer pixels, so don't crop a tiny area and expect a large sharp print.",
  },
  {
    question: "Can I crop a passport or ID photo here?",
    answer:
      "Yes. Select the 1:1 ratio, frame the face per your form's guidance (usually face occupying most of the frame, plain background), and download. For strict portals, follow cropping with the resize tool to hit exact pixel requirements like 600×600, then compress to the required KB cap.",
  },
  {
    question: "What's the difference between cropping and resizing?",
    answer:
      "Cropping removes pixels — it cuts content away and changes what the image shows. Resizing keeps all content but changes pixel dimensions by resampling. Crop when the framing is wrong (too much background, wrong shape); resize when the framing is right but the pixel size is wrong for the destination.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. Selection, preview rendering, and export all happen locally in your browser via canvas. Your photos never leave your device, and exported files are stripped of EXIF metadata like GPS location.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Crop Image — PixelShrink",
  url: canonical("/crop-image"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser image cropper with 1:1, 4:3, 3:2, 16:9 and free aspect modes plus live canvas preview.",
};

export default function CropImagePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Crop Image" }]} />
      </div>
      <ToolShell
        title="Crop Image Online"
        intro="Cut photos to 1:1, 4:3, 16:9, or any free selection with a live preview. Drag, frame, download — free and fully private."
        relatedExclude="/crop-image"
        guide={
          <>
            <h2>Cropping is composition, not correction</h2>
            <p>
              Beginners treat cropping as damage control — salvaging a tilted horizon or an accidental
              photobomber. Professionals treat it as the second shutter press: the moment an image&apos;s
              composition is truly decided. The distinction matters because the crop defines what viewers feel
              before they notice any detail. A loose frame with the subject centered and acres of margin
              reads as a snapshot; the same photo cropped so the subject&apos;s gaze leads into negative
              space reads as a portrait. Aspect ratio is part of that language: squares feel stable and
              iconic, 4:3 feels documentary and honest, 16:9 feels cinematic and sweeping. Choosing the ratio
              before dragging the box — rather than dragging freely and hoping — gives every crop intent. The
              tool above encourages exactly that: lock a ratio, then move and size the frame until the
              composition clicks in the live preview.
            </p>
            <h2>The five ratios and where each belongs</h2>
            <p>
              Each preset in the cropper maps to real destinations. The 1:1 square rules avatars, profile
              photos, Instagram posts, album art, and passport-style crops — anywhere a circle or square
              mask will cut the corners, so keep faces and key subjects clear of the edges. The 4:3
              rectangle is the classic photographic frame: compact-camera heritage, presentation-friendly,
              and the shape many upload forms expect. The 3:2 ratio is the full-frame DSLR native shape and
              the print world&apos;s favorite, mapping perfectly to 6 × 4 inch prints with no trimming. The
              16:9 widescreen dominates video thumbnails, slide decks, hero banners, and wallpapers — frames
              where horizontal sweep carries the message. And Free mode covers everything bespoke: marketplace
              image slots with odd ratios, banner crops, or artistic compositions that no standard fits. When
              a destination names dimensions (1080 × 1350, say), crop to the ratio first and <Link href="/resize-image">resize to the
              pixels</Link> after — ratio from the cropper, pixels from the resizer, bytes from the <Link href="/compress-image">compressor</Link>.
            </p>
            <h2>How to crop an image in four steps</h2>
            <ol>
              <li>
                <strong>Drop your photo</strong> into the cropper above. It appears with a default selection
                covering most of the frame.
              </li>
              <li>
                <strong>Choose a ratio.</strong> Tap 1:1, 4:3, 3:2, or 16:9 to constrain the box — height then
                follows width automatically — or stay on Free for any shape.
              </li>
              <li>
                <strong>Drag to frame.</strong> Drag on empty areas to draw a new box, drag inside it to move
                it, and use the sliders for pixel-level nudges while watching the live preview.
              </li>
              <li>
                <strong>Export deliberately.</strong> Pick JPEG for photos, PNG for graphics with text, set
                quality in the 90s for archival crops, and download the exact selected pixels.
              </li>
            </ol>
            <h2>Composition rules worth internalizing</h2>
            <p>
              Three principles elevate crops instantly. First, the rule of thirds: imagine the frame divided
              into nine equal cells and place points of interest — eyes, horizons, products — on the
              intersections rather than dead center. Centered subjects feel static; off-center subjects feel
              dynamic. Second, lead room: give moving subjects, gazes, and faces space to “look into” —
              cropping tight ahead of a runner or stare creates claustrophobic tension, while space ahead
              feels natural. Third, edge discipline: scan all four borders before exporting and mercilessly
              exclude half-faces at parties, bright trash at landscapes&apos; edges, and intruding fingers —
              anything touching the frame edge pulls the eye disproportionately. A corollary for people:
              crop between joints, never through them — mid-forearm and mid-thigh crops look natural, while
              slices through wrists, knees, or foreheads read as amputation. These rules are made to be
              broken, but break them deliberately, having seen what the obedient version looks like in the
              preview first.
            </p>
            <h2>Cropping for documents and official photos</h2>
            <p>
              Utilitarian cropping follows different laws than artistic cropping: the goal is compliance, not
              beauty. For ID and application photos, the form&apos;s specification is the composition brief —
              face height as a fraction of the frame, plain light background, no shadows or reflections on
              glasses. Crop tight enough that the verifier&apos;s software finds the face instantly, but never
              so tight that ears or chin touch the border, since some validators reject edge-touching faces.
              For document scans photographed on desks, crop edge-to-edge on the paper: every pixel of desk,
              keyboard, or shadow included in the frame is bytes stolen from text legibility after
              compression, and skewed perspective should be fixed by re-shooting parallel rather than by
              diagonal cropping. Signatures deserve the tightest crops of all — margins of blank paper around
              ink are pure waste at strict KB caps, so shave them to a hairline. In all three cases, crop
              before resizing and compressing: the downstream steps can only spend bytes on pixels you give
              them, so give them nothing but signal.
            </p>
            <h2>Crop order in the full editing chain</h2>
            <p>
              Cropping first is the unanimous professional recommendation, and the reasoning is arithmetic.
              Every edit downstream — resize resampling, sharpening, compression — processes each pixel it is
              given; pixels you will eventually cut consume quality budget and computation for nothing. Crop
              first and the resizer works from clean full-detail survivors, the sharpener enhances content
              that remains, and the compressor spends every byte on the final composition. The reverse order
              visibly degrades results: compress-then-crop bakes artifacts into the survivors, and
              resize-then-crop resamples pixels destined for the bin. One caution: cropping is destructive to
              the working copy, so keep the uncropped original archived. Re-cropping a previous crop for a
              new ratio (square avatar today, widescreen banner tomorrow) compounds pixel losses — return to
              the master each time, frame fresh for each destination, and every derivative starts life at
              maximum quality.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Cropper />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
