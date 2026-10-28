import { z } from 'zod';

/**
 * One field model for every template and every language.
 *
 * Templates choose which of these to show; none of them invent fields. Every
 * cultural field (gotra, manglik, caste, complexion) is optional, because a
 * family that does not want it on the page should not have to type it.
 */

export const DOC_LOCALES = ['en', 'hi', 'mr'] as const;
export type DocLocale = (typeof DOC_LOCALES)[number];

export const PROFILE_TYPES = ['bride', 'groom', 'unspecified'] as const;
export type ProfileType = (typeof PROFILE_TYPES)[number];

/** Hard caps, so one pasted essay cannot push a biodata to four pages. */
const LIMITS = {
  name: 80,
  short: 60,
  line: 120,
  long: 600
} as const;

const short = z.string().trim().max(LIMITS.short);
const line = z.string().trim().max(LIMITS.line);

export const educationEntry = z.object({
  qualification: line,
  institution: line.optional().default(''),
  year: z
    .string()
    .trim()
    .regex(/^$|^(19|20)\d{2}$/, 'Use a four-digit year')
    .optional()
    .default('')
});

export const sibling = z.object({
  relation: z.enum(['brother', 'sister']),
  name: short.optional().default(''),
  note: line.optional().default('')
});

export const photo = z.object({
  /** data: URL while editing on the device, blob key once paid. */
  src: z.string().max(4_000_000).optional().default(''),
  /** CSS object-position, so a face can be centred without a cropper. */
  position: z.string().trim().max(24).optional().default('50% 30%')
});

export const biodataSchema = z.object({
  templateSlug: z.string().trim().min(1),
  docLocale: z.enum(DOC_LOCALES),

  fullName: z.string().trim().min(1, 'Add the name that goes on the biodata').max(LIMITS.name),
  profileType: z.enum(PROFILE_TYPES),

  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Add the date of birth'),
  tob: z.string().regex(/^$|^\d{2}:\d{2}$/).optional().default(''),
  pob: short.optional().default(''),
  heightCm: z.number().int().min(120).max(230).optional(),
  religion: short.optional().default(''),
  caste: short.optional().default(''),
  motherTongue: short.optional().default(''),
  nativePlace: short.optional().default(''),
  diet: z.enum(['', 'vegetarian', 'eggetarian', 'non-vegetarian', 'jain', 'vegan']).optional().default(''),
  complexion: short.optional().default(''),

  education: z.array(educationEntry).max(5).optional().default([]),
  occupation: line.optional().default(''),
  employer: line.optional().default(''),
  workLocation: short.optional().default(''),
  income: short.optional().default(''),

  showFamily: z.boolean().optional().default(true),
  fatherName: short.optional().default(''),
  fatherOccupation: line.optional().default(''),
  motherName: short.optional().default(''),
  motherOccupation: line.optional().default(''),
  siblings: z.array(sibling).max(6).optional().default([]),
  familyType: z.enum(['', 'nuclear', 'joint']).optional().default(''),
  familyNativePlace: short.optional().default(''),

  showHoroscope: z.boolean().optional().default(false),
  rashi: short.optional().default(''),
  nakshatra: short.optional().default(''),
  gotra: short.optional().default(''),
  manglik: z.enum(['', 'no', 'yes', 'partial', 'unknown']).optional().default(''),
  gan: short.optional().default(''),
  nadi: short.optional().default(''),
  charan: short.optional().default(''),

  about: z.string().trim().max(LIMITS.long).optional().default(''),
  expectations: z.string().trim().max(LIMITS.long).optional().default(''),

  contactName: short.optional().default(''),
  phone: z.string().trim().regex(/^$|^[+0-9][0-9 ()-]{6,19}$/, 'Check the phone number').optional().default(''),
  altPhone: z.string().trim().regex(/^$|^[+0-9][0-9 ()-]{6,19}$/).optional().default(''),
  email: z.union([z.literal(''), z.string().email()]).optional().default(''),
  address: z.string().trim().max(LIMITS.long).optional().default(''),

  photo: photo.optional().default({ src: '', position: '50% 30%' })
});

export type Biodata = z.infer<typeof biodataSchema>;

/** Minimum legal age to marry in India: 18 for a bride, 21 for a groom. */
export const MIN_AGE: Record<ProfileType, number> = {
  bride: 18,
  groom: 21,
  // Nothing says which, so apply the stricter of the two rather than guess.
  unspecified: 21
};

/** Whole years from an ISO date to `on`. Returns null if the date is unusable. */
export function ageOn(isoDob: string, on: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDob);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dob = new Date(Date.UTC(y, mo - 1, d));
  // Reject a date the calendar rolled over, e.g. 2001-02-30.
  if (dob.getUTCFullYear() !== y || dob.getUTCMonth() !== mo - 1 || dob.getUTCDate() !== d) return null;
  let age = on.getUTCFullYear() - y;
  const beforeBirthday =
    on.getUTCMonth() < mo - 1 || (on.getUTCMonth() === mo - 1 && on.getUTCDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

export type FieldIssue = { field: string; message: string };

/**
 * Everything that must hold before money changes hands. The zod schema covers
 * shape; this covers the rules a biodata has to obey to be publishable.
 */
export function checkBiodata(data: Biodata, now: Date = new Date()): FieldIssue[] {
  const issues: FieldIssue[] = [];

  const age = ageOn(data.dob, now);
  if (age === null) {
    issues.push({ field: 'dob', message: 'That date of birth is not a real date.' });
  } else if (age < 0 || age > 100) {
    issues.push({ field: 'dob', message: 'Check the date of birth.' });
  } else {
    const min = MIN_AGE[data.profileType];
    if (age < min) {
      issues.push({
        field: 'dob',
        message: `This biodata would be for someone aged ${age}. The legal minimum age to marry in India is ${min}.`
      });
    }
  }

  if (!data.fullName.trim()) {
    issues.push({ field: 'fullName', message: 'Add the name that goes on the biodata.' });
  }

  // A biodata nobody can answer is not finished. Either channel is enough.
  if (!data.phone && !data.email) {
    issues.push({ field: 'phone', message: 'Add a phone number or an email address so families can reply.' });
  }

  return issues;
}

/**
 * An empty draft. Deliberately not run through the schema: a draft is
 * incomplete by definition, and `dob` has not been typed yet.
 */
export function emptyBiodata(templateSlug: string, docLocale: DocLocale): Biodata {
  return {
    templateSlug,
    docLocale,
    fullName: '',
    profileType: 'unspecified',
    dob: '',
    tob: '',
    pob: '',
    religion: '',
    caste: '',
    motherTongue: '',
    nativePlace: '',
    diet: '',
    complexion: '',
    education: [],
    occupation: '',
    employer: '',
    workLocation: '',
    income: '',
    showFamily: true,
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: [],
    familyType: '',
    familyNativePlace: '',
    showHoroscope: false,
    rashi: '',
    nakshatra: '',
    gotra: '',
    manglik: '',
    gan: '',
    nadi: '',
    charan: '',
    about: '',
    expectations: '',
    contactName: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    photo: { src: '', position: '50% 30%' }
  };
}
