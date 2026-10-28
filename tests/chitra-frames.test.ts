import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CHITRA_FRAMES, SHEET, clearance, slotSpacer } from '../src/templates/chitra-frames.ts';
import { frameDataUri } from '../src/templates/chitra-art.ts';

const frames = Object.entries(CHITRA_FRAMES);
const file = (rel: string) => fileURLToPath(new URL(`../${rel}`, import.meta.url));

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

test('every frame has a 1240 × 1754 print copy and a 600px preview copy', async () => {
  for (const [slug] of frames) {
    const print = await sharp(file(`assets/frames/${slug}.jpg`)).metadata();
    assert.deepEqual([print.width, print.height], [1240, 1754], `${slug} print copy`);
    const preview = await sharp(file(`public/frames/${slug}.jpg`)).metadata();
    assert.equal(preview.width, 600, `${slug} preview copy`);
  }
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

test('the print copy is read only for a known frame', async () => {
  assert.match(await frameDataUri('vinayak'), /^data:image\/jpeg;base64,/);
  await assert.rejects(frameDataUri('../../package'));
  await assert.rejects(frameDataUri('no-such-frame'));
});
