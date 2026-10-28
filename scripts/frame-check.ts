/**
 * Checks each chitra template against the inputs that break a page laid over
 * an image, and writes a side-by-side of frame and filled page for the eye.
 *
 *   npm run dev                       (in another terminal)
 *   npm run frames:check [slug ...]   (default: every chitra template)
 *
 * (a) A long "about" must raise the article above A4, or the editor, the review
 *     page and `npm run fit` would all miss text running into the border art.
 * (b) A long unbroken value (an email, a URL) must wrap inside its column.
 * (c) A long name must never run under the photo; on a frame with a name plate,
 *     the plate must grow around it.
 * Side-by-side: proofs/compare/<slug>.png, the prepared frame on the left and
 * the Hindi sample with a test photo on the right.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { TEMPLATES } from '../src/templates/catalog.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
const args = process.argv.slice(2);
const slugs = args.length ? args : TEMPLATES.filter((t) => t.layout === 'chitra').map((t) => t.slug);
const outDir = path.resolve('proofs/compare');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
const failures: string[] = [];

async function load(slug: string, lang: string) {
  const res = await page.goto(`${origin}/print/sample/${slug}?lang=${lang}&photo=1`, { waitUntil: 'networkidle' });
  if (!res?.ok()) throw new Error(`print page returned ${res?.status()}`);
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 15_000 });
}

for (const slug of slugs) {
  try {
    await load(slug, 'en');
    const grown = await page.evaluate(() => {
      const p = document.createElement('p');
      p.textContent = 'lorem '.repeat(500);
      document.querySelector('[data-chitra-body]')!.lastElementChild!.append(p);
      return document.querySelector('article')!.scrollHeight;
    });
    if (grown <= 1125) failures.push(`${slug}: (a) text past the box did not register as overflow (scrollHeight ${grown})`);

    await load(slug, 'en');
    const [scroll, client] = await page.evaluate(() => {
      const v = document.querySelector<HTMLElement>('[data-chitra-value]')!;
      v.textContent = 'x'.repeat(80);
      return [v.scrollWidth, v.clientWidth];
    });
    if (scroll > client + 1) failures.push(`${slug}: (b) an unbroken value spills out of its column (${scroll} > ${client})`);

    await load(slug, 'en');
    const clash = await page.evaluate(() => {
      const h = document.querySelector('h1')!;
      h.textContent = 'Name '.repeat(14).trim();
      // The text's own line boxes: a block beside a float keeps its full width underneath it.
      const range = document.createRange();
      range.selectNodeContents(h);
      const lines = [...range.getClientRects()];
      const photo = document.querySelector('[data-chitra-photo]')!.getBoundingClientRect();
      const under = lines.some((r) => r.left < photo.right && r.right > photo.left && r.top < photo.bottom && r.bottom > photo.top);
      const plate = document.querySelector('[data-chitra-plate]')?.getBoundingClientRect();
      const name = h.getBoundingClientRect();
      const outside = plate ? name.top < plate.top || name.bottom > plate.bottom || lines.some((r) => r.left < plate.left || r.right > plate.right) : false;
      return { under, outside };
    });
    if (clash.under) failures.push(`${slug}: (c) a long name runs under the photo`);
    if (clash.outside) failures.push(`${slug}: (c) a long name spills out of its plate`);

    await load(slug, 'hi');
    const shot = await sharp(await page.locator('.print-sheet').first().screenshot()).resize(794, 1123).toBuffer();
    const frame = await sharp(path.resolve('assets/frames', `${slug}.jpg`)).resize(794, 1123).toBuffer();
    await sharp({ create: { width: 794 * 2 + 6, height: 1123, channels: 3, background: '#888888' } })
      .composite([{ input: frame, left: 0, top: 0 }, { input: shot, left: 800, top: 0 }])
      .png()
      .toFile(path.join(outDir, `${slug}.png`));
    console.log(`checked ${slug} -> proofs/compare/${slug}.png`);
  } catch (err) {
    failures.push(`${slug}: ${(err as Error).message}`);
  }
}

await browser.close();
if (failures.length) {
  console.error(`\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`\n${slugs.length} chitra template(s) pass (a), (b) and (c).`);
process.exit(0);
