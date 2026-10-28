import type { Biodata, DocLocale } from '@/lib/biodata';
import { labelsFor } from './labels.ts';

/**
 * One place where biodata turns into printable rows.
 *
 * All 26 templates read these sections, so a field added here appears in every
 * design and a formatting fix lands everywhere at once. Templates decide the
 * look; they never decide what a date looks like.
 */

export type Row = { l: string; v: string };
export type Section = { title: string; rows: Row[]; text?: string };

export type Numerals = 'latin' | 'devanagari';

const DEV_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function digits(value: string | number, numerals: Numerals): string {
  const s = String(value);
  if (numerals === 'latin') return s;
  return s.replace(/[0-9]/g, (d) => DEV_DIGITS[Number(d)]);
}

const MONTHS: Record<DocLocale, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर'],
  mr: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर']
};

/** Part of day, because "9:10" alone reads wrong on a Hindi or Marathi page. */
const DAYPART: Record<DocLocale, [string, string, string, string]> = {
  en: ['am', 'pm', 'pm', 'pm'],
  hi: ['सुबह', 'दोपहर', 'शाम', 'रात'],
  mr: ['सकाळी', 'दुपारी', 'सायंकाळी', 'रात्री']
};

export function formatDate(iso: string, locale: DocLocale, numerals: Numerals): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return '';
  const month = MONTHS[locale][Number(m[2]) - 1];
  if (!month) return '';
  return `${digits(Number(m[3]), numerals)} ${month} ${digits(m[1], numerals)}`;
}

export function formatTime(hhmm: string, locale: DocLocale, numerals: Numerals): string {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return '';
  const h24 = Number(m[1]);
  const mins = m[2];
  if (h24 > 23 || Number(mins) > 59) return '';
  const band = h24 < 12 ? 0 : h24 < 16 ? 1 : h24 < 20 ? 2 : 3;
  const word = DAYPART[locale][band];
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const clock = `${digits(h12, numerals)}:${digits(mins, numerals)}`;
  // English puts the marker after the clock; Devanagari puts it before.
  return locale === 'en' ? `${clock} ${word}` : `${word} ${clock}`;
}

export function formatHeight(cm: number | undefined, locale: DocLocale, numerals: Numerals): string {
  if (!cm) return '';
  const l = labelsFor(locale);
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${digits(ft, numerals)} ${l.unitFt} ${digits(inch, numerals)} ${l.unitIn}`;
}

/** Drops rows whose value is empty, so an unfilled field leaves no blank line. */
function kept(rows: Array<[string, string]>): Row[] {
  return rows.filter(([, v]) => v.trim() !== '').map(([l, v]) => ({ l, v: v.trim() }));
}

export type Built = {
  kicker: string;
  name: string;
  subtitle: string;
  personal: Section;
  education: Section;
  family: Section;
  horoscope: Section;
  about: Section;
  expectations: Section;
  contact: Section;
  /** Every non-empty section, in printing order. */
  sections: Section[];
  /** Compact facts for the templates with a side column. */
  facts: Row[];
};

export function buildSections(data: Biodata, numerals: Numerals = 'latin'): Built {
  const loc = data.docLocale;
  const l = labelsFor(loc);
  const d = (v: string | number) => digits(v, numerals);

  const dietLabel: Record<NonNullable<Biodata['diet']>, string> = {
    '': '',
    vegetarian: l.dietVegetarian,
    eggetarian: l.dietEggetarian,
    'non-vegetarian': l.dietNonVegetarian,
    jain: l.dietJain,
    vegan: l.dietVegan
  };
  const manglikLabel: Record<NonNullable<Biodata['manglik']>, string> = {
    '': '',
    no: l.manglikNo,
    yes: l.manglikYes,
    partial: l.manglikPartial,
    unknown: l.manglikUnknown
  };
  const familyTypeLabel: Record<NonNullable<Biodata['familyType']>, string> = {
    '': '',
    nuclear: l.familyNuclear,
    joint: l.familyJoint
  };

  const personal: Section = {
    title: l.secPersonal,
    rows: kept([
      [l.dob, formatDate(data.dob, loc, numerals)],
      [l.tob, formatTime(data.tob ?? '', loc, numerals)],
      [l.pob, data.pob ?? ''],
      [l.height, formatHeight(data.heightCm, loc, numerals)],
      [l.religion, data.religion ?? ''],
      [l.caste, data.caste ?? ''],
      [l.motherTongue, data.motherTongue ?? ''],
      [l.nativePlace, data.nativePlace ?? ''],
      [l.complexion, data.complexion ?? ''],
      [l.diet, dietLabel[data.diet ?? '']]
    ])
  };

  const eduLines = (data.education ?? [])
    .map((e) => [e.qualification, e.institution, e.year ? d(e.year) : ''].filter(Boolean).join(', '))
    .filter(Boolean);

  const education: Section = {
    title: l.secEducation,
    rows: kept([
      [l.education, eduLines.join('; ')],
      [l.occupation, data.occupation ?? ''],
      [l.employer, data.employer ?? ''],
      [l.workLocation, data.workLocation ?? ''],
      [l.income, data.income ?? '']
    ])
  };

  const siblingRows: Array<[string, string]> = (data.siblings ?? []).map((s) => [
    s.relation === 'brother' ? l.brother : l.sister,
    [s.name, s.note].filter(Boolean).join(', ')
  ]);

  const family: Section = {
    title: l.secFamily,
    rows: data.showFamily
      ? kept([
          [l.father, data.fatherName ?? ''],
          [l.fatherOccupation, data.fatherOccupation ?? ''],
          [l.mother, data.motherName ?? ''],
          [l.motherOccupation, data.motherOccupation ?? ''],
          ...siblingRows,
          [l.familyType, familyTypeLabel[data.familyType ?? '']],
          [l.nativePlace, data.familyNativePlace ?? '']
        ])
      : []
  };

  const horoscope: Section = {
    title: l.secHoroscope,
    rows: data.showHoroscope
      ? kept([
          [l.rashi, data.rashi ?? ''],
          [l.nakshatra, data.nakshatra ?? ''],
          [l.gotra, data.gotra ?? ''],
          [l.gan, data.gan ?? ''],
          [l.nadi, data.nadi ?? ''],
          [l.charan, data.charan ?? ''],
          [l.manglik, manglikLabel[data.manglik ?? '']]
        ])
      : []
  };

  const about: Section = { title: l.secAbout, rows: [], text: (data.about ?? '').trim() };
  const expectations: Section = { title: l.secExpectations, rows: [], text: (data.expectations ?? '').trim() };

  const contact: Section = {
    title: l.secContact,
    rows: kept([
      [l.contactPerson, data.contactName ?? ''],
      [l.phone, data.phone ?? ''],
      [l.altPhone, data.altPhone ?? ''],
      [l.email, data.email ?? ''],
      [l.address, (data.address ?? '').replace(/\s*\n\s*/g, ', ')]
    ])
  };

  const kicker =
    data.profileType === 'bride' ? l.kickerBride : data.profileType === 'groom' ? l.kickerGroom : l.kickerBiodata;

  const subtitleParts = [data.occupation, data.workLocation].map((s) => (s ?? '').trim()).filter(Boolean);

  const all = [personal, education, family, horoscope, about, expectations, contact];

  return {
    kicker,
    name: data.fullName.trim(),
    subtitle: subtitleParts.join(', '),
    personal,
    education,
    family,
    horoscope,
    about,
    expectations,
    contact,
    sections: all.filter((s) => s.rows.length > 0 || (s.text ?? '') !== ''),
    facts: personal.rows.slice(0, 5)
  };
}
