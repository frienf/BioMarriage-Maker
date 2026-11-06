import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as downloads from '../src/lib/pdf-download.ts';

type Limited = <T>(token: string, work: () => Promise<T>) => Promise<
  { kind: 'busy' } | { kind: 'ok'; value: T }
>;
const limited = (downloads as unknown as { withRenderSlot: Limited }).withRenderSlot;

test('busy response tells the caller when to retry', async () => {
  const busyResponse = (downloads as unknown as { renderBusyResponse: () => Response }).renderBusyResponse;
  assert.equal(typeof busyResponse, 'function');
  const response = busyResponse();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '5');
  assert.match((await response.json()).error, /retry/i);
});

test('busy admission never renders or consumes the download allowance', async () => {
  const guarded = (downloads as unknown as { guardedAuthorizedPdf: (
    token: string, revision: number, deps: downloads.PdfDownloadDeps
  ) => Promise<{ kind: string }> }).guardedAuthorizedPdf;
  assert.equal(typeof guarded, 'function');
  let release!: () => void, renders = 0, charges = 0;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const deps = {
    async render() { renders++; await gate; return Buffer.from('pdf'); },
    async authorize() { charges++; return true; }
  };
  const first = guarded('same-token', 0, deps);
  try {
    assert.deepEqual(await guarded('same-token', 0, deps), { kind: 'busy' });
    assert.equal(renders, 1);
    assert.equal(charges, 0);
    assert.deepEqual(await limited('different-token', async () => 'allowed'), { kind: 'ok', value: 'allowed' });
  } finally { release(); await first; }
  assert.equal(charges, 1);
});

test('admission limits renders globally and by token without running rejected work', async () => {
  assert.equal(typeof limited, 'function');
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const running = ['a', 'b', 'c', 'd'].map((token) => limited(token, async () => { await gate; return token; }));
  let rejectedWork = 0;
  try {
    assert.deepEqual(await limited('a', async () => { rejectedWork++; }), { kind: 'busy' });
    assert.deepEqual(await limited('e', async () => { rejectedWork++; }), { kind: 'busy' });
    assert.equal(rejectedWork, 0);
  } finally { release(); await Promise.all(running); }
  assert.deepEqual(await limited('e', async () => 'done'), { kind: 'ok', value: 'done' });
});

test('a failed render releases its global and token slot', async () => {
  assert.equal(typeof limited, 'function');
  await assert.rejects(limited('failure', async () => { throw new Error('render failed'); }), /render failed/);
  assert.deepEqual(await limited('failure', async () => 'recovered'), { kind: 'ok', value: 'recovered' });
});

test('an authorization error releases the render slot', async () => {
  await assert.rejects(downloads.guardedAuthorizedPdf('db-error', 0, {
    async render() { return Buffer.from('pdf'); },
    async authorize() { throw new Error('authorization failed'); }
  }), /authorization failed/);
  assert.deepEqual(await limited('db-error', async () => 'recovered'), { kind: 'ok', value: 'recovered' });
});
