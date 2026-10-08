import Link from "next/link";
import { canonical } from "@/lib/site";

export interface Crumb {
  label: string;
  /** Omit for the current page (rendered as plain text). */
  href?: string;
}

export interface BreadcrumbsProps {
  /** Trail after Home — the last item is treated as the current page. */
  items: Crumb[];
}

/**
 * "Home › …" trail plus a BreadcrumbList JSON-LD emitter.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: canonical(crumb.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-300">
                  ›
                </span>
              )}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-slate-900 dark:text-slate-100" : ""}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
