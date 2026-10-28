import { readFile, rm, stat } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { consumeDownload, orderByToken, setPdfStatus } from '@/lib/orders';
import { pdfPathFor, renderOrderPdf } from '@/lib/pdf';

export const runtime = 'nodejs';
// A render takes seconds, so this must never be cached as a static route.
export const dynamic = 'force-dynamic';

/**
 * The paywall.
 *
 * Entitlement is taken first, with one conditional UPDATE, so two taps cannot
 * both slip through a check-then-write. If the render then fails, the download
 * is handed back rather than being silently spent.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await consumeDownload(token);
  if (!order) {
    const existing = await orderByToken(token);
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
    if (existing.deletedAt) return NextResponse.json({ error: 'deleted' }, { status: 410 });
    if (existing.status !== 'paid') return NextResponse.json({ error: 'not paid' }, { status: 402 });
    if (existing.expiresAt && existing.expiresAt <= new Date()) return NextResponse.json({ error: 'expired' }, { status: 410 });
    return NextResponse.json({ error: 'download limit reached' }, { status: 429 });
  }

  const file = pdfPathFor(token);
  try {
    try {
      await stat(file);
    } catch {
      await setPdfStatus(token, 'rendering');
      await renderOrderPdf(token);
      // Erased while rendering: the order was gone before this could mark it
      // ready, so this render's file is the only copy left and goes too.
      // Postgres orders the two updates, so either this sees the erasure or
      // eraseOrder's rm runs after the file was written.
      if (!(await setPdfStatus(token, 'ready', file))) {
        await rm(file, { force: true });
        return NextResponse.json({ error: 'deleted' }, { status: 410 });
      }
    }
    const bytes = await readFile(file);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="biodata-${order.orderNumber}.pdf"`,
        'cache-control': 'private, no-store'
      }
    });
  } catch (err) {
    console.error('pdf render failed', err);
    await setPdfStatus(token, 'failed');
    // The render failed, so give the allowance back rather than charge the
    // visitor a download for our own error.
    const { getDb } = await import('@/lib/db');
    const { orders } = await import('@/lib/db/schema');
    const { eq, sql } = await import('drizzle-orm');
    await getDb()
      .update(orders)
      .set({ downloadsUsed: sql`greatest(${orders.downloadsUsed} - 1, 0)` })
      .where(eq(orders.token, token));
    return NextResponse.json({ error: 'render failed' }, { status: 500 });
  }
}
