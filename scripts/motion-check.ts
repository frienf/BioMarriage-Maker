/**
 * Checks that the four animated moments actually move.
 *
 * A cut instead of a fade is invisible to typecheck, lint and tests, and it is
 * exactly what happens when an animation is driven by a frame loop that a
 * heavy React commit swallows. This caught that once already.
 *
 *   npm run dev      (in another terminal)
 *   npm run motion
 */
import { chromium, type Page } from 'playwright';
import { TEMPLATES, templatesInCollection } from '../src/templates/catalog.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
let fails = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) fails += 1;
};

/**
 * Clicks until the page actually reacts.
 *
 * In dev the first interaction can land before React has hydrated, and a lost
 * click looks exactly like a broken animation. This waits for the effect
 * rather than sleeping a guessed interval, so a genuinely dead control still
 * fails loudly.
 */
async function clickUntil(page: Page, click: () => Promise<void>, settled: () => Promise<boolean>, tries = 10) {
  for (let i = 0; i < tries; i++) {
    await click();
    for (let j = 0; j < 8; j++) {
      if (await settled()) return true;
      await page.waitForTimeout(100);
    }
  }
  return false;
}

/** Polls from outside the page, so the sampling cannot starve React. */
async function trace(page: Page, read: () => Promise<string>, steps = 20, gap = 15) {
  const seen: string[] = [];
  for (let i = 0; i < steps; i++) {
    seen.push(await read());
    await page.waitForTimeout(gap);
  }
  return seen;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 1200 } });

console.log('\nMotion\n');

// --- Template detail: the colour swatch crossfade ---------------------------
await page.goto(`${origin}/en/templates/kumkum`, { waitUntil: 'networkidle' });
const fade = () =>
  page.evaluate(() => [...document.querySelectorAll('.crossfade > *')].map((k) => getComputedStyle(k).opacity.slice(0, 4)).join(','));

check('all four colourways stay mounted', (await fade()).split(',').length === 4, await fade());
check('only the first is visible at rest', (await fade()) === '1,0,0,0');

const reacted = await clickUntil(
  page,
  () => page.locator('button[aria-pressed]').nth(2).click(),
  async () => ((await page.textContent('legend')) ?? '').includes('Jamun purple')
);
check('the swatch responds to a click', reacted);

// Re-run the swap from a known state so the crossfade itself can be sampled.
await page.locator('button[aria-pressed]').nth(0).click();
await page.waitForTimeout(400);
await page.locator('button[aria-pressed]').nth(2).click();
const fades = await trace(page, fade);
const partway = fades.some((s) => {
  const [a, , c] = s.split(',').map(Number);
  return a > 0 && a < 1 && c > 0 && c < 1;
});
check('the swatch crossfades rather than cutting', partway, `${new Set(fades).size} distinct states`);
check('it lands on the chosen colourway', (await fade()) === '0,0,1,0', await fade());
check('the legend names it', ((await page.textContent('legend')) ?? '').includes('Jamun purple'));

// --- Gallery: cards travel to their new positions ---------------------------
await page.goto(`${origin}/en/templates`, { waitUntil: 'networkidle' });
const grid = () =>
  page.evaluate(() => {
    const lis = [...document.querySelectorAll('.grid-cards > li')];
    return `${lis.length}|${lis.slice(0, 3).map((l) => (l as HTMLElement).style.transform || '-').join(' ')}`;
  });

// Counts come from the catalogue, so adding a template never breaks this check.
check('the gallery lists every template', (await grid()).startsWith(`${TEMPLATES.length}|`), (await grid()).split('|')[0]);
await page.getByRole('link', { name: 'Modern', exact: true }).click();
await page.waitForURL('**/templates?style=modern');
const grids = await trace(page, grid, 45, 15);
check('filtering narrows the grid', (await grid()).startsWith(`${templatesInCollection('modern').length}|`), (await grid()).split('|')[0]);
check(
  'surviving cards are moved into place, not snapped',
  grids.some((s) => s.includes('translate3d') && !s.includes('translate3d(0px, 0px, 0px)')),
  `${new Set(grids).size} distinct states`
);

// --- Home hero: the ambience must not cost readability ----------------------
await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const hero = await page.evaluate(() => {
  const bg = document.querySelector('.hero-bg');
  const cs = bg ? getComputedStyle(bg) : null;
  return {
    present: !!bg,
    animated: !!cs && cs.animationName !== 'none',
    duration: cs?.animationDuration ?? '',
    behind: cs ? Number(cs.zIndex) < 0 : false,
    decorative: bg?.getAttribute('aria-hidden') === 'true'
  };
});
check('the hero carries the ambient layer', hero.present && hero.behind);
check('it drifts on the 24s loop', hero.animated && hero.duration.startsWith('24'), hero.duration);
check('it is hidden from assistive technology', hero.decorative);

// Worst case for the real headline over the real background, left half only,
// which is where the copy sits.
await page.evaluate(() => {
  document.querySelectorAll('.hero .shell, .hero > svg').forEach((el) => ((el as HTMLElement).style.visibility = 'hidden'));
});
const heroShot = (await page.locator('.hero').screenshot({ type: 'png' })).toString('base64');
const worstHero = await page.evaluate(async (b64: string) => {
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
  const d = g.getImageData(0, 0, Math.floor(c.width * 0.5), c.height).data;
  const lum = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  let worst = 99;
  for (let i = 0; i < d.length; i += 4) {
    const L = 0.2126 * lum(d[i]) + 0.7152 * lum(d[i + 1]) + 0.0722 * lum(d[i + 2]);
    worst = Math.min(worst, 1.05 / (L + 0.05));
  }
  return +worst.toFixed(2);
}, heroShot);
check('white hero copy stays readable over it', worstHero >= 4.5, `${worstHero}:1`);

await browser.close();
console.log(fails ? `\n${fails} check(s) failed\n` : '\nEvery animated moment moves.\n');
process.exit(fails ? 1 : 0);
