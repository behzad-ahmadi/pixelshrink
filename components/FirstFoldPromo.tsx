export default function FirstFoldPromo() {
  return (
    <aside aria-label="Discover First Fold Studio" className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-slate-900">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">From the creator of PixelShrink</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Building a website?</span>
          <span className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">Get a fast, custom landing page designed and built by First Fold Studio.</span>
        </div>
        <a href="https://www.firstfold.dev/?utm_source=pixelshrink&utm_medium=referral&utm_campaign=website-promo" className="inline-flex min-h-11 shrink-0 items-center self-start rounded-lg border border-blue-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950 sm:self-auto">
          Explore First Fold →
        </a>
      </div>
    </aside>
  );
}
