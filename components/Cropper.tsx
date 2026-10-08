"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageEngineError,
  downloadBlob,
  encodeCanvas,
  flattenForJpeg,
  formatBytes,
  loadImageFile,
  revokeLoadedImage,
  withExtension,
  type LoadedImage,
  type OutputMime,
} from "@/lib/image-engine";

interface Fractions {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ASPECTS: ReadonlyArray<{ name: string; ratio: number | null }> = [
  { name: "Free", ratio: null },
  { name: "1:1", ratio: 1 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "3:2", ratio: 3 / 2 },
  { name: "16:9", ratio: 16 / 9 },
];

const MIN = 0.02;

function clampSel(s: Fractions): Fractions {
  const w = Math.min(1, Math.max(MIN, s.w));
  const h = Math.min(1, Math.max(MIN, s.h));
  return {
    w,
    h,
    x: Math.min(1 - w, Math.max(0, s.x)),
    y: Math.min(1 - h, Math.max(0, s.y)),
  };
}

function enforceRatio(s: Fractions, ratio: number | null, imgAspect = 1): Fractions {
  if (ratio === null) return clampSel(s);
  // s.w / s.h are fractions of DIFFERENT bases (image width vs height), so
  // convert through real pixels: h_frac = w_frac * (W/H) / ratio.
  const { x, y } = s;
  let w = s.w;
  let h = (w * imgAspect) / ratio;
  if (y + h > 1) {
    h = 1 - y;
    w = (h * ratio) / imgAspect;
  }
  if (x + w > 1) {
    w = 1 - x;
    h = (w * imgAspect) / ratio;
  }
  return clampSel({ x, y, w, h });
}

function errorMessage(err: unknown): string {
  if (err instanceof ImageEngineError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong while cropping that image.";
}

export default function Cropper() {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [sel, setSel] = useState<Fractions>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [aspectName, setAspectName] = useState("Free");
  const [format, setFormat] = useState<OutputMime>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [working, setWorking] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gesture = useRef<{ mode: "create" | "move"; startX: number; startY: number; orig: Fractions } | null>(null);

  const activeRatio = ASPECTS.find((a) => a.name === aspectName)?.ratio ?? null;

  useEffect(() => {
    return () => {
      if (loaded) revokeLoadedImage(loaded);
    };
  }, [loaded]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    setError(null);
    setDoneInfo(null);
    try {
      const image = await loadImageFile(file);
      setLoaded((prev) => {
        if (prev) revokeLoadedImage(prev);
        return image;
      });
      setSel({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      setAspectName("Free");
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const toRelative = (clientX: number, clientY: number) => {
    const el = boxRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!loaded) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const p = toRelative(e.clientX, e.clientY);
    const inside = p.x >= sel.x && p.x <= sel.x + sel.w && p.y >= sel.y && p.y <= sel.y + sel.h;
    gesture.current = { mode: inside ? "move" : "create", startX: p.x, startY: p.y, orig: sel };
    if (!inside) setSel((s) => clampSel({ ...s, x: p.x, y: p.y, w: MIN, h: MIN }));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || !loaded) return;
    const p = toRelative(e.clientX, e.clientY);
    if (g.mode === "create") {
      const x = Math.min(g.startX, p.x);
      const y = Math.min(g.startY, p.y);
      const w = Math.max(MIN, Math.abs(p.x - g.startX));
      const h = Math.max(MIN, Math.abs(p.y - g.startY));
      const imgAspect = loaded.width / Math.max(1, loaded.height);
      setSel(enforceRatio({ x, y, w, h }, activeRatio, imgAspect));
    } else {
      const dx = p.x - g.startX;
      const dy = p.y - g.startY;
      setSel(clampSel({ ...g.orig, x: g.orig.x + dx, y: g.orig.y + dy }));
    }
  };

  const onPointerUp = () => {
    gesture.current = null;
  };

  const applyAspect = (name: string) => {
    setAspectName(name);
    const ratio = ASPECTS.find((a) => a.name === name)?.ratio ?? null;
    const imgAspect = loaded ? loaded.width / Math.max(1, loaded.height) : 1;
    setSel((s) => {
      const cx = s.x + s.w / 2;
      const cy = s.y + s.h / 2;
      if (ratio === null) return s;
      let h = Math.min(0.9, (s.w * imgAspect) / ratio, 1 - cy + 0.45);
      h = Math.min(h, 1);
      let w = (h * ratio) / imgAspect;
      if (w > 0.9) {
        w = 0.9;
        h = (w * imgAspect) / ratio;
      }
      return clampSel({ x: cx - w / 2, y: cy - h / 2, w, h });
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const sx = Math.round(sel.x * loaded.width);
    const sy = Math.round(sel.y * loaded.height);
    const sw = Math.max(1, Math.round(sel.w * loaded.width));
    const sh = Math.max(1, Math.round(sel.h * loaded.height));
    const scale = Math.min(1, 480 / Math.max(sw, sh));
    canvas.width = Math.max(1, Math.round(sw * scale));
    canvas.height = Math.max(1, Math.round(sh * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(loaded.element, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, [loaded, sel]);

  const handleDownload = useCallback(async () => {
    if (!loaded) return;
    setWorking(true);
    setError(null);
    try {
      const sx = Math.round(sel.x * loaded.width);
      const sy = Math.round(sel.y * loaded.height);
      const sw = Math.max(1, Math.round(sel.w * loaded.width));
      const sh = Math.max(1, Math.round(sel.h * loaded.height));
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new ImageEngineError("Canvas 2D is not available in this browser.", "encode");
      ctx.drawImage(loaded.element, sx, sy, sw, sh, 0, 0, sw, sh);
      if (format === "image/jpeg") flattenForJpeg(canvas);
      const blob = await encodeCanvas(canvas, format, quality / 100);
      downloadBlob(blob, withExtension(`cropped-${sw}x${sh}-${loaded.name}`, format));
      setDoneInfo(`Saved ${sw} × ${sh} px · ${formatBytes(blob.size)}.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setWorking(false);
    }
  }, [format, loaded, quality, sel]);

  const outW = loaded ? Math.max(1, Math.round(sel.w * loaded.width)) : 0;
  const outH = loaded ? Math.max(1, Math.round(sel.h * loaded.height)) : 0;

  // Live size estimate: re-encode the full-res crop offscreen (debounced so
  // slider drags stay smooth) and show the real byte count in the preview.
  const [estSize, setEstSize] = useState<number | null>(null);
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const sx = Math.round(sel.x * loaded.width);
          const sy = Math.round(sel.y * loaded.height);
          const sw = Math.max(1, Math.round(sel.w * loaded.width));
          const sh = Math.max(1, Math.round(sel.h * loaded.height));
          const canvas = document.createElement("canvas");
          canvas.width = sw;
          canvas.height = sh;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(loaded.element, sx, sy, sw, sh, 0, 0, sw, sh);
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
  }, [format, loaded, quality, sel]);

  const slider = (label: string, value: number, set: (v: number) => void, max = 100) => (
    <div>
      <label className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        {label} <span>{Math.round(value * 100)}%</span>
      </label>
      <input
        type="range"
        min={0}
        max={max}
        value={Math.round(value * 100)}
        onChange={(e) => set(Number(e.target.value) / 100)}
        className="w-full accent-blue-600"
      />
    </div>
  );

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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 ${
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
                ✓ Image selected — drag on the photo below to crop
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Drop an image here or click to browse</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">JPG, PNG, WebP, GIF, BMP, AVIF — up to 50MB. Cropping happens on-device.</p>
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

      {!loaded ? (
        <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-10 text-center dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Choose an image to start cropping — drag on the photo to draw your selection.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Aspect ratio">
              {ASPECTS.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => applyAspect(a.name)}
                  aria-pressed={aspectName === a.name}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium focus-visible:outline-2 ${
                    aspectName === a.name ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-slate-500"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
            <div
              ref={boxRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="relative inline-block max-w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loaded.objectUrl} alt="Crop source" draggable={false} className="block max-h-[420px] w-auto max-w-full" />
              <div
                aria-hidden
                className="pointer-events-none absolute border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)] dark:border-blue-400"
                style={{
                  left: `${sel.x * 100}%`,
                  top: `${sel.y * 100}%`,
                  width: `${sel.w * 100}%`,
                  height: `${sel.h * 100}%`,
                }}
              />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Selection: <strong>{outW} × {outH} px</strong>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {slider("Left", sel.x, (v) => setSel((s) => clampSel({ ...s, x: v })))}
              {slider("Top", sel.y, (v) => setSel((s) => clampSel({ ...s, y: v })))}
              {slider("Width", sel.w, (v) => {
                const imgAspect = loaded ? loaded.width / Math.max(1, loaded.height) : 1;
                return setSel((s) => enforceRatio({ ...s, w: Math.max(MIN, v) }, activeRatio, imgAspect));
              })}
              {slider("Height", sel.h, (v) =>
                setSel((s) => (activeRatio === null ? clampSel({ ...s, h: Math.max(MIN, v) }) : s)),
              )}
            </div>
            {activeRatio !== null && <p className="text-xs text-slate-500 dark:text-slate-400">Height follows the {aspectName} ratio — adjust width to resize.</p>}
          </div>

          <div className="space-y-3" aria-live="polite">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live preview</p>
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <canvas ref={canvasRef} className="max-w-full rounded-lg" aria-label="Cropped preview" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Output: <strong>{outW} × {outH} px</strong>
              {estSize !== null ? ` · ~${formatBytes(estSize)}` : " · measuring…"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="crp-format" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Format
                </label>
                <select
                  id="crp-format"
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
                <label htmlFor="crp-q" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Quality · {quality}%
                </label>
                <input
                  id="crp-q"
                  type="range"
                  min={5}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-3 w-full accent-blue-600"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={working}
              aria-busy={working}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-2 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              {working ? "Cropping…" : `Download ${outW} × ${outH} crop`}
            </button>
            {doneInfo && <p className="text-sm text-emerald-700 dark:text-emerald-300">{doneInfo}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
