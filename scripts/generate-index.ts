import fs from 'node:fs';
import path from 'node:path';
import { ManifestSchema } from '../src/templates/schema.ts';

const base = path.join('public', 'templates');
const dirs = fs.readdirSync(base, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const ids: string[] = [];
for (const id of dirs) {
  const manifestPath = path.join(base, id, 'manifest.json');
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  ManifestSchema.parse(manifest);
  const bg = path.join(base, id, 'background.webp');
  if (!fs.existsSync(bg)) throw new Error(`Missing background for ${id}`);
  // ratio check: image dimensions should match canvas ratio (approx)
  ids.push(id);
}
fs.writeFileSync(path.join(base, 'index.json'), JSON.stringify(ids, null, 2));
console.log('Generated index.json with', ids.length, 'templates');
