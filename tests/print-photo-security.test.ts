import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyBiodata } from '../src/lib/biodata.ts';
import * as pdf from '../src/lib/pdf-download.ts';
import sharp from 'sharp';

test('printable biodata rejects a legacy remote photo instead of fetching it', async () => {
  assert.equal(typeof (pdf as Record<string, unknown>).printableBiodata, 'function');
  const check = (pdf as unknown as { printableBiodata(data: unknown): Promise<unknown> }).printableBiodata;
  const data = { ...emptyBiodata('kumkum', 'en'), fullName: 'Synthetic Test', dob: '1990-01-01', phone: '+919876543210' };
  assert.equal(await check({ ...data, photo: { src: 'http://127.0.0.1/private', position: '50% 30%' } }), null);
  assert.notEqual(await check(data), null);
  const jpeg = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'red' } }).jpeg().toBuffer();
  assert.notEqual(await check({ ...data, photo: { src: `data:image/jpeg;base64,${jpeg.toString('base64')}`, position: '50% 30%' } }), null);
});
