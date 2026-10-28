import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const templates = [
  { id: 'lakshmi-elephants-01', ratio: [3, 4], color: '#f5f0e8' },
  { id: 'green-lotus-02', ratio: [1, 1.414], color: '#eef4ee' },
  { id: 'murugan-vel-03', ratio: [3, 4], color: '#f2ece4' },
  { id: 'stone-arch-04', ratio: [1, 1.414], color: '#ece7e0' },
];

for (const t of templates) {
  const w = 900;
  const h = Math.round(w * (t.ratio[1] / t.ratio[0]));
  const dir = path.join('public', 'templates', t.id);
  fs.mkdirSync(dir, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${t.color}"/>
    <text x="50%" y="50%" font-size="48" text-anchor="middle" fill="#999" font-family="serif">${t.id} placeholder</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 95 }).toFile(path.join(dir, 'background.webp'));
  // thumb
  await sharp(Buffer.from(svg)).resize(300, null).webp({ quality: 80 }).toFile(path.join(dir, 'thumb.webp'));
  console.log('generated', t.id, w, 'x', h);
}
console.log('done');
