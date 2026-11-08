import Link from "next/link";
import type { ToolLink } from "@/lib/site";

export { default as Breadcrumbs } from "@/components/Breadcrumbs";
export type { Crumb } from "@/components/Breadcrumbs";

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq({
  items,
  heading = "Frequently asked questions",
}: {
  items: FaqItem[];
  heading?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
        {heading}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
        {items.map((item) => (
          <div key={item.question} className="px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.question}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

export function RelatedLinks({
  heading = "Related tools",
  links,
}: {
  heading?: string;
  links: ToolLink[];
}) {
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
        {heading}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <p className="text-base font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
              {link.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
