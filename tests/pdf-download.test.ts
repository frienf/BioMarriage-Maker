import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorizedPdf, printableRevision } from '../src/lib/pdf-download.ts';

test('print authorization requires the exact paid, unexpired, undeleted revision', () => {
  const order = { status: 'paid', deletedAt: null, expiresAt: new Date('2030-01-01'), editsUsed: 2 };
  const now = new Date('2029-01-01');
  assert.equal(printableRevision(order, '2', now), true);
  for (const revision of ['1', '02', '-1', '2.0', '', ['2']]) {
    assert.equal(printableRevision(order, revision, now), false);
  }
  assert.equal(printableRevision({ ...order, deletedAt: now }, '2', now), false);
  assert.equal(printableRevision({ ...order, expiresAt: now }, '2', now), false);
  assert.equal(printableRevision({ ...order, status: 'refunded' }, '2', now), false);
});

function setup() {
  let revision = 0, allowed = true, remaining = 1, started!: () => void, unblock!: () => void;
  const rendering = new Promise<void>((resolve) => { started = resolve; });
  const release = new Promise<void>((resolve) => { unblock = resolve; });
  return {
    rendering, unblock,
    edit() { revision++; },
    revoke() { allowed = false; },
    remaining() { return remaining; },
    run() {
      return authorizedPdf(0, {
        async render() { started(); await release; return Buffer.from('pdf'); },
        async authorize(expected) {
          if (!allowed || revision !== expected || remaining === 0) return false;
          remaining--; return true;
        }
      });
    }
  };
}

test('edit, deletion, expiry or refund overtaking a render refuses bytes without consuming allowance', async () => {
  for (const change of ['edit', 'delete', 'expire', 'refund'] as const) {
    const f = setup();
    const result = f.run();
    await f.rendering;
    if (change === 'edit') f.edit(); else f.revoke();
    f.unblock();
    assert.equal(await result, null);
    assert.equal(f.remaining(), 1);
  }
});

test('competing successful renders consume at most the available allowance', async () => {
  const f = setup();
  const a = f.run(), b = f.run();
  await f.rendering; f.unblock();
  const results = await Promise.all([a, b]);
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(f.remaining(), 0);
});

test('render failure never authorizes or consumes an allowance', async () => {
  let attempts = 0;
  await assert.rejects(authorizedPdf(0, {
    async render() { throw new Error('render failed'); },
    async authorize() { attempts++; return true; }
  }), /render failed/);
  assert.equal(attempts, 0);
});

test('authorization database failure never returns PDF bytes', async () => {
  await assert.rejects(authorizedPdf(0, {
    async render() { return Buffer.from('pdf'); },
    async authorize() { throw new Error('db failed'); }
  }), /db failed/);
});
