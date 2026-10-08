import Link from "next/link";
import { TOOLS } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
        This page doesn&apos;t exist
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
        The link you followed may be broken, or the page may have moved. Your
        images are safe — nothing was uploaded, because nothing ever leaves
        your device. Pick a tool below to keep going.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TOOLS.slice(0, 4).map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-300 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {tool.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Back to homepage
      </Link>
    </div>
  );
}
