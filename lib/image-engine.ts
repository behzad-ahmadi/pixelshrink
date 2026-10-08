/**
 * Shared client-side image engine for PixelShrink.
 *
 * Everything runs locally with <canvas> + File APIs: images are decoded,
 * transformed, and re-encoded in the browser. Re-encoding strips EXIF and
 * other metadata by default, since encoders only write pixel data.
 */

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const DECODABLE_TYPES = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
]);

const HEIC_TYPES = new Set<string>([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

/** True for iPhone-style HEIC/HEIF files, by MIME or extension. */
export function isHeicFile(file: File): boolean {
  if (HEIC_TYPES.has(file.type.toLowerCase())) return true;
  return /\.(heic|heif)$/i.test(file.name);
}

/**
 * Load any supported image, decoding HEIC/HEIF via heic2any first.
 * The WASM decoder is dynamically imported so it only loads when a
 * HEIC file is actually chosen — other formats pay nothing.
 */
export async function loadImageFileMaybeHeic(file: File): Promise<LoadedImage> {
  if (!isHeicFile(file)) return loadImageFile(file);
  if (file.size === 0) {
    throw new ImageEngineError(`"${file.name}" is empty. Please choose another file.`, "size");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ImageEngineError(
      `"${file.name}" is ${formatBytes(file.size)}. Files must be 50MB or smaller.`,
      "size",
    );
  }
  let converted: Blob;
  try {
    const { default: heic2any } = await import("heic2any");
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    converted = Array.isArray(out) ? out[0] : out;
  } catch {
    throw new ImageEngineError(
      `"${file.name}" could not be decoded as HEIC. The file may be corrupt or use an unsupported variant.`,
      "decode",
    );
  }
  return new Promise<LoadedImage>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(converted);
    const element = new Image();
    element.onload = () => {
      resolve({
        element,
        objectUrl,
        name: file.name,
        sizeBytes: file.size,
        width: element.naturalWidth,
        height: element.naturalHeight,
      });
    };
    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new ImageEngineError(
          `"${file.name}" could not be decoded after HEIC conversion.`,
          "decode",
        ),
      );
    };
    element.src = objectUrl;
  });
}

export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

export const OUTPUT_OPTIONS: ReadonlyArray<{
  mime: OutputMime;
  label: string;
  supportsQuality: boolean;
}> = [
  { mime: "image/jpeg", label: "JPEG", supportsQuality: true },
  { mime: "image/webp", label: "WebP", supportsQuality: true },
  { mime: "image/png", label: "PNG", supportsQuality: false },
];

export type EngineErrorCode = "type" | "size" | "decode" | "encode";

export class ImageEngineError extends Error {
  code: EngineErrorCode;
  constructor(message: string, code: EngineErrorCode) {
    super(message);
    this.name = "ImageEngineError";
    this.code = code;
  }
}

export interface LoadedImage {
  element: HTMLImageElement;
  objectUrl: string;
  name: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export function validateFile(file: File): void {
  if (!DECODABLE_TYPES.has(file.type)) {
    throw new ImageEngineError(
      `"${file.name}" is a ${file.type || "unknown"} file. Please choose a JPEG, PNG, WebP, GIF, BMP, or AVIF image.`,
      "type",
    );
  }
  if (file.size === 0) {
    throw new ImageEngineError(`"${file.name}" is empty. Please choose another file.`, "size");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ImageEngineError(
      `"${file.name}" is ${formatBytes(file.size)}. Files must be 50MB or smaller.`,
      "size",
    );
  }
}

export function loadImageFile(file: File): Promise<LoadedImage> {
  validateFile(file);
  return new Promise<LoadedImage>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const element = new Image();
    element.onload = () => {
      resolve({
        element,
        objectUrl,
        name: file.name,
        sizeBytes: file.size,
        width: element.naturalWidth,
        height: element.naturalHeight,
      });
    };
    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new ImageEngineError(
          `"${file.name}" could not be decoded. The file may be corrupt or use an unsupported variant.`,
          "decode",
        ),
      );
    };
    element.src = objectUrl;
  });
}

export function revokeLoadedImage(image: LoadedImage): void {
  URL.revokeObjectURL(image.objectUrl);
}

export function drawToCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageEngineError(
      "Canvas 2D is not available in this browser. Try a recent version of Chrome, Edge, Firefox, or Safari.",
      "encode",
    );
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Paint white behind transparent pixels. JPEG has no alpha channel, so
 * call this before encodeCanvas whenever the output is image/jpeg —
 * otherwise transparency exports as black.
 */
export function flattenForJpeg(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

export function encodeCanvas(
  canvas: HTMLCanvasElement,
  mime: OutputMime,
  quality: number,
): Promise<Blob> {
  const clamped = Math.min(1, Math.max(0.01, quality));
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new ImageEngineError(
              `Your browser could not encode ${mime}. Try JPEG or PNG instead.`,
              "encode",
            ),
          );
          return;
        }
        resolve(blob);
      },
      mime,
      mime === "image/png" ? undefined : clamped,
    );
  });
}

export interface TargetResult {
  blob: Blob;
  quality: number;
  width: number;
  height: number;
  scaledDown: boolean;
}

/**
 * Hit an exact byte target with binary search over encoder quality, then
 * fall back to progressively smaller dimensions if quality alone cannot
 * get there (typical for PNG or very small targets like 20KB).
 */
export async function compressToTargetBytes(
  image: HTMLImageElement,
  targetBytes: number,
  mime: OutputMime,
  startQuality = 0.9,
): Promise<TargetResult> {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  // JPEG has no alpha channel: flatten transparency onto white before
  // encoding, otherwise transparent pixels export as black.
  const drawForOutput = (): HTMLCanvasElement => {
    const canvas = drawToCanvas(image, width, height);
    if (mime === "image/jpeg") flattenForJpeg(canvas);
    return canvas;
  };

  if (mime === "image/png") {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const blob = await encodeCanvas(drawForOutput(), mime, 1);
      if (blob.size <= targetBytes || width <= 16 || height <= 16) {
        return { blob, quality: 1, width, height, scaledDown: attempt > 0 };
      }
      width = Math.floor(width * 0.88);
      height = Math.floor(height * 0.88);
    }
    const blob = await encodeCanvas(drawForOutput(), mime, 1);
    return { blob, quality: 1, width, height, scaledDown: true };
  }

  for (let scale = 0; scale < 10; scale += 1) {
    let low = 0.05;
    let high = Math.min(0.95, startQuality);
    let best: TargetResult | null = null;
    for (let i = 0; i < 7; i += 1) {
      const q = (low + high) / 2;
      const blob = await encodeCanvas(drawForOutput(), mime, q);
      if (blob.size <= targetBytes) {
        best = { blob, quality: q, width, height, scaledDown: scale > 0 };
        low = q;
      } else {
        high = q;
      }
    }
    if (best) return best;
    width = Math.floor(width * 0.88);
    height = Math.floor(height * 0.88);
    if (width < 16 || height < 16) break;
  }
  const blob = await encodeCanvas(drawForOutput(), mime, 0.05);
  return { blob, quality: 0.05, width, height, scaledDown: true };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function extensionFor(mime: OutputMime): "jpg" | "png" | "webp" {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

export function withExtension(name: string, mime: OutputMime): string {
  const base = name.replace(/\.[a-z0-9]+$/i, "");
  return `${base}.${extensionFor(mime)}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

export function savingsPercent(originalBytes: number, outputBytes: number): number {
  if (originalBytes <= 0) return 0;
  return Math.max(0, Math.round((1 - outputBytes / originalBytes) * 100));
}

/** Scale dimensions to fit inside maxW x maxH, preserving aspect ratio. */
export function fitDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (naturalWidth <= maxWidth && naturalHeight <= maxHeight) {
    return { width: naturalWidth, height: naturalHeight };
  }
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  };
}
