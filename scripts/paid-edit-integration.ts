/** Run only against the dedicated local test database and server. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { emptyBiodata } from '../src/lib/biodata.ts';
import { attachRazorpayOrder, createOrder, eraseOrder, markPaid, orderByToken } from '../src/lib/orders.ts';

const dbUrl = new URL(process.env.DATABASE_URL ?? 'invalid:');
assert.equal(dbUrl.hostname, '127.0.0.1');
assert.equal(dbUrl.username, 'edit_test');
assert.equal(dbUrl.pathname, '/edit_test');
assert.equal(process.env.APP_ORIGIN, 'http://localhost:3118');
assert.equal(process.env.ISOLATED_TEST_DATABASE, 'confirmed');
const origin = process.env.APP_ORIGIN;
const data = { ...emptyBiodata('kumkum', 'en'), fullName: 'Synthetic Example', profileType: 'bride' as const, dob: '1990-01-01', phone: '+919876543210' };
const order = await createOrder(data, null);
const url = `${origin}/api/orders/${order.token}/edit`;
const patch = (biodata: typeof data, expectedRevision: number) => fetch(url, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ biodata, expectedRevision })
});
try {
  assert.equal((await fetch(url)).status, 404, 'unpaid orders cannot be edited');
  const paymentOrder = `order_test_${randomUUID().replaceAll('-', '')}`;
  await attachRazorpayOrder(order.token, paymentOrder);
  assert.ok(await markPaid(paymentOrder, `pay_test_${randomUUID().replaceAll('-', '')}`));
  const loaded = await fetch(url);
  assert.equal(loaded.status, 200);
  assert.match(loaded.headers.get('cache-control') ?? '', /no-store/);
  assert.equal((await loaded.json()).editsUsed, 0);
  assert.equal((await patch(data, 0)).status, 200, 'no-op succeeds');
  assert.equal((await orderByToken(order.token))?.editsUsed, 0, 'no-op does not consume an edit');
  assert.equal((await patch({ ...data, templateSlug: 'mayur' }, 0)).status, 400, 'upgrades above the paid price are rejected');
  const edited = { ...data, fullName: 'Synthetic Updated' };
  assert.equal((await patch(edited, 0)).status, 200);
  assert.equal((await patch(data, 0)).status, 409, 'stale revision is rejected');
  assert.equal((await fetch(`${origin}/print/${order.token}?revision=0`)).status, 404);
  const print = await fetch(`${origin}/print/${order.token}?revision=1`);
  assert.equal(print.status, 200);
  assert.match(await print.text(), /Synthetic Updated/);
  const download = await fetch(`${origin}/api/download/${order.token}`);
  assert.equal(download.status, 200);
  assert.equal(Buffer.from(await download.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
  const results = await Promise.all([
    patch({ ...edited, fullName: 'Concurrent One' }, 1),
    patch({ ...edited, fullName: 'Concurrent Two' }, 1)
  ]);
  const statuses = results.map((r) => r.status).sort();
  assert.equal(statuses[0], 200);
  assert.ok([404, 409].includes(statuses[1]), `the losing request must be unavailable or stale: ${statuses}`);
  const final = await orderByToken(order.token);
  assert.equal(final?.editsUsed, 2);
  assert.equal(final?.downloadsUsed, 1);
  assert.equal(final?.pricePaise, order.pricePaise);
  assert.equal((await fetch(url)).status, 404, 'exhausted orders cannot be edited');
  console.log('Paid-edit database integration: passed (no-op, price, revision, PDF, concurrent saves, allowance).');
} finally {
  await eraseOrder(order.token);
}
process.exit(0);
