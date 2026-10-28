/**
 * Turns the owner's page designs into the chitra templates' frame images.
 *
 *   npm run frames
 *
 * For each frame: repair the generator sparkle with the mirror image of the
 * opposite corner, paint out any listed rectangles, crop to the paper, then fit
 * into A4 without stretching. Writes two copies:
 *   assets/frames/<slug>.jpg  1240 x 1754, the print copy. Not public: only the
 *                             paid print page embeds it, as a data URI.
 *   public/frames/<slug>.jpg  600px wide, the preview copy, too coarse to print
 *                             as a free blank.
 * Rerun after replacing a source with a higher-resolution original under the
 * same name. All boxes are in source pixels.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

type Box = { x: number; y: number; w: number; h: number };
type Prep = {
  src: string;
  /** To the paper; only for the images photographed on a backdrop. */
  crop?: Box;
  /** The sparkle's box. Unset (and no crop) means the bottom-right 80px corner;
   *  false skips the repair. */
  sparkle?: Box | false;
  fills?: Array<Box & { colour: string }>;
};

const at = (cx: number, cy: number): Box => ({ x: cx - 30, y: cy - 30, w: 60, h: 60 });

const FRAMES: Record<string, Prep> = {
  vinayak: { src: 'image_2d80ef02.jpg', sparkle: at(811, 1177) },
  gajanan: { src: 'image_430871a3.jpg', sparkle: at(804, 1174) },
  ekadanta: { src: 'image_6f2e0c6a.jpg', sparkle: false, fills: [{ x: 93, y: 374, w: 386, h: 57, colour: '#F9FAF4' }] },
  siddhivinayak: { src: 'image_c3e8c406.jpg', sparkle: { x: 786, y: 1158, w: 48, h: 46 } },
  gajmukh: { src: 'image_fb1b0709.jpg', sparkle: at(836, 1140) },
  neelkanth: { src: 'image_9b354efe.jpg', sparkle: at(811, 1172) },
  bholenath: { src: 'image_f4c0e80a.jpg', sparkle: at(809, 1167) },
  vrindavan: { src: 'image_d598dc6b.jpg', sparkle: at(806, 1174) },
  govind: { src: 'image_e88ec56a.jpg', crop: { x: 90, y: 90, w: 716, h: 1019 } },
  kodanda: { src: 'image_63be21ea.jpg', sparkle: at(848, 1150) },
  dhanu: { src: 'image_b0a679dd.jpg', crop: { x: 44, y: 61, w: 779, h: 1121 }, sparkle: { x: 784, y: 1148, w: 40, h: 52 } },
  gajalakshmi: { src: 'image_5eb9d767.jpg', crop: { x: 52, y: 48, w: 792, h: 1103 }, sparkle: { x: 812, y: 1118, w: 32, h: 34 } },
  vithoba: { src: 'image_753afda.jpg', sparkle: at(843, 1145) },
  'sankat-mochan': { src: 'image_9fbaaf29.jpg', sparkle: at(841, 1145) }
};

const PRINT = { w: 1240, h: 1754 };
const PREVIEW_W = 600;
const srcDir = path.resolve('Design Template');
const printDir = path.resolve('assets/frames');
const previewDir = path.resolve('public/frames');

await mkdir(printDir, { recursive: true });
await mkdir(previewDir, { recursive: true });

for (const [slug, p] of Object.entries(FRAMES)) {
  const file = path.join(srcDir, p.src);
  const { width: W = 0, height: H = 0 } = await sharp(file).metadata();
  const layers: sharp.OverlayOptions[] = [];

  const box = p.sparkle === undefined && !p.crop ? { x: W - 96, y: H - 96, w: 80, h: 80 } : p.sparkle;
  if (box) {
    // Mirror about the paper's centre line: a photographed sheet is not centred
    // in its image, and the image's own centre would copy in a strip of backdrop.
    const axis = p.crop ? 2 * p.crop.x + p.crop.w - 1 : W - 1;
    const mirror = await sharp(file).extract({ left: axis - box.x - box.w + 1, top: box.y, width: box.w, height: box.h }).flop().toBuffer();
    layers.push({ input: mirror, left: box.x, top: box.y });
  }
  for (const f of p.fills ?? []) {
    layers.push({ input: { create: { width: f.w, height: f.h, channels: 3, background: f.colour } }, left: f.x, top: f.y });
  }

  // Composite and extract are separate passes: within one pipeline sharp
  // extracts first, which would put the repairs in the wrong place.
  let page = await sharp(file).composite(layers).toBuffer();
  if (p.crop) page = await sharp(page).extract({ left: p.crop.x, top: p.crop.y, width: p.crop.w, height: p.crop.h }).toBuffer();

  // Pad with the paper at the corners, so the bands added to reach A4 read as margin.
  const { data, info } = await sharp(page).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.height * info.width - 1];
  const [r, g, b] = [0, 1, 2].map((c) => Math.round(corners.reduce((sum, i) => sum + data[i * 3 + c], 0) / 4));

  const printFile = path.join(printDir, `${slug}.jpg`);
  await sharp(page)
    .resize(PRINT.w, PRINT.h, { fit: 'contain', background: { r, g, b }, kernel: 'lanczos3' })
    .jpeg({ quality: 90 })
    .toFile(printFile);
  await sharp(printFile).resize(PREVIEW_W).jpeg({ quality: 80 }).toFile(path.join(previewDir, `${slug}.jpg`));
  console.log(`${slug.padEnd(14)} ${p.src} -> assets/frames/${slug}.jpg, public/frames/${slug}.jpg`);
}
