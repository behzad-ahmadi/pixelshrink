import assert from "node:assert/strict";
import test from "node:test";
import { compressToTargetBytes, ImageEngineError, resizeDimensions } from "../lib/image-engine.ts";

test("a width or height alone preserves each image's proportions", () => {
  assert.deepEqual(resizeDimensions(4000, 3000, { width: 1000, keepAspectRatio: true }), { width: 1000, height: 750 });
  assert.deepEqual(resizeDimensions(600, 1200, { height: 300, keepAspectRatio: true }), { width: 150, height: 300 });
});

test("a shared bounding box preserves different batch aspect ratios", () => {
  const settings = { width: 1000, height: 1000, keepAspectRatio: true };
  assert.deepEqual(resizeDimensions(4000, 3000, settings), { width: 1000, height: 750 });
  assert.deepEqual(resizeDimensions(2000, 4000, settings), { width: 500, height: 1000 });
});

test("unlocked dimensions use the exact requested size", () => {
  assert.deepEqual(resizeDimensions(4000, 3000, { width: 800, height: 800, keepAspectRatio: false }), { width: 800, height: 800 });
  assert.deepEqual(resizeDimensions(4000, 3000, { width: 800, keepAspectRatio: false }), { width: 800, height: 3000 });
});

test("blank dimensions preserve the original and thin images stay at least one pixel", () => {
  assert.deepEqual(resizeDimensions(9000, 3000, { keepAspectRatio: true }), { width: 9000, height: 3000 });
  assert.deepEqual(resizeDimensions(8000, 1, { width: 1, keepAspectRatio: true }), { width: 1, height: 1 });
});

test("invalid or oversized output dimensions are rejected", () => {
  for (const width of [0, -1, 1.5, NaN, Infinity, 8001]) {
    assert.throws(() => resizeDimensions(400, 200, { width, keepAspectRatio: true }), ImageEngineError);
  }
  assert.throws(() => resizeDimensions(1, 8000, { width: 8000, keepAspectRatio: true }), ImageEngineError);
});

async function withCanvas(run) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: () => {
      const canvas = {
        width: 0,
        height: 0,
        getContext: () => ({ drawImage() {}, fillRect() {} }),
        toBlob: (callback, mime, quality) => callback(new Blob([
          new Uint8Array(Math.ceil(canvas.width * canvas.height * (mime === "image/png" ? 1 : quality))),
        ], { type: mime })),
      };
      return canvas;
    },
  };
  try {
    await run();
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
}

test("an impossible JPEG target keeps explicit resize dimensions and reports the real size", async () => {
  await withCanvas(async () => {
    const result = await compressToTargetBytes({ naturalWidth: 400, naturalHeight: 200 }, 1, "image/jpeg", 0.9, {
      width: 120, height: 60, allowDimensionReduction: false,
    });
    assert.equal(result.width, 120);
    assert.equal(result.height, 60);
    assert.equal(result.scaledDown, false);
    assert.ok(result.blob.size > 1);
  });
});

test("a PNG target also preserves explicit dimensions when it cannot fit", async () => {
  await withCanvas(async () => {
    const result = await compressToTargetBytes({ naturalWidth: 400, naturalHeight: 200 }, 1, "image/png", 0.9, {
      width: 64, height: 32, allowDimensionReduction: false,
    });
    assert.equal(result.width, 64);
    assert.equal(result.height, 32);
    assert.equal(result.scaledDown, false);
    assert.ok(result.blob.size > 1);
  });
});

test("quality search meets an achievable target at the selected dimensions", async () => {
  await withCanvas(async () => {
    const result = await compressToTargetBytes({ naturalWidth: 400, naturalHeight: 200 }, 1000, "image/webp", 0.9, {
      width: 160, height: 80, allowDimensionReduction: false,
    });
    assert.equal(result.width, 160);
    assert.equal(result.height, 80);
    assert.ok(result.blob.size <= 1000);
  });
});

test("the original compressor still reduces dimensions to reach a small target", async () => {
  await withCanvas(async () => {
    for (const mime of ["image/jpeg", "image/png"]) {
      const target = mime === "image/png" ? 5000 : 1000;
      const result = await compressToTargetBytes({ naturalWidth: 400, naturalHeight: 200 }, target, mime);
      assert.ok(result.blob.size <= target);
      assert.equal(result.scaledDown, true);
    }
  });
});
