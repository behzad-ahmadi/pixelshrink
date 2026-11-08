import { ARTICLE_NOTES } from "@/lib/article-notes";
import ArticleAccordion from "@/components/ArticleAccordion";
import FirstFoldPromo from "@/components/FirstFoldPromo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/guides";
import { buildMetadata } from "@/lib/site";

export function generateStaticParams() {
  return GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) notFound();
  return buildMetadata({ title: guide.title, description: guide.intro, path: `/guides/${slug}` });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <article className="guide mx-auto max-w-3xl px-4 py-12">
    <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/guides">Image guides</Link></nav>
    <h1>{guide.title}</h1><p>{guide.intro}</p>
    <ArticleAccordion title="Practical example and workflow"><h2>Practical example</h2><p>{guide.example}</p>
    <h2>Workflow and checks</h2><p>{guide.workflow}</p>
    <p><Link href={guide.tool}>Open the matching image tool</Link></p>
    <h2>Before submitting your image</h2><p>Open the downloaded file and confirm its format, dimensions and byte size. Inspect small text and edges at full size. Keep the original so another export does not require recompressing a lossy copy.</p>
    {ARTICLE_NOTES[guide.tool]?.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</ArticleAccordion>
    <h2>Related guides</h2><ul>{GUIDES.filter((item) => item.slug !== slug && item.tool.includes("convert") === guide.tool.includes("convert")).map((item) => <li key={item.slug}><Link href={`/guides/${item.slug}`}>{item.title}</Link></li>)}</ul>
    {["jpg-to-webp-for-websites", "choose-image-format", "image-compression-quality-settings"].includes(slug) && <FirstFoldPromo />}
  </article>;
}
