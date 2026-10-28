/**
 * Verifies the two standalone brand artifacts under public/brand/.
 *
 * Needs no dev server: both open from the filesystem. What it guards is the
 * class of fault that typecheck, lint and tests all miss — a logo that flashes
 * its finished state before drawing, a stroke left half-drawn on the end frame,
 * a background loop with a visible seam, or a drift that quietly pushes the
 * hero headline below readable contrast.
 *
 *   npm run brand
 */
import { chromium, type Page } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file = (name: string) => pathToFileURL(path.resolve('public/brand', name)).href;
const LOOP = 24; // the background's period, in seconds

let fails = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) fails += 1;
};

/** Decodes two PNGs in the page and reports how far apart they are. */
async function compare(page: Page, a: string, b: string) {
  return page.evaluate(async ([x, y]) => {
    const load = (b64: string) =>
      new Promise<HTMLImageElement>((r) => {
        const i = new Image();
        i.onload = () => r(i);
        i.src = 'data:image/png;base64,' + b64;
      });
    const [ia, ib] = await Promise.all([load(x), load(y)]);
    const c = document.createElement('canvas');
    c.width = ia.width;
    c.height = ia.height;
    const g = c.getContext('2d')!;
    g.drawImage(ia, 0, 0);
    const da = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(ib, 0, 0);
    const db = g.getImageData(0, 0, c.width, c.height).data;
    let max = 0;
    let sum = 0;
    for (let i = 0; i < da.length; i += 4) {
      const v = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      if (v > max) max = v;
      sum += v;
    }
    return { max, mean: +(sum / (da.length / 4)).toFixed(2) };
  }, [a, b]);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

// --- The logo reveal --------------------------------------------------------
console.log('\nLogo reveal\n');

async function logoAt(t: number) {
  await page.goto(`${file('toran-logo.html')}?t=${t}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  return page.evaluate(() => {
    const pieces = [...document.querySelectorAll('#logo [data-draw]')];
    return {
      pieces: pieces.length,
      // getComputedStyle returns the offset with a unit, so parseFloat, not Number.
      undrawn: pieces.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)).filter((v) => v > 0.001).length,
      fullyDrawn: pieces.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)).filter((v) => v < 0.001).length,
      hidden: pieces.filter((p) => Number(getComputedStyle(p).opacity) < 0.01).length,
      wordmark: Number(getComputedStyle(document.querySelector('#wordmark')!).opacity)
    };
  });
}

// At exactly t=0 the cord has become visible because its draw begins there;
// what matters is that nothing has been *drawn* yet, so the frame is blank.
const start = await logoAt(0);
check('nothing is drawn at the start', start.undrawn === start.pieces, `${start.undrawn}/${start.pieces} still undrawn`);
check('no piece has flashed its finished state', start.hidden >= start.pieces - 1, `${start.hidden}/${start.pieces} hidden`);
check('the wordmark has not arrived yet', start.wordmark < 0.01, String(start.wordmark));

const mid = await logoAt(0.75);
check(
  'the reveal is genuinely part-way at 0.75s',
  mid.undrawn > 0 && mid.fullyDrawn > 0,
  `${mid.fullyDrawn} drawn, ${mid.undrawn} still drawing`
);

const end = await logoAt(1.5);
check('no stroke is left half-drawn at the end', end.undrawn === 0, `${end.undrawn} undrawn`);
check('every piece is visible at the end', end.hidden === 0);
check('the wordmark has landed', end.wordmark > 0.99, String(end.wordmark));

// --- The hero background ----------------------------------------------------
console.log('\nHero background\n');

async function bgShot(t: number, hideForeground: boolean) {
  await page.goto(`${file('hero-background.html')}?t=${t}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  if (hideForeground) await page.evaluate(() => ((document.querySelector('main') as HTMLElement).style.visibility = 'hidden'));
  return (await page.screenshot({ type: 'png' })).toString('base64');
}

const b0 = await bgShot(0, true);
const bHalf = await bgShot(LOOP / 4, true);
const bEnd = await bgShot(LOOP, true);

const seam = await compare(page, b0, bEnd);
check(`the ${LOOP}s loop has no seam`, seam.max <= 4, `max channel delta ${seam.max}`);

const drift = await compare(page, b0, bHalf);
check('the background actually moves', drift.mean >= 3, `mean delta ${drift.mean}`);
check('but never enough to compete with the copy', drift.max <= 60, `max delta ${drift.max}`);

// Worst-case contrast for white copy, sampled over the band the hero text fills.
for (const t of [0, LOOP / 4, LOOP / 2, (LOOP * 3) / 4]) {
  const shot = await bgShot(t, true);
  const worst = await page.evaluate(async (b64: string) => {
    const img = await new Promise<HTMLImageElement>((res) => {
      const i = new Image();
      i.onload = () => res(i);
      i.src = 'data:image/png;base64,' + b64;
    });
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext('2d')!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(90, 210, 760, 290).data;
    const lum = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    let worstRatio = 99;
    for (let i = 0; i < d.length; i += 4) {
      const L = 0.2126 * lum(d[i]) + 0.7152 * lum(d[i + 1]) + 0.0722 * lum(d[i + 2]);
      worstRatio = Math.min(worstRatio, 1.05 / (L + 0.05));
    }
    return +worstRatio.toFixed(2);
  }, shot);
  check(`white copy stays readable at t=${t}s`, worst >= 4.5, `${worst}:1`);
}

await browser.close();
console.log(fails ? `\n${fails} check(s) failed\n` : '\nBoth brand artifacts verified.\n');
process.exit(fails ? 1 : 0);
