import Link from "next/link";
import ArticleAccordion from "@/components/ArticleAccordion";
import { GUIDES } from "@/lib/guides";
import { ARTICLE_NOTES } from "@/lib/article-notes";

/** Add another guide with the same tool path to extend a page's reading list. */
export default function PageArticles({ path }: { path: string }) {
  const guides = GUIDES.filter((guide) => guide.tool === path);
  if (!guides.length) return null;
  return <section aria-label="Articles and practical advice" className="mt-10 space-y-3">
    <h2 className="text-xl font-bold">Articles and practical advice</h2>
    <p className="text-sm text-slate-600 dark:text-slate-300">Open a topic when you need a little more guidance.</p>
    {guides.map((guide) => <ArticleAccordion key={guide.slug} title={guide.title} id={`article-${guide.slug}`}>
      <p>{guide.intro}</p>
      <h3>A situation you might recognize</h3><p>{guide.example}</p>
      <h3>What to do next</h3><p>{guide.workflow}</p>
      {ARTICLE_NOTES[guide.tool]?.map((section) => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <p><Link href={`/guides/${guide.slug}`}>Read the standalone guide</Link> or <Link href="/guides">explore all image guides</Link>.</p>
    </ArticleAccordion>)}
  </section>;
}
