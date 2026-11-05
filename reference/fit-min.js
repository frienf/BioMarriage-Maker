/* Minimal biodata fit check to understand scrollHeight baseline. */
import { chromium } from 'playwright';

const origin = 'http://localhost:3000';
const A4_H = 1123;

const minimal = (loc) => ({
  templateSlug: 'sudarshana', docLocale: loc,
  fullName: loc === 'en' ? 'Ananya Kulkarni' : (loc === 'hi' ? 'अनन्या कुलकर्णी' : 'अनन्या कुलकर्णी'),
  profileType: 'bride',
  docLocale: loc
});

const browser = await chromium.launch();
const page = await browser.newPage();
for (const loc of ['en', 'hi', 'mr']) {
  const id = `sudarshana/min/${loc}`;
  await page.goto(`${origin}/print/debug-max/sudarshana?lang=${loc}&data=${encodeURIComponent(JSON.stringify(minimal(loc)))}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 30000 });
  const heights = await page.evaluate(() => [...document.querySelectorAll('article')].map((a) => a.scrollHeight));
  console.log(id, 'scrollHeight=', Math.max(...heights));
}
await browser.close();
