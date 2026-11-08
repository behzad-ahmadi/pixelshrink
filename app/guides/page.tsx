import ArticleAccordion from "@/components/ArticleAccordion";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({ title: "Image editing guides", description: "Learn image compression, resizing, cropping and format conversion with practical examples and upload checks.", path: "/guides" });

export default function GuidesPage() {
  return <div className="guide mx-auto max-w-4xl px-4 py-12">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <h1>Image editing guides</h1>
    <p>Choose a workflow for your image format, pixel dimensions or upload limit.</p>
    <p><Link href="/guides/reduce-image-size-without-losing-quality">Reduce image size without visible quality loss</Link></p>
    <div className="grid gap-4">
      <ArticleAccordion title="Where should you start with an image that will not upload?" id="image-upload-troubleshooting">
        <p>An error that says &ldquo;file too large&rdquo; usually points to bytes, while a request for width and height points to pixels. Check both before editing.</p>
        <ul>
          <li>If the shape is wrong, <Link href="/guides/crop-image-aspect-ratio">crop to the required aspect ratio</Link>.</li>
          <li>If the dimensions are too large, <Link href="/guides/resize-image-without-stretching">resize without stretching</Link>.</li>
          <li>If the file still exceeds the limit, <Link href="/guides/resize-and-compress-images">compress the finished image</Link>.</li>
          <li>If the file will not open or its format is rejected, <Link href="/guides/choose-image-format">choose a compatible format</Link> before converting.</li>
        </ul>
        <p>Keep the original and check the downloaded copy before you submit it. You do not need to use every tool for every picture.</p>
      </ArticleAccordion>
    {GUIDES.map((guide) => <ArticleAccordion key={guide.slug} title={guide.title} id={guide.slug}>
      <p><Link href={`/guides/${guide.slug}`}>Read the full guide</Link></p><p>{guide.intro}</p>
      <p><Link href={guide.tool}>Try the matching image tool</Link></p>
      <p>Next: <Link href="#resize-image-without-stretching">check pixel dimensions</Link>, <Link href="#choose-image-format">choose a compatible format</Link>, or <Link href="#image-compression-quality-settings">adjust compression quality</Link>.</p>
    </ArticleAccordion>)}
    </div>
  </div>;
}
