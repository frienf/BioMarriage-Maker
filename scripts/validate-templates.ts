import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ManifestSchema } from '../src/templates/schema.ts';

const base = path.join('public', 'templates');
const ids = JSON.parse(fs.readFileSync(path.join(base, 'index.json'), 'utf8')) as string[];

for (const id of ids) {
  const dir = path.join(base, id);
  const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')));
  if (manifest.id !== id) throw new Error(`Manifest id mismatch: ${manifest.id} vs ${id}`);
  for (const f of ['background.webp', 'thumb.webp', 'manifest.json']) {
    if (!fs.existsSync(path.join(dir, f))) throw new Error(`Missing ${f} for ${id}`);
  }
  // ratio check
  const meta = await sharp(path.join(dir, 'background.webp')).metadata();
  const [rw, rh] = manifest.canvas.ratio;
  const actual = (meta.width ?? 0) / (meta.height ?? 1);
  const expected = rw / rh;
  if (Math.abs(actual - expected) > 0.01) throw new Error(`Ratio mismatch for ${id}: ${actual} vs ${expected}`);
  console.log('OK', id);
}
console.log('All templates valid');
