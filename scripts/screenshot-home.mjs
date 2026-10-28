import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/home-page-screenshot.png', fullPage: true });
  console.log('Screenshot saved to public/home-page-screenshot.png');
  await browser.close();
}

capture();
