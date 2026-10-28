import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ageOn, checkBiodata, emptyBiodata, MIN_AGE } from '../src/lib/biodata.ts';

const ON = new Date(Date.UTC(2026, 9, 19)); // 19 October 2026

function person(over: Partial<ReturnType<typeof emptyBiodata>> = {}) {
  return { ...emptyBiodata('kumkum', 'en'), fullName: 'Test Person', dob: '1997-03-14', phone: '+91 98000 00010', ...over };
}

test('ageOn counts whole years and respects the birthday', () => {
  assert.equal(ageOn('2000-10-19', ON), 26);
  assert.equal(ageOn('2000-10-20', ON), 25, 'a birthday tomorrow has not happened yet');
  assert.equal(ageOn('2000-10-18', ON), 26);
});

test('ageOn rejects dates the calendar never had', () => {
  assert.equal(ageOn('2001-02-30', ON), null);
  assert.equal(ageOn('not-a-date', ON), null);
  assert.equal(ageOn('', ON), null);
});

test('the legal minimum age differs for a bride and a groom', () => {
  assert.equal(MIN_AGE.bride, 18);
  assert.equal(MIN_AGE.groom, 21);
  assert.equal(MIN_AGE.unspecified, 21, 'unknown applies the stricter rule');
});

test('a bride of 19 is allowed and a groom of 19 is not', () => {
  const dob = '2007-01-01'; // 19 on the test date
  assert.deepEqual(checkBiodata(person({ dob, profileType: 'bride' }), ON), []);
  const groom = checkBiodata(person({ dob, profileType: 'groom' }), ON);
  assert.equal(groom.length, 1);
  assert.equal(groom[0].field, 'dob');
  assert.match(groom[0].message, /21/);
});

test('a biodata nobody can answer is not finished', () => {
  const issues = checkBiodata(person({ phone: '', email: '' }), ON);
  assert.ok(issues.some((i) => i.field === 'phone'));
  assert.deepEqual(checkBiodata(person({ phone: '', email: 'a@example.com' }), ON), []);
});

test('a missing name is reported', () => {
  const issues = checkBiodata(person({ fullName: '   ' }), ON);
  assert.ok(issues.some((i) => i.field === 'fullName'));
});
