/**
 * Renders each template's sample page to a PNG, for use as a texture.
 *
 * Reuses the /print/sample route the proof sheets already use, so the paper in
 * the 3D showcase carries the real template rather than a mock-up.
 *
 *   npm run dev        (in another terminal)
 *   npm run thumbs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { TEMPLATES } from '../src/templates/catalog.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
const outDir = path.resolve('public/brand/thumbs');
await mkdir(outDir, { recursive: true });

// A4 at 96dpi, doubled so the texture holds up when the sheet fills the view.
const SCALE = 2;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: SCALE });
let made = 0;

for (const tpl of TEMPLATES) {
  const res = await page.goto(`${origin}/print/sample/${tpl.slug}?lang=${tpl.docLocales[0]}`, { waitUntil: 'networkidle' });
  if (!res?.ok()) {
    console.error(`${tpl.slug}: ${res?.status()}`);
    continue;
  }
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached' });
  await page.locator('.print-sheet').first().screenshot({ path: path.join(outDir, `${tpl.slug}.png`) });
  made += 1;
  console.log(`${tpl.slug} -> public/brand/thumbs/${tpl.slug}.png`);
}

await browser.close();
console.log(`\n${made} of ${TEMPLATES.length} thumbnails written`);
process.exit(made === TEMPLATES.length ? 0 : 1);
