import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const imagesDir = 'Design Template';
const templatesDir = 'public/templates';
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg')).slice(0, 4);

const ratios = [
  [3, 4],   // portrait
  [4, 5],   // portrait
  [3, 4],
  [1, 1.414] // A4-ish
];

const collections = ['traditional', 'traditional', 'devotional', 'premium'];
const accents = ['#7B1E2B', '#8A4B12', '#1F5A4A', '#5A1E3A'];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const id = `design-${String(i + 1).padStart(2, '0')}`;
  const ratio = ratios[i];
  const srcPath = path.join(imagesDir, file);
  const dir = path.join(templatesDir, id);
  fs.mkdirSync(dir, { recursive: true });

  const img = sharp(srcPath);
  const meta = await img.metadata();
  const w = meta.width ?? 900;
  const h = meta.height ?? Math.round(w * (ratio[1] / ratio[0]));

  // background at image's aspect ratio (untouched)
  await img.webp({ quality: 92 }).resize(w, h, { fit: 'fill' }).toFile(path.join(dir, 'background.webp'));
  await img.webp({ quality: 80 }).resize(300, Math.round(300 * ((meta.height || 900) / (meta.width || 900))), { fit: 'fill' }).toFile(path.join(dir, 'thumb.webp'));

  const manifest = {
    id,
    version: 1,
    canvas: { ratio },
    photoSlot: {
      shape: 'circle',
      box: { x: 0.65, y: 0.10, w: 0.22, h: 0.15 },
      path: null,
      radius: null,
      inset: 0.012,
    },
    contentArea: { x: 0.14, y: 0.36, w: 0.72, h: 0.58 },
    exclusions: [],
    theme: {
      text: '#1c1b1a', heading: '#800020', divider: '#a47a35',
      fontHeading: 'serif', fontBody: 'sans-serif', baseSize: 11,
    },
    layoutHint: 'two-column',
  };
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('created', id, 'from', file, 'ratio', ratio, 'bg', w, 'x', Math.round(meta.height || 900));
}
console.log('done');
