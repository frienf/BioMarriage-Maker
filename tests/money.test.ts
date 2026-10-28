import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatINR, rupeesToPaise } from '../src/lib/money.ts';

test('rupees convert to whole paise without float drift', () => {
  assert.equal(rupeesToPaise(49), 4900);
  assert.equal(rupeesToPaise(0.1), 10);
  assert.equal(rupeesToPaise(29.99), 2999);
  // 0.1 + 0.2 in a double is 0.30000000000000004; this must still be 30.
  assert.equal(rupeesToPaise(0.1 + 0.2), 30);
});

test('a non-number is refused rather than silently becoming NaN paise', () => {
  assert.throws(() => rupeesToPaise(Number.NaN));
  assert.throws(() => rupeesToPaise(Number.POSITIVE_INFINITY));
});

test('whole rupees print without decimals', () => {
  assert.match(formatINR(4900), /49/);
  assert.ok(!formatINR(4900).includes('.00'));
  assert.ok(formatINR(4950).includes('.5'));
});
