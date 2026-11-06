import { NextResponse } from 'next/server';
import { orderByToken } from '@/lib/orders';
import { confirmNoop, editableOrder, prepareOrderEdit, readEditBody, updatePaidOrder } from '@/lib/order-edits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store' };
const unavailable = () => NextResponse.json({ error: 'Not found.' }, { status: 404, headers });
type Context = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { token } = await params;
  const order = await orderByToken(token);
  if (!order || !editableOrder(order)) return unavailable();
  return NextResponse.json({
    biodata: order.biodata,
    templateSlug: order.templateSlug,
    docLocale: order.docLocale,
    pricePaise: order.pricePaise,
    editsUsed: order.editsUsed,
    editLimit: order.editLimit,
    expiresAt: order.expiresAt
  }, { headers });
}

export async function PATCH(request: Request, { params }: Context) {
  const { token } = await params;
  const order = await orderByToken(token);
  if (!order || !editableOrder(order)) return unavailable();
  const body = await readEditBody(request.body);
  if (body.kind === 'too-large') return NextResponse.json({ error: 'Request is too large.' }, { status: 413, headers });
  if (body.kind === 'invalid') return NextResponse.json({ error: 'Send JSON.' }, { status: 400, headers });
  const decision = await prepareOrderEdit(order, body.body);
  if (decision.kind === 'unavailable') return unavailable();
  if (decision.kind === 'conflict') return NextResponse.json({ error: 'This order has changed. Reload and try again.' }, { status: 409, headers });
  if (decision.kind === 'invalid') return NextResponse.json({ error: decision.error }, { status: 400, headers });
  if (decision.kind === 'noop') {
    const current = await confirmNoop(token, order.editsUsed);
    if (current.kind === 'unavailable') return unavailable();
    if (current.kind === 'conflict') return NextResponse.json({ error: 'This order has changed. Reload and try again.' }, { status: 409, headers });
    return NextResponse.json({ biodata: decision.biodata, editsUsed: current.editsUsed, editLimit: current.editLimit }, { headers });
  }
  const updated = await updatePaidOrder(token, order.editsUsed, decision.biodata);
  if (!updated) return NextResponse.json({ error: 'This order has changed or is no longer available.' }, { status: 409, headers });
  return NextResponse.json({ biodata: updated.biodata, editsUsed: updated.editsUsed, editLimit: updated.editLimit }, { headers });
}
