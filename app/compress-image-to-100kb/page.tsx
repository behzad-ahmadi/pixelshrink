import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Compressor from "@/components/Compressor";
import Faq from "@/components/Faq";
import ToolShell from "@/components/ToolShell";
import { buildMetadata, canonical } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Compress Image to 100KB for Web & Listings",
  description:
    "Get images under 100KB for marketplaces, CMS & classifieds. Free exact-size compression, private and in-browser.",
  path: "/compress-image-to-100kb",
});

const FAQS = [
  {
    question: "Why do marketplaces and CMS platforms cap uploads at 100KB?",
    answer:
      "Product listing pages often render dozens of images, so platforms cap each file to keep pages fast on mobile networks. A 100KB budget per image keeps a 20-product grid under a few megabytes total. Files over the cap are either rejected or recompressed by the platform's own crude pipeline — compressing yourself first preserves quality control.",
  },
  {
    question: "How is compressing to 100KB different from 20KB or 50KB?",
    answer:
      "At 100KB the budget is generous: most photos fit at full resolution with quality in the 80s, so dimensions rarely need to shrink. The engine still binary searches quality first and only scales down as a last resort, but for typical web photos the last resort never triggers. Expect results that look identical to the original.",
  },
  {
    question: "Should sellers use JPEG or WebP for listings?",
    answer:
      "Compress to whatever the marketplace accepts — most require JPEG, so JPEG it is. For your own store or CMS where you control the stack, WebP at 100KB buys noticeably more pixels or quality than JPEG, and AVIF goes further still. Always check the platform's accepted-formats list before uploading.",
  },
  {
    question: "Will compression hurt my product photo conversions?",
    answer:
      "Not if done right — and it likely helps, because faster-loading listings rank and convert better. The danger is over-compression: blocky fabric texture or ringing around product edges reads as low quality. At 100KB with a clean source you keep full detail, so verify at full zoom and prioritize sharp, well-lit originals.",
  },
  {
    question: "Can I batch-compress a whole catalog to 100KB?",
    answer:
      "Yes — drop up to 10 images into the tool above and each is compressed to 100KB in turn, keeping filenames consistent like sku-1234-main.jpg. With 2 or more done, a Download-all-as-ZIP button appears. For very large catalogs, standardize dimensions first (e.g. 1600×1600 for square listings) so every output is uniform.",
  },
  {
    question: "Are my product photos uploaded to a server?",
    answer:
      "No. This tool decodes, compresses, and re-encodes entirely in your browser — unreleased products and supplier photos never leave your machine. Re-encoding also strips EXIF metadata such as GPS coordinates, which is good hygiene before publishing supplier-provided images.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compress Image to 100KB — PixelShrink",
  url: canonical("/compress-image-to-100kb"),
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  description:
    "Free in-browser tool that fits any image under an exact 100KB budget for marketplaces, classifieds, and CMS uploads.",
};

export default function CompressTo100KBPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compress Image", href: "/compress-image" }, { label: "Compress to 100KB" }]} />
      </div>
      <ToolShell
        title="Compress Image to 100KB"
        intro="Get product photos and web images under a 100KB cap for marketplaces, classifieds, and CMS uploads — full quality preserved, free and private."
        relatedExclude="/compress-image-to-100kb"
        guide={
          <>
            <h2>100KB: the commerce tier of image compression</h2>
            <p>
              Where 20KB serves bureaucracy and 50KB serves applications, 100KB serves commerce. Marketplace
              listings, classified ads, real-estate portals, and CMS featured images cluster around this cap
              because it matches how selling works online: buyers scroll grids of thumbnails on phones, tap
              the promising ones, and expect the detail view to load instantly. A 100KB budget per image lets
              a category page with thirty products weigh roughly three megabytes of imagery — heavy but
              tolerable on 4G, and exactly why platforms enforce per-image caps rather than trusting sellers
              to optimize. The good news for sellers is that 100KB is a comfortable budget rather than a
              punishment. A 1600-pixel product photo at JPEG 82% typically lands between 150 and 250KB, so
              reaching 100KB costs only a few quality points or a modest dimension trim — changes no buyer
              will ever perceive on a phone screen.
            </p>
            <h2>Why you should compress before the platform does</h2>
            <p>
              Every major marketplace recompresses your uploads into thumbnails, zooms, and CDN variants — and
              their pipelines optimize for throughput, not your product. When you upload a 4MB original, the
              platform&apos;s batch encoder applies one-size-fits-all settings: fixed quality, fixed
              sharpening, sometimes a decade-old encoder. The result is generational loss — your camera&apos;s
              JPEG artifacts plus the platform&apos;s recompression artifacts, stacked. Compressing to a
              clean 100KB yourself flips the dynamic. You choose the quality-detail trade-off per image,
              inspect the result, and hand the platform a file already near its target size, which its
              pipeline then handles gently. Sellers who control their own compression consistently show
              crisper zoom views than sellers who dump originals and hope. The ten seconds per image is among
              the highest-ROI work in listing optimization.
            </p>
            <h2>The product-photo pipeline: shoot, standardize, compress</h2>
            <p>
              Professional catalog quality comes from standardizing before compressing. Step one is capture:
              diffuse daylight or a softbox, a neutral sweep background, and the product filling 75% of the
              frame — every background pixel is budget spent on nothing. Step two is dimensions: pick one
              canvas for the catalog (1600 × 1600 square for marketplaces, 1920 × 1080 for editorial) and
              resize every image to it, so listings look uniform and the byte budget buys identical detail
              everywhere. Step three is cleanup at full size — dust spots, stray threads, sensor dust — since
              flaws compress into permanent-looking smudges. Step four is the 100KB target run in JPEG for
              marketplaces or WebP for your own store. Step five is the zoom test: open the output at 100%
              and check fabric weave, stitching, serial numbers, and reflective highlights. If micro-detail
              matters for your category — jewelry, watches, sneakers — and 100KB softens it, crop the hero
              tighter rather than raising the budget; a closer view at the same bytes shows more.
            </p>
            <h2>Page speed is a ranking factor, not a nicety</h2>
            <p>
              Search engines measure how fast your images load and fold it into rankings through Core Web
              Vitals, principally Largest Contentful Paint — usually a hero or product image. Each unoptimized
              megabyte of imagery delays that paint by a second or more on mid-range phones, and the data on
              bounces is unforgiving: conversion probability drops steeply with every extra second of load.
              A catalog compressed to 100KB per image, served in WebP with explicit width and height
              attributes, routinely cuts image payload by 70–85% versus camera originals — often the single
              largest performance improvement a store can make, bigger than script optimization or caching
              tweaks. Beyond rankings, there is money: shoppers on metered connections abandon image-heavy
              pages that burn their data, and marketplaces quietly boost listings with fast-loading media in
              internal search. Compression is marketing spend with a permanent return.
            </p>
            <h2>Format strategy for sellers and publishers</h2>
            <p>
              The format decision splits cleanly by destination. Marketplaces (Amazon, eBay, Etsy, property
              portals, classifieds) dictate JPEG in their seller guides — follow them exactly, since
              non-conforming uploads risk silent rejection or mangling. Your own website is a different game:
              serve WebP (or AVIF for the adventurous) at the same visual quality for 25–40% fewer bytes,
              which compounds across every listing view. A practical dual workflow covers both: keep a master
              archive at full quality, export JPEG-at-100KB for marketplace listings, and export WebP for
              your storefront from the same master. Never chain conversions — each JPEG generation loses
              detail, so always compress from the master rather than re-compressing a previous output. And
              keep transparency needs in mind: product cutouts on transparent backgrounds must be PNG or
              WebP, since JPEG has no alpha channel; budget extra pixels accordingly because transparency
              edges compress poorly.
            </p>
            <h2>Troubleshooting listing rejections and ugly renders</h2>
            <p>
              When a marketplace rejects a 100KB file, suspect metadata first: verify the extension is .jpg,
              the color space is sRGB (Adobe RGB exports confuse some pipelines into dull, shifted colors),
              and dimensions meet the platform&apos;s minimums — many require 1000+ pixels on the longest
              side for zoom to activate. If the listing preview looks worse than your file, compare the
              platform&apos;s rendered variant against your upload; some platforms apply aggressive sharpening
              that turns clean compression into crunchy halos, in which case uploading a slightly softer file
              paradoxically renders better. White-background requirements deserve special attention: shoot
              true white (RGB 255) rather than near-white, because off-white backgrounds compress into
              visible blotches and fail automated background checks. Finally, keep every submitted file
              archived by SKU — when a marketplace flags an old listing&apos;s imagery, re-uploading the
              exact approved file beats regenerating and hoping the pipeline agrees twice.
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Compressor defaultMode="target" defaultTargetKB={100} lockTargetKB />
      </ToolShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
