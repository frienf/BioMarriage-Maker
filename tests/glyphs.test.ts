import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unsupportedGlyphs, unsupportedIn } from '../src/lib/glyphs.ts';

test('the scripts the templates are typeset in all pass', () => {
  assert.deepEqual(unsupportedGlyphs('Ananya Prakash Kulkarni'), []);
  assert.deepEqual(unsupportedGlyphs('अनन्या प्रकाश कुलकर्णी'), []);
  assert.deepEqual(unsupportedGlyphs('॥ श्री गणेशाय नमः ॥'), []);
  assert.deepEqual(unsupportedGlyphs('किर्र्र् क्ष्म्य'), [], 'deep conjuncts are still Devanagari');
  assert.deepEqual(unsupportedGlyphs('₹49 — "quoted" don’t'), []);
});

test('characters that would print as a box are caught', () => {
  assert.deepEqual(unsupportedGlyphs('Satara ★'), ['★']);
  assert.deepEqual(unsupportedGlyphs('\u{1F60A}'), ['\u{1F60A}'], 'emoji are outside every template face');
  assert.deepEqual(unsupportedGlyphs('你好'), ['你', '好']);
});

test('each offending character is reported once', () => {
  assert.deepEqual(unsupportedGlyphs('★★★'), ['★']);
});

test('nested values are checked, not just top-level strings', () => {
  const found = unsupportedIn({
    fullName: 'Fine',
    siblings: [{ name: 'Rohan ★' }],
    nested: { deep: { note: '\u{1F60A}' } },
    heightCm: 163,
    showFamily: true
  });
  assert.deepEqual(found.sort(), ['★', '\u{1F60A}'].sort());
});
