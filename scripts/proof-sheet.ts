/**
 * Prints every template to one PDF each, with fictional sample details.
 *
 * This is the proof sheet: take it to a real inkjet and a real laser before
 * launch. Screen colour is not ink, and a watermark that looks right here can
 * still come out blank on paper.
 *
 *   npm run dev            (in another terminal)
 *   node --experimental-strip-types scripts/proof-sheet.ts
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { TEMPLATES } from '../src/templates/catalog.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
const outDir = path.resolve('proofs');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
let made = 0;
const rasterised: string[] = [];

for (const tpl of TEMPLATES) {
  const lang = tpl.docLocales[0];
  const url = `${origin}/print/sample/${tpl.slug}?lang=${lang}`;
  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
  if (!res?.ok()) {
    console.error(`${tpl.slug}: print page returned ${res?.status()}`);
    continue;
  }
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 15_000 });
  const pdf = await page.pdf({
    path: path.join(outDir, `${tpl.slug}.pdf`),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  made += 1;
  console.log(`${tpl.slug} -> proofs/${tpl.slug}.pdf`);

  // Chromium prints an SVG <pattern> fill as a low-resolution bitmap, which comes
  // out soft next to vector text. The devotional frame is drawn as plain vector
  // elements for that reason; this fails if a raster creeps back in. Each real
  // <img> may bring two image objects (the picture and its alpha mask). A chitra
  // frame is an <img> by design, so the same rule holds it to its images.
  // Not Paramparik: its jhalar strip is still a <pattern> (known).
  if (tpl.layout === 'devotional' || tpl.layout === 'chitra') {
    const imgs = await page.evaluate(() => document.images.length);
    const rasters = pdf.toString('latin1').split('/Subtype /Image').length - 1;
    if (rasters > 2 * imgs) rasterised.push(`${tpl.slug} (${rasters} images, ${imgs} <img>)`);
  }
}

await browser.close();
console.log(`\n${made} of ${TEMPLATES.length} templates printed into ${outDir}`);
if (rasterised.length) console.error(`Rasterised ornaments in: ${rasterised.join(', ')}`);
process.exit(made === TEMPLATES.length && !rasterised.length ? 0 : 1);
