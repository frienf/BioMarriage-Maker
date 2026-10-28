import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { COLLECTIONS, SWATCHES, TEMPLATES, templateBySlug } from '../src/templates/catalog.ts';
import { DEV_THEMES } from '../src/templates/devotional-themes.ts';
import { MOTIFS } from '../src/templates/motifs.ts';
import { CHITRA_FRAMES } from '../src/templates/chitra-frames.ts';
import { unsupportedGlyphs } from '../src/lib/glyphs.ts';

test('the catalogue is the twelve designs, one devotional template per deity, and one chitra template per frame', () => {
  assert.equal(TEMPLATES.filter((t) => t.collection !== 'devotional').length, 12);
  const dev = TEMPLATES.filter((t) => t.layout === 'devotional');
  assert.ok(dev.every((t) => t.collection === 'devotional' && t.motif), 'a devotional template without a motif has no ornaments');
  assert.deepEqual(dev.map((t) => t.motif).sort(), [...MOTIFS].sort(), 'every deity has exactly one devotional-layout template');
  const chitra = TEMPLATES.filter((t) => t.layout === 'chitra');
  assert.ok(chitra.every((t) => t.collection === 'devotional'));
  assert.deepEqual(chitra.map((t) => t.slug).sort(), Object.keys(CHITRA_FRAMES).sort(), 'every frame has exactly one template');
  assert.equal(TEMPLATES.length, 26 + chitra.length);
});

test('every invocation typesets in the template faces', () => {
  for (const [motif, t] of Object.entries(DEV_THEMES)) assert.deepEqual(unsupportedGlyphs(t.invocation), [], motif);
});

test('slugs are unique, because a slug is a URL', () => {
  const slugs = TEMPLATES.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `${s} is not URL-safe`);
});

test('a non-devotional template has an accent colour and devotional ones do not need one', () => {
  for (const t of TEMPLATES) {
    if (t.layout === 'devotional' || t.layout === 'chitra') continue;
    assert.ok(t.accent, `${t.slug} has no accent colour`);
    assert.match(t.accent!, /^#[0-9A-Fa-f]{6}$/);
  }
});

test('every template is priced in whole paise above zero', () => {
  for (const t of TEMPLATES) {
    assert.ok(Number.isInteger(t.pricePaise) && t.pricePaise > 0, `${t.slug} is mispriced`);
    assert.equal(t.pricePaise % 100, 0, `${t.slug} is not a whole number of rupees`);
  }
});

test('every template offers at least one document language', () => {
  for (const t of TEMPLATES) assert.ok(t.docLocales.length > 0, `${t.slug} cannot be issued in any language`);
});

test('every collection in the filter bar actually has templates', () => {
  for (const c of COLLECTIONS) {
    assert.ok(TEMPLATES.some((t) => t.collection === c.id), `the ${c.id} filter would always be empty`);
  }
});

test('a layout with swatches offers its accent as one of them', () => {
  for (const t of TEMPLATES) {
    const swatches = SWATCHES[t.layout];
    if (!swatches.length) continue;
    assert.ok(swatches.some((s) => s.hex.toLowerCase() === t.accent?.toLowerCase()), `${t.slug}'s default colour is not offered`);
  }
});

test('lookup by slug finds every template and nothing else', () => {
  for (const t of TEMPLATES) assert.equal(templateBySlug(t.slug)?.slug, t.slug);
  assert.equal(templateBySlug('no-such-template'), undefined);
});

test('every deity figure a theme names is a real file under public/deities', () => {
  for (const [motif, t] of Object.entries(DEV_THEMES)) {
    if (!t.figure) continue;
    assert.equal(t.figure, `/deities/${motif}.png`);
    assert.ok(existsSync(new URL(`../public${t.figure}`, import.meta.url)), `${motif}: ${t.figure} is missing`);
  }
});

test('Om Shanti has no figure: its slot keeps the ॐ', () => {
  assert.equal(DEV_THEMES.om.figure, undefined);
});

test('a two-page template is only the one that was designed with a second page', () => {
  const twoPage = TEMPLATES.filter((t) => t.pages === 2).map((t) => t.slug);
  assert.deepEqual(twoPage, ['ganesh-mangal']);
});
