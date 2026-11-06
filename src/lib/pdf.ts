import { chromium } from 'playwright';
export { pdfPathFor, storageDir } from './pdf-store.ts';

/**
 * Renders the PDF on the server, from the same React templates the preview
 * uses, by printing /print/<token> with Chromium.
 *
 * Server-side and not html2pdf.js in the browser: the client already holds the
 * template and the data, so a client renderer would let anyone produce the paid
 * PDF from devtools without paying, and html2pdf rasterises the page, which
 * loses selectable text. That decision is ADR-004 in the design.
 *
 * Render on demand into memory; no PDF is written to disk. There is no queue
 * or worker, so concurrent downloads each launch a browser.
 */

export async function renderOrderPdf(token: string, revision: number): Promise<Buffer> {
  const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
  const target = `${origin}/print/${encodeURIComponent(token)}?revision=${revision}`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 30_000 });
    if (!response || !response.ok()) {
      throw new Error(`Print page returned ${response?.status() ?? 'no response'}`);
    }
    // The page sets this once every font has loaded. Printing before that is
    // how a Devanagari conjunct ends up as a fallback glyph.
    await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 15_000 });

    return await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
  } finally {
    await browser.close();
  }
}
