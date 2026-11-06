import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { emptyBiodata } from '../src/lib/biodata.ts';
import * as edits from '../src/lib/order-edits.ts';
const { editableOrder, prepareOrderEdit } = edits;

const now = new Date('2026-01-01T00:00:00Z');
const data = { ...emptyBiodata('kumkum', 'en'), fullName: 'Asha', dob: '1990-01-01', email: 'a@example.com' };
const order = { status: 'paid', deletedAt: null, expiresAt: new Date('2026-01-02T00:00:00Z'), editsUsed: 0, editLimit: 2, templateSlug: 'kumkum', pricePaise: 4900, biodata: data };

test('final no-op check distinguishes available, stale, and unavailable orders', () => {
  const current = { eligible: true, editsUsed: 1, editLimit: 2 };
  assert.deepEqual(edits.classifyNoop(current, 1), { kind: 'ok', editsUsed: 1, editLimit: 2 });
  assert.deepEqual(edits.classifyNoop(current, 0), { kind: 'conflict' });
  assert.deepEqual(edits.classifyNoop({ ...current, eligible: false }, 1), { kind: 'unavailable' });
  assert.deepEqual(edits.classifyNoop({ ...current, eligible: null }, 1), { kind: 'unavailable' });
  assert.deepEqual(edits.classifyNoop(null, 1), { kind: 'unavailable' });
});

test('only paid, undeleted, unexpired orders with remaining edits are editable', () => {
  assert.equal(editableOrder(order, now), true);
  for (const change of [{ status: 'refunded' }, { deletedAt: now }, { expiresAt: now }, { expiresAt: null }, { editsUsed: 2 }]) {
    assert.equal(editableOrder({ ...order, ...change }, now), false);
  }
});

test('normalizes defaults and whitespace before detecting a no-op', async () => {
  const { photo: _, ...withoutPhoto } = data;
  const result = await prepareOrderEdit(order, { biodata: { ...withoutPhoto, fullName: ' Asha ' }, expectedRevision: 0 }, now);
  assert.equal(result.kind, 'noop');
});

test('requires a valid revision and rejects stale edits even if unchanged', async () => {
  assert.equal((await prepareOrderEdit(order, { biodata: data, expectedRevision: 1 }, now)).kind, 'conflict');
  for (const expectedRevision of [-1, 0.5, '0', null]) {
    assert.equal((await prepareOrderEdit(order, { biodata: data, expectedRevision }, now)).kind, 'invalid');
  }
});

test('validates biodata, publication rules, glyphs, and template locale', async () => {
  for (const biodata of [null, { ...data, dob: '2020-01-01' }, { ...data, fullName: '😀' }, { ...data, templateSlug: 'unknown' }, { ...data, templateSlug: 'hindi-paramparik', docLocale: 'en' }]) {
    assert.equal((await prepareOrderEdit(order, { biodata, expectedRevision: 0 }, now)).kind, 'invalid');
  }
});

test('permits current template despite price increases but rejects a costlier switch', async () => {
  assert.equal((await prepareOrderEdit({ ...order, pricePaise: 2900 }, { biodata: { ...data, fullName: 'Anita' }, expectedRevision: 0 }, now)).kind, 'update');
  assert.equal((await prepareOrderEdit(order, { biodata: { ...data, templateSlug: 'mayur' }, expectedRevision: 0 }, now)).kind, 'invalid');
  assert.equal((await prepareOrderEdit(order, { biodata: { ...data, templateSlug: 'saral' }, expectedRevision: 0 }, now)).kind, 'update');
});

test('unavailable orders never authorize edits', async () => {
  assert.equal((await prepareOrderEdit({ ...order, status: 'awaiting_payment' }, { biodata: data, expectedRevision: 0 }, now)).kind, 'unavailable');
});

test('only empty or decodable raster image data URLs are accepted', async () => {
  const check = async (src: string) => (await prepareOrderEdit(order, { biodata: { ...data, photo: { ...data.photo, src } }, expectedRevision: 0 }, now)).kind;
  const jpeg = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'red' } }).jpeg().toBuffer();
  const png = await sharp(jpeg).png().toBuffer();
  const webp = await sharp(jpeg).webp().toBuffer();
  const oversized = await sharp({ create: { width: 8001, height: 5000, channels: 3, background: 'white' } }).png().toBuffer();
  assert.ok(`data:image/png;base64,${oversized.toString('base64')}`.length <= 4_000_000);
  assert.equal(await check(''), 'noop');
  assert.equal(await check(`data:image/jpeg;base64,${jpeg.toString('base64')}`), 'update');
  assert.equal(await check(`data:image/png;base64,${png.toString('base64')}`), 'update');
  assert.equal(await check(`data:image/webp;base64,${webp.toString('base64')}`), 'update');
  for (const src of [
    'http://127.0.0.1:3000/private', 'http://169.254.169.254/latest/meta-data/',
    'https://example.com/photo.jpg', 'file:///etc/passwd', 'javascript:alert(1)',
    'data:image/svg+xml;base64,PHN2Zy8+', `data:image/png;base64,${webp.toString('base64')}`,
    `data:image/webp;base64,${jpeg.toString('base64')}`, `data:image/png;base64,${oversized.toString('base64')}`,
    `data:image/jpeg;base64,${png.toString('base64')}`, 'data:image/jpeg;base64,',
    'data:image/jpeg;base64,%%%%', 'data:image/jpeg;base64,YQ=',
    'data:image/jpeg;base64,/9j/2Q==', `data:image/jpeg;base64,${'A'.repeat(4_000_000)}`
  ]) assert.equal(await check(src), 'invalid', src.slice(0, 80));
});

test('legacy 1201 by 1200 PNG allows normalized no-op and unrelated edits', async () => {
  const png = await sharp({ create: { width: 1201, height: 1200, channels: 3, background: 'blue' } }).png().toBuffer();
  const oldData = { ...data, photo: { ...data.photo, src: `data:image/png;base64,${png.toString('base64')}` } };
  const existing = { ...order, biodata: oldData };
  assert.equal((await prepareOrderEdit(existing, { biodata: { ...oldData, fullName: ' Asha ' }, expectedRevision: 0 }, now)).kind, 'noop');
  assert.equal((await prepareOrderEdit(existing, { biodata: { ...oldData, fullName: 'Anita' }, expectedRevision: 0 }, now)).kind, 'update');
});

test('unsafe legacy photos allow no-op but changed saves must replace them', async () => {
  const oldData = { ...data, photo: { ...data.photo, src: 'http://127.0.0.1/private' } };
  const existing = { ...order, biodata: oldData };
  assert.equal((await prepareOrderEdit(existing, { biodata: oldData, expectedRevision: 0 }, now)).kind, 'noop');
  const changed = await prepareOrderEdit(existing, { biodata: { ...oldData, fullName: 'Anita' }, expectedRevision: 0 }, now);
  assert.equal(changed.kind, 'invalid');
  if (changed.kind === 'invalid') assert.match(changed.error, /replace|remove/i);
  assert.equal((await prepareOrderEdit(existing, { biodata: { ...oldData, photo: data.photo }, expectedRevision: 0 }, now)).kind, 'update');
});

test('animated WebP cannot be saved on an edit', async () => {
  const pixels = Buffer.from([255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 255]);
  const webp = await sharp(pixels, { raw: { width: 2, height: 4, channels: 3, pageHeight: 2 } }).webp({ delay: [100, 100] }).toBuffer();
  assert.equal((await sharp(webp).metadata()).pages, 2);
  const biodata = { ...data, photo: { ...data.photo, src: `data:image/webp;base64,${webp.toString('base64')}` } };
  assert.equal((await prepareOrderEdit(order, { biodata, expectedRevision: 0 }, now)).kind, 'invalid');
});

test('rejects APNG while accepting static PNG containing acTL in text', async () => {
  // Two-frame APNG produced by Pillow; Sharp does not report its animation.
  const apng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAACGFjVEwAAAACAAAAAPONk3AAAAAaZmNUTAAAAAAAAAACAAAAAgAAAAAAAAAAAAEACgAA6FTcAAAAABVJREFUeJxj/M/A8J+BgYGBCUSAMAAfFwICAkezFAAAABpmY1RMAAAAAQAAAAIAAAACAAAAAAAAAAAAAQAKAABzJzbUAAAAGWZkQVQAAAACeJxjZGD4/5+BgYGBCUSAMAAdGQICRW6eVwAAAABJRU5ErkJggg==', 'base64');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAGXRFWHRub3RlAGxlZ2l0aW1hdGUgYWNUTCB0ZXh034yg5gAAABBJREFUeJxj/M8AAkxgkgEADR0BA4LJcf8AAAAASUVORK5CYII=', 'base64');
  assert.ok(((await sharp(apng).metadata()).pages ?? 1) <= 1);
  const check = async (bytes: Buffer) => (await prepareOrderEdit(order, { biodata: { ...data, photo: { ...data.photo, src: `data:image/png;base64,${bytes.toString('base64')}` } }, expectedRevision: 0 }, now)).kind;
  assert.equal(await check(apng), 'invalid');
  assert.equal(await check(png), 'update');
  const badLength = Buffer.from(png);
  badLength.writeUInt32BE(0xffffffff, 8);
  assert.equal(await check(badLength), 'invalid');
  assert.equal(await check(png.subarray(0, png.length - 1)), 'invalid');
});

test('edit body reader enforces byte limit across chunks and handles malformed JSON', async () => {
  const stream = (...chunks: Uint8Array[]) => new ReadableStream<Uint8Array>({
    start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); }
  });
  const encode = (text: string) => new TextEncoder().encode(text);
  assert.deepEqual(await edits.readEditBody(stream(encode('{"name":"'), encode('अ"}'))), { kind: 'ok', body: { name: 'अ' } });
  assert.equal((await edits.readEditBody(stream(encode('{bad')))).kind, 'invalid');
  assert.equal((await edits.readEditBody(null)).kind, 'invalid');
  assert.equal((await edits.readEditBody(stream(new Uint8Array(2_100_000), new Uint8Array(2_000_001)))).kind, 'too-large');
  assert.equal((await edits.readEditBody(stream(new Uint8Array(4_100_001)))).kind, 'too-large');
  const exact = `"${'a'.repeat(4_099_998)}"`;
  assert.equal((await edits.readEditBody(stream(encode(exact)))).kind, 'ok');
  const request = new Request('https://example.test', { method: 'PATCH', headers: { 'Content-Length': '1' }, body: encode(`${exact} `) });
  assert.equal((await edits.readEditBody(request.body)).kind, 'too-large');
  let cancelled = false;
  const endless = new ReadableStream<Uint8Array>({
    pull(controller) { controller.enqueue(new Uint8Array(4_100_001)); },
    cancel() { cancelled = true; }
  });
  assert.equal((await edits.readEditBody(endless)).kind, 'too-large');
  assert.equal(cancelled, true);
});
