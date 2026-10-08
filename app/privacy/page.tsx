import { buildMetadata, BRAND, CONTACT_EMAIL } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "PixelShrink privacy policy: images are processed locally in your browser and never uploaded. How cookies, analytics, and advertising work on this site.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Last updated: October 2026. This policy explains what {BRAND} does —
        and, more importantly, does not — do with your information. The short
        version: your images never leave your device, we do not require
        accounts, and we do not sell personal data.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        1. Your files stay on your device
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        All image processing on {BRAND} happens locally in your browser using
        client-side web technologies. When you compress, resize, crop, or
        convert a picture, the file is read into your own browser memory,
        transformed there, and written back out as a download. No image bytes
        are transmitted to our servers, because there is no server-side
        processing pipeline at all. We cannot view, store, or share your photos
        for the simple reason that we never receive them.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        2. Information we do not collect
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        We do not ask you to create an account, provide a name, or submit an
        email address to use the tools. We do not collect the contents of your
        images, the filenames you process, or any biometric information. If you
        contact us by email, we receive only what you choose to include in that
        message, and we use it solely to respond to your inquiry.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        3. Cookies and local storage
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        {BRAND} itself sets no cookies and uses no browser storage of its own
        for the tools — there is nothing to remember, because every setting
        lives only in the current page session. We do not set advertising or
        cross-site tracking cookies ourselves. However, third-party services
        described below may use cookies in your browser, and you can clear or
        block cookies at any time through your browser settings without losing
        access to the core tools.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        4. Analytics and advertising
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        To understand which tools people find useful, we may use privacy-minded
        analytics that aggregate visits without building profiles of individual
        users. In the future, this site may also display advertisements through
        networks such as Google AdSense. Those advertising partners may use
        cookies — including the Google DoubleClick cookie — to serve ads based
        on your visits to this and other sites. You can opt out of personalized
        advertising through Google&apos;s Ads Settings or the Network
        Advertising Initiative opt-out page. Because ad providers operate under
        their own privacy policies, we encourage you to review Google&apos;s
        Privacy &amp; Terms if you want the full details.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Third parties</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Apart from analytics and advertising providers described above, we do
        not share information with third parties. Our hosting and content
        delivery providers necessarily handle standard network metadata, such as
        IP addresses in server logs, in order to serve pages to you. That
        metadata is retained according to their own policies and is never
        combined with image content, because no image content ever reaches any
        server.
      </p>

      <h2 className="mt-8 text-xl font-semibold">
        6. Children&apos;s privacy
      </h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        {BRAND} is a general-purpose utility that does not knowingly collect
        personal information from children. Because the tools require no
        registration and process files locally, children can use them in the
        same anonymous manner as anyone else. If you believe a child has sent us
        personal information via the contact address, let us know and we will
        delete it promptly.
      </p>

      <h2 className="mt-8 text-xl font-semibold">7. Changes to this policy</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        We may update this policy as the site evolves — for instance, if we add
        analytics tooling or begin serving ads. Any revision will be posted on
        this page with a new effective date. Continued use of the site after a
        change takes effect means you accept the updated policy.
      </p>

      <h2 className="mt-8 text-xl font-semibold">8. Contact</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        Questions about this policy or about privacy on {BRAND} generally are
        welcome at{" "}
        <a
          className="font-medium text-slate-900 underline dark:text-slate-100"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        . We aim to answer every genuine privacy inquiry.
      </p>
    </div>
  );
}
