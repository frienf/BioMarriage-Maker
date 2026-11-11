import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CHITRA_FRAMES, SHEET, clearance, slotSpacer } from '../src/templates/chitra-frames.ts';
import { frameDataUri } from '../src/templates/chitra-art.ts';
import { TEMPLATES } from '../src/templates/catalog.ts';

const frames = Object.entries(CHITRA_FRAMES);
const file = (rel: string) => fileURLToPath(new URL(`../${rel}`, import.meta.url));
// Coordinates in the original artwork checks were measured on 1240 × 1754.
const printPoint = (x: number, y: number) => ({ left: Math.round(x * 1588 / 1240), top: Math.round(y * 2246 / 1754) });

/** WCAG contrast ratio between two #RRGGBB colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('every frame has its specified print size and a 600px preview copy', async () => {
  for (const [slug] of frames) {
    const print = await sharp(file(`assets/frames/${slug}.jpg`)).metadata();
    assert.deepEqual([print.width, print.height], [1588, 2246], `${slug} print copy`);
    const preview = await sharp(file(`public/frames/${slug}.jpg`)).metadata();
    assert.equal(preview.width, 600, `${slug} preview copy`);
  }
});

test('vaibhav-lakshmi is registered with the existing Lakshmi motif and chamfered photo path', () => {
  const frame = CHITRA_FRAMES['vaibhav-lakshmi'];
  assert.ok(frame, 'frame row must be registered');
  assert.equal(frame.motif, 'lakshmi');
  assert.equal(frame.slot.shape, 'path');
  assert.ok(frame.slot.path?.endsWith('Z'));
  assert.equal(frame.plate, undefined);
});

test('kanha uses the Krishna Chitra frame and is offered in all three languages', () => {
  const frame = CHITRA_FRAMES.kanha;
  const template = TEMPLATES.find((t) => t.slug === 'kanha');
  assert.ok(frame);
  assert.ok(template);
  assert.equal(frame.motif, 'krishna');
  assert.equal(frame.slot.shape, 'oval');
  assert.equal(frame.plate, undefined);
  assert.equal(template.layout, 'chitra');
  assert.equal(template.collection, 'devotional');
  assert.deepEqual(template.deities, ['krishna']);
  assert.deepEqual(template.docLocales, ['en', 'hi', 'mr']);
  assert.equal(template.pricePaise, 4900);
  assert.equal(template.pages, 1);
});

test('vaibhav-lakshmi has a 1588 × 2246 print copy and a 600px preview', async () => {
  const print = await sharp(file('assets/frames/vaibhav-lakshmi.jpg')).metadata();
  const preview = await sharp(file('public/frames/vaibhav-lakshmi.jpg')).metadata();
  assert.deepEqual([print.width, print.height], [1588, 2246]);
  assert.equal(preview.width, 600);
});

test('jagannath artwork occupies its intended near-full-page width', async () => {
  const pixel = await sharp(file('assets/frames/jagannath.jpg'))
    .extract({ ...printPoint(100, 877), width: 1, height: 1 }).raw().toBuffer();
  assert.ok(pixel[0] > pixel[1] * 1.25 && pixel[1] < 160, 'expected the red border at print x=100');
});

test('jagannath leaves the outer 20 CSS pixels free of border art', async () => {
  for (const [left, top] of [[30, 877], [877, 30]]) {
    const pixel = await sharp(file('assets/frames/jagannath.jpg'))
      .extract({ ...printPoint(left, top), width: 1, height: 1 }).raw().toBuffer();
    assert.ok(pixel[0] > 240 && pixel[1] > 240 && pixel[2] > 240, `border too close at ${left},${top}`);
  }
});

test('durga-trishul inner field is not confined to the undersized inset', async () => {
  const pixel = await sharp(file('assets/frames/durga-trishul.jpg'))
    .extract({ ...printPoint(150, 877), width: 1, height: 1 }).raw().toBuffer();
  assert.ok(pixel[0] > 200 && pixel[1] > 190 && pixel[2] > 160, 'expected the cream field at print x=150');
});

test('jagannath keeps the full header alongside its portrait frame', () => {
  const frame = CHITRA_FRAMES.jagannath;
  assert.equal(frame.containHeader, true);
  assert.ok((slotSpacer(frame)?.h ?? 0) >= 60);
});

test('simha portrait uses the drawn central opening and its text clears the frame', () => {
  const frame = CHITRA_FRAMES.simha;
  assert.ok(frame.slot.x >= 328 && frame.slot.x <= 332);
  assert.ok(frame.slot.y >= 209 && frame.slot.y <= 213);
  assert.ok(frame.slot.w >= 132 && frame.slot.w <= 138);
  assert.ok(frame.slot.h >= 186 && frame.slot.h <= 191);
  assert.equal(slotSpacer(frame), null);
});

test('slot and text box lie inside the sheet', () => {
  for (const [slug, f] of frames) {
    const { top, right, bottom, left } = f.text;
    assert.ok([top, right, bottom, left].every((v) => v >= 0), `${slug}: negative text inset`);
    assert.ok(left + right <= SHEET.w - 400, `${slug}: text box narrower than 400px`);
    assert.ok(top + bottom <= SHEET.h - 400, `${slug}: text box shorter than 400px`);
    const s = f.slot;
    assert.ok(s.x >= 0 && s.y >= 0 && s.x + s.w <= SHEET.w && s.y + s.h <= SHEET.h, `${slug}: slot leaves the sheet`);
  }
});

test('a slot that reaches into the text box is deep enough to beside-set the head, and leaves it 300px', () => {
  for (const [slug, f] of frames) {
    const s = slotSpacer(f);
    if (!s) continue;
    assert.ok(s.h >= 60, `${slug}: a ${s.h}px spacer only knocks the head off-centre; move text.top below the slot`);
    assert.ok(f.slot.x - clearance(f) - f.text.left >= 300, `${slug}: under 300px left beside the photo for the name`);
  }
});

test('accent and ink reach 4.5:1 against the paper', () => {
  for (const [slug, f] of frames) {
    assert.ok(contrast(f.paper, f.accent) >= 4.5, `${slug}: accent ${f.accent} on ${f.paper}`);
    assert.ok(contrast(f.paper, f.ink) >= 4.5, `${slug}: ink ${f.ink} on ${f.paper}`);
  }
});

test('only a path slot carries a path', () => {
  for (const [slug, f] of frames) assert.equal(f.slot.shape === 'path', Boolean(f.slot.path), slug);
});

test('body size stays between 13 and 14.5px', () => {
  for (const [slug, f] of frames) assert.ok(f.size >= 13 && f.size <= 14.5, `${slug}: ${f.size}px`);
});

test('jagannath-mandir is a separate devotional Chitra frame with a cusped portrait', async () => {
  const frame = CHITRA_FRAMES['jagannath-mandir'];
  const template = TEMPLATES.find((t) => t.slug === 'jagannath-mandir');
  assert.ok(frame);
  assert.ok(template);
  assert.equal(frame.motif, 'jagannath');
  assert.equal(frame.slot.shape, 'path');
  assert.ok(frame.slot.path?.endsWith('Z'));
  assert.equal(frame.plate, undefined);
  assert.equal(template.layout, 'chitra');
  assert.equal(template.collection, 'devotional');
  assert.deepEqual(template.docLocales, ['en', 'hi', 'mr']);
  assert.equal(template.pricePaise, 4900);
  assert.equal(template.pages, 1);
  const print = await sharp(file('assets/frames/jagannath-mandir.jpg')).metadata();
  assert.deepEqual([print.width, print.height], [1588, 2246]);
});

test('balaji-namam is a separate devotional Chitra frame with a measured oval portrait', async () => {
  const frame = CHITRA_FRAMES['balaji-namam'];
  const template = TEMPLATES.find((t) => t.slug === 'balaji-namam');
  assert.ok(frame);
  assert.ok(template);
  assert.equal(frame.motif, 'balaji');
  assert.equal(frame.slot.shape, 'oval');
  assert.equal(frame.plate, undefined);
  assert.equal(template.layout, 'chitra');
  assert.equal(template.collection, 'devotional');
  assert.deepEqual(template.deities, ['balaji']);
  assert.deepEqual(template.docLocales, ['en', 'hi', 'mr']);
  assert.equal(template.pricePaise, 4900);
  assert.equal(template.pages, 1);
  const print = await sharp(file('assets/frames/balaji-namam.jpg')).metadata();
  assert.deepEqual([print.width, print.height], [1588, 2246]);
});

test('balaji-namam leaves the outer 20 CSS pixels free of artwork', async () => {
  // Sample the 40-print-px safety band (20 CSS px) on all four sides.
  for (const x of [0, 20, 38, 1549, 1570, 1587]) {
    for (const y of [140, 600, 1123, 1700, 2245]) {
      const { data } = await sharp(file('assets/frames/balaji-namam.jpg'))
        .extract({ left: x, top: Math.min(y, 2245), width: 1, height: 1 })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.ok(data[0] >= 245 && data[1] >= 245 && data[2] >= 245, `edge art at ${x},${y}`);
    }
  }
});

test('aditya leaves the outer 20 CSS pixels free of artwork', async () => {
  for (const x of [0, 20, 38, 1549, 1570, 1587]) {
    for (const y of [140, 600, 1123, 1700, 2245]) {
      const { data } = await sharp(file('assets/frames/aditya.jpg')).extract({ left: x, top: Math.min(y, 2245), width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.ok(data[0] >= 245 && data[1] >= 245 && data[2] >= 245, `edge art at ${x},${y}`);
    }
  }
  for (const y of [0, 60, 113, 2132, 2200, 2245]) {
    const { data } = await sharp(file('assets/frames/aditya.jpg')).extract({ left: 700, top: y, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.ok(data[0] >= 245 && data[1] >= 245 && data[2] >= 245, `edge art at 700,${y}`);
  }
  const template = TEMPLATES.find((t) => t.slug === 'aditya');
  assert.ok(template, 'aditya catalogue row');
  assert.equal(template.collection, 'devotional');
  assert.equal(template.pricePaise, 4900);
  assert.deepEqual(template.docLocales, ['en', 'hi', 'mr']);
});

test('the print copy is read only for a known frame', async () => {
  assert.match(await frameDataUri('vinayak'), /^data:image\/jpeg;base64,/);
  await assert.rejects(frameDataUri('../../package'));
  await assert.rejects(frameDataUri('no-such-frame'));
});

test('jagannath-dark is a separate devotional Chitra frame with a chamfered portrait', async () => {
  const frame = CHITRA_FRAMES['jagannath-dark'];
  const template = TEMPLATES.find((t) => t.slug === 'jagannath-dark');
  assert.ok(frame);
  assert.ok(template);
  assert.equal(frame.motif, 'jagannath');
  assert.equal(frame.slot.shape, 'path');
  assert.ok(frame.slot.path?.endsWith('Z'));
  assert.equal(frame.plate, undefined);
  assert.ok((slotSpacer(frame)?.h ?? 0) >= 60);
  assert.ok(frame.slot.x - (frame.moulding ?? 14) - 16 - frame.text.left >= 300);
  assert.equal(template.layout, 'chitra');
  assert.equal(template.collection, 'devotional');
  assert.deepEqual(template.docLocales, ['en', 'hi', 'mr']);
  assert.equal(template.pricePaise, 4900);
  assert.equal(template.pages, 1);
  const print = await sharp(file('assets/frames/jagannath-dark.jpg')).metadata();
  assert.deepEqual([print.width, print.height], [1588, 2246]);
  const preview = await sharp(file('public/frames/jagannath-dark.jpg')).metadata();
  assert.equal(preview.width, 600);
});

test('jagannath-dark leaves the outer 20 CSS pixels free of artwork', async () => {
  // Sample the 40-print-px safety band (20 CSS px) on the left and right.
  for (const x of [0, 20, 38, 1549, 1570, 1587]) {
    for (const y of [140, 600, 1123, 1700, 2245]) {
      const { data } = await sharp(file('assets/frames/jagannath-dark.jpg'))
        .extract({ left: x, top: Math.min(y, 2245), width: 1, height: 1 })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.ok(data[0] >= 245 && data[1] >= 245 && data[2] >= 245, `edge art at ${x},${y}`);
    }
  }
  // The dark field is preserved under the text.
  const pixel = await sharp(file('assets/frames/jagannath-dark.jpg'))
    .extract({ left: 700, top: 1123, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  assert.ok(pixel[0] >= 36 && pixel[0] <= 50 && pixel[1] >= 40 && pixel[1] <= 54, 'expected the charcoal field at 700,1123');
  // The generator sparkle is gone from the bottom-right corner.
  const sparkle = await sharp(file('assets/frames/jagannath-dark.jpg'))
    .extract({ left: 1438, top: 2097, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  assert.ok(sparkle[0] + sparkle[1] + sparkle[2] < 3 * 160, 'sparkle trace remains at the bottom-right corner');
});

test('other portrait slot coordinates remain unchanged', () => {
  const expected: Record<string, [number, number, number, number]> = {
    vithoba: [548, 125, 145, 195],
  };
  for (const [slug, [x, y, w, h]] of Object.entries(expected)) {
    const slot = CHITRA_FRAMES[slug].slot;
    assert.deepEqual([slot.x, slot.y, slot.w, slot.h], [x, y, w, h], slug);
  }
});

test('sri-yantra portrait and header fit the central artwork frame', () => {
  // Inner outline of assets/frames/sri-yantra.jpg on the 794 × 1123 sheet.
  const slot = CHITRA_FRAMES['sri-yantra'].slot;
  assert.equal(slot.shape, 'path');
  assert.ok(Math.abs(slot.x - 315) <= 4, 'photo must start at the left inner frame');
  assert.ok(Math.abs(slot.y - 180) <= 4, 'photo must start at the top inner frame');
  assert.ok(Math.abs(slot.x + slot.w - 480) <= 4, 'photo must end at the right inner frame');
  assert.ok(Math.abs(slot.y + slot.h - 390) <= 4, 'photo must end at the bottom inner frame');
  assert.ok(CHITRA_FRAMES['sri-yantra'].text.top >= 400, 'header must be below the frame');
});

test('portrait slots match the openings measured from the artwork', async () => {
  const cases = [
    { slug: 'surya', seed: [622, 220], threshold: 235, shape: 'oval' },
    { slug: 't1-lakshmi-elephants', seed: [580, 260], threshold: 220, shape: 'oval' },
    { slug: 'kartikeya', seed: [600, 240], threshold: 220, shape: 'rect' },
    { slug: 'parvati', seed: [607, 290], threshold: 235, shape: 'oval' }
  ] as const;
  for (const { slug, seed, threshold, shape } of cases) {
    const { data, info } = await sharp(file(`assets/frames/${slug}.jpg`))
      .resize(794, 1123).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const queue = [seed[1] * info.width + seed[0]];
    const seen = new Set(queue);
    let minX: number = seed[0], maxX: number = seed[0], minY: number = seed[1], maxY: number = seed[1];
    for (let i = 0; i < queue.length; i++) {
      const x = queue[i] % info.width, y = Math.floor(queue[i] / info.width);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const index = ny * info.width + nx;
        if (nx <= 400 || nx >= 730 || ny <= 80 || ny >= 410 || seen.has(index)) continue;
        const p = index * info.channels;
        if (Math.min(data[p], data[p + 1], data[p + 2]) <= threshold) continue;
        seen.add(index); queue.push(index);
      }
    }
    assert.ok(seen.size > 10000, `${slug}: opening could not be measured`);
    const slot = CHITRA_FRAMES[slug].slot;
    assert.equal(slot.shape, shape, slug);
    for (const [actual, measured, edge] of [[slot.x, minX, 'left'], [slot.y, minY, 'top'], [slot.x + slot.w - 1, maxX, 'right'], [slot.y + slot.h - 1, maxY, 'bottom']] as const) {
      assert.ok(Math.abs(actual - measured) <= 3, `${slug}: ${edge} slot ${actual}, artwork ${measured}`);
    }
  }
});
