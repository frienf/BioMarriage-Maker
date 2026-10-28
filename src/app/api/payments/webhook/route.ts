import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { webhookEvents } from '@/lib/db/schema';
import { markPaid } from '@/lib/orders';
import { verifyWebhookSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';

/**
 * Razorpay's own account of what happened, and the authority on settlement.
 *
 * Razorpay retries, so the delivery id is written first and a duplicate is
 * answered 200 without doing the work again: a retried webhook must never mark
 * an order paid twice.
 */
export async function POST(request: Request) {
  // Read the raw bytes: the signature is over exactly what was sent, and
  // re-serialising parsed JSON would change it.
  const raw = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const deliveryId = request.headers.get('x-razorpay-event-id') ?? signature;
  const db = getDb();
  const inserted = await db
    .insert(webhookEvents)
    .values({ id: randomUUID(), provider: 'razorpay', eventId: deliveryId, payload: event })
    .onConflictDoNothing()
    .returning();

  if (inserted.length === 0) return NextResponse.json({ ok: true, duplicate: true });

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const entity = event.payload?.payment?.entity;
    if (entity?.order_id && entity.id) await markPaid(entity.order_id, entity.id);
  }

  return NextResponse.json({ ok: true });
}
