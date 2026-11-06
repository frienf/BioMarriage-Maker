import { NextResponse } from 'next/server';
import { consumeDownload, orderByToken } from '@/lib/orders';
import { renderOrderPdf } from '@/lib/pdf';
import { guardedAuthorizedPdf, renderBusyResponse } from '@/lib/pdf-download';

export const runtime = 'nodejs';
// A render takes seconds, so this must never be cached as a static route.
export const dynamic = 'force-dynamic';

/**
 * The paywall.
 *
 * Render first, then atomically authorize the revision and consume allowance.
 * No on-disk PDF is produced and a failed render never consumes a download.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await orderByToken(token);
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (order.deletedAt) return NextResponse.json({ error: 'deleted' }, { status: 410 });
  if (order.status !== 'paid') return NextResponse.json({ error: 'not paid' }, { status: 402 });
  if (!order.expiresAt || order.expiresAt <= new Date()) return NextResponse.json({ error: 'expired' }, { status: 410 });
  if (order.downloadsUsed >= order.downloadLimit) {
    return NextResponse.json({ error: 'download limit reached' }, { status: 429 });
  }

  let bytes: Uint8Array | null;
  try {
    const result = await guardedAuthorizedPdf(token, order.editsUsed, {
      render: () => renderOrderPdf(token, order.editsUsed),
      authorize: async (revision) => !!(await consumeDownload(token, revision))
    });
    if (result.kind === 'busy') {
      return renderBusyResponse();
    }
    bytes = result.value;
  } catch {
    // Renderer errors may contain the secret print URL.
    console.error('pdf render failed');
    return NextResponse.json({ error: 'render failed' }, { status: 500 });
  }
  if (!bytes) {
    const latest = await orderByToken(token);
    if (latest && !latest.deletedAt && latest.status === 'paid' && latest.expiresAt &&
        latest.expiresAt > new Date() && latest.editsUsed === order.editsUsed &&
        latest.downloadsUsed >= latest.downloadLimit) {
      return NextResponse.json({ error: 'download limit reached' }, { status: 429 });
    }
    return NextResponse.json({ error: 'order changed or unavailable' }, { status: 409 });
  }
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="biodata-${order.orderNumber}.pdf"`,
      'cache-control': 'private, no-store'
    }
  });
}
