/**
 * Measures every template against A4 with a fully filled sample biodata.
 *
 * A template that overflows here will clip a real family's details, so this is
 * a build-time check of the design, not a style preference.
 */
import { chromium } from 'playwright';
import { TEMPLATES } from '../src/templates/catalog.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
const A4_H = 1123;

const browser = await chromium.launch();
const page = await browser.newPage();
const over: string[] = [];

// Every language, not just the first: Devanagari sets taller than English.
for (const tpl of TEMPLATES) {
  for (const lang of tpl.docLocales) {
    const id = `${tpl.slug}/${lang}`;
    await page.goto(`${origin}/print/sample/${tpl.slug}?lang=${lang}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-print-ready="true"]', { state: 'attached' });
    const heights = await page.evaluate(() => [...document.querySelectorAll('article')].map((a) => a.scrollHeight));
    const worst = Math.max(...heights);
    const delta = worst - A4_H;
    const flag = delta > 2 ? 'OVER' : 'ok  ';
    if (delta > 2) over.push(`${id} (+${delta}px)`);
    console.log(`${flag} ${id.padEnd(25)} ${worst}px`);
  }
}

await browser.close();
if (over.length) {
  console.error(`\n${over.length} template(s) clip a full biodata: ${over.join(', ')}`);
  process.exit(1);
}
console.log('\nEvery template fits a full biodata on its page.');
process.exit(0);
