"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const TOPICS = ["Bug report", "Feature request", "Privacy question", "Other"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const subject = encodeURIComponent(`[${topic}] Message from ${name || "a PixelShrink user"}`);
    const body = encodeURIComponent(`Name: ${name}\nReply-to: ${email}\nTopic: ${topic}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  const inputClass =
    "w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:text-slate-100 dark:border-slate-600 dark:focus:border-slate-400 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900 dark:placeholder:text-slate-500 dark:bg-slate-900";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Your name <span aria-hidden="true" className="text-slate-500 dark:text-slate-400">*</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            aria-required="true"
            autoComplete="name"
            maxLength={100}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Your email <span aria-hidden="true" className="text-slate-500 dark:text-slate-400">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            aria-required="true"
            autoComplete="email"
            maxLength={254}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Topic</span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={inputClass}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          Message <span aria-hidden="true" className="text-slate-500 dark:text-slate-400">*</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue, including your browser and what you were trying to do…"
          required
          aria-required="true"
          rows={6}
          maxLength={5000}
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        className="min-h-[44px] rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-slate-700 active:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:active:bg-slate-200"
      >
        Send via email
      </button>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No account or server involved — submitting opens your own email app
        with the message pre-filled. Prefer your own client? Write to us
        directly at{" "}
        <a
          className="font-medium text-slate-900 underline dark:text-slate-100"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
