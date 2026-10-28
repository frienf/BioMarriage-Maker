import type { DocLocale } from '@/lib/biodata';
import type { Motif } from './motifs.ts';

/**
 * The template catalogue: 26 designs over 6 layouts.
 *
 * A layout is code; a template is a row in here. Adding "another traditional
 * design in green" is a row, not a component — which is why there are 26
 * templates and 6 files.
 */

export type LayoutKind = 'kumkum' | 'akash' | 'saral' | 'mayur' | 'paramparik' | 'devotional' | 'chitra' | 'artwork' | 't1' | 't2' | 't3' | 't4';

export type Collection = 'traditional' | 'devotional' | 'modern' | 'minimal' | 'premium' | 'hindi' | 'marathi';

export type Swatch = { hex: string; label: string };

export type TemplateDef = {
  slug: string;
  title: string;
  collection: Collection;
  layout: LayoutKind;
  /** Devotional templates take their colours from the deity theme instead. */
  accent?: string;
  motif?: Motif;
  manifestId?: string;
  pricePaise: number;
  docLocales: DocLocale[];
  blurb: string;
  pages: 1 | 2;
};

const PRICE = { minimal: 2900, standard: 4900, premium: 9900 } as const;

export const SWATCHES: Record<LayoutKind, Swatch[]> = {
  kumkum: [
    { hex: '#7B1E2B', label: 'Kumkum maroon' },
    { hex: '#1F4D3A', label: 'Banana-leaf green' },
    { hex: '#3B2A6B', label: 'Jamun purple' },
    { hex: '#8A4B12', label: 'Turmeric brown' }
  ],
  akash: [
    { hex: '#1F3A68', label: 'Indigo navy' },
    { hex: '#234E52', label: 'Deep teal' },
    { hex: '#3D2F5B', label: 'Aubergine' },
    { hex: '#2B2B2B', label: 'Graphite' }
  ],
  saral: [
    { hex: '#4E6853', label: 'Sage' },
    { hex: '#3F5A6B', label: 'Slate blue' },
    { hex: '#6B5440', label: 'Clay' },
    { hex: '#3E3E3E', label: 'Charcoal' }
  ],
  mayur: [
    { hex: '#0E4F57', label: 'Peacock' },
    { hex: '#5A1E3A', label: 'Plum' },
    { hex: '#1F3A5F', label: 'Royal blue' },
    { hex: '#2F3A2A', label: 'Olive' }
  ],
  paramparik: [
    { hex: '#8A2A1C', label: 'Sindoor red' },
    { hex: '#5B2A6E', label: 'Violet' },
    { hex: '#1F5A4A', label: 'Emerald' },
    { hex: '#7A4A10', label: 'Haldi brown' },
    { hex: '#7A2E12', label: 'Terracotta' }
  ],
  devotional: [],
  chitra: [],
  artwork: [],
  t1: [{ hex: '#7B1E2B', label: 'Maroon (TODO)' }],
  t2: [{ hex: '#145250', label: 'Teal green (TODO)' }],
  t3: [{ hex: '#6B3A1E', label: 'Golden brown (TODO)' }],
  t4: [{ hex: '#5A3A2B', label: 'Stone brown (TODO)' }],
};

const ALL: DocLocale[] = ['en', 'hi', 'mr'];

export const TEMPLATES: TemplateDef[] = [
  // Traditional
  { slug: 'kumkum', title: 'Kumkum', collection: 'traditional', layout: 'kumkum', accent: '#7B1E2B', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A double-ruled frame with gold corner diamonds and centred headings. An optional Ganesha invocation sits above the name.' },
  { slug: 'rangoli', title: 'Rangoli', collection: 'traditional', layout: 'kumkum', accent: '#1F4D3A', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The traditional frame in banana-leaf green, for families who want something other than maroon.' },
  { slug: 'toran', title: 'Toran', collection: 'traditional', layout: 'kumkum', accent: '#234E52', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Turmeric brown and gold, warm under a printer that runs cool.' },

  // Devotional, one deity each
  { slug: 'ganesh-mangal', title: 'Ganesh Mangal', collection: 'devotional', layout: 'devotional', motif: 'ganesh', pricePaise: PRICE.standard, docLocales: ALL, pages: 2,
    blurb: 'Ganesha in a lotus mandala, with a second page for contact details and two photographs.' },
  { slug: 'om-shanti', title: 'Om Shanti', collection: 'devotional', layout: 'devotional', motif: 'om', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A radiating lotus behind the Om, centred, with a round portrait.' },
  { slug: 'murli-manohar', title: 'Murli Manohar', collection: 'devotional', layout: 'devotional', motif: 'krishna', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A single peacock feather over a bansuri, kadamba blossoms, pitambar yellow on deep blue.' },
  { slug: 'shiv-shakti', title: 'Shiv Shakti', collection: 'devotional', layout: 'devotional', motif: 'shiv', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Trishul and damru with a crescent moon, inside a rudraksha ring.' },
  { slug: 'lakshmi', title: 'Lakshmi', collection: 'devotional', layout: 'devotional', motif: 'lakshmi', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lotus and a single gold coin, with her charan in the watermark.' },
  { slug: 'ram', title: 'Ram', collection: 'devotional', layout: 'devotional', motif: 'ram', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Bow and arrow on a sun disc, with a ray burst behind the details.' },
  { slug: 'hanuman', title: 'Hanuman', collection: 'devotional', layout: 'devotional', motif: 'hanuman', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Gada and flag against a rising sun, centred.' },
  { slug: 'saraswati', title: 'Saraswati', collection: 'devotional', layout: 'devotional', motif: 'saraswati', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Veena and hamsa inside a ring of lotus buds.' },
  { slug: 'shiva', title: 'Shiva', collection: 'devotional', layout: 'devotional', motif: 'mahadev', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A coiled naag and the third eye down both borders, with Nandi faintly behind the details.' },
  { slug: 'durga', title: 'Durga', collection: 'devotional', layout: 'devotional', motif: 'durga', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Red hibiscus and the temple bell down both borders, with a Navratri kalash faintly behind the details.' },
  { slug: 'ambabai', title: 'Ambabai', collection: 'devotional', layout: 'devotional', motif: 'ambabai', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Green bangles and a nath down both borders, with a kumkum karanda faintly behind the details, in Kolhapur green and gold.' },
  { slug: 'vitthal', title: 'Vitthal', collection: 'devotional', layout: 'devotional', motif: 'vitthal', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Tulsi vrindavan and the Varkari dindi flag down both borders, with taal faintly behind the details.' },
  { slug: 'balaji', title: 'Tirupati Balaji', collection: 'devotional', layout: 'devotional', motif: 'balaji', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Shankh and chakra down both borders, with the namam faintly behind the details.' },
  { slug: 'khandoba', title: 'Khandoba', collection: 'devotional', layout: 'devotional', motif: 'khandoba', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "The Jejuri deepmal and Khandoba's shield down both borders, with bhandara faintly behind the details." },

  // Devotional, on the owner's page designs (layout chitra: the image is the page)
  { slug: 'vinayak', title: 'Vinayak', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Ganesha in a laurel wreath inside an interlaced gold border, with a mandala Ganesha faintly behind the details.' },
  { slug: 'gajanan', title: 'Gajanan', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A gold temple arch on handmade beige paper, a small line Ganesha at its peak and an oval portrait.' },
  { slug: 'ekadanta', title: 'Ekadanta', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A line Ganesha and an arched portrait window inside a double gold frame with lotus corners.' },
  { slug: 'siddhivinayak', title: 'Siddhivinayak', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Ganesha in gold line with lotus vines in three corners and a mandala Ganesha behind the details.' },
  { slug: 'gajmukh', title: 'Gajmukh', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A gold line Ganesha face, flowering vine corners and a column of small Ganeshas down the right side.' },
  { slug: 'neelkanth', title: 'Neelkanth', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A watercolour trishul and damru in a ring of flame, a border of naag, damru and bilva, and Shiva in meditation behind the details.' },
  { slug: 'bholenath', title: 'Bholenath', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A trishul and damru in flame on old parchment, with a border of trishul, damru, bilva and spirals.' },
  { slug: 'vrindavan', title: 'Vrindavan', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Peacock feathers, flutes and pink lotus around the page, Krishna's mukut above, and Radha Krishna faintly behind the details." },
  { slug: 'govind', title: 'Govind', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Krishna's crown and flute in gold on white, inside a sage border with lotus and feather corners." },
  { slug: 'kodanda', title: 'Kodanda', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Ram's bow and arrow on an enamel sun, a border of bows, arrows and suns, and his silhouette behind the details." },
  { slug: 'dhanu', title: 'Dhanu', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A terracotta bow and arrow inside a sun, faint sun discs across the page, and a fine double rule.' },
  { slug: 'gajalakshmi', title: 'Gajalakshmi', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lakshmi on her lotus, framed by maroon waves, caparisoned elephants, kalash and gold coins.' },
  { slug: 'vithoba', title: 'Vithoba', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Vitthal in gold line, a scalloped portrait frame, and a green and gold border with key-pattern corners.' },
  { slug: 'sankat-mochan', title: 'Sankat Mochan', collection: 'devotional', layout: 'chitra', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Hanuman carrying the mountain against a sunburst, with gada and mountain bands across an aged page.' },

  // Modern
  { slug: 'akash', title: 'Akash', collection: 'modern', layout: 'akash', accent: '#1F3A68', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Two columns in navy and white, with quick facts down the side. Easy to scan.' },
  { slug: 'setu', title: 'Setu', collection: 'modern', layout: 'akash', accent: '#234E52', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The modern layout in deep teal.' },
  { slug: 'kshitij', title: 'Kshitij', collection: 'modern', layout: 'akash', accent: '#3D2F5B', pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The modern layout in aubergine.' },

  // Minimal
  { slug: 'saral', title: 'Saral', collection: 'minimal', layout: 'saral', accent: '#4E6853', pricePaise: PRICE.minimal, docLocales: ALL, pages: 1,
    blurb: 'Quiet sage and charcoal, no frame and no photograph. Nothing extra.' },
  { slug: 'shuddh', title: 'Shuddh', collection: 'minimal', layout: 'saral', accent: '#3F5A6B', pricePaise: PRICE.minimal, docLocales: ALL, pages: 1,
    blurb: 'The minimal layout in slate blue.' },

  // Premium
  { slug: 'mayur', title: 'Mayur', collection: 'premium', layout: 'mayur', accent: '#0E4F57', pricePaise: PRICE.premium, docLocales: ALL, pages: 1,
    blurb: 'Editorial display type, a fine peacock mark and a coloured spine down the left edge.' },
  { slug: 'kamal', title: 'Kamal', collection: 'premium', layout: 'mayur', accent: '#5a3e2b', pricePaise: PRICE.premium, docLocales: ALL, pages: 1,
    blurb: 'The premium layout in plum.' },

  // Devanagari first
  { slug: 'hindi-paramparik', title: 'हिंदी पारंपरिक', collection: 'hindi', layout: 'paramparik', accent: '#7A2E12', pricePaise: PRICE.standard, docLocales: ['hi'], pages: 1,
    blurb: 'Laid out for Hindi from the start, with a jhalar strip across the head of the page.' },
  { slug: 'marathi-paramparik', title: 'मराठी पारंपरिक', collection: 'marathi', layout: 'paramparik', accent: '#8A2A1C', pricePaise: PRICE.standard, docLocales: ['mr'], pages: 1,
    blurb: 'Laid out for Marathi from the start, with Devanagari numerals throughout.' },

  // Rebuilt designs (code-based, full-page decorative art + measured photo/content)
  { slug: 't1-lakshmi-elephants', title: 'Lakshmi Elephants', collection: 'traditional', layout: 't1', accent: '#7A3B1C', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_146c7743 (full decorative background + circle photo). Art must be regenerated at A4 ratio.' },
  { slug: 't2-green-lotus', title: 'Green Lotus', collection: 'traditional', layout: 't2', accent: '#145250', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_404a553f (full decorative background + circle photo + left lotus strip).' },
  { slug: 't3-murugan-vel', title: 'Murugan Vel', collection: 'devotional', layout: 't3', accent: '#8A5A30', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_9372ce8f (full decorative parchment + rect photo + peacock feather border). Art must be regenerated at A4 ratio.' },
  { slug: 't4-stone-arch', title: 'Stone Arch', collection: 'premium', layout: 't4', accent: '#5A3A2B', pricePaise: PRICE.premium, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_30039c0 (carved stone decorative border + arched photo + deity niche).' },

  // Artwork (image-based) templates
  { slug: 'lakshmi-elephants-01', title: 'Lakshmi Elephants', collection: 'traditional', layout: 'artwork', manifestId: 'lakshmi-elephants-01', accent: '#7B1E2B', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' },
  { slug: 'green-lotus-02', title: 'Green Lotus', collection: 'traditional', layout: 'artwork', manifestId: 'green-lotus-02', accent: '#234E52', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' },
  { slug: 'murugan-vel-03', title: 'Murugan Vel', collection: 'devotional', layout: 'artwork', manifestId: 'murugan-vel-03', accent: '#800020', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' },
  { slug: 'stone-arch-04', title: 'Stone Arch', collection: 'premium', layout: 'artwork', manifestId: 'stone-arch-04', accent: '#5a3e2b', pricePaise: PRICE.premium, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' }
];

export function templateBySlug(slug: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function templatesInCollection(c: Collection): TemplateDef[] {
  return TEMPLATES.filter((t) => t.collection === c);
}

export const COLLECTIONS: Array<{ id: Collection; label: string }> = [
  { id: 'traditional', label: 'Traditional' },
  { id: 'devotional', label: 'Devotional' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'premium', label: 'Premium' },
  { id: 'hindi', label: 'Hindi-first' },
  { id: 'marathi', label: 'Marathi-first' }
];
