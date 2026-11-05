import type { DocLocale } from '@/lib/biodata';
import type { Motif } from './motifs.ts';
import type { TemplateDef } from './catalog.ts';

/**
 * Deity category for the template catalogue.
 *
 * A template can belong to zero, one or several deities (primary first).
 * `matchesDeity` follows the parent chain, so filtering by Vishnu also
 * surfaces Krishna, Ram, Balaji and Vitthal designs.
 */

export const DEITY_IDS = [
  'ganesha',
  'lakshmi',
  'shiva',
  'krishna',
  'ram',
  'hanuman',
  'vitthal',
  'khandoba',
  'ambabai',
  'durga',
  'saraswati',
  'balaji',
  'vishnu',
  'murugan',
  'om',
  'brahma'
] as const;

export type DeityId = (typeof DEITY_IDS)[number];

export type DeityLabel = { en: string; hi: string; mr: string };

export type Deity = {
  id: DeityId;
  label: DeityLabel;
  aliases: string[];
  parent?: DeityId;
  order: number;
};

// hi and mr labels need native review (see report).
export const DEITIES: Deity[] = [
  { id: 'ganesha', label: { en: 'Ganesha', hi: 'गणेश', mr: 'गणपती' }, aliases: ['ganesh', 'ganpati', 'ganapati', 'vinayak', 'vinayaka', 'gajanan', 'ekadanta', 'siddhivinayak', 'bappa'], order: 0 }, // hi needs native review, mr needs native review
  { id: 'lakshmi', label: { en: 'Lakshmi', hi: 'लक्ष्मी', mr: 'लक्ष्मी' }, aliases: ['laxmi', 'mahalakshmi', 'gajalakshmi', 'dhanalakshmi', 'shree'], order: 1 }, // hi needs native review, mr needs native review
  { id: 'shiva', label: { en: 'Shiva', hi: 'शिव', mr: 'शिव' }, aliases: ['shiv', 'mahadev', 'shankar', 'neelkanth', 'bholenath'], order: 2 }, // hi needs native review, mr needs native review
  { id: 'krishna', label: { en: 'Krishna', hi: 'कृष्ण', mr: 'कृष्ण' }, aliases: ['govind', 'gopal', 'murli', 'shrinathji', 'radha krishna'], parent: 'vishnu', order: 3 }, // hi needs native review, mr needs native review
  { id: 'ram', label: { en: 'Ram', hi: 'राम', mr: 'राम' }, aliases: ['raghav', 'kodanda', 'shri ram'], parent: 'vishnu', order: 4 }, // hi needs native review, mr needs native review
  { id: 'hanuman', label: { en: 'Hanuman', hi: 'हनुमान', mr: 'हनुमान' }, aliases: ['maruti', 'bajrangbali', 'anjaneya', 'sankat mochan'], order: 5 }, // hi needs native review, mr needs native review
  { id: 'vitthal', label: { en: 'Vitthal', hi: 'विठ्ठल', mr: 'विठ्ठल' }, aliases: ['vithoba', 'pandurang', 'panduranga', 'varkari'], parent: 'krishna', order: 6 }, // hi needs native review, mr needs native review
  { id: 'khandoba', label: { en: 'Khandoba', hi: 'खंडोबा', mr: 'खंडोबा' }, aliases: ['malhari', 'martand', 'jejuri'], parent: 'shiva', order: 7 }, // hi needs native review, mr needs native review
  { id: 'ambabai', label: { en: 'Ambabai', hi: 'अंबाबाई', mr: 'अंबाबाई' }, aliases: ['ambe', 'mahalakshmi kolhapur'], order: 8 }, // hi needs native review, mr needs native review
  { id: 'durga', label: { en: 'Durga', hi: 'दुर्गा', mr: 'दुर्गा' }, aliases: ['bhavani', 'navratri'], order: 9 }, // hi needs native review, mr needs native review
  { id: 'saraswati', label: { en: 'Saraswati', hi: 'सरस्वती', mr: 'सरस्वती' }, aliases: ['sharada'], order: 10 }, // hi needs native review, mr needs native review
  { id: 'balaji', label: { en: 'Balaji', hi: 'बालाजी', mr: 'बालाजी' }, aliases: ['venkateswara', 'tirupati', 'venkatesh'], parent: 'vishnu', order: 11 }, // hi needs native review, mr needs native review
  { id: 'vishnu', label: { en: 'Vishnu', hi: 'विष्णू', mr: 'विष्णू' }, aliases: ['narayan', 'narayana', 'padmanabha', 'sheshashayi'], order: 12 }, // hi needs native review, mr needs native review
  { id: 'murugan', label: { en: 'Murugan', hi: 'मुरुगन', mr: 'मुरुगन' }, aliases: ['kartikeya', 'subramanya', 'skanda'], order: 13 }, // hi needs native review, mr needs native review
  { id: 'om', label: { en: 'Om', hi: 'ॐ', mr: 'ॐ' }, aliases: ['aum'], order: 14 }, // hi needs native review, mr needs native review
  { id: 'brahma', label: { en: 'Brahma', hi: 'ब्रह्मा', mr: 'ब्रह्मा' }, aliases: ['lord brahma', 'lord of creation'], order: 15 }
];

// Parents: balaji, krishna and ram under vishnu; vitthal under krishna; khandoba under shiva.
// (Already set above.)

export const MOTIF_DEITY: Partial<Record<Motif, DeityId>> = {
  ganesh: 'ganesha',
  om: 'om',
  krishna: 'krishna',
  shiv: 'shiva',
  mahadev: 'shiva',
  trinetra: 'shiva',
  lakshmi: 'lakshmi',
  ram: 'ram',
  hanuman: 'hanuman',
  saraswati: 'saraswati',
  durga: 'durga',
  ambabai: 'ambabai',
  vitthal: 'vitthal',
  balaji: 'balaji',
  khandoba: 'khandoba',
  narayan: 'vishnu',
  shankha: 'vishnu',
  murugan: 'murugan',
  brahma: 'brahma'
};

const DEITY_BY_ID: Record<DeityId, Deity> = Object.fromEntries(DEITIES.map((d) => [d.id, d])) as Record<DeityId, Deity>;

/** Ancestor chain including self. */
function ancestors(id: DeityId): DeityId[] {
  const out: DeityId[] = [id];
  let cur = DEITY_BY_ID[id];
  while (cur?.parent) {
    out.push(cur.parent);
    cur = DEITY_BY_ID[cur.parent];
  }
  return out;
}

const ANCESTORS: Record<DeityId, DeityId[]> = Object.fromEntries(
  DEITY_IDS.map((id) => [id, ancestors(id)])
) as Record<DeityId, DeityId[]>;

export function deityLabel(id: DeityId, locale: DocLocale | string): string {
  const d = DEITY_BY_ID[id];
  if (!d) return id;
  const l = (locale === 'hi' || locale === 'mr' || locale === 'en') ? locale : 'en';
  return d.label[l as 'en' | 'hi' | 'mr'];
}

export function matchesDeity(template: TemplateDef, id: DeityId): boolean {
  if (!template.deities || template.deities.length === 0) return false;
  // template deities match if any equals id or has id as ancestor
  for (const d of template.deities) {
    if (d === id) return true;
    // d has id as ancestor?
    if (ANCESTORS[d as DeityId]?.includes(id)) return true;
  }
  return false;
}

export function primaryDeity(template: TemplateDef): DeityId | undefined {
  return template.deities && template.deities.length > 0 ? template.deities[0] : undefined;
}

export function deityFacets(templates: TemplateDef[]): Record<DeityId, number> {
  const counts = Object.fromEntries(DEITY_IDS.map((id) => [id, 0])) as Record<DeityId, number>;
  for (const t of templates) {
    const pd = primaryDeity(t);
    if (pd) counts[pd] = (counts[pd] ?? 0) + 1;
  }
  return counts;
}

// ordered list of deities that have at least one template (by primary deity)
export function deitiesWithTemplates(templates: TemplateDef[]): DeityId[] {
  // A deity "has a template" if any template matches it (including descendants)
  const result: DeityId[] = [];
  for (const d of DEITIES) {
    const has = templates.some((t) => matchesDeity(t, d.id));
    if (has) result.push(d.id);
  }
  return result;
}