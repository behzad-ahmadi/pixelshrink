import { buildMetadata, BRAND, CONTACT_EMAIL } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "PixelShrink terms of service: acceptable use, disclaimers, and liability limits for our free browser-based image tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Last updated: October 2026. These terms govern your use of {BRAND}.
        By using any tool on this site, you agree to these terms. If you do
        not agree, please do not use the site.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. The service</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        {BRAND} provides free browser-based utilities for compressing,
        resizing, cropping, and converting images. All processing happens
        locally on your device; the site supplies the web pages and JavaScript
        that make that possible. The tools are provided free of charge, with no
        account required, and we may modify, suspend, or discontinue any part
        of the service at any time without prior notice.
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Acceptable use</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        You agree to use the tools only for lawful purposes and only with
        images you have the right to process. You must not use the site to
        infringe copyrights or trademarks, to create misleading or deceptive
        imagery intended to defraud, to process unlawful content, or to attempt
        to disrupt the site through abusive automated traffic, scraping at
        unreasonable rates, or probing for vulnerabilities. Because processing
        is local, misuse of the tools themselves is your sole responsibility —
        we have no technical ability to monitor what you do with files on your
        own machine, and we accept no liability for it.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        3. Intellectual property
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        The site&apos;s design, text, guides, and code are owned by {BRAND}{" "}
        and protected by applicable intellectual-property laws. You are welcome
        to link to our tools and share your results. You may not copy
        substantial portions of the site&apos;s original written content,
        present the tools as your own, or circumvent any technical measures
        that protect the service. Your own images remain entirely yours — we
        claim no rights over files you process, and since files never reach our
        servers, we never even possess them.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        4. Quality and backups
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Image compression, especially lossy formats like JPEG and WebP,
        discards data permanently. Resizing and conversion can likewise change
        how a picture looks. Always keep a backup of important originals before
        overwriting them with a processed version. {BRAND} is a convenience
        utility, not a professional pre-press service, and output quality
        depends on your chosen settings as well as your browser&apos;s image
        codecs.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        5. Disclaimer of warranties
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        The service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, whether express, implied, or
        statutory, including warranties of merchantability, fitness for a
        particular purpose, accuracy, and non-infringement. We do not warrant
        that the site will be uninterrupted, error-free, or compatible with
        every browser, nor that any particular file-size target or visual
        quality level is achievable for a given image.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        6. Limitation of liability
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        To the maximum extent permitted by law, {BRAND} and its operators are
        not liable for any indirect, incidental, consequential, special, or
        exemplary damages — including lost files, lost profits, or missed
        deadlines — arising from your use of or inability to use the service,
        even if advised of the possibility of such damages. Our total liability
        for any claim related to the service is limited to the amount you paid
        to use it, which is zero.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        7. Third-party links and ads
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        The site may link to external resources or display third-party
        advertisements. We do not control third-party sites or advertisers and
        are not responsible for their content, policies, or practices. Your
        dealings with advertisers are solely between you and them.
      </p>

      <h2 className="mt-8 text-xl font-semibold">8. Changes and contact</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        We may revise these terms from time to time, and the current version
        will always be posted on this page. Continued use of the site after
        changes take effect constitutes acceptance of the new terms. If you
        have questions about these terms, contact us at{" "}
        <a
          className="font-medium text-slate-900 underline dark:text-slate-100"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
