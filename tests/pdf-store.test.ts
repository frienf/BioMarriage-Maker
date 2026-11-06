import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pdfPathFor, removeOrderPdfs } from '../src/lib/pdf-store.ts';

test('recognizes distinct revisions and the legacy revision zero path', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'pdf-store-'));
  try {
    assert.equal(pdfPathFor('abc_123', 0, dir), path.join(dir, 'abc_123.pdf'));
    assert.notEqual(pdfPathFor('abc_123', 1, dir), pdfPathFor('abc_123', 2, dir));
    assert.throws(() => pdfPathFor('../bad', 0, dir));
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('deletion removes only this token’s revisions and crashed temporary files', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'pdf-store-'));
  try {
    for (const name of ['abc.pdf', 'abc.1.pdf', 'abc.1.123e4567-e89b-12d3-a456-426614174000.tmp', 'abc2.pdf', 'abc.extra.pdf']) {
      await writeFile(path.join(dir, name), 'private');
    }
    await removeOrderPdfs('abc', dir);
    assert.deepEqual((await readdir(dir)).sort(), ['abc.extra.pdf', 'abc2.pdf']);
    await removeOrderPdfs('abc', dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
