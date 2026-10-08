import Link from "next/link";
import { BRAND, TAGLINE, TOOLS, CONVERT_PAIRS, CONTACT_EMAIL } from "@/lib/site";

/** Footer with tool links, resources, and legal. */
export default function SiteFooter() {
  // Static year: new Date() is not allowed during prerendering
  // with Cache Components enabled.
  const year = 2026;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <span className="text-blue-600 dark:text-blue-400">Pixel</span>Shrink
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">{TAGLINE}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <nav aria-label="Tools">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tools</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {[...TOOLS.slice(0, 4), ...CONVERT_PAIRS].map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="text-slate-600 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300">
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Legal</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link href="/privacy" className="text-slate-600 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-600 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-600 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6 dark:text-slate-400">
          © {year} {BRAND}. All processing happens in your browser — your images are never uploaded.
        </p>
      </div>
    </footer>
  );
}
