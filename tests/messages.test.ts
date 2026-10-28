import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * A missing key renders as the key itself on a stranger's screen, which is why
 * this is a test and not a lint rule.
 */
const load = (l: string) => JSON.parse(readFileSync(new URL(`../src/i18n/messages/${l}.json`, import.meta.url), 'utf8'));

function flatten(o: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

test('Hindi and Marathi carry every key English has, and no extras', () => {
  const en = flatten(load('en')).sort();
  assert.ok(en.length > 200, 'the English catalogue should be the full UI');
  for (const locale of ['hi', 'mr']) {
    const other = flatten(load(locale)).sort();
    assert.deepEqual(other.filter((k) => !en.includes(k)), [], `${locale} has keys English does not`);
    assert.deepEqual(en.filter((k) => !other.includes(k)), [], `${locale} is missing keys`);
  }
});

test('no translation was left as the English string in a Devanagari locale', () => {
  const en = load('en');
  for (const locale of ['hi', 'mr']) {
    const other = load(locale);
    // Spot-check the lines a visitor reads first.
    assert.notEqual(other.home.title, en.home.title, `${locale} home title is untranslated`);
    assert.notEqual(other.nav.create, en.nav.create, `${locale} main call to action is untranslated`);
  }
});

test('the home page counts templates from the catalogue, never in words', () => {
  for (const l of ['en', 'hi', 'mr']) {
    assert.match(load(l).home.how1Body, /\{count\}/, `${l} hard-codes the number of designs`);
  }
});
