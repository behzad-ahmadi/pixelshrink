import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Run after npm run build. Check the actual prerendered navigation and JSON-LD.
const root = ".next/server/app";
const files = readdirSync(root, { recursive: true }).filter((file) => file.endsWith(".html") && !file.includes("["));
let checked = 0;
for (const file of files) {
  const html = readFileSync(join(root, file), "utf8");
  const navs = [...html.matchAll(/<nav aria-label="Breadcrumb">([\s\S]*?)<\/nav>/g)];
  const route = file === "index.html" ? "/" : `/${file.replaceAll("\\", "/").slice(0, -5)}`;
  if (route.startsWith("/guides")) assert.equal(navs.length, 1, `${route}: missing breadcrumb`);
  if (!navs.length) continue;
  assert.equal(navs.length, 1, `${route}: duplicate breadcrumbs`);
  const nav = navs[0][1];
  const links = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(links[0]?.[1], "/", `${route}: Home must link to /`);
  assert.equal((nav.match(/aria-current="page"/g) || []).length, 1, `${route}: current page marker`);
  for (const [, href] of links) {
    assert.notEqual(href, route, `${route}: ancestor links to itself`);
    assert.ok(existsSync(join(root, href === "/" ? "index.html" : `${href.slice(1)}.html`)), `${route}: broken link ${href}`);
  }
  if (route.startsWith("/guides/")) assert.equal(links[1]?.[1], "/guides", `${route}: wrong guides parent`);
  if (route.startsWith("/convert/")) assert.equal(links[1]?.[1], "/convert-image", `${route}: wrong converter parent`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1])).filter((schema) => schema["@type"] === "BreadcrumbList");
  assert.equal(schemas.length, 1, `${route}: missing or duplicate schema`);
  const items = schemas[0].itemListElement;
  assert.equal(items.length, links.length + 1, `${route}: schema differs from navigation`);
  items.forEach((item, index) => {
    assert.equal(item.position, index + 1);
    if (index < links.length) assert.equal(item.item, `https://www.pixelshrink.app${links[index][1]}`);
  });
  const current = nav.match(/<span aria-current="page"[^>]*>([^<]+)<\/span>/)?.[1];
  assert.equal(items.at(-1).name, current, `${route}: current page name mismatch`);
  checked++;
}
assert.ok(checked > 0, "No rendered breadcrumbs found; run npm run build first.");
console.log(`Verified breadcrumbs, parent links and JSON-LD on ${checked} pages.`);
