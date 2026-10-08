import { buildMetadata, BRAND } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn what PixelShrink is: free, browser-first image tools that compress, resize, crop, and convert photos without ever uploading your files.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        About {BRAND}
      </h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        {BRAND} is a collection of free online image tools built around a
        single promise: your files never leave your device. Every tool —
        compression, resizing, cropping, and format conversion — runs entirely
        in your browser using modern web APIs. There is no upload step, no
        waiting queue, no account to create, and no server that ever sees your
        photos.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Why browser-first?</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Traditional online image tools work by sending your pictures to a remote
        server, processing them there, and sending a result back. That approach
        has real downsides: personal photos travel over the network, processing
        queues get slow at peak times, and file-size limits exist to protect
        server capacity rather than to help you. We took the opposite approach.
        Your browser already has everything needed to decode, transform, and
        re-encode images, so {BRAND} does all of that work locally on your own
        machine. The result is faster processing, no upload bandwidth, and a
        privacy story that is simple to verify — disconnect from the internet
        after the page loads and the tools keep working.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What you can do here</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        The toolkit covers the everyday image chores that come up again and
        again. Compress JPEG, PNG, and WebP files with a quality slider or dial
        in an exact target such as 20KB, 50KB, or 100KB for exam forms, job
        portals, and upload limits. Resize photos to exact pixel dimensions with
        an aspect-ratio lock and handy presets for social media. Crop images to
        standard ratios like 1:1, 4:3, and 16:9 or a free selection of your own.
        Convert between JPEG, PNG, and WebP — including dedicated converters for
        common pairs like WebP to JPG, PNG to JPG, and JPG to WebP — without
        installing desktop software.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Who it is for</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Students squeezing a scanned signature under a portal limit, freelancers
        preparing marketplace listings, bloggers speeding up their pages, and
        anyone who received a WebP download their editor refuses to open — these
        are the people {BRAND} is built for. Everything is free, works on both
        desktop and mobile browsers, and requires no sign-up. If a tool saves
        you time, the best thanks is telling someone else who fights the same
        upload limits every week.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Our commitments</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        First, privacy by design: because files are processed locally, there is
        nothing to leak, sell, or breach. Second, honesty about quality: lossy
        compression always involves trade-offs, so our guides explain what the
        sliders actually do instead of promising magic. Third, keeping the core
        tools free and accessible without accounts, watermarks, or download
        caps. If you have feedback, a feature request, or found a bug, please
        reach out through the contact page — real user reports shape what gets
        built next.
      </p>
    </div>
  );
}
