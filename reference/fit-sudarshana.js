/* Targeted fit check for sudarshana in all 3 locales via the dev server. */
import { chromium } from 'playwright';

const origin = 'http://localhost:3000';
const A4_H = 1123;

const browser = await chromium.launch();
const page = await browser.newPage();

let over = [];
for (const lang of ['en', 'hi', 'mr']) {
  const id = `sudarshana/${lang}`;
  await page.goto(`${origin}/print/sample/sudarshana?lang=${lang}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 30000 });
  const heights = await page.evaluate(() => [...document.querySelectorAll('article')].map((a) => a.scrollHeight));
  const worst = Math.max(...heights);
  const delta = worst - A4_H;
  const flag = delta > 2 ? 'OVER' : 'ok  ';
  if (delta > 2) over.push(`${id} (+${delta}px)`);
  console.log(`${flag} ${id.padEnd(20)} ${worst}px`);
}

await browser.close();
if (over.length) {
  console.error(`\n${over.length} template(s) clip: ${over.join(', ')}`);
  process.exit(1);
}
console.log('\nsudarshana fits a full biodata in all locales.');
