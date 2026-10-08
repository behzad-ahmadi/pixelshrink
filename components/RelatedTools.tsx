import Link from "next/link";
import { TOOLS, CONVERT_PAIRS } from "@/lib/site";

export interface RelatedToolsProps {
  /** Href to leave out (normally the current tool page). */
  excludeHref?: string;
  /** Maximum number of cards to show. */
  limit?: number;
  heading?: string;
}

/**
 * Grid of cards linking to the other tools in the lib/site tools list.
 */
export default function RelatedTools({
  excludeHref,
  limit = 6,
  heading = "Related tools",
}: RelatedToolsProps) {
  const all = [...TOOLS, ...CONVERT_PAIRS];
  const items = all.filter((t) => t.href !== excludeHref).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="mt-12">
      <h2
        id="related-tools-heading"
        className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
      >
        {heading}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block h-full rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-500 hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-400 dark:hover:bg-blue-950/50"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">{tool.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
