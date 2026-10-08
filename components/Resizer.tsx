"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageEngineError,
  downloadBlob,
  drawToCanvas,
  encodeCanvas,
  flattenForJpeg,
  formatBytes,
  loadImageFile,
  revokeLoadedImage,
  savingsPercent,
  withExtension,
  type LoadedImage,
  type OutputMime,
} from "@/lib/image-engine";

interface Preset {
  name: string;
  width: number;
  height: number;
  note: string;
}

const PRESETS: Preset[] = [
  { name: "Instagram Square", width: 1080, height: 1080, note: "Feed post" },
  { name: "Instagram Portrait", width: 1080, height: 1350, note: "Feed post 4:5" },
  { name: "Instagram Story", width: 1080, height: 1920, note: "Story / Reel 9:16" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, note: "16:9 cover" },
  { name: "Passport Photo", width: 600, height: 600, note: "2×2 in @300dpi" },
  { name: "LinkedIn Banner", width: 1584, height: 396, note: "Profile cover" },
  { name: "LinkedIn Post", width: 1200, height: 627, note: "Link preview" },
  { name: "X / Facebook Post", width: 1600, height: 900, note: "Landscape 16:9" },
];

function errorMessage(err: unknown): string {
  if (err instanceof ImageEngineError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong while resizing that image.";
}

export default function Resizer() {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [widthStr, setWidthStr] = useState("");
  const [heightStr, setHeightStr] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<OutputMime>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [estSize, setEstSize] = useState<number | null>(null);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (loaded) revokeLoadedImage(loaded);
    };
  }, [loaded]);

  useEffect(() => {
    return () => {
      if (outUrl) URL.revokeObjectURL(outUrl);
    };
  }, [outUrl]);

  const ratio = loaded && loaded.height > 0 ? loaded.width / loaded.height : 1;

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    setError(null);
    setOutBlob(null);
    setOutSize(null);
    setEstSize(null);
    setOutUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setActivePreset(null);
    try {
      const image = await loadImageFile(file);
      setLoaded((prev) => {
        if (prev) revokeLoadedImage(prev);
        return image;
      });
      setWidthStr(String(image.width));
      setHeightStr(String(image.height));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const onWidthChange = (v: string) => {
    setWidthStr(v);
    setActivePreset(null);
    const w = parseInt(v, 10);
    if (lockAspect && Number.isFinite(w) && w > 0 && loaded) {
      setHeightStr(String(Math.max(1, Math.round(w / ratio))));
    }
  };

  const onHeightChange = (v: string) => {
    setHeightStr(v);
    setActivePreset(null);
    const h = parseInt(v, 10);
    if (lockAspect && Number.isFinite(h) && h > 0 && loaded) {
      setWidthStr(String(Math.max(1, Math.round(h * ratio))));
    }
  };

  const applyPreset = (p: Preset) => {
    if (lockAspect && loaded) {
      // Fit inside the preset box without stretching: use the tighter scale.
      const scale = Math.min(p.width / loaded.width, p.height / loaded.height);
      setWidthStr(String(Math.max(1, Math.round(loaded.width * scale))));
      setHeightStr(String(Math.max(1, Math.round(loaded.height * scale))));
    } else {
      setWidthStr(String(p.width));
      setHeightStr(String(p.height));
    }
    setActivePreset(p.name);
  };

  const handleResize = useCallback(async () => {
    if (!loaded) return;
    const w = parseInt(widthStr, 10);
    const h = parseInt(heightStr, 10);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1 || w > 8000 || h > 8000) {
      setError("Enter a width and height between 1 and 8000 pixels.");
      return;
    }
    setWorking(true);
    setError(null);
    try {
      const canvas = drawToCanvas(loaded.element, w, h);
      if (format === "image/jpeg") flattenForJpeg(canvas);
      const blob = await encodeCanvas(canvas, format, quality / 100);
      setOutBlob(blob);
      setOutSize(blob.size);
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setWorking(false);
    }
  }, [format, heightStr, loaded, quality, widthStr]);

  const wEst = parseInt(widthStr, 10);
  const hEst = parseInt(heightStr, 10);
  const dimsValid =
    Number.isFinite(wEst) && Number.isFinite(hEst) && wEst >= 1 && hEst >= 1 && wEst <= 8000 && hEst <= 8000;

  // Live size estimate: re-encode the resized output offscreen (debounced so
  // typing dimensions or dragging quality stays smooth).
  useEffect(() => {
    if (!loaded || !dimsValid) return;
    const ew = parseInt(widthStr, 10);
    const eh = parseInt(heightStr, 10);
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const canvas = drawToCanvas(loaded.element, ew, eh);
          if (format === "image/jpeg") flattenForJpeg(canvas);
          const blob = await encodeCanvas(canvas, format, quality / 100);
          if (!cancelled) setEstSize(blob.size);
        } catch {
          if (!cancelled) setEstSize(null);
        }
      })();
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dimsValid, format, heightStr, loaded, quality, widthStr]);

  const w = parseInt(widthStr, 10);
  const h = parseInt(heightStr, 10);
  const upscaling = loaded && Number.isFinite(w) && Number.isFinite(h) && (w > loaded.width || h > loaded.height);
  const megapixels = Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 ? ((w * h) / 1_000_000).toFixed(1) : "–";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop an image here or press Enter to choose a file"
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
        {loaded ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={loaded.objectUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-600"
            />
            <div className="min-w-0 text-left">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{loaded.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {loaded.width} × {loaded.height} px · {formatBytes(loaded.sizeBytes)}
              </p>
              <p className="mt-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                ✓ Image selected — set size and press Resize
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Drop an image here or click to browse
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              JPG, PNG, WebP, GIF, BMP, AVIF — up to 50MB. Processed locally.
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Presets</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              title={`${p.width} × ${p.height} — ${p.note}`}
              aria-pressed={activePreset === p.name}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium focus-visible:outline-2 ${
                activePreset === p.name
                  ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-slate-500"
              }`}
            >
              {p.name} · {p.width}×{p.height}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rsz-w" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Width (px)
              </label>
              <input
                id="rsz-w"
                type="number"
                min={1}
                max={8000}
                value={widthStr}
                onChange={(e) => onWidthChange(e.target.value)}
                placeholder="1920"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 dark:border-slate-600"
              />
            </div>
            <div>
              <label htmlFor="rsz-h" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Height (px)
              </label>
              <input
                id="rsz-h"
                type="number"
                min={1}
                max={8000}
                value={heightStr}
                onChange={(e) => onHeightChange(e.target.value)}
                placeholder="1080"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 dark:border-slate-600"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Lock aspect ratio {loaded ? `(${loaded.width}:${loaded.height})` : ""}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rsz-format" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Format
              </label>
              <select
                id="rsz-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputMime)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 dark:border-slate-600 dark:bg-slate-900"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
            <div>
              <label htmlFor="rsz-q" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quality · {quality}%
              </label>
              <input
                id="rsz-q"
                type="range"
                min={5}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-3 w-full accent-blue-600"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Output ≈ {megapixels} MP.
            {upscaling ? " You are upscaling beyond the original — edges may look soft." : ""}
          </p>
          {loaded && dimsValid ? (
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Estimated size:{" "}
              <strong>{estSize !== null ? `~${formatBytes(estSize)}` : "measuring…"}</strong>
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void handleResize()}
            disabled={!loaded || working}
            aria-busy={working}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-2"
          >
            {working ? "Resizing…" : "Resize image"}
          </button>
        </div>

        <div aria-live="polite">
          {!outUrl || outSize === null ? (
            <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-10 text-center dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {loaded ? "Set your dimensions and press Resize image." : "Your resized preview will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outUrl} alt="Resized result" className="max-h-56 w-full rounded-lg object-contain bg-white dark:bg-slate-900" />
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <strong>
                  {widthStr} × {heightStr} px
                </strong>{" "}
                · {formatBytes(outSize)}
                {loaded ? ` · ${savingsPercent(loaded.sizeBytes, outSize)}% vs original` : ""}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (outBlob && loaded) downloadBlob(outBlob, withExtension(`resized-${w}x${h}-${loaded.name}`, format));
                }}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2"
              >
                Download resized image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
