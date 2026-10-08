"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageEngineError,
  drawToCanvas,
  encodeCanvas,
  extensionFor,
  flattenForJpeg,
  formatBytes,
  loadImageFileMaybeHeic,
  revokeLoadedImage,
  savingsPercent,
  withExtension,
  type LoadedImage,
  type OutputMime,
} from "@/lib/image-engine";
import { downloadZip } from "@/lib/batch";
import { trackEvent } from "@/lib/analytics";

const OUTPUT_LABELS: Record<OutputMime, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export interface ConverterProps {
  /** Human label of the expected source, e.g. "WebP". */
  fromLabel: string;
  /** Allowed outputs. Pass a single entry to lock the conversion pair. */
  outputs: OutputMime[];
  defaultOutput?: OutputMime;
  accept?: string;
  defaultQuality?: number;
  heading?: string;
  subheading?: string;
}

interface ConvertResult {
  url: string;
  blob: Blob;
  sizeBytes: number;
  filename: string;
  mime: OutputMime;
}

interface QueueItem {
  id: number;
  source: LoadedImage;
  result: ConvertResult | null;
  error: string | null;
  status: "queued" | "working" | "done" | "error";
}

/** Max files per batch — bounds memory on low-end devices. */
const MAX_BATCH_FILES = 10;

export default function Converter({
  fromLabel,
  outputs,
  defaultOutput,
  accept = "image/*",
  defaultQuality = 85,
  heading = "Convert your image",
  subheading,
}: ConverterProps) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [output, setOutput] = useState<OutputMime>(defaultOutput ?? outputs[0]);
  const [quality, setQuality] = useState<number>(defaultQuality);
  const [busy, setBusy] = useState<boolean>(false);
  const [zipBusy, setZipBusy] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextId = useRef(1);
  const workingRef = useRef(false);
  const itemsRef = useRef<QueueItem[]>([]);
  // Latest settings readable from the async loop without stale closures.
  const settingsRef = useRef({ output, quality, fromLabel });
  useEffect(() => {
    settingsRef.current = { output, quality, fromLabel };
  }, [output, quality, fromLabel]);

  const locked = outputs.length === 1;
  const supportsQuality = output !== "image/png";

  const syncItems = useCallback((next: QueueItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const updateItem = useCallback(
    (id: number, patch: Partial<QueueItem>) => {
      syncItems(itemsRef.current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [syncItems],
  );

  // Revoke every object URL on unmount.
  useEffect(() => {
    const ref = itemsRef;
    return () => {
      for (const item of ref.current) {
        revokeLoadedImage(item.source);
        if (item.result) URL.revokeObjectURL(item.result.url);
      }
    };
  }, []);

  const convertSource = useCallback(
    async (source: LoadedImage, mime: OutputMime, q: number, label: string) => {
      const canvas = drawToCanvas(source.element, source.width, source.height);
      if (mime === "image/jpeg") flattenForJpeg(canvas);
      const blob = await encodeCanvas(
        canvas,
        mime,
        mime === "image/png" ? 1 : q / 100,
      );
      const url = URL.createObjectURL(blob);
      const result: ConvertResult = {
        url,
        blob,
        sizeBytes: blob.size,
        filename: withExtension(source.name, mime),
        mime,
      };
      trackEvent("convert_completed", {
        from: label,
        to: OUTPUT_LABELS[mime],
        quality: Math.round(q),
      });
      return result;
    },
    [],
  );

  const runQueue = useCallback(async () => {
    if (workingRef.current) return;
    const queued = itemsRef.current.filter((i) => i.status === "queued");
    if (queued.length === 0) return;
    workingRef.current = true;
    setBusy(true);
    setNotice(null);
    trackEvent("convert_batch_started", {
      from: settingsRef.current.fromLabel,
      to: OUTPUT_LABELS[settingsRef.current.output],
      count: queued.length,
    });
    let succeeded = 0;
    try {
      const batchLabel = settingsRef.current.fromLabel;
      for (;;) {
        const next = itemsRef.current.find((i) => i.status === "queued");
        if (!next) break;
        // Snapshot settings per file so a mid-batch control change applies
        // to files not yet processed (synced via effect, never during render).
        const snap = { ...settingsRef.current };
        updateItem(next.id, { status: "working", error: null });
        try {
          const result = await convertSource(next.source, snap.output, snap.quality, snap.fromLabel);
          const prev = itemsRef.current.find((i) => i.id === next.id)?.result;
          if (prev) URL.revokeObjectURL(prev.url);
          updateItem(next.id, { status: "done", result, error: null });
          succeeded += 1;
        } catch (err) {
          const message =
            err instanceof ImageEngineError
              ? err.message
              : "Conversion failed in this browser. Try JPEG or PNG instead.";
          updateItem(next.id, { status: "error", error: message });
          trackEvent("convert_failed", {
            from: snap.fromLabel,
            to: OUTPUT_LABELS[snap.output],
          });
        }
      }
      trackEvent("convert_batch_completed", { from: batchLabel, succeeded });
    } finally {
      workingRef.current = false;
      setBusy(false);
    }
  }, [convertSource, updateItem]);

  async function handleFiles(list: FileList | File[]) {
    const picked = Array.from(list);
    if (picked.length === 0) return;
    setNotice(null);
    const room = MAX_BATCH_FILES - itemsRef.current.length;
    if (room <= 0) {
      setNotice(
        `This batch is full (${MAX_BATCH_FILES} files). Download your results, then start a new batch.`,
      );
      return;
    }
    const accepted = picked.slice(0, room);
    if (picked.length > room) {
      setNotice(
        `Only the first ${room} file${room === 1 ? "" : "s"} were added (10 per batch). Process the rest in a second batch.`,
      );
    }
    const fresh: QueueItem[] = [];
    for (const file of accepted) {
      try {
        const loaded = await loadImageFileMaybeHeic(file);
        trackEvent("convert_started", {
          from: fromLabel,
          to: OUTPUT_LABELS[settingsRef.current.output],
        });
        fresh.push({
          id: nextId.current,
          source: loaded,
          result: null,
          error: null,
          status: "queued",
        });
        nextId.current += 1;
      } catch (err) {
        // Failed decodes still get a row so the user sees what went wrong;
        // they carry no source image.
        fresh.push({
          id: nextId.current,
          source: {
            element: new Image(),
            objectUrl: "",
            name: file.name,
            sizeBytes: file.size,
            width: 0,
            height: 0,
          },
          result: null,
          error:
            err instanceof ImageEngineError
              ? err.message
              : `"${file.name}" could not be read. Please try another file.`,
          status: "error",
        });
        nextId.current += 1;
      }
    }
    const next = [...itemsRef.current, ...fresh];
    syncItems(next);
    if (activeId === null) {
      const firstGood = fresh.find((f) => f.status !== "error");
      setActiveId((firstGood ?? fresh[0])?.id ?? null);
    }
    void runQueue();
  }

  function handleRemove(id: number) {
    const target = itemsRef.current.find((i) => i.id === id);
    if (target) {
      if (target.source.objectUrl) revokeLoadedImage(target.source);
      if (target.result) URL.revokeObjectURL(target.result.url);
    }
    const next = itemsRef.current.filter((i) => i.id !== id);
    syncItems(next);
    if (activeId === id) setActiveId(next.length > 0 ? next[0].id : null);
  }

  function handleReset() {
    for (const item of itemsRef.current) {
      if (item.source.objectUrl) revokeLoadedImage(item.source);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    syncItems([]);
    setActiveId(null);
    setNotice(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleOutputChange(mime: OutputMime) {
    setOutput(mime);
    // Sync the ref immediately: runQueue() below reads settings from the ref,
    // and the effect sync only runs after re-render (too late).
    settingsRef.current = { ...settingsRef.current, output: mime };
    // A new output invalidates completed results — re-queue every processable
    // item so the batch actually converts to the newly selected format.
    const next = itemsRef.current.map((item) => {
      if (item.status === "error") return item;
      if (item.result) URL.revokeObjectURL(item.result.url);
      return { ...item, status: "queued" as const, result: null, error: null };
    });
    syncItems(next);
    void runQueue();
  }

  function handleQualityChange(q: number) {
    setQuality(q);
  }

  // Quality changes refresh completed results live (debounced so slider
  // drags enqueue a single re-run). In-flight batches pick up the new value
  // per file via settingsRef, so skip while busy.
  useEffect(() => {
    if (!itemsRef.current.some((i) => i.status === "done") || workingRef.current) return;
    const timer = setTimeout(() => {
      const next = itemsRef.current.map((item) => {
        if (item.status === "error") return item;
        if (item.result) URL.revokeObjectURL(item.result.url);
        return { ...item, status: "queued" as const, result: null, error: null };
      });
      syncItems(next);
      void runQueue();
    }, 600);
    return () => clearTimeout(timer);
  }, [quality, runQueue, syncItems]);

  async function handleZip() {
    const done = itemsRef.current.filter(
      (i) => i.status === "done" && i.result,
    );
    if (done.length === 0 || zipBusy) return;
    setZipBusy(true);
    setNotice(null);
    try {
      const { output: mime } = settingsRef.current;
      await downloadZip(
        done.map((i) => ({
          name: (i.result as ConvertResult).filename,
          blob: (i.result as ConvertResult).blob,
        })),
        `pixelshrink-${extensionFor(mime)}`,
      );
      trackEvent("convert_zip_downloaded", { count: done.length });
    } catch {
      setNotice("The ZIP could not be created in this browser. Download the files individually instead.");
    } finally {
      setZipBusy(false);
    }
  }

  const active = items.find((i) => i.id === activeId) ?? items[0] ?? null;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <section
      aria-label={heading}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-800/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{heading}</h2>
        {subheading ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subheading}</p>
        ) : null}
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Choose ${fromLabel} images to convert (up to ${MAX_BATCH_FILES})`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            if (event.dataTransfer.files?.length) void handleFiles(event.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            dragOver
              ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
              : "border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-600 dark:bg-slate-800"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              if (event.target.files?.length) void handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {items.length === 0
              ? `Drop ${fromLabel} images here, or click to browse`
              : `Add more images (${items.length}/${MAX_BATCH_FILES})`}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Up to {MAX_BATCH_FILES} files · JPEG, PNG, WebP, HEIC, GIF, BMP or AVIF up to 50MB each —
            never uploaded
          </p>
        </div>

        {notice ? (
          <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {notice}
          </p>
        ) : null}

        {/* File queue */}
        {items.length > 0 ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200" id="convert-queue-heading">
                Batch ({items.length} file{items.length === 1 ? "" : "s"} · {doneCount} done)
              </p>
              <button
                type="button"
                onClick={handleReset}
                disabled={busy}
                className="text-xs font-medium text-slate-500 underline hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear all
              </button>
            </div>
            <div
              className={`mt-2 ${busy ? "" : "invisible"}`}
              role="progressbar"
              aria-label="Batch conversion progress"
              aria-valuemin={0}
              aria-valuemax={items.length}
              aria-valuenow={doneCount}
              aria-hidden={!busy}
            >
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
                />
              </div>
              <p aria-live="polite" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Converting… {doneCount} of {items.length} done
              </p>
            </div>
            <ul aria-labelledby="convert-queue-heading" className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={active?.id === item.id}
                    aria-label={`Preview ${item.source.name}`}
                    className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-slate-50 focus-visible:outline-2 dark:bg-slate-800 ${
                      active?.id === item.id
                        ? "border-blue-600"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.source.objectUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.source.objectUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-xs text-slate-400">?</span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.source.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.status === "working" && "Converting…"}
                      {item.status === "queued" && `Queued · ${formatBytes(item.source.sizeBytes)}`}
                      {item.status === "done" && item.result && (
                        <>
                          {formatBytes(item.source.sizeBytes)} → {formatBytes(item.result.sizeBytes)}
                        </>
                      )}
                      {item.status === "error" && (item.error ?? "Failed")}
                    </p>
                  </div>
                  {item.status === "done" && item.result ? (
                    <a
                      href={item.result.url}
                      download={item.result.filename}
                      onClick={() =>
                        trackEvent("convert_downloaded", {
                          to: OUTPUT_LABELS[item.result?.mime ?? output],
                        })
                      }
                      className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2"
                    >
                      Download
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={busy}
                    aria-label={`Remove ${item.source.name} from batch`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 focus-visible:outline-2 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <span aria-hidden="true" className="text-lg leading-none">×</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {active?.source.objectUrl ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.source.objectUrl}
              alt="Preview of the selected source image"
              className="mx-auto max-h-64 w-auto object-contain bg-slate-50 dark:bg-slate-800"
            />
          </div>
        ) : null}

        {/* Output + quality controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="converter-output"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Output format
            </label>
            {locked ? (
              <p className="mt-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                {OUTPUT_LABELS[output]} (. {extensionFor(output)})
              </p>
            ) : (
              <select
                id="converter-output"
                value={output}
                disabled={busy}
                onChange={(event) => handleOutputChange(event.target.value as OutputMime)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {outputs.map((mime) => (
                  <option key={mime} value={mime}>
                    {OUTPUT_LABELS[mime]}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label
              htmlFor="converter-quality"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Quality: {supportsQuality ? `${quality}%` : "lossless (PNG)"}
            </label>
            <input
              id="converter-quality"
              type="range"
              min={10}
              max={100}
              step={1}
              value={quality}
              disabled={busy || !supportsQuality}
              onChange={(event) => handleQualityChange(Number(event.target.value))}
              className="mt-2 w-full accent-blue-600 disabled:opacity-40"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {supportsQuality
                ? "85–92% looks identical to the original for most photos. Applies to new conversions."
                : "PNG is always lossless; quality does not apply."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runQueue()}
            disabled={items.length === 0 || busy}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {busy
              ? `Converting… ${doneCount}/${items.length}`
              : doneCount > 0 && doneCount === items.filter((i) => i.status !== "error").length
                ? "Re-convert all"
                : `Convert ${items.length > 0 ? `${items.length} file${items.length === 1 ? "" : "s"}` : ""} to ${OUTPUT_LABELS[output]}`}
          </button>
          {doneCount >= 2 ? (
            <button
              type="button"
              onClick={() => void handleZip()}
              disabled={zipBusy || busy}
              aria-busy={zipBusy}
              className="rounded-lg border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
            >
              {zipBusy ? "Preparing ZIP…" : `Download all as ZIP (${doneCount})`}
            </button>
          ) : null}
          {items.length > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={busy}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Start over
            </button>
          ) : null}
        </div>

        {/* Per-file results */}
        {doneCount > 0 ? (
          <div className="space-y-3" aria-live="polite">
            {items.filter((i) => i.result).map((item) => {
              const itemSavings =
                item.result != null
                  ? savingsPercent(item.source.sizeBytes, item.result.sizeBytes)
                  : 0;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950"
                >
                  <p className="truncate text-sm font-semibold text-green-900 dark:text-green-200">
                    {item.source.name} — Done — {formatBytes(item.source.sizeBytes)} →{" "}
                    {formatBytes(item.result!.sizeBytes)}
                    {itemSavings > 0 ? ` (${itemSavings}% smaller)` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-green-800 dark:text-green-200">
                    {item.result!.filename} · encoded locally, metadata stripped
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={item.result!.url}
                      download={item.result!.filename}
                      onClick={() =>
                        trackEvent("convert_downloaded", {
                          to: OUTPUT_LABELS[item.result?.mime ?? output],
                        })
                      }
                      className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
                    >
                      Download {OUTPUT_LABELS[item.result!.mime]}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Private by design: conversion runs with canvas encoding on your device.
          Converting to JPEG flattens transparency onto a white background, and
          re-encoding always strips EXIF metadata.
        </p>
      </div>
    </section>
  );
}
