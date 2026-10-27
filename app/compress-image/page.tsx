import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import Compressor from '@/components/Compressor'
import Faq from '@/components/Faq'
import ToolShell from '@/components/ToolShell'
import { buildMetadata, canonical } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Resize and Compress Image Online Free',
  description:
    'Set custom width and height, preserve aspect ratio, and compress JPG, PNG & WebP online for free. Choose quality or KB targets. No signup or uploads.',
  path: '/compress-image',
})

const FAQS = [
  {
    question: 'Can I resize and compress an image online for free?',
    answer:
      'Yes. Enter a width, height, or both in Image dimensions, then choose a quality setting or KB target. The tool resizes and compresses each image in one run, locally in your browser, with no account or watermark.',
  },
  {
    question: 'Does compressing an image always change its dimensions?',
    answer:
      'No. Leave both dimension fields blank to keep the original size in quality mode. Enter dimensions to resize before compression. With aspect ratio locked, each image fits within the entered width and height. When custom dimensions are entered, target mode keeps them and reports a missed KB target rather than shrinking them further.',
  },
  {
    question: 'How do I set an exact width and height?',
    answer:
      'Enter both pixel dimensions and turn off Keep aspect ratio to use that exact width and height. This can stretch the image if the proportions differ from the original. To preserve proportions, leave the lock on: the result fits inside your chosen dimensions. Each output dimension can be up to 8000 pixels.',
  },
  {
    question: 'How does online image compression work?',
    answer:
      'The tool decodes your image and re-encodes it in your browser. Lower JPEG or WebP quality settings can reduce file size by discarding detail. PNG output is lossless at the chosen dimensions, so lowering a quality setting does not make it smaller; use a smaller canvas or another format when appropriate.',
  },
  {
    question: 'What quality setting should I choose?',
    answer:
      'Start around 80–85% for JPG or WebP photos, then compare the result with your original at full size. Increase quality if faces, small text, or gradients look damaged. The best setting and file-size savings depend on the image, output format, and browser.',
  },
  {
    question: 'Should I choose JPEG, PNG, or WebP output?',
    answer:
      'JPG is a common choice for photos and upload forms that require JPEG. WebP supports transparency and is useful for web images. PNG preserves pixel detail and transparency at the output dimensions, but photographic PNGs can be large. Always check which formats your destination accepts.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'No. Your image is decoded, resized when needed, and compressed locally in your browser. The image file is never uploaded to PixelShrink. No account is required to use the tool.',
  },
  {
    question: 'Why is my PNG still large after compressing?',
    answer:
      'PNG does not use the lossy quality slider. Enter smaller dimensions to make a smaller PNG, or leave dimensions blank to let target mode reduce them automatically. If custom dimensions are fixed and the target is missed, choose a larger KB target or try JPG/WebP. JPG replaces transparency with a white background.',
  },
  {
    question: 'Will compression remove EXIF and metadata?',
    answer:
      'Yes. Browser encoders write only pixel data, so camera settings, GPS coordinates, and timestamps in the original EXIF block are stripped from the output. That shrinks the file slightly and protects your privacy when sharing photos publicly.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Resize and Compress Image Online Free — PixelShrink',
  url: canonical('/compress-image'),
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0' },
  description:
    'Resize JPG, PNG, and WebP images with custom pixel dimensions and aspect-ratio control, then compress with quality settings or a KB target in one browser-based workflow. Free, no signup or image uploads.',
}

export default function CompressImagePage() {
  return (
    <>
      <div className='mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6'>
        <Breadcrumbs items={[{ label: 'Resize and Compress Image' }]} />
      </div>
      <ToolShell
        title='Resize and Compress Images for Free'
        intro='Set your image width and height, keep the aspect ratio or choose exact dimensions, then compress JPG, PNG, and WebP files in one step. Free, with no signup, watermark, or image uploads.'
        relatedExclude='/compress-image'
        guide={
          <>
            <h2>How to resize and compress an image online for free</h2>
            <p>
              A smaller image can mean fewer pixels, fewer kilobytes, or both.
              Use this free online image compressor when a photo is too large
              for an upload form, email attachment, or web page. Set pixel
              dimensions and compression together in the tool above. If you only
              need to reduce file size, leave the dimension fields blank or open
              the dedicated{' '}
              <Link href='/image-compressor'>image compressor</Link>.
            </p>
            <ol>
              <li>
                <strong>Choose your images.</strong> Drop up to 10 files into
                the tool, with a maximum of 50MB per file. Supported inputs
                include JPG, PNG, WebP, GIF, BMP, and AVIF.
              </li>
              <li>
                <strong>Set the dimensions.</strong> Enter width, height, or
                both. Keep aspect ratio on to fit each image inside those
                bounds, or turn it off to use an exact width and height. Leave
                both blank when you want to keep the original size.
              </li>
              <li>
                <strong>Choose quality or a KB target.</strong> Both modes use
                your selected dimensions. If a KB target cannot be met at that
                size, the tool tells you. Choose JPG, PNG, or WebP output.
              </li>
              <li>
                <strong>Compare and download.</strong> Check the original and
                output sizes, dimensions, and preview. Verify the target status
                and small details before downloading individual images or a ZIP
                of completed results.
              </li>
            </ol>
            <h2>Resizing vs. compression: pixels and kilobytes</h2>
            <p>
              Resizing changes width and height; compression changes how the
              image is encoded. For example, resizing a 4000 × 3000 photo to
              1000 × 750 leaves one-sixteenth of the original pixel count. The
              resulting file size still depends on its content, format, and
              quality. A 100KB target does not specify pixel dimensions, and a
              1000-pixel width does not guarantee a 100KB file.
            </p>
            <p>
              When a form limits both dimensions and file size, enter the
              required pixels and select a KB target above. Resizing happens
              before encoding in the same run. Keep the aspect ratio locked to
              avoid stretching. Enlarging a small image can soften detail. If
              the required shape differs from your original,{' '}
              <Link href='/crop-image'>crop the image</Link> before resizing.
            </p>
            <h2>Choose a quality setting or a file-size target</h2>
            <p>
              Use the quality slider when you want control over appearance at
              your chosen dimensions. Start around 80–85% for JPG and WebP
              photos and inspect faces, text, and gradients. Lower quality can
              introduce visible artifacts; savings vary between files.
            </p>
            <p>
              Use Exact KB target for an upload limit. With custom dimensions,
              it searches quality settings while keeping the chosen size; a
              missed target means you need a larger budget, smaller dimensions,
              or another format. When both dimension fields are blank, target
              mode can shrink dimensions automatically. Check the final result
              rather than assuming every file fits. For common limits, use the
              presets to{' '}
              <Link href='/compress-image-to-20kb'>compress to 20KB</Link>,{' '}
              <Link href='/compress-image-to-50kb'>50KB</Link>, or{' '}
              <Link href='/compress-image-to-100kb'>100KB</Link>.
            </p>
            <h2>Which image format should you choose?</h2>
            <ul>
              <li>
                <strong>JPG:</strong> a common choice for photos and forms that
                require JPEG. Transparency is replaced with a white background.
              </li>
              <li>
                <strong>WebP:</strong> supports transparency and adjustable
                compression for web images. Confirm that the receiving app or
                website accepts it.
              </li>
              <li>
                <strong>PNG:</strong> preserves pixel detail and transparency at
                the output dimensions. The quality slider does not reduce PNG
                size; choose smaller dimensions to reduce its pixel count.
              </li>
            </ul>
            <p>
              If the file type is the main problem, the{' '}
              <Link href='/convert-image'>image converter</Link> can help you
              switch formats. Animated inputs are exported as a still image by
              these canvas-based tools; they do not preserve the animation.
            </p>
            <h2>Free image processing that stays on your device</h2>
            <p>
              There is no signup, watermark, or image upload. Your browser
              decodes and processes the files locally, and re-encoding strips
              the original EXIF metadata. Keep an untouched original if you need
              camera settings or location data later. JPEG and WebP compression
              can discard detail, so compare the exported image at its intended
              display size before replacing an original. For more advice, read
              our{' '}
              <Link href='/guides/reduce-image-size-without-losing-quality'>
                guide to reducing image size without visible quality loss
              </Link>
              .
            </p>
          </>
        }
        faq={<Faq items={FAQS} />}
      >
        <Compressor
          enableResize
          defaultMode='quality'
          defaultQuality={80}
          defaultTargetKB={100}
        />
      </ToolShell>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  )
}
