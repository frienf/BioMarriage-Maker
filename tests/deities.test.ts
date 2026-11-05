import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEITY_IDS, DEITIES, MOTIF_DEITY, deityLabel, matchesDeity, primaryDeity, deityFacets, deitiesWithTemplates } from '../src/templates/deities.ts';
import { TEMPLATES } from '../src/templates/catalog.ts';
import { CHITRA_FRAMES } from '../src/templates/chitra-frames.ts';
import { readFileSync } from 'node:fs';

test('deity ids are unique', () => {
  assert.equal(new Set(DEITY_IDS).size, DEITY_IDS.length);
});

test('every deity has labels in en, hi and mr and at least one alias', () => {
  for (const d of DEITIES) {
    assert.ok(d.label.en, `${d.id} missing en label`);
    assert.ok(d.label.hi, `${d.id} missing hi label`);
    assert.ok(d.label.mr, `${d.id} missing mr label`);
    assert.ok(d.aliases.length > 0, `${d.id} has no aliases`);
  }
});

test('every devotional-layout or Chitra template has at least one deity, unless commented', () => {
  const src = readFileSync(new URL('../src/templates/catalog.ts', import.meta.url), 'utf8');
  for (const t of TEMPLATES) {
    if (t.layout === 'devotional' || t.layout === 'chitra') {
      if (t.deities.length > 0) continue;
      // allow exception if the row has a trailing comment
      const line = src.split('\n').find((l: string) => l.includes(`slug: '${t.slug}'`));
      assert.ok(line && line.includes('//'), `${t.slug} (devotional/chitra) has no deity and no exception comment`);
    }
  }
});

test('neutral-collection templates have no deities', () => {
  const neutral = ['kumkum', 'rangoli', 'toran', 'akash', 'setu', 'kshitij', 'saral', 'shuddh', 'mayur', 'kamal', 'hindi-paramparik', 'marathi-paramparik'];
  for (const slug of neutral) {
    const t = TEMPLATES.find((x) => x.slug === slug);
    assert.ok(t, `${slug} not found`);
    assert.deepEqual(t!.deities, [], `${slug} should have no deities`);
  }
});

test('each template primary deity equals MOTIF_DEITY of its motif unless commented', () => {
  for (const t of TEMPLATES) {
    let motif: any = t.motif;
    if (!motif && t.layout === 'chitra') {
      const frame = CHITRA_FRAMES[t.slug];
      if (frame) motif = frame.motif;
    }
    if (!motif) continue;
    const expected = MOTIF_DEITY[motif as keyof typeof MOTIF_DEITY];
    if (expected === undefined) continue;
    const pd = primaryDeity(t);
    // allow exceptions documented by comments - check source
    assert.equal(pd, expected, `${t.slug}: primary deity ${pd} != MOTIF_DEITY ${expected}`);
  }
});

test('matchesDeity follows parents (vishnu matches krishna and vitthal templates)', () => {
  const krishnaTpl = TEMPLATES.find((t) => t.slug === 'murli-manohar')!;
  const vitthalTpl = TEMPLATES.find((t) => t.slug === 'vitthal')!;
  assert.ok(matchesDeity(krishnaTpl, 'vishnu'), 'vishnu should match krishna template');
  assert.ok(matchesDeity(vitthalTpl, 'vishnu'), 'vishnu should match vitthal template');
  assert.ok(matchesDeity(vitthalTpl, 'krishna'), 'krishna should match vitthal template');
});

test('deityFacets totals equal template counts with deities', () => {
  const facets = deityFacets(TEMPLATES);
  const total = Object.values(facets).reduce((a, b) => a + b, 0);
  const withDeity = TEMPLATES.filter((t) => t.deities.length > 0).length;
  assert.equal(total, withDeity, 'facet total should equal number of templates with deities');
});

test('deitiesWithTemplates returns deities with at least one template', () => {
  const withTpls = deitiesWithTemplates(TEMPLATES);
  assert.ok(withTpls.length > 0);
  // every deity in the list should have at least one matching template
  for (const id of withTpls) {
    assert.ok(TEMPLATES.some((t) => matchesDeity(t, id)), `${id} listed but no matching template`);
  }
});