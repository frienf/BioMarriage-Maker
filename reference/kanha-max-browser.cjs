const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const locale of ['en', 'hi', 'mr']) {
      await page.goto(`http://localhost:3000/print/sample/kanha?lang=${locale}`, { waitUntil: 'networkidle' });
      const html = fs.readFileSync(`reference/kanha-max-${locale}.html`, 'utf8');
      await page.evaluate((content) => { document.querySelector('article').outerHTML = content; }, html);
      if (process.env.TEST_PADDING) {
        await page.evaluate(({ padding, size }) => {
          const article = document.querySelector('article');
          article.style.padding = padding;
          article.style.fontSize = size;
        }, { padding: process.env.TEST_PADDING, size: process.env.TEST_SIZE || '14px' });
      }
      await page.evaluate(() => document.fonts.ready);
      console.log(locale, await page.evaluate(() => document.querySelector('article').scrollHeight));
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
