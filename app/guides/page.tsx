import ArticleAccordion from "@/components/ArticleAccordion";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({ title: "Image editing guides", description: "Learn image compression, resizing, cropping and format conversion with practical examples and upload checks.", path: "/guides" });

export default function GuidesPage() {
  return <div className="guide mx-auto max-w-4xl px-4 py-12">
    <h1>Image editing guides</h1>
    <p>Choose a workflow for your image format, pixel dimensions or upload limit.</p>
    <p><Link href="/guides/reduce-image-size-without-losing-quality">Reduce image size without visible quality loss</Link></p>
    <div className="grid gap-4">
    {GUIDES.map((guide) => <ArticleAccordion key={guide.slug} title={guide.title} id={guide.slug}>
      <p><Link href={`/guides/${guide.slug}`}>Read the full guide</Link></p><p>{guide.intro}</p>
      <p><Link href={guide.tool}>Try the matching image tool</Link></p>
      <p>Next: <Link href="#resize-image-without-stretching">check pixel dimensions</Link>, <Link href="#choose-image-format">choose a compatible format</Link>, or <Link href="#image-compression-quality-settings">adjust compression quality</Link>.</p>
    </ArticleAccordion>)}
    </div>
  </div>;
}
