import ArticleAccordion from "@/components/ArticleAccordion";
import type { Metadata } from 'next'
import Link from 'next/link'
import { Faq } from '@/components/page-bits'
import {
  BRAND,
  CONVERT_PAIRS,
  TAGLINE,
  TOOLS,
  buildMetadata,
  canonical,
} from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Free Image Tools أ¢â‚¬â€‌ Compress, Resize, Convert',
  description:
    'Free image tools that never upload your files. Compress, resize, crop & convert JPG, PNG, WebP in your browser.',
  path: '/',
})

const HOME_FAQS = [
  {
    question: 'Are these image tools really free?',
    answer:
      'Yes أ¢â‚¬â€‌ every tool is free with no account and no watermark. You can process up to 10 files per batch and run as many batches as you like. Processing happens in your browser, so there is no server cost per conversion to pass on to you.',
  },
  {
    question: 'Do my images get uploaded to a server?',
    answer:
      'No. Files are decoded, transformed, and re-encoded locally with the canvas and File APIs. Your images never leave your device, and re-encoding strips EXIF metadata automatically.',
  },
  {
    question: 'Which tool do I need for an upload form with a KB limit?',
    answer:
      'Use the exact-target pages: compress to 20KB for exam forms, 50KB for resumes and ID proofs, or 100KB for listings and CMS uploads. They binary-search quality to land under the limit.',
  },
  {
    question: 'Will compressing ruin my photo quality?',
    answer:
      'Not if you stay in the sweet spot: JPEG or WebP at 80أ¢â‚¬â€œ90% quality looks identical to the original at normal viewing distance while cutting 50أ¢â‚¬â€œ70% of the bytes. Start at 85% and compare at full zoom.',
  },
  {
    question: 'Which format should I use: JPG, PNG, or WebP?',
    answer:
      'JPG for photos and smallest compatible size, PNG when you need transparency or pixel-perfect graphics, WebP for the smallest web-ready files. The convert pages switch between them in one click.',
  },
]

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: `${BRAND} أ¢â‚¬â€‌ Free Image Tools`,
  url: canonical('/'),
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0' },
  description:
    'Free in-browser image tools: compress, resize, crop and convert JPG, PNG, and WebP with no uploads and no account.',
}

const USE_CASES = [
  {
    title: 'Exam & job applications',
    text: 'Hit strict 20KB and 50KB upload limits for admit cards, resumes, signatures, and ID proofs أ¢â‚¬â€‌ without a rejected submission.',
    href: '/compress-image-to-20kb',
    cta: 'Compress to 20KB',
  },
  {
    title: 'Marketplaces & listings',
    text: 'Get product photos under 100KB so listings upload fast and pages render instantly on mobile connections.',
    href: '/compress-image-to-100kb',
    cta: 'Compress to 100KB',
  },
  {
    title: 'Blogs & websites',
    text: 'Convert photos to WebP and resize to display dimensions for faster pages and better Core Web Vitals scores.',
    href: '/convert/jpg-to-webp',
    cta: 'JPG to WebP',
  },
  {
    title: 'Docs & sharing',
    text: 'Turn heavy PNG screenshots into small JPGs that attach to tickets, docs, and emails without friction.',
    href: '/convert/png-to-jpg',
    cta: 'PNG to JPG',
  },
]

export default function HomePage() {
  return (
    <div className='w-full'>
      {/* Hero أ¢â‚¬â€‌ full-bleed so zoom-out shows background, not blank sides */}
      <section className='w-full border-b border-slate-200 bg-gradient-to-b from-blue-50 via-slate-50 to-white dark:border-slate-700 dark:from-blue-950 dark:via-slate-900 dark:to-slate-900'>
        <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16'>
          <header className='mx-auto max-w-3xl text-center'>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100'>
              Free image tools that never upload your files
            </h1>
            <p className='mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300'>
              {TAGLINE} Compress, resize, crop, and convert JPG, PNG, and WebP
              right in your browser أ¢â‚¬â€‌ no account, no watermark, no waiting.
            </p>
            <div className='mt-6 flex flex-wrap justify-center gap-3'>
              <Link
                href='/compress-image'
                className='rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              >
                Resize and compress
              </Link>
              <Link
                href='/convert-image'
                className='rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-800'
              >
                Convert formats
              </Link>
            </div>
            <p className='mt-4 text-xs text-slate-500 dark:text-slate-400'>
              Private by design ط¢آ· No signup ط¢آ· Free forever
            </p>
          </header>
        </div>
      </section>

      {/* Tool cards أ¢â‚¬â€‌ full-bleed white */}
      <section
        aria-labelledby='tools-heading'
        className='w-full bg-white dark:bg-slate-900'
      >
        <div className='mx-auto w-full max-w-6xl px-4 py-12 sm:px-6'>
          <h2
            id='tools-heading'
            className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100'
          >
            All tools
          </h2>
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className='group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:shadow dark:bg-slate-900 dark:border-slate-700 dark:hover:border-blue-600'
              >
                <p className='text-base font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400'>
                  {tool.label}
                </p>
                <p className='mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  {tool.description}
                </p>
                <p className='mt-3 text-sm font-medium text-blue-700 dark:text-blue-400'>
                  Open tool أ¢â€ â€™
                </p>
              </Link>
            ))}
            {CONVERT_PAIRS.map(pair => (
              <Link
                key={pair.href}
                href={pair.href}
                className='group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:shadow dark:bg-slate-900 dark:border-slate-700 dark:hover:border-blue-600'
              >
                <p className='text-base font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400'>
                  {pair.label}
                </p>
                <p className='mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  {pair.description}
                </p>
                <p className='mt-3 text-sm font-medium text-blue-700 dark:text-blue-400'>
                  Open tool أ¢â€ â€™
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases أ¢â‚¬â€‌ full-bleed tinted band */}
      <section
        aria-labelledby='usecases-heading'
        className='w-full border-y border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700'
      >
        <div className='mx-auto w-full max-w-6xl px-4 py-12 sm:px-6'>
          <h2
            id='usecases-heading'
            className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100'
          >
            Built for real jobs
          </h2>
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            {USE_CASES.map(c => (
              <div
                key={c.title}
                className='rounded-2xl border border-slate-200 bg-white p-5 dark:bg-slate-900 dark:border-slate-700'
              >
                <p className='font-semibold text-slate-900 dark:text-slate-100'>
                  {c.title}
                </p>
                <p className='mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                  {c.text}
                </p>
                <Link
                  href={c.href}
                  className='mt-3 inline-block text-sm font-medium text-blue-700 hover:underline dark:text-blue-400'
                >
                  {c.cta} أ¢â€ â€™
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / privacy + FAQ أ¢â‚¬â€‌ full-bleed white */}
      <section className='w-full bg-white dark:bg-slate-900'>
        <div className='mx-auto w-full max-w-6xl px-4 py-12 sm:px-6'>
          <div
            aria-labelledby='privacy-heading'
            className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:bg-slate-900 dark:border-slate-700'
          >
            <h2
              id='privacy-heading'
              className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100'
            >
              How privacy works here
            </h2>
            <div className='mt-4 grid gap-4 text-sm leading-relaxed text-slate-600 sm:grid-cols-3 dark:text-slate-300'>
              <div>
                <p className='font-semibold text-slate-900 dark:text-slate-100'>
                  On-device processing
                </p>
                <p className='mt-1'>
                  Every operation runs locally with canvas and File APIs. There
                  is no upload step, so your photos cannot leak in transit or
                  sit on a server.
                </p>
              </div>
              <div>
                <p className='font-semibold text-slate-900 dark:text-slate-100'>
                  Metadata stripped
                </p>
                <p className='mt-1'>
                  Re-encoding writes only pixel data, so EXIF information such
                  as GPS location and camera settings is removed from exported
                  files automatically.
                </p>
              </div>
              <div>
                <p className='font-semibold text-slate-900 dark:text-slate-100'>
                  No account needed
                </p>
                <p className='mt-1'>
                  No signup and no cookies for tool use. Optional analytics only
                  loads if explicitly configured أ¢â‚¬â€‌ otherwise nothing phones
                  home.
                </p>
              </div>
            </div>
            <p className='mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
              New to this? Read the{' '}
              <Link
                href='/guides/reduce-image-size-without-losing-quality'
                className='font-medium text-blue-700 hover:underline dark:text-blue-400'
              >
                guide to reducing image size without losing quality
              </Link>{' '}
              for the full workflow.
            </p>
          </div>

          <Faq items={HOME_FAQS} />
        </div>
      </section>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />

<section className="mt-10" aria-label="Practical reading"><ArticleAccordion title="Where should you start with an image that will not upload?"><p>{"An error that says \u201cfile too large\u201d usually points to bytes, while a request for width and height points to pixels. Check both before editing. If the shape is wrong, crop first; if the dimensions are too large, resize; if the file still exceeds the limit, compress the finished image."}</p><p>{"For a file that will not open or a format the destination rejects, start with conversion. Keep the original and check the downloaded copy before you submit it. You do not need to use every tool for every picture."}</p></ArticleAccordion></section>
</div>
  )
}
