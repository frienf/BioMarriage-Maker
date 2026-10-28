import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

/**
 * Renders the PDF on the server, from the same React templates the preview
 * uses, by printing /print/<token> with Chromium.
 *
 * Server-side and not html2pdf.js in the browser: the client already holds the
 * template and the data, so a client renderer would let anyone produce the paid
 * PDF from devtools without paying, and html2pdf rasterises the page, which
 * loses selectable text. That decision is ADR-004 in the design.
 *
 * ponytail: rendered on demand and cached on disk, with no queue table or
 * worker. At the planning ceiling of about 1,000 renders a day one browser is
 * enough. Move to a queue when a render makes a request wait too long.
 */

export function storageDir(): string {
  return path.resolve(process.env.STORAGE_DIR ?? './storage');
}

export function pdfPathFor(token: string): string {
  // The token is base64url, so it has no path separators.
  return path.join(storageDir(), `${token}.pdf`);
}

export async function renderOrderPdf(token: string): Promise<string> {
  const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
  const target = `${origin}/print/${encodeURIComponent(token)}`;
  const out = pdfPathFor(token);
  await mkdir(storageDir(), { recursive: true });

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

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await writeFile(out, pdf);
    return out;
  } finally {
    await browser.close();
  }
}
