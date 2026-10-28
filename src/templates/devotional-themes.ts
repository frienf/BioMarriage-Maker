import type { Motif } from './motifs.ts';

/**
 * The eight Hindu devotional themes, one deity each.
 *
 * Values carried over from the market audit, deliberately:
 *   - tileOpacity starts at 0.11 (0.14 for Saraswati, whose yellow prints
 *     faint). The single watermark it replaced needed 0.13 to 0.16 because 0.07
 *     to 0.09 printed as nothing on a home inkjet; set the final values from a
 *     test print, and never lower them without one.
 *   - Om Shanti's invocation is the Shanti line, not the Gayatri opening,
 *     so the words match the template's name.
 *   - Krishna is pitambar yellow on deep blue, not peacock teal, to stay
 *     clear of a competitor's best-selling Krishna design.
 */

export type DevLayout = 'classic' | 'centered' | 'split';

export type DevTheme = {
  motif: Motif;
  layout: DevLayout;
  accent: string;
  accent2: string;
  ink: string;
  label: string;
  paper: string;
  tint: string;
  head: string;
  headWeight: number;
  body: string;
  invocation: string;
  invLang: string;
  invFont: string;
  /** Strength of the tiled watermark behind the details. */
  tileOpacity: number;
  /** The owner's deity artwork, /deities/<motif>.png under public/. Unset, the
   *  figure slot shows the SVG logo instead, at the same size. */
  figure?: string;
  /** A second page for contact details and two photos. */
  twoPage?: boolean;
  /** Some faces set larger than their nominal size. Pulls the measure in so a
   *  full biodata still fits the page; `npm run fit` is what catches this. */
  runsLarge?: boolean;
};

const SERIF = '"Noto Serif Devanagari", Georgia, serif';
const SANS = '"Noto Sans Devanagari", system-ui, sans-serif';

export const DEV_THEMES: Record<Motif, DevTheme> = {
  ganesh: {
    motif: 'ganesh',
    layout: 'classic',
    accent: '#9A4A12',
    accent2: '#C9892E',
    ink: '#2B1A10',
    label: '#4D3526',
    paper: '#FFFDF8',
    tint: '#FBEFE2',
    head: `var(--font-rozha), ${SERIF}`,
    headWeight: 400,
    body: `var(--font-mukta), ${SANS}`,
    invocation: '॥ श्री गणेशाय नमः ॥',
    invLang: 'hi',
    invFont: `var(--font-mukta), ${SANS}`,
    tileOpacity: 0.11,
    twoPage: true
  },
  om: {
    motif: 'om',
    layout: 'centered',
    accent: '#9E1B32',
    accent2: '#B8892E',
    ink: '#2A1418',
    label: '#563038',
    paper: '#FFF9F4',
    tint: '#FBEAEA',
    head: `var(--font-laila), ${SERIF}`,
    headWeight: 600,
    body: `var(--font-laila), ${SERIF}`,
    invocation: '॥ ॐ शान्तिः ॥',
    invLang: 'sa',
    invFont: `var(--font-laila), ${SERIF}`,
    tileOpacity: 0.11
  },
  krishna: {
    motif: 'krishna',
    layout: 'split',
    accent: '#23408E',
    accent2: '#E2A40B',
    ink: '#121C33',
    label: '#34406A',
    paper: '#FFFEF8',
    tint: '#FFF4D6',
    head: `var(--font-yatra), ${SANS}`,
    headWeight: 400,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ जय श्री कृष्ण ॥',
    invLang: 'hi',
    invFont: `var(--font-hind), ${SANS}`,
    tileOpacity: 0.11
  },
  shiv: {
    motif: 'shiv',
    layout: 'classic',
    accent: '#6B3410',
    accent2: '#B8892E',
    ink: '#24180F',
    label: '#4A3A2E',
    paper: '#FBF8F3',
    tint: '#EFE7DD',
    head: `var(--font-khand), ${SANS}`,
    headWeight: 600,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ ॐ नमः शिवाय ॥',
    invLang: 'sa',
    invFont: `var(--font-hind), ${SANS}`,
    tileOpacity: 0.11
  },
  lakshmi: {
    motif: 'lakshmi',
    layout: 'split',
    accent: '#A3123A',
    accent2: '#D9A21B',
    ink: '#2B0E15',
    label: '#5C2A36',
    paper: '#FFFBF7',
    tint: '#FCE9EE',
    head: `var(--font-sura), ${SERIF}`,
    headWeight: 700,
    body: `var(--font-sura), ${SERIF}`,
    invocation: '॥ ॐ श्री महालक्ष्म्यै नमः ॥',
    invLang: 'sa',
    invFont: `var(--font-sura), ${SERIF}`,
    tileOpacity: 0.11
  },
  ram: {
    motif: 'ram',
    layout: 'classic',
    accent: '#A8410B',
    accent2: '#D4A017',
    ink: '#2A1606',
    label: '#56331A',
    paper: '#FFFCF5',
    tint: '#FBEBD9',
    head: `var(--font-kurale), ${SERIF}`,
    headWeight: 400,
    body: `var(--font-mukta), ${SANS}`,
    invocation: '॥ जय श्री राम ॥',
    invLang: 'hi',
    invFont: `var(--font-kurale), ${SERIF}`,
    tileOpacity: 0.11
  },
  hanuman: {
    motif: 'hanuman',
    layout: 'centered',
    accent: '#B3261E',
    accent2: '#E08A1E',
    ink: '#2A0F0C',
    label: '#5A2A22',
    paper: '#FFFAF5',
    tint: '#FCE8E2',
    head: `var(--font-sarpanch), ${SANS}`,
    headWeight: 600,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ जय श्री हनुमान ॥',
    invLang: 'hi',
    invFont: `var(--font-hind), ${SANS}`,
    tileOpacity: 0.11
  },
  saraswati: {
    motif: 'saraswati',
    layout: 'centered',
    accent: '#7A5200',
    accent2: '#E8B931',
    ink: '#2A2008',
    label: '#5A4A1E',
    paper: '#FFFEF8',
    tint: '#FFF4CC',
    head: `var(--font-vesper), ${SERIF}`,
    headWeight: 700,
    body: `var(--font-martel), ${SERIF}`,
    invocation: '॥ ॐ ऐं सरस्वत्यै नमः ॥',
    invLang: 'sa',
    invFont: `var(--font-vesper), ${SERIF}`,
    tileOpacity: 0.14,
    runsLarge: true
  },
  mahadev: {
    motif: 'mahadev',
    layout: 'classic',
    accent: '#2F4A6B',
    accent2: '#A07A3C',
    ink: '#141D29',
    label: '#3A4A60',
    paper: '#FBFAF6',
    tint: '#E8EDF3',
    head: `var(--font-eczar), ${SERIF}`,
    headWeight: 700,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ हर हर महादेव ॥',
    invLang: 'hi',
    invFont: `var(--font-eczar), ${SERIF}`,
    tileOpacity: 0.11
  },
  durga: {
    motif: 'durga',
    layout: 'split',
    accent: '#B0202E',
    accent2: '#2F7A3F',
    ink: '#2A0C10',
    label: '#5E2A30',
    paper: '#FFFBF7',
    tint: '#FBE8EA',
    head: `var(--font-rozha), ${SERIF}`,
    headWeight: 400,
    body: `var(--font-martel), ${SERIF}`,
    invocation: '॥ ॐ दुं दुर्गायै नमः ॥',
    invLang: 'sa',
    invFont: `var(--font-rozha), ${SERIF}`,
    tileOpacity: 0.11
  },
  ambabai: {
    motif: 'ambabai',
    layout: 'split',
    accent: '#1F6B45',
    accent2: '#C9952C',
    ink: '#0F2A1C',
    label: '#2F5240',
    paper: '#FDFCF6',
    tint: '#E6F1EA',
    head: `var(--font-tiro-mr), ${SERIF}`,
    headWeight: 400,
    body: `var(--font-mukta), ${SANS}`,
    invocation: '॥ उदे गं अंबे उदे ॥',
    invLang: 'mr',
    invFont: `var(--font-tiro-mr), ${SERIF}`,
    tileOpacity: 0.11
  },
  vitthal: {
    motif: 'vitthal',
    layout: 'split',
    accent: '#3B2F6B',
    accent2: '#E07A1F',
    ink: '#1A1530',
    label: '#463D6B',
    paper: '#FDFBF7',
    tint: '#EEEAF6',
    head: `var(--font-kurale), ${SERIF}`,
    headWeight: 400,
    body: `var(--font-mukta), ${SANS}`,
    invocation: '॥ जय जय राम कृष्ण हरी ॥',
    invLang: 'mr',
    invFont: `var(--font-kurale), ${SERIF}`,
    tileOpacity: 0.11
  },
  balaji: {
    motif: 'balaji',
    layout: 'classic',
    accent: '#6E1423',
    accent2: '#D4A017',
    ink: '#2A0A10',
    label: '#5A2A33',
    paper: '#FFFCF5',
    tint: '#F8E9E6',
    head: `var(--font-martel), ${SERIF}`,
    headWeight: 700,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ ॐ नमो वेंकटेशाय ॥',
    invLang: 'sa',
    invFont: `var(--font-martel), ${SERIF}`,
    tileOpacity: 0.11
  },
  khandoba: {
    motif: 'khandoba',
    layout: 'classic',
    accent: '#7B2D26',
    accent2: '#E8B21A',
    ink: '#2A110E',
    label: '#5A3029',
    paper: '#FFFCF3',
    tint: '#FCF0D2',
    head: `var(--font-khand), ${SANS}`,
    headWeight: 600,
    body: `var(--font-hind), ${SANS}`,
    invocation: '॥ येळकोट येळकोट जय मल्हार ॥',
    invLang: 'mr',
    invFont: `var(--font-khand), ${SANS}`,
    tileOpacity: 0.11
  }
};
