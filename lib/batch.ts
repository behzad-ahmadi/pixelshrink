import { downloadBlob } from "./image-engine";

/**
 * Make a filename unique within a batch by appending " - N" before the
 * extension: photo.jpg, photo - 2.jpg, photo - 3.jpg …
 */
export function uniqueFilename(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 2;
  let candidate = `${base} - ${i}${ext}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base} - ${i}${ext}`;
  }
  used.add(candidate);
  return candidate;
}

/**
 * Download several blobs as one .zip. JSZip is dynamically imported so
 * single-file users never pay for it; everything still runs locally.
 */
export async function downloadZip(
  files: Array<{ name: string; blob: Blob }>,
  zipName: string,
): Promise<void> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Set<string>();
  for (const file of files) {
    zip.file(uniqueFilename(file.name, used), file.blob);
  }
  const archive = await zip.generateAsync(
    { type: "blob", compression: "STORE" },
    undefined,
  );
  downloadBlob(archive, zipName.endsWith(".zip") ? zipName : `${zipName}.zip`);
}
