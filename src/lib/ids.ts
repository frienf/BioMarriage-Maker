import { randomBytes, randomInt } from 'node:crypto';

/**
 * The purchase token is the only thing standing between a stranger and
 * someone's biodata, so it is a 160-bit random value, never a sequence.
 */
export function purchaseToken(): string {
  return randomBytes(20).toString('base64url');
}

/** Human-quotable order number for support. Not a secret, never an index. */
export function orderNumber(now: Date = new Date()): string {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `BM-${ymd}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`;
}
