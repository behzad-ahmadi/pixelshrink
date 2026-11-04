export const GUIDES = [
  {
    "slug": "resize-and-compress-images",
    "title": "Resize and compress images for upload",
    "tool": "/compress-image",
    "keyword": "resize and compress image",
    "intro": "Separate pixel requirements from the upload limit. A form can reject a small file because its width is wrong, or reject correctly sized pixels because the encoded file is too large.",
    "example": "For a hypothetical 1200 by 800 photo needed at 600 by 400, lock the aspect ratio and halve the width. Then set the upload limit. Reducing both dimensions by half leaves one quarter of the pixels to encode.",
    "workflow": "Read the destination requirements first. Set the final dimensions, select a supported output format, then apply compression. Inspect the downloaded result rather than assuming the preview meets the form rules."
  },
  {
    "slug": "image-compression-quality-settings",
    "title": "Image compression settings: quality versus file size",
    "tool": "/image-compressor",
    "keyword": "image compression quality settings",
    "intro": "Compressing an image reduces encoded bytes; it does not necessarily change width and height. Keep dimensions when the destination requires exact pixels and start from the original file.",
    "example": "Try a moderate quality setting, compare fine hair, small lettering and gradients at full size, then adjust. A slider value is encoder-specific: the same number in two tools does not promise the same result.",
    "workflow": "Use quality mode when visual detail matters most. Use a KB target when an upload cap is mandatory. If the target cannot preserve readable text, reduce unnecessary background or reconsider the required dimensions."
  },
  {
    "slug": "resize-image-without-stretching",
    "title": "How to resize an image without stretching",
    "tool": "/resize-image",
    "keyword": "resize image without stretching",
    "intro": "Resizing changes pixel dimensions. Keeping the aspect ratio preserves proportions, while forcing an unrelated width and height can stretch faces and turn circles into ovals.",
    "example": "A 1600 by 900 image resized to 800 pixels wide should become 450 pixels tall. If the destination requires 800 by 800, crop to a square first instead of stretching the full frame.",
    "workflow": "Start with the largest original. Lock the ratio, enter one dimension and inspect the other. Avoid enlarging a small source when detail matters: interpolation adds pixels but cannot recover missing detail."
  },
  {
    "slug": "crop-image-aspect-ratio",
    "title": "How to crop an image to the right aspect ratio",
    "tool": "/crop-image",
    "keyword": "crop image aspect ratio",
    "intro": "Cropping removes part of the frame; resizing changes its dimensions. Choose the destination shape before shrinking so you keep the subject and discard unwanted background.",
    "example": "For a square profile picture, choose a 1:1 crop, center the face and leave room around the head. A circular display may hide the corners even though the downloaded image is square.",
    "workflow": "Keep a copy of the uncropped original. Review the crop edges, then resize and compress the result only if needed. Avoid trimming document borders or required identifying details."
  },
  {
    "slug": "choose-image-format",
    "title": "JPG vs PNG vs WebP: choose an image format",
    "tool": "/convert-image",
    "keyword": "jpg vs png vs webp",
    "intro": "Choose a format for the image and the destination together. JPEG suits photographs and broad compatibility; PNG preserves sharp graphics and transparency; WebP supports both lossy and lossless encoding.",
    "example": "For a product photo with no transparent background, compare JPEG and WebP exports at the same displayed dimensions. For a transparent logo, avoid JPEG because it cannot preserve the alpha channel.",
    "workflow": "Check accepted file types before converting. Changing the filename extension does not convert the image data. Download a real conversion and inspect its appearance, byte size and transparency."
  },
  {
    "slug": "heic-to-jpg-quality",
    "title": "Convert HEIC to JPG: quality and compatibility",
    "tool": "/convert/heic-to-jpg",
    "keyword": "convert heic to jpg quality",
    "intro": "HEIC photos can be inconvenient when an application only accepts JPEG. Convert from the original HEIC to avoid an extra round of encoding from an already compressed copy.",
    "example": "A JPEG export may be larger than the HEIC original. Conversion solves compatibility, so compare the downloaded file against any upload cap separately instead of assuming it also compresses the photo.",
    "workflow": "Open the JPEG after conversion and check orientation, colors and fine detail. Keep the HEIC original for editing. If decoding fails, try another original file or export a JPEG using your device photo application."
  },
  {
    "slug": "webp-to-jpg-for-uploads",
    "title": "Convert WebP to JPG for upload forms",
    "tool": "/convert/webp-to-jpg",
    "keyword": "convert webp to jpg for upload",
    "intro": "A downloaded WebP image may display correctly but be rejected by an older upload form. Exporting JPEG changes its encoding to a format the destination may accept.",
    "example": "If the WebP has transparent edges, JPEG must replace transparency with a solid background. Inspect those edges before using the result on a different page background.",
    "workflow": "Convert once from the original WebP, check the background and dimensions, then compress only if the file exceeds the destination limit. A different extension alone will not fix a rejected format."
  },
  {
    "slug": "png-to-jpg-transparency",
    "title": "PNG to JPG: reduce photo size and handle transparency",
    "tool": "/convert/png-to-jpg",
    "keyword": "png to jpg transparency",
    "intro": "PNG to JPG conversion can help with photographic PNG files, but JPEG loses transparency and uses lossy encoding. Keep PNG when crisp interface text or transparent edges are essential.",
    "example": "A photo exported as PNG is a useful candidate for a JPEG comparison. A transparent company logo is a poor candidate unless a solid background is acceptable. Inspect small text for ringing around letter edges.",
    "workflow": "Choose the background you need before conversion, inspect the exported corners and compare file sizes. Keep the original PNG so later design changes do not depend on a lossy JPEG."
  },
  {
    "slug": "jpg-to-webp-for-websites",
    "title": "Convert JPG to WebP for website images",
    "tool": "/convert/jpg-to-webp",
    "keyword": "jpg to webp for website",
    "intro": "WebP can reduce the bytes needed for website photos, but savings depend on the source and export settings. Measure the result rather than promising a fixed percentage.",
    "example": "Resize a large source to the dimensions needed by the page before encoding. Compare the WebP with the JPEG at the same visible size, paying attention to texture and gradients.",
    "workflow": "Check that your publishing system accepts WebP. Keep the JPEG original for future edits and compare actual download sizes. Converting an already degraded JPEG cannot recover its missing detail."
  },
  {
    "slug": "photo-under-20kb",
    "title": "How to make a photo smaller than 20KB",
    "tool": "/compress-image-to-20kb",
    "keyword": "how to compress photo under 20kb",
    "intro": "A 20KB photo limit is a file-size requirement, separate from pixel dimensions and format. Read all three requirements before editing; a smaller file can still be rejected for the wrong shape.",
    "example": "At a tight 20KB limit, remove unused background first and prioritize readable faces or signature strokes. Large dimensions and detailed backgrounds compete for a small encoding budget.",
    "workflow": "Use the 20KB target, download the result and verify the actual file size. A portal may interpret KB differently or require a strict less-than comparison, so leave a little headroom. If it still rejects the file, check format and dimensions next."
  },
  {
    "slug": "photo-under-50kb",
    "title": "How to make a photo smaller than 50KB",
    "tool": "/compress-image-to-50kb",
    "keyword": "how to compress photo under 50kb",
    "intro": "A 50KB photo limit is a file-size requirement, separate from pixel dimensions and format. Read all three requirements before editing; a smaller file can still be rejected for the wrong shape.",
    "example": "For a 50KB submission, start with a well-lit original and crop unused margins. Preserve required document boundaries; cutting important text to save bytes defeats the purpose.",
    "workflow": "Use the 50KB target, download the result and verify the actual file size. A portal may interpret KB differently or require a strict less-than comparison, so leave a little headroom. If it still rejects the file, check format and dimensions next."
  },
  {
    "slug": "photo-under-100kb",
    "title": "How to make a photo smaller than 100KB",
    "tool": "/compress-image-to-100kb",
    "keyword": "how to compress photo under 100kb",
    "intro": "A 100KB photo limit is a file-size requirement, separate from pixel dimensions and format. Read all three requirements before editing; a smaller file can still be rejected for the wrong shape.",
    "example": "A 100KB budget can still be restrictive for a detailed full-page scan. Check small letters at full size and avoid treating a successful download as proof that the document remains readable.",
    "workflow": "Use the 100KB target, download the result and verify the actual file size. A portal may interpret KB differently or require a strict less-than comparison, so leave a little headroom. If it still rejects the file, check format and dimensions next."
  }
];
