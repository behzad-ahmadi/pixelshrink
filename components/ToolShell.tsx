import type { ReactNode } from "react";
import RelatedTools from "@/components/RelatedTools";

export interface ToolShellProps {
  /** Page H1. */
  title: string;
  /** One-to-two sentence intro under the H1. */
  intro: string;
  /** The interactive tool UI. */
  children: ReactNode;
  /** Long-form guide content (renders inside .guide). */
  guide?: ReactNode;
  /** FAQ block (use <Faq items={...} />). */
  faq?: ReactNode;
  /** Href of the current tool, excluded from the related-tools grid. */
  relatedExclude?: string;
  className?: string;
}

/**
 * Standard layout for every tool page: H1 + intro, interactive tool slot,
 * guide-content slot, FAQ slot, and related tools.
 */
export default function ToolShell({
  title,
  intro,
  children,
  guide,
  faq,
  relatedExclude,
  className = "",
}: ToolShellProps) {
  return (
    <div className={`mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 ${className}`}>
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{intro}</p>
      </header>

      <section aria-label="Image tool" className="mt-8">
        {children}
      </section>

      {guide && (
        <section aria-label="Guide" className="guide mt-12">
          {guide}
        </section>
      )}

      {faq && <div className="mt-12">{faq}</div>}

      <RelatedTools excludeHref={relatedExclude} />
    </div>
  );
}
