/**
 * Exercises every path that needs a database, end to end, against a running
 * dev server: order creation, the Razorpay webhook and its idempotency, the
 * Checkout callback, the download paywall and its allowance, the print page's
 * paid gate, and erasure.
 *
 * Razorpay's own servers are not involved: the signatures are computed here
 * with the same secrets the server verifies against, which is exactly what
 * Razorpay does. Only `createRazorpayOrder` (one POST to their API) is unproven
 * without live keys.
 *
 *   docker compose up -d postgres && npm run db:push
 *   npm run dev                        (in another terminal)
 *   npm run e2e
 */
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { emptyBiodata } from '../src/lib/biodata.ts';
import { attachRazorpayOrder, createOrder, eraseOrder, orderByToken, setPdfStatus } from '../src/lib/orders.ts';
import { pdfPathFor } from '../src/lib/pdf.ts';

const origin = process.env.APP_ORIGIN ?? 'http://localhost:3000';
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';
const hookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
assert.ok(keySecret && hookSecret, 'RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET must be set');

let passed = 0;
async function step(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    // A failed run must not leave the test biodata or its PDF behind. Straight
    // to the database, so this still works when the dev server is what failed.
    await eraseOrder(token).catch(() => {});
    throw err;
  }
  passed += 1;
  console.log(`  ok  ${name}`);
}

const sample = {
  ...emptyBiodata('kumkum', 'en'),
  fullName: 'Integration Test Person',
  profileType: 'bride' as const,
  dob: '1997-03-14',
  heightCm: 163,
  occupation: 'Data analyst',
  workLocation: 'Pune',
  fatherName: 'Test Father',
  phone: '+91 98000 00010',
  address: 'Kothrud, Pune'
};

console.log('\nDatabase-backed paths\n');

const order = await createOrder(sample, '#7B1E2B');
const token = order.token;
console.log(`  order ${order.orderNumber} (${token.slice(0, 8)}...)\n`);

const rzpOrderId = `order_test_${randomUUID().replace(/-/g, '').slice(0, 14)}`;
const rzpPaymentId = `pay_test_${randomUUID().replace(/-/g, '').slice(0, 14)}`;

await step('a new order starts unpaid and priced from the catalogue', async () => {
  assert.equal(order.status, 'awaiting_payment');
  assert.equal(order.pricePaise, 4900);
  assert.equal(order.downloadsUsed, 0);
  assert.equal(order.downloadLimit, 5);
  // Setup for the payment steps, inside a step so a failure here still erases
  // the order.
  await attachRazorpayOrder(token, rzpOrderId);
});

await step('the print page refuses an unpaid order', async () => {
  const res = await fetch(`${origin}/print/${token}`);
  assert.equal(res.status, 404, 'an unpaid token must not produce a clean document');
});

await step('the download is refused before payment', async () => {
  const res = await fetch(`${origin}/api/download/${token}`);
  assert.equal(res.status, 402);
});

function webhookBody(event: string) {
  return JSON.stringify({ event, payload: { payment: { entity: { id: rzpPaymentId, order_id: rzpOrderId } } } });
}
function sign(raw: string, secret: string) {
  return createHmac('sha256', secret).update(raw).digest('hex');
}
async function postWebhook(raw: string, signature: string, deliveryId: string) {
  return fetch(`${origin}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': signature, 'x-razorpay-event-id': deliveryId },
    body: raw
  });
}

const raw = webhookBody('payment.captured');
const delivery = `evt_${randomUUID()}`;

await step('a webhook with a bad signature is rejected', async () => {
  const res = await postWebhook(raw, sign(raw, 'wrong-secret'), `evt_${randomUUID()}`);
  assert.equal(res.status, 400);
  assert.equal((await orderByToken(token))!.status, 'awaiting_payment', 'a forged webhook must not pay an order');
});

await step('a correctly signed webhook marks the order paid', async () => {
  const res = await postWebhook(raw, sign(raw, hookSecret), delivery);
  assert.equal(res.status, 200);
  const row = (await orderByToken(token))!;
  assert.equal(row.status, 'paid');
  assert.equal(row.razorpayPaymentId, rzpPaymentId);
  assert.ok(row.paidAt, 'a paid order must carry when it was paid');
  assert.ok(row.expiresAt, 'retention must start at payment');
});

await step('Razorpay retrying the same webhook changes nothing', async () => {
  const before = (await orderByToken(token))!;
  const res = await postWebhook(raw, sign(raw, hookSecret), delivery);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, duplicate: true });
  const after = (await orderByToken(token))!;
  assert.equal(after.paidAt!.getTime(), before.paidAt!.getTime(), 'a retry must not re-stamp the payment');
});

await step('the Checkout callback accepts the real signature and refuses a forged one', async () => {
  const good = sign(`${rzpOrderId}|${rzpPaymentId}`, keySecret);
  const bad = await fetch(`${origin}/api/payments/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, razorpay_order_id: rzpOrderId, razorpay_payment_id: rzpPaymentId, razorpay_signature: 'deadbeef' })
  });
  assert.equal(bad.status, 400);

  const res = await fetch(`${origin}/api/payments/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, razorpay_order_id: rzpOrderId, razorpay_payment_id: rzpPaymentId, razorpay_signature: good })
  });
  assert.equal(res.status, 200);
  // The webhook already won this race; the callback must report the truth
  // rather than fail or pay twice.
  assert.deepEqual(await res.json(), { status: 'paid' });
});

await step('the print page renders once the order is paid', async () => {
  const res = await fetch(`${origin}/print/${token}`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes('Integration Test Person'), 'the print page should carry the biodata');
});

await step('the first download renders a real PDF', async () => {
  const res = await fetch(`${origin}/api/download/${token}`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.match(res.headers.get('content-disposition') ?? '', /attachment; filename="biodata-BM-/);
  const bytes = Buffer.from(await res.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString('latin1'), '%PDF-', 'that is not a PDF');
  const pages = bytes.toString('latin1').match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
  assert.equal(pages, 1, `a one-page template should print one page, not ${pages}`);
  assert.equal((await orderByToken(token))!.downloadsUsed, 1);
});

await step('the allowance is spent exactly five times', async () => {
  for (let i = 2; i <= 5; i++) {
    const res = await fetch(`${origin}/api/download/${token}`);
    assert.equal(res.status, 200, `download ${i} should succeed`);
    await res.arrayBuffer();
  }
  assert.equal((await orderByToken(token))!.downloadsUsed, 5);
});

await step('the sixth download is refused and does not over-count', async () => {
  const res = await fetch(`${origin}/api/download/${token}`);
  assert.equal(res.status, 429);
  assert.equal((await orderByToken(token))!.downloadsUsed, 5, 'a refused download must not be charged');
});

await step('concurrent downloads cannot both slip past the limit', async () => {
  // A fresh order, taken to one download short of its limit, then hit twice at
  // once. A check-then-write would let both through.
  const second = await createOrder({ ...sample, fullName: 'Race Test' }, null);
  try {
    const oid = `order_test_${randomUUID().replace(/-/g, '').slice(0, 14)}`;
    await attachRazorpayOrder(second.token, oid);
    const body = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: `pay_${randomUUID().slice(0, 12)}`, order_id: oid } } } });
    await postWebhook(body, sign(body, hookSecret), `evt_${randomUUID()}`);

    for (let i = 0; i < 4; i++) await (await fetch(`${origin}/api/download/${second.token}`)).arrayBuffer();
    assert.equal((await orderByToken(second.token))!.downloadsUsed, 4);

    const [a, b] = await Promise.all([
      fetch(`${origin}/api/download/${second.token}`),
      fetch(`${origin}/api/download/${second.token}`)
    ]);
    await Promise.all([a.arrayBuffer(), b.arrayBuffer()]);
    const codes = [a.status, b.status].sort();
    assert.deepEqual(codes, [200, 429], `exactly one should win, got ${codes.join(' and ')}`);
    assert.equal((await orderByToken(second.token))!.downloadsUsed, 5);
  } finally {
    // Erased even when an assertion above fails, so no run leaves a paid test
    // order and its PDF behind. Swallowed, so a cleanup error cannot hide the
    // failure that got us here.
    await eraseOrder(second.token).catch(() => {});
  }
});

await step('the order status endpoint reports what the page needs', async () => {
  const res = await fetch(`${origin}/api/orders/${token}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'paid');
  assert.equal(body.downloadsUsed, 5);
  assert.equal(body.downloadLimit, 5);
  assert.equal(body.deleted, false);
});

await step('erasure removes the details and closes every door', async () => {
  // The server and this script share STORAGE_DIR from .env.local.
  const pdf = pdfPathFor(token);
  assert.ok(existsSync(pdf), 'the downloads should have cached a PDF');
  const res = await fetch(`${origin}/api/orders/${token}`, { method: 'DELETE' });
  assert.equal(res.status, 200);

  const row = (await orderByToken(token))!;
  assert.equal(row.biodata, null, 'the biodata must be gone');
  assert.equal(existsSync(pdf), false, 'the cached PDF must be gone too');
  // What a download mid-render does when it finishes: it must be refused, or
  // the route would keep the PDF it just wrote.
  assert.equal(await setPdfStatus(token, 'ready', pdf), false, 'a late render must not mark an erased order ready');
  assert.equal((await orderByToken(token))!.pdfPath, null);
  assert.ok(row.deletedAt, 'the erasure must be recorded');
  assert.equal(row.orderNumber, order.orderNumber, 'the row stays, for accounts and refunds');
  assert.equal(row.pricePaise, 4900);

  assert.equal((await fetch(`${origin}/print/${token}`)).status, 404);
  assert.equal((await fetch(`${origin}/api/download/${token}`)).status, 410);
});

await step('an unknown token leaks nothing', async () => {
  assert.equal((await fetch(`${origin}/api/orders/does-not-exist`)).status, 404);
  assert.equal((await fetch(`${origin}/api/download/does-not-exist`)).status, 404);
  assert.equal((await fetch(`${origin}/print/does-not-exist`)).status, 404);
});

console.log(`\n${passed} checks passed.\n`);
process.exit(0);
