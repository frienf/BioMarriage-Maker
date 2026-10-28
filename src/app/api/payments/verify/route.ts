import { NextResponse } from 'next/server';
import { markPaid, orderByToken } from '@/lib/orders';
import { verifyCheckoutSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';

/**
 * The browser's word that Checkout succeeded, with a signature to back it.
 *
 * The webhook is the authority on settlement; this exists so the visitor sees
 * their PDF immediately instead of waiting for a webhook they cannot see.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;

  if (!body?.token || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
    return NextResponse.json({ error: 'Incomplete payment details.' }, { status: 400 });
  }

  if (!verifyCheckoutSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) {
    return NextResponse.json({ error: 'That payment could not be verified.' }, { status: 400 });
  }

  const order = await orderByToken(body.token);
  // The signature proves the payment; this proves it belongs to THIS order.
  if (!order || order.razorpayOrderId !== body.razorpay_order_id) {
    return NextResponse.json({ error: 'That payment does not match this order.' }, { status: 400 });
  }

  const paid = await markPaid(body.razorpay_order_id, body.razorpay_payment_id);
  // A null here means the webhook won the race, which is a success, not a
  // failure, so the current state is read back rather than assumed.
  const current = paid ?? (await orderByToken(body.token));
  return NextResponse.json({ status: current?.status ?? 'awaiting_payment' });
}
