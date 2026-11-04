export const ARTICLE_NOTES: Record<string, { title: string; paragraphs: string[] }[]> = {
  "/compress-image": [
    {
      "title": "When the upload form asks for two different sizes",
      "paragraphs": [
        "You have probably seen a form ask for a photo in pixels and then give a separate limit in KB. Those numbers describe different things. Pixels describe the canvas; KB describes the saved file. Changing one may help with the other, but it does not prove that both requirements are satisfied.",
        "Write the requirements down before editing. If the photo needs a different shape, crop it first. Then set its dimensions and compress the final canvas. This saves you from repeatedly exporting a photo that was the wrong shape to begin with."
      ]
    }
  ],
  "/image-compressor": [
    {
      "title": "The best setting is the one your picture can tolerate",
      "paragraphs": [
        "A bright portrait, a grainy night photo and a screenshot of tiny text will not behave the same way under compression. That is why a single recommended quality number can only be a starting point. Look at the part of the image that matters to you, rather than judging the whole preview from a distance.",
        "If letters develop fuzzy outlines or a face loses its texture, back off the compression. If the image already fits the destination limit, there is little reason to keep pushing it smaller. Keep the original and download a version that solves the actual problem."
      ]
    }
  ],
  "/resize-image": [
    {
      "title": "A square box does not mean you should stretch the picture",
      "paragraphs": [
        "Imagine putting a landscape photo into a square profile slot. Typing equal width and height values can make it fit, but it also changes the proportions of everything in the frame. Cropping is usually the better way to get a new shape while keeping people and objects looking natural.",
        "Resize after choosing the crop. A small original will not gain real detail when enlarged, even if the exported dimensions are bigger. For a print or an identity document, check the receiving service’s instructions instead of relying on a social-media preset."
      ]
    }
  ],
  "/crop-image": [
    {
      "title": "How to make a 1x1 crop that still feels comfortable",
      "paragraphs": [
        "A 1x1 crop is simply a square: its width and height are equal. It says nothing about the final pixel count. You can crop a large square now and resize it later if a profile page asks for a smaller file.",
        "Leave a little breathing room above a head and around the sides of the subject. Profile pictures are often displayed inside a circle, which can hide details near the square’s corners. For documents, the priority changes: keep all required borders and text, even if a tighter crop would look neater."
      ]
    }
  ],
  "/convert-image": [
    {
      "title": "Choose the destination before choosing the format",
      "paragraphs": [
        "The most useful format is the one that preserves what matters and works where you need it. A transparent badge has different needs from a holiday photo. A website you control may accept WebP, while a form you cannot change may insist on JPEG.",
        "Try one representative image before converting a whole set. Check its background, small text and file size after download. Saving to a new format does not recover detail that was missing from the original, so keep your best source for later edits."
      ]
    }
  ],
  "/convert/heic-to-jpg": [
    {
      "title": "Keep the iPhone original, share a JPEG copy",
      "paragraphs": [
        "Converting a HEIC photo is usually about making it easier to open elsewhere. It is not a promise of a smaller file. A perfectly usable JPEG can be larger than the HEIC you started with, so check the result before attaching it to a size-limited form.",
        "Look at orientation and color as well as sharpness. If the photo is important, keep the original in your photo library and treat the JPEG as a delivery copy. For a Live Photo, a still-image conversion is not a replacement for its moving portion."
      ]
    }
  ],
  "/convert/webp-to-jpg": [
    {
      "title": "When a downloaded image will not attach",
      "paragraphs": [
        "An upload form may reject a WebP even though your browser displays it without trouble. Renaming the file to end in .jpg only changes its label. A real conversion decodes the picture and saves new JPEG image data.",
        "Pay particular attention to transparent areas. JPEG cannot keep them transparent, so a formerly invisible background becomes solid. Check the exported image on the background where it will actually appear, especially around logos and rounded edges."
      ]
    }
  ],
  "/convert/png-to-jpg": [
    {
      "title": "The photo and the logo need different decisions",
      "paragraphs": [
        "A photographic PNG can be a good candidate for JPEG. A logo with transparent edges or a screenshot full of small lettering deserves more caution. JPEG can introduce marks around sharp contrast, and transparency cannot survive the conversion.",
        "Compare the downloaded result at the size people will use it. If the text becomes harder to read, keeping PNG may be worth the extra bytes. If you only needed to shrink a large photo, resize it to useful dimensions before deciding how much JPEG compression to apply."
      ]
    }
  ],
  "/convert/jpg-to-webp": [
    {
      "title": "Measure the saving instead of assuming it",
      "paragraphs": [
        "WebP is worth trying for website photos, but every source is different. An already small JPEG may offer little room for improvement. Compare the actual file sizes and inspect the same image details before deciding which export to publish.",
        "Check your publishing workflow too. If an image editor, email service or content system does not accept the export, a theoretical saving will not help. Keep the original JPEG so a later edit does not start with another compressed generation."
      ]
    }
  ],
  "/compress-image-to-20kb": [
    {
      "title": "A tiny budget needs a simple picture",
      "paragraphs": [
        "At 20KB, unnecessary background can take space away from the face or signature the form actually needs. Start with a clear original, crop only what is safe to remove, and follow the stated pixel dimensions. Do not make a required document incomplete to save bytes.",
        "After downloading, inspect thin signature strokes and small letters. If they are disappearing, the file is not useful just because it is under the limit. Check whether the portal allows a different format or a smaller set of dimensions, and leave a little room below its maximum."
      ]
    }
  ],
  "/compress-image-to-50kb": [
    {
      "title": "Make the signature readable before making it smaller",
      "paragraphs": [
        "A dim photograph of a signature often compresses poorly because shadows and paper texture fill the frame. A clearer original can be more useful than repeatedly lowering quality on the same noisy picture. Keep the whole signature and remove only unneeded surrounding paper.",
        "For identity photos, follow the portal’s framing rules rather than improvising a tight crop. Download a trial version, open it and check its dimensions and byte size. A portal can reject the correct KB value if the file type or proportions are wrong."
      ]
    }
  ],
  "/compress-image-to-100kb": [
    {
      "title": "A listing photo and a scanned page have different priorities",
      "paragraphs": [
        "A product photo may still work well after reducing its dimensions, as long as buyers can see the relevant details. A scanned page is less forgiving: small letters can become unreadable long before the overall preview looks obviously damaged.",
        "Check the smallest important detail at full size. If the required document cannot fit clearly, consult the destination’s requirements before making further cuts. Keep your original scan and avoid repeatedly compressing the last downloaded JPEG."
      ]
    }
  ]
};
