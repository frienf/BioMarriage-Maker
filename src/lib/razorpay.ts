import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Razorpay, without the SDK.
 *
 * ponytail: creating an order is one POST and both signature checks are one
 * HMAC each. A dependency for 40 lines is a dependency to patch later.
 */

const API = 'https://api.razorpay.com/v1';

function keys() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
  return { id, secret };
}

export function publicKeyId(): string {
  return process.env.RAZORPAY_KEY_ID ?? '';
}

export type RazorpayOrder = { id: string; amount: number; currency: string; status: string };

/** `amountPaise` is sent exactly as given: Razorpay's unit is already paise. */
export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<RazorpayOrder> {
  const { id, secret } = keys();
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`
    },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, payment_capture: 1 })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/** Constant-time compare of two hex digests of the same length. */
function hexEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

/**
 * The signature Checkout hands back. Proves this browser completed this
 * payment; it does NOT prove the money settled, which is why the webhook
 * exists as well.
 */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  const { secret } = keys();
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return hexEquals(expected, signature);
}

/** The webhook signature, over the exact raw body bytes Razorpay sent. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET must be set');
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  return hexEquals(expected, signature);
}
