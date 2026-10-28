import { NextResponse } from 'next/server';
import { eraseOrder, orderByToken } from '@/lib/orders';

export const runtime = 'nodejs';

/** Status for the order page to poll while a payment settles. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await orderByToken(token);
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({
    status: order.status,
    pdfStatus: order.pdfStatus,
    orderNumber: order.orderNumber,
    downloadsUsed: order.downloadsUsed,
    downloadLimit: order.downloadLimit,
    editsUsed: order.editsUsed,
    editLimit: order.editLimit,
    expiresAt: order.expiresAt,
    deleted: order.deletedAt !== null
  });
}

/** Erase on request. Holding the token is the authorisation. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const row = await eraseOrder(token);
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
