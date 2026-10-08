import { buildMetadata, BRAND, CONTACT_EMAIL } from "@/lib/site";
import ContactForm from "./contact-form";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact PixelShrink: report a bug, request a feature, or ask a privacy question. The form opens your email app — no account, no tracking.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Contact {BRAND}
      </h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Found a bug, want a new tool, or have a question about how your privacy
        is protected? We read every genuine message and aim to reply within a
        few business days. Because {BRAND} runs entirely in your browser with
        no accounts and no backend database, this contact form works a little
        differently from most: instead of submitting your words to a server,
        it composes an email in your own mail app, addressed to us, with
        everything pre-filled. Nothing is sent until you press send in your
        email client, and no copy is stored on any server in between.
      </p>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        To help us help you faster, please include a few details in your
        message. For bug reports, tell us which tool you were using, your
        browser and operating system, the type and approximate size of the
        image, and the exact steps that led to the problem. Screenshots of any
        error are always welcome. For feature requests, describe the job you
        are trying to get done — for example, the upload limit you keep hitting
        or the format your editor refuses to open — rather than just naming a
        button you want. The underlying need often points to a better solution
        than the one first imagined.
      </p>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
        A quick note on privacy: please do not attach sensitive personal
        documents unless they are essential to the issue, and never send
        passwords. If your question is about advertising or data handling, our
        privacy policy already answers most common questions and is worth a
        look first. For anything else, the form below is the fastest route —
        or email us directly at{" "}
        <a
          className="font-medium text-slate-900 underline dark:text-slate-100"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <ContactForm />
    </div>
  );
}
