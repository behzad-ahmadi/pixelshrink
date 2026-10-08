export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  items: FaqItem[];
  /** Heading shown above the accordion. */
  heading?: string;
}

/**
 * Accessible FAQ accordion built on native <details>/<summary>, plus an
 * FAQPage JSON-LD emitter for search engines.
 */
export default function Faq({ items, heading = "Frequently asked questions" }: FaqProps) {
  if (items.length === 0) return null;

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
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {heading}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden dark:text-slate-100">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-400 transition-transform group-open:rotate-45 dark:text-slate-300"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
