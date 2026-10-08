"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageEngineError,
  compressToTargetBytes,
  downloadBlob,
  drawToCanvas,
  encodeCanvas,
  flattenForJpeg,
  formatBytes,
  loadImageFile,
  revokeLoadedImage,
  savingsPercent,
  withExtension,
  type OutputMime,
} from "@/lib/image-engine";
import { downloadZip } from "@/lib/batch";
import { trackEvent } from "@/lib/analytics";

interface CompressorProps {
  defaultMode?: "quality" | "target";
  defaultTargetKB?: number;
  lockTargetKB?: boolean;
  defaultQuality?: number;
}

interface CompressResult {
  blob: Blob;
  url: string;
  sizeBytes: number;
  quality: number;
  width: number;
  height: number;
  scaledDown: boolean;
  mime: OutputMime;
}

interface BatchItem {
  id: number;
  file: File;
  previewUrl: string | null;
  width: number;
  height: number;
  sizeBytes: number;
  result: CompressResult | null;
  error: string | null;
  status: "queued" | "working" | "done" | "error";
}

const FORMATS: ReadonlyArray<{ mime: OutputMime; label: string }> = [
  { mime: "image/jpeg", label: "JPEG" },
  { mime: "image/webp", label: "WebP" },
  { mime: "image/png", label: "PNG" },
];

/** Max files per batch — bounds memory on low-end devices. */
const MAX_BATCH_FILES = 10;

function errorMessage(err: unknown): string {
  if (err instanceof ImageEngineError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong while processing that image.";
}

export default function Compressor({
  defaultMode = "quality",
  defaultTargetKB = 100,
  lockTargetKB = false,
  defaultQuality = 80,
}: CompressorProps) {
  const [mode, setMode] = useState<"quality" | "target">(defaultMode);
  const [quality, setQuality] = useState<number>(defaultQuality);
  const [targetKB, setTargetKB] = useState<number>(defaultTargetKB);
  const [format, setFormat] = useState<OutputMime>("image/jpeg");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const workingRef = useRef(false);
  const itemsRef = useRef<BatchItem[]>([]);
  // Settings signature of the last completed run — detects stale results
  // when the user tweaks controls after a batch finished.
  const [lastRunSig, setLastRunSig] = useState<string | null>(null);

  const syncItems = useCallback((next: BatchItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const updateItem = useCallback(
    (id: number, patch: Partial<BatchItem>) => {
      syncItems(itemsRef.current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [syncItems],
  );

  // Revoke every object URL on unmount.
  useEffect(() => {
    const ref = itemsRef;
    return () => {
      for (const item of ref.current) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result) URL.revokeObjectURL(item.result.url);
      }
    };
  }, []);

  const compressOne = useCallback(
    async (file: File, m: "quality" | "target", q: number, kb: number, mime: OutputMime) => {
      const image = await loadImageFile(file);
      try {
        let blob: Blob;
        let outQuality = q / 100;
        let width = image.width;
        let height = image.height;
        let scaledDown = false;
        if (m === "target") {
          const targetBytes = Math.max(1, Math.round(kb * 1024));
          const r = await compressToTargetBytes(image.element, targetBytes, mime, 0.9);
          blob = r.blob;
          outQuality = r.quality;
          width = r.width;
          height = r.height;
          scaledDown = r.scaledDown;
        } else {
          const canvas = drawToCanvas(image.element, width, height);
          if (mime === "image/jpeg") flattenForJpeg(canvas);
          blob = await encodeCanvas(canvas, mime, q / 100);
        }
        return { blob, sizeBytes: blob.size, quality: outQuality, width, height, scaledDown, mime };
      } finally {
        // Release the decoded bitmap immediately — bounds memory in large batches.
        revokeLoadedImage(image);
      }
    },
    [],
  );

  const runBatch = useCallback(
    async (m: "quality" | "target", q: number, kb: number, mime: OutputMime) => {
      if (workingRef.current) return;
      const queued = itemsRef.current.filter((i) => i.status === "queued");
      if (queued.length === 0) return;
      setLastRunSig(null);
      workingRef.current = true;
      setWorking(true);
      setNotice(null);
      trackEvent("compress_batch_started", { count: queued.length, mode: m });
      let succeeded = 0;
      try {
        for (;;) {
          const next = itemsRef.current.find((i) => i.status === "queued");
          if (!next) break;
          updateItem(next.id, { status: "working", error: null });
          try {
            const r = await compressOne(next.file, m, q, kb, mime);
            const prev = itemsRef.current.find((i) => i.id === next.id)?.result;
            if (prev) URL.revokeObjectURL(prev.url);
            const url = URL.createObjectURL(r.blob);
            updateItem(next.id, {
              status: "done",
              result: { ...r, url },
              error: null,
            });
            succeeded += 1;
          } catch (err) {
            updateItem(next.id, { status: "error", error: errorMessage(err) });
          }
        }
      } finally {
        workingRef.current = false;
        setWorking(false);
        setLastRunSig(JSON.stringify([m, q, kb, mime]));
        trackEvent("compress_batch_completed", { succeeded, mode: m });
      }
    },
    [compressOne, updateItem],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const picked = Array.from(files);
      if (picked.length === 0) return;
      setNotice(null);
      const room = MAX_BATCH_FILES - itemsRef.current.length;
      if (room <= 0) {
        setNotice(`This batch is full (${MAX_BATCH_FILES} files). Download your results, then start a new batch.`);
        return;
      }
      const accepted = picked.slice(0, room);
      if (picked.length > room) {
        setNotice(
          `Only the first ${room} file${room === 1 ? "" : "s"} were added (10 per batch). Process the rest in a second batch.`,
        );
      }
      const fresh: BatchItem[] = [];
      for (const file of accepted) {
        const id = nextId.current;
        nextId.current += 1;
        const previewUrl = URL.createObjectURL(file);
        try {
          // Decode once for dimensions, then release — the batch loop
          // re-decodes each file only while it is being processed.
          const loaded = await loadImageFile(file);
          fresh.push({
            id,
            file,
            previewUrl,
            width: loaded.width,
            height: loaded.height,
            sizeBytes: file.size,
            result: null,
            error: null,
            status: "queued",
          });
          revokeLoadedImage(loaded);
        } catch (err) {
          URL.revokeObjectURL(previewUrl);
          fresh.push({
            id,
            file,
            previewUrl: null,
            width: 0,
            height: 0,
            sizeBytes: file.size,
            result: null,
            error: errorMessage(err),
            status: "error",
          });
        }
      }
      const next = [...itemsRef.current, ...fresh];
      syncItems(next);
      if (activeId === null && fresh.length > 0) setActiveId(fresh[0].id);
      void runBatch(mode, quality, targetKB, format);
    },
    [activeId, format, mode, quality, runBatch, syncItems, targetKB],
  );

  const recompressAll = useCallback(() => {
    const next = itemsRef.current.map((item) => {
      if (item.previewUrl === null) return item;
      if (item.result) URL.revokeObjectURL(item.result.url);
      return { ...item, result: null, error: null, status: "queued" as const };
    });
    syncItems(next);
    void runBatch(mode, quality, targetKB, format);
  }, [format, mode, quality, runBatch, syncItems, targetKB]);

  const removeItem = useCallback(
    (id: number) => {
      const target = itemsRef.current.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.result) URL.revokeObjectURL(target.result.url);
      const next = itemsRef.current.filter((i) => i.id !== id);
      syncItems(next);
      if (activeId === id) setActiveId(next.length > 0 ? next[0].id : null);
    },
    [activeId, syncItems],
  );

  const clearAll = useCallback(() => {
    for (const item of itemsRef.current) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    syncItems([]);
    setActiveId(null);
    setNotice(null);
  }, [syncItems]);

  const handleZip = useCallback(async () => {
    const done = itemsRef.current.filter((i) => i.status === "done" && i.result);
    if (done.length === 0 || zipBusy) return;
    setZipBusy(true);
    setNotice(null);
    try {
      await downloadZip(
        done.map((i) => ({
          name: withExtension(`compressed-${i.file.name}`, (i.result as CompressResult).mime),
          blob: (i.result as CompressResult).blob,
        })),
        "pixelshrink-compressed",
      );
      trackEvent("compress_zip_downloaded", { count: done.length });
    } catch {
      setNotice("The ZIP could not be created in this browser. Download the files individually instead.");
    } finally {
      setZipBusy(false);
    }
  }, [zipBusy]);

  const doneCount = items.filter((i) => i.status === "done").length;
  const queuedCount = items.filter((i) => i.status === "queued" || i.status === "working").length;
  const active = items.find((i) => i.id === activeId) ?? items[0] ?? null;
  const currentSig = JSON.stringify([mode, quality, targetKB, format]);
  const stale = doneCount > 0 && !working && lastRunSig !== null && lastRunSig !== currentSig;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop images here or press Enter to choose files"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors focus-visible:outline-2 ${
          dragOver ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-slate-500"
        }`}
      >
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {items.length === 0 ? "Drop images here or click to browse" : `Add more images (${items.length}/${MAX_BATCH_FILES})`}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Up to {MAX_BATCH_FILES} files · JPG, PNG, WebP, GIF, BMP, AVIF — up to 50MB each. Files never
          leave your device.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {notice && (
        <div role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {notice}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100" id="batch-heading">
              Batch ({items.length} file{items.length === 1 ? "" : "s"} · {doneCount} done)
            </p>
            <button
              type="button"
              onClick={clearAll}
              disabled={working}
              className="text-xs font-medium text-slate-500 underline hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear all
            </button>
          </div>
          <div
            className={`mt-2 ${working ? "" : "invisible"}`}
            role="progressbar"
            aria-label="Batch compression progress"
            aria-valuemin={0}
            aria-valuemax={items.length}
            aria-valuenow={doneCount}
            aria-hidden={!working}
          >
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
                />
              </div>
              <p aria-live="polite" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Compressing… {doneCount} of {items.length} done
              </p>
          </div>
          <ul aria-labelledby="batch-heading" className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={active?.id === item.id}
                  aria-label={`Preview ${item.file.name}`}
                  className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-slate-50 focus-visible:outline-2 dark:bg-slate-800 ${
                    active?.id === item.id ? "border-blue-600" : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {item.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-xs text-slate-400">?</span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{item.file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.status === "working" && "Compressing…"}
                    {item.status === "queued" && `Queued · ${formatBytes(item.sizeBytes)}`}
                    {item.status === "done" && item.result && (
                      <>{formatBytes(item.sizeBytes)} → {formatBytes(item.result.sizeBytes)} · {item.result.width}×{item.result.height}px</>
                    )}
                    {item.status === "error" && (item.error ?? "Failed")}
                  </p>
                </div>
                {item.status === "done" && item.result && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!item.result) return;
                      downloadBlob(item.result.blob, withExtension(`compressed-${item.file.name}`, item.result.mime));
                      trackEvent("compress_downloaded", { files: 1 });
                    }}
                    className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2"
                  >
                    Download
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={working}
                  aria-label={`Remove ${item.file.name} from batch`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 focus-visible:outline-2 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <span aria-hidden="true" className="text-lg leading-none">×</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mode</legend>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Compression mode">
              <button
                type="button"
                onClick={() => setMode("quality")}
                aria-pressed={mode === "quality"}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline-2 ${
                  mode === "quality" ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-slate-500"
                }`}
              >
                Quality slider
              </button>
              <button
                type="button"
                onClick={() => setMode("target")}
                aria-pressed={mode === "target"}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline-2 ${
                  mode === "target" ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-slate-500"
                }`}
              >
                Exact KB target
              </button>
            </div>
          </fieldset>

          {mode === "quality" ? (
            <div>
              <label htmlFor="cmp-quality" className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quality <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{quality}%</span>
              </label>
              <input
                id="cmp-quality"
                type="range"
                min={5}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Lower values shrink the file but soften fine detail. 70–85% is the sweet spot for photos.</p>
            </div>
          ) : (
            <div>
              <label htmlFor="cmp-target" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Target size (KB){lockTargetKB ? " — fixed for this tool" : ""}
              </label>
              <input
                id="cmp-target"
                type="number"
                min={5}
                max={10240}
                value={targetKB}
                disabled={lockTargetKB}
                onChange={(e) => setTargetKB(Math.max(5, Number(e.target.value) || 5))}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 focus-visible:outline-2 dark:border-slate-600 dark:disabled:bg-slate-800"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Binary search over encoder quality hits your exact byte target, shrinking dimensions only if quality alone can&apos;t get there.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="cmp-format" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Output format
            </label>
            <select
              id="cmp-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputMime)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 dark:border-slate-600 dark:bg-slate-900"
            >
              {FORMATS.map((f) => (
                <option key={f.mime} value={f.mime}>
                  {f.label}
                </option>
              ))}
            </select>
            {format === "image/png" && mode === "quality" && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG is lossless, so the quality slider has no effect — file size changes only in target-KB mode.</p>
            )}
          </div>

          <button
            type="button"
            onClick={recompressAll}
            disabled={items.length === 0 || working}
            aria-busy={working}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-2"
          >
            {working
              ? `Compressing… ${doneCount}/${items.length}`
              : items.length === 0
                ? "Choose images to start"
                : doneCount === items.length && doneCount > 0
                  ? "Re-compress all"
                  : `Compress ${queuedCount > 0 ? queuedCount : items.length} image${items.length === 1 ? "" : "s"}`}
          </button>
          {stale ? (
            <p role="status" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Settings changed — these sizes are from the previous settings. Press “Re-compress
              all” to update them.
            </p>
          ) : null}
          {doneCount >= 2 && (
            <button
              type="button"
              onClick={() => void handleZip()}
              disabled={zipBusy || working}
              aria-busy={zipBusy}
              className="w-full rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 dark:text-emerald-300 dark:hover:bg-emerald-950"
            >
              {zipBusy ? "Preparing ZIP…" : `Download all as ZIP (${doneCount})`}
            </button>
          )}
        </div>

        <div aria-live="polite" className="space-y-3">
          {items.length === 0 ? (
            <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-10 text-center dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Your before / after comparison will appear here.</p>
            </div>
          ) : (
            items.map((item) => {
              const itemSavings =
                item.result != null ? savingsPercent(item.sizeBytes, item.result.sizeBytes) : 0;
              return (
              <div
                key={item.id}
                className={`rounded-xl border p-3 dark:border-slate-700 ${
                  active?.id === item.id ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
                }`}
              >
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.file.name}</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Before</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{formatBytes(item.sizeBytes)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.width} × {item.height} px
                    </p>
                    {item.previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.previewUrl} alt="" className="mt-2 max-h-32 w-full rounded-lg object-contain bg-slate-50 dark:bg-slate-800" />
                    )}
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-2 dark:border-blue-800 dark:bg-blue-950/50">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">After</p>
                    {item.result ? (
                      <>
                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{formatBytes(item.result.sizeBytes)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.result.width} × {item.result.height} px · {itemSavings}% smaller
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.result.url} alt={`Compressed result for ${item.file.name}`} className="mt-2 max-h-32 w-full rounded-lg object-contain bg-white dark:bg-slate-900" />
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.status === "working" ? "Working…" : item.status === "error" ? (item.error ?? "Failed") : "Queued…"}
                      </p>
                    )}
                  </div>
                </div>
                {item.result && mode === "target" && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Final quality {Math.round(item.result.quality * 100)}%
                    {item.result.scaledDown ? " · dimensions reduced to hit the target" : " · full dimensions kept"} ·{" "}
                    {item.result.sizeBytes <= targetKB * 1024 ? "target met ✓" : "target missed — try a larger KB value or WebP"}
                  </p>
                )}
                {item.result && mode === "quality" && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Encoded at {Math.round(item.result.quality * 100)}% quality · {itemSavings}% smaller than the original.
                  </p>
                )}
                {item.result && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!item.result) return;
                      downloadBlob(item.result.blob, withExtension(`compressed-${item.file.name}`, item.result.mime));
                      trackEvent("compress_downloaded", { files: 1 });
                    }}
                    className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2"
                  >
                    Download compressed image
                  </button>
                )}
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
