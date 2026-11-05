/* Oversized content to confirm scrollHeight tracks real height when overflowing. */
import { chromium } from 'playwright';

const origin = 'http://localhost:3000';
const A4_H = 1123;

const big = (loc) => ({
  templateSlug: 'sudarshana', docLocale: loc,
  fullName: 'Ananya Prakash Kulkarni-Agarwal-Singhania-Deshmukh-Joshi-Patil',
  profileType: 'bride',
  docLocale: loc,
  expectations: 'X '.repeat(900)
});

const browser = await chromium.launch();
const page = await browser.newPage();
const id = `sudarshana/big/en`;
await page.goto(`${origin}/print/debug-max/sudarshana?lang=en&data=${encodeURIComponent(JSON.stringify(big('en')))}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 30000 });
const heights = await page.evaluate(() => [...document.querySelectorAll('article')].map((a) => a.scrollHeight));
console.log(id, 'scrollHeight=', Math.max(...heights));
await browser.close();
