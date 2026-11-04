import type { ReactNode } from "react";

export default function ArticleAccordion({ title, children, id }: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <details id={id} className="article-accordion rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <summary className="cursor-pointer rounded-xl px-5 py-4 font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-slate-100">
        {title}
      </summary>
      <div className="guide border-t border-slate-200 px-5 pb-5 pt-2 dark:border-slate-700">{children}</div>
    </details>
  );
}
