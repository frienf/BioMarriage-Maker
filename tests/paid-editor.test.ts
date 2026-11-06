import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { editAvailability, allowedTemplate, overflowingPages } from '../src/lib/paid-editor.ts';

test('edit availability distinguishes status, deletion, expiry and exhausted edits', () => {
  const order = { status: 'paid', deleted: false, expiresAt: '2030-01-01T00:00:00Z', editsUsed: 1, editLimit: 2 };
  const now = Date.parse('2029-01-01T00:00:00Z');
  assert.equal(editAvailability(order, now), 'available');
  assert.equal(editAvailability({ ...order, status: 'refunded' }, now), 'unpaid');
  assert.equal(editAvailability({ ...order, deleted: true }, now), 'deleted');
  assert.equal(editAvailability({ ...order, expiresAt: null }, now), 'expired');
  assert.equal(editAvailability({ ...order, expiresAt: '2029-01-01T00:00:00Z' }, now), 'expired');
  assert.equal(editAvailability({ ...order, editsUsed: 2 }, now), 'exhausted');
});

test('only the original or an affordable template is selectable', () => {
  assert.equal(allowedTemplate({ slug: 'original', pricePaise: 9000 }, 'original', 4900), true);
  assert.equal(allowedTemplate({ slug: 'other', pricePaise: 4900 }, 'original', 4900), true);
  assert.equal(allowedTemplate({ slug: 'other', pricePaise: 5000 }, 'original', 4900), false);
});

test('checks every expected page and refuses incomplete measurements', () => {
  const sheet = (scrollHeight: number) => ({ scrollHeight });
  assert.deepEqual(overflowingPages([sheet(1123)], 1, 1123), []);
  assert.deepEqual(overflowingPages([sheet(1123), sheet(1126)], 2, 1123), [2]);
  assert.deepEqual(overflowingPages([sheet(1126), sheet(1126)], 2, 1123), [1, 2]);
  assert.equal(overflowingPages([sheet(1123)], 2, 1123), null);
  assert.equal(overflowingPages([], 1, 1123), null);
  assert.equal(overflowingPages([sheet(0), sheet(1123)], 2, 1123), null);
});
