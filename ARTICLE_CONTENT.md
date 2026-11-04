# Adding image articles

The site content is English. Keep examples concrete and avoid promises of fixed savings or invisible quality loss.

- Add a unique entry to `lib/guides.ts`, with an existing tool path in `tool` and a unique slug. It automatically appears in that tool’s accordion list, the guides index, its standalone route and the sitemap.
- Add deeper editorial sections to `lib/article-notes.ts`, keyed by tool path. Both the inline article and standalone guide use these sections.
- `components/ArticleAccordion.tsx` uses native details/summary. Content is rendered by the server even when collapsed. Preserve keyboard focus styles and meaningful summary text.
- Keep informational and legal reading in the corresponding page; policy text remains directly visible.
- Check for overlap with existing topics before adding an article. Prefer extending an established guide when search intent is the same.
- Run lint, typecheck and build after edits; inspect open/closed articles in light and dark themes.
