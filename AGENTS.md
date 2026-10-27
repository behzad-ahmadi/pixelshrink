# Repository Guidelines

## Project Structure & Module Organization
PixelShrink uses Next.js App Router, React, and strict TypeScript. `app/` contains tool routes, informational pages, metadata, and global styles. `components/` holds image-tool interfaces and shared UI; `components/theme/` manages themes. `lib/image-engine.ts` handles browser image processing, `lib/batch.ts` ZIP downloads, and `lib/site.ts` shared site metadata. Static assets live in `public/`; social images and icons also live in `app/`. Image-engine tests live in `tests/`.

## Build, Test, and Development Commands
- `npm ci`: install locked dependencies.
- `npm run dev`: start development at `http://localhost:3000`.
- `npm run build`: create the production build.
- `npm start`: serve the production build after building.
- `npm run lint`: run ESLint with Next.js Core Web Vitals and TypeScript rules.
- `npm run typecheck`: check TypeScript without emitting files.
- `npm test`: run Node.js image-engine tests (Node 22.18+).

## Coding Style & Naming Conventions
Follow existing two-space indentation, double quotes, and semicolons. Use PascalCase for component files (`Compressor.tsx`), camelCase for functions, and uppercase constants (`MAX_BATCH_FILES`). Route folders use lowercase hyphenated names. Prefer `@/` imports. Keep browser-dependent UI in client components with `"use client"` and reuse shared image helpers. No dedicated formatter is configured.

## Testing Guidelines
Use Node.js's built-in test runner with `tests/*.test.mjs`; run `npm test`. No coverage threshold is configured. Run lint, typecheck, and build before submitting. Verify affected tools with valid and invalid images, downloads, batch ZIPs, and light/dark themes. Check HEIC conversion when changing decoding logic.

## Commit & Pull Request Guidelines
History uses descriptive subjects such as `SEO: canonical host...` and `chore: ignore...`; follow that concise style. Keep commits focused. PRs should explain behavior changes, list validation performed, link relevant issues, and include screenshots for UI changes.

## Privacy & Configuration
Keep image processing local to the browser. Never upload user images or include their contents in analytics. `NEXT_PUBLIC_GA_ID` controls the analytics stub and is public client configuration; never place secrets in `NEXT_PUBLIC_*` variables.

## Agent Instructions
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
