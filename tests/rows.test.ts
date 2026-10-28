import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyBiodata } from '../src/lib/biodata.ts';
import { buildSections, digits, formatDate, formatHeight, formatTime } from '../src/templates/rows.ts';

test('dates are written the way each language writes them', () => {
  assert.equal(formatDate('1997-03-14', 'en', 'latin'), '14 March 1997');
  assert.equal(formatDate('1997-03-14', 'hi', 'latin'), '14 मार्च 1997');
  assert.equal(formatDate('1997-03-14', 'mr', 'devanagari'), '१४ मार्च १९९७');
  assert.equal(formatDate('bad', 'en', 'latin'), '');
});

test('Devanagari numerals convert digit by digit', () => {
  assert.equal(digits('2026', 'devanagari'), '२०२६');
  assert.equal(digits('2026', 'latin'), '2026');
});

test('the part of day goes after the clock in English and before it in Devanagari', () => {
  assert.equal(formatTime('06:40', 'en', 'latin'), '6:40 am');
  assert.equal(formatTime('18:05', 'en', 'latin'), '6:05 pm');
  assert.equal(formatTime('09:10', 'hi', 'latin'), 'सुबह 9:10');
  assert.equal(formatTime('06:40', 'mr', 'devanagari'), 'सकाळी ६:४०');
  assert.equal(formatTime('99:99', 'en', 'latin'), '');
});

test('midnight and noon do not become zero o clock', () => {
  assert.equal(formatTime('00:30', 'en', 'latin'), '12:30 am');
  assert.equal(formatTime('12:30', 'en', 'latin'), '12:30 pm');
});

test('height converts centimetres to feet and inches', () => {
  assert.equal(formatHeight(163, 'en', 'latin'), '5 ft 4 in');
  assert.equal(formatHeight(163, 'mr', 'devanagari'), '५ फूट ४ इंच');
  assert.equal(formatHeight(undefined, 'en', 'latin'), '');
});

test('an unfilled field leaves no blank line on the page', () => {
  const data = { ...emptyBiodata('kumkum', 'en'), fullName: 'A Person', dob: '1997-03-14', religion: '', nativePlace: 'Pune' };
  const built = buildSections(data);
  const labels = built.personal.rows.map((r) => r.l);
  assert.ok(labels.includes('Date of birth'));
  assert.ok(labels.includes('Native place'));
  assert.ok(!labels.includes('Religion'), 'an empty religion must not print a label with nothing after it');
});

test('a section switched off contributes nothing', () => {
  const base = { ...emptyBiodata('kumkum', 'en'), fullName: 'A', dob: '1997-03-14', fatherName: 'B', rashi: 'Mesh' };
  assert.equal(buildSections({ ...base, showFamily: false }).family.rows.length, 0);
  assert.equal(buildSections({ ...base, showHoroscope: false }).horoscope.rows.length, 0);
  assert.equal(buildSections({ ...base, showHoroscope: true }).horoscope.rows.length, 1);
});

test('the kicker follows who the biodata is for', () => {
  const base = { ...emptyBiodata('kumkum', 'mr'), fullName: 'A', dob: '1997-03-14' };
  assert.equal(buildSections({ ...base, profileType: 'bride' }).kicker, 'वधू परिचय');
  assert.equal(buildSections({ ...base, profileType: 'groom' }).kicker, 'वर परिचय');
  assert.equal(buildSections({ ...base, profileType: 'unspecified' }).kicker, 'बायोडाटा');
});
