import type { DocLocale } from '@/lib/biodata';
import type { Motif } from './motifs.ts';
import type { DeityId } from './deities.ts';

/**
 * The template catalogue: 26 designs over 6 layouts.
 *
 * A layout is code; a template is a row in here. Adding "another traditional
 * design in green" is a row, not a component — which is why there are 26
 * templates and 6 files.
 */

export type LayoutKind = 'kumkum' | 'akash' | 'saral' | 'mayur' | 'paramparik' | 'devotional' | 'chitra' | 't2' | 't3' | 't4';

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
  /** Deities this template is associated with. Primary first. Empty for neutral designs. */
  deities: DeityId[];
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
    { hex: '#8A4B12', label: 'Turmeric brown' },
    { hex: '#234E52', label: 'Deep teal' }
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
    { hex: '#2F3A2A', label: 'Olive' },
    { hex: '#5A3E2B', label: 'Cocoa brown' }
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
  t2: [{ hex: '#145250', label: 'Teal green (TODO)' }],
  t3: [{ hex: '#6B3A1E', label: 'Golden brown (TODO)' }, { hex: '#8A5A30', label: 'Terracotta (TODO)' }],
  t4: [{ hex: '#5A3A2B', label: 'Stone brown (TODO)' }],
};

const ALL: DocLocale[] = ['en', 'hi', 'mr'];

export const TEMPLATES: TemplateDef[] = [
  // Traditional
  { slug: 'kumkum', title: 'Kumkum', collection: 'traditional', layout: 'kumkum', accent: '#7B1E2B', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A double-ruled frame with gold corner diamonds and centred headings. An optional Ganesha invocation sits above the name.' },
  { slug: 'rangoli', title: 'Rangoli', collection: 'traditional', layout: 'kumkum', accent: '#1F4D3A', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The traditional frame in banana-leaf green, for families who want something other than maroon.' },
  { slug: 'toran', title: 'Toran', collection: 'traditional', layout: 'kumkum', accent: '#234E52', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Turmeric brown and gold, warm under a printer that runs cool.' },

  // Devotional, one deity each
  { slug: 'ganesh-mangal', title: 'Ganesh Mangal', collection: 'devotional', layout: 'devotional', motif: 'ganesh', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 2,
    blurb: 'Ganesha in a lotus mandala, with a second page for contact details and two photographs.' },
  { slug: 'om-shanti', title: 'Om Shanti', collection: 'devotional', layout: 'devotional', motif: 'om', deities: ['om'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A radiating lotus behind the Om, centred, with a round portrait.' },
  { slug: 'murli-manohar', title: 'Murli Manohar', collection: 'devotional', layout: 'devotional', motif: 'krishna', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A single peacock feather over a bansuri, kadamba blossoms, pitambar yellow on deep blue.' },
  { slug: 'shiv-shakti', title: 'Shiv Shakti', collection: 'devotional', layout: 'devotional', motif: 'shiv', deities: ['shiva'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Trishul and damru with a crescent moon, inside a rudraksha ring.' },
  { slug: 'lakshmi', title: 'Lakshmi', collection: 'devotional', layout: 'devotional', motif: 'lakshmi', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lotus and a single gold coin, with her charan in the watermark.' },
  { slug: 'ram', title: 'Ram', collection: 'devotional', layout: 'devotional', motif: 'ram', deities: ['ram'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Bow and arrow on a sun disc, with a ray burst behind the details.' },
  { slug: 'hanuman', title: 'Hanuman', collection: 'devotional', layout: 'devotional', motif: 'hanuman', deities: ['hanuman'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Gada and flag against a rising sun, centred.' },
  { slug: 'saraswati', title: 'Saraswati', collection: 'devotional', layout: 'chitra', motif: 'saraswati', deities: ['saraswati'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Goddess Saraswati seated on a lotus with veena and swan in golden linework, elegant swan corner ornaments, an octagonal gold portrait frame, and a large faint Saraswati yantra behind the details on clean white.' },
  { slug: 'shiva', title: 'Shiva', collection: 'devotional', layout: 'devotional', motif: 'mahadev', deities: ['shiva'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A coiled naag and the third eye down both borders, with Nandi faintly behind the details.' },
  { slug: 'durga', title: 'Durga', collection: 'devotional', layout: 'devotional', motif: 'durga', deities: ['durga'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Red hibiscus and the temple bell down both borders, with a Navratri kalash faintly behind the details.' },
  { slug: 'ambabai', title: 'Ambabai', collection: 'devotional', layout: 'devotional', motif: 'ambabai', deities: ['ambabai'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Green bangles and a nath down both borders, with a kumkum karanda faintly behind the details, in Kolhapur green and gold.' },
  { slug: 'vitthal', title: 'Vitthal', collection: 'devotional', layout: 'devotional', motif: 'vitthal', deities: ['vitthal'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Tulsi vrindavan and the Varkari dindi flag down both borders, with taal faintly behind the details.' },
  { slug: 'balaji', title: 'Tirupati Balaji', collection: 'devotional', layout: 'devotional', motif: 'balaji', deities: ['balaji'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Shankh and chakra down both borders, with the namam faintly behind the details.' },
  { slug: 'khandoba', title: 'Khandoba', collection: 'devotional', layout: 'devotional', motif: 'khandoba', deities: ['khandoba'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "The Jejuri deepmal and Khandoba's shield down both borders, with bhandara faintly behind the details." },

  // Devotional, on the owner's page designs (layout chitra: the image is the page)
  { slug: 'vinayak', title: 'Vinayak', collection: 'devotional', layout: 'chitra', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Ganesha in a laurel wreath inside an interlaced gold border, with a mandala Ganesha faintly behind the details.' },
  { slug: 'gajanan', title: 'Gajanan', collection: 'devotional', layout: 'chitra', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A gold temple arch on handmade beige paper, a small line Ganesha at its peak and an oval portrait.' },
  { slug: 'ekadanta', title: 'Ekadanta', collection: 'devotional', layout: 'chitra', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A line Ganesha and an arched portrait window inside a double gold frame with lotus corners.' },
  { slug: 'siddhivinayak', title: 'Siddhivinayak', collection: 'devotional', layout: 'chitra', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Ganesha in gold line with lotus vines in three corners and a mandala Ganesha behind the details.' },
  { slug: 'gajmukh', title: 'Gajmukh', collection: 'devotional', layout: 'chitra', deities: ['ganesha'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A gold line Ganesha face, flowering vine corners and a column of small Ganeshas down the right side.' },
  { slug: 'neelkanth', title: 'Neelkanth', collection: 'devotional', layout: 'chitra', deities: ['shiva'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A watercolour trishul and damru in a ring of flame, a border of naag, damru and bilva, and Shiva in meditation behind the details.' },
  { slug: 'bholenath', title: 'Bholenath', collection: 'devotional', layout: 'chitra', deities: ['shiva'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A trishul and damru in flame on old parchment, with a border of trishul, damru, bilva and spirals.' },
  { slug: 'vrindavan', title: 'Vrindavan', collection: 'devotional', layout: 'chitra', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Peacock feathers, flutes and pink lotus around the page, Krishna's mukut above, and Radha Krishna faintly behind the details." },
  { slug: 'govind', title: 'Govind', collection: 'devotional', layout: 'chitra', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Krishna's crown and flute in gold on white, inside a sage border with lotus and feather corners." },
  { slug: 'kodanda', title: 'Kodanda', collection: 'devotional', layout: 'chitra', deities: ['ram'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: "Ram's bow and arrow on an enamel sun, a border of bows, arrows and suns, and his silhouette behind the details." },
  { slug: 'dhanu', title: 'Dhanu', collection: 'devotional', layout: 'chitra', deities: ['ram'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A terracotta bow and arrow inside a sun, faint sun discs across the page, and a fine double rule.' },
  { slug: 'gajalakshmi', title: 'Gajalakshmi', collection: 'devotional', layout: 'chitra', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lakshmi on her lotus, framed by maroon waves, caparisoned elephants, kalash and gold coins.' },
  { slug: 'vithoba', title: 'Vithoba', collection: 'devotional', layout: 'chitra', deities: ['vitthal'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Vitthal in gold line, a scalloped portrait frame, and a green and gold border with key-pattern corners.' },
  { slug: 'sankat-mochan', title: 'Sankat Mochan', collection: 'devotional', layout: 'chitra', deities: ['hanuman'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Hanuman carrying the mountain against a sunburst, with gada and mountain bands across an aged page.' },
  { slug: 'sheshashayi', title: 'Sheshashayi', collection: 'devotional', layout: 'chitra', motif: 'narayan', deities: ['vishnu'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A gold naga hood over a lotus at the head of the page, an oval portrait under a jewelled cobra crown, and Vishnu reclining on Shesha faintly behind the details, on burnt-edge parchment with a carved lotus-bud border.' },
  { slug: 'kanha', title: 'Kanha', collection: 'devotional', layout: 'chitra', motif: 'krishna', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Peacocks and white flowering vines surround aged, torn-edge parchment, with a peacock feather over a flute at the head and a carved oval portrait frame crowned by a peacock.' },

  // Modern
  { slug: 'akash', title: 'Akash', collection: 'modern', layout: 'akash', accent: '#1F3A68', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Two columns in navy and white, with quick facts down the side. Easy to scan.' },
  { slug: 'setu', title: 'Setu', collection: 'modern', layout: 'akash', accent: '#234E52', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The modern layout in deep teal.' },
  { slug: 'kshitij', title: 'Kshitij', collection: 'modern', layout: 'akash', accent: '#3D2F5B', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'The modern layout in aubergine.' },

  // Minimal
  { slug: 'saral', title: 'Saral', collection: 'minimal', layout: 'saral', accent: '#4E6853', deities: [], pricePaise: PRICE.minimal, docLocales: ALL, pages: 1,
    blurb: 'Quiet sage and charcoal, no frame and no photograph. Nothing extra.' },
  { slug: 'shuddh', title: 'Shuddh', collection: 'minimal', layout: 'saral', accent: '#3F5A6B', deities: [], pricePaise: PRICE.minimal, docLocales: ALL, pages: 1,
    blurb: 'The minimal layout in slate blue.' },

  // Premium
  { slug: 'mayur', title: 'Mayur', collection: 'premium', layout: 'mayur', accent: '#0E4F57', deities: [], pricePaise: PRICE.premium, docLocales: ALL, pages: 1,
    blurb: 'Editorial display type, a fine peacock mark and a coloured spine down the left edge.' },
  { slug: 'kamal', title: 'Kamal', collection: 'premium', layout: 'mayur', accent: '#5a3e2b', deities: [], pricePaise: PRICE.premium, docLocales: ALL, pages: 1,
    blurb: 'The premium layout in plum.' },

  // Devanagari first
  { slug: 'hindi-paramparik', title: 'हिंदी पारंपरिक', collection: 'hindi', layout: 'paramparik', accent: '#7A2E12', deities: [], pricePaise: PRICE.standard, docLocales: ['hi'], pages: 1,
    blurb: 'Laid out for Hindi from the start, with a jhalar strip across the head of the page.' },
  { slug: 'marathi-paramparik', title: 'मराठी पारंपरिक', collection: 'marathi', layout: 'paramparik', accent: '#8A2A1C', deities: [], pricePaise: PRICE.standard, docLocales: ['mr'], pages: 1,
    blurb: 'Laid out for Marathi from the start, with Devanagari numerals throughout.' },

  // Rebuilt designs (code-based, full-page decorative art + measured photo/content)
  { slug: 't1-lakshmi-elephants', title: 'Lakshmi Elephants', collection: 'devotional', layout: 'chitra', motif: 'lakshmi', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Lakshmi seated on a lotus between two elephants, a round portrait in a lotus-petal frame, and a faint Sri Yantra behind the details, inside a terracotta border of gilded lotuses and kalash.' },
  { slug: 't2-green-lotus', title: 'Green Lotus', collection: 'traditional', layout: 't2', accent: '#145250', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_404a553f (full decorative background + circle photo + left lotus strip).' }, // confirmed Lakshmi by viewing the art (Lakshmi figure at top-center)
  { slug: 't3-murugan-vel', title: 'Murugan Vel', collection: 'devotional', layout: 't3', accent: '#8A5A30', deities: ['murugan'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_9372ce8f (full decorative parchment + rect photo + peacock feather border). Art must be regenerated at A4 ratio.' },
  { slug: 't4-stone-arch', title: 'Stone Arch', collection: 'premium', layout: 't4', accent: '#5A3A2B', deities: [], pricePaise: PRICE.premium, docLocales: ALL, pages: 1, blurb: 'Rebuilt from Design Template image_30039c0 (carved stone decorative border + arched photo + deity niche).' }, // exception: no clear deity in the art

  // Shrinathji (Pichwai): cows and pink lotuses in a peacock-teal border, a peacock
  // feather and gold tilak at the head, an arched window for the portrait, and a
  // Pichwai Krishna faintly behind the details. Navy arched window is the empty state.
  { slug: 'shrinathji', title: 'Shrinathji', collection: 'devotional', layout: 'chitra', motif: 'krishna', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Cows and pink lotuses in a Pichwai border of peacock teal, a peacock feather and gold tilak at the head, an arched window for the portrait, and a Pichwai Krishna faintly behind the details.' },
  { slug: 'murugan-vel', title: 'Murugan Vel', collection: 'devotional', layout: 'chitra', motif: 'murugan', deities: ['murugan'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Murugan standing with the Vel under a peacock-feather border, a notched portrait frame, and a faint mountain range with the sacred spear behind the details, on warm parchment.' },
  // Padma Shankha: golden Shankha (conch) in a lotus/sunburst mandala at the
  // head, a continuous soft pink lotus vine down the left edge, a slender vertical
  // rectangle photo frame with thin double rose-gold border and leaf accents at
  // the top right, and a faint full-bloom lotus watermark behind the details.
  { slug: 'padma-shankha', title: 'Padma Shankha', collection: 'devotional', layout: 'chitra', motif: 'shankha', deities: ['vishnu'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A golden Shankha in a lotus mandala at the head, a soft pink lotus vine running the left edge, a slender rose-gold portrait frame, and a faint full-bloom lotus behind the details on clean white.' },
  // Surya: a golden sun with the all-seeing eye at the head, a circular sunburst
  // portrait frame at the top right, corner sun ornaments, and a large faint solar
  // mandala behind the details on warm cream parchment.
  { slug: 'surya', title: 'Surya', collection: 'devotional', layout: 'chitra', motif: 'surya', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: Surya is not in the deity list; premium/aesthetic sun design
    blurb: 'A golden Surya with the all-seeing eye at the head, a circular sunburst portrait frame, corner sun ornaments, and a large faint solar mandala behind the details on warm cream.' },
  { slug: 'dhanalakshmi', title: 'Dhanalakshmi', collection: 'devotional', layout: 'chitra', motif: 'lakshmi', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lakshmi seated on her lotus between two elephants under a cusped temple arch, an oval portrait framed by a gold lotus crown and leaf ornament, kalash and gold coin garlands on deep maroon, and a faint Sri Yantra behind the details.' },
  { slug: 'bajrangbali', title: 'Bajrangbali', collection: 'devotional', layout: 'chitra', motif: 'hanuman', deities: ['hanuman'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A seated Hanuman in rust line art beside a framed portrait, a faint gada over the Dronagiri mountain behind the details, and a terracotta border of white chevrons with a clay pot in each corner.' },
  // Lakshmi Padma (new chitra frame): Goddess Lakshmi seated on a lotus in
  // golden line drawing, rich left-side lotus vine in teal and pink, circular
  // lotus-petal portrait frame (oval, equal w/h) at top right, and a faint lotus
  // pond watermark rising from the bottom centre-right on warm cream.
  { slug: 'lakshmi-padma', title: 'Lakshmi Padma', collection: 'devotional', layout: 'chitra', motif: 'lakshmi', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Goddess Lakshmi seated on a lotus in golden linework, a rich teal-and-pink lotus vine along the left edge, a circular lotus-petal portrait frame, and a quiet lotus pond faintly behind the details on warm cream.' },
  // Gokul (new chitra frame): Krishna pastoral — a matka overflowing with curd
  // and a horizontal bansuri (flute) with hanging tassel at the head, continuous
  // folk-style lotus vines with white cows (decorative collars/spots) and peacocks
  // along left, right and bottom borders, a perfect circular lotus-petal portrait
  // frame at top-right (equal w/h, oval), and a very large faint multi-layered
  // lotus mandala centred on the page, all in warm terracotta on cream.
  { slug: 'gokul', title: 'Gokul', collection: 'devotional', layout: 'chitra', motif: 'krishna', deities: ['krishna'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A matka overflowing with curd and a bansuri at the head, cows and peacocks among lotus vines on all sides, a circular lotus-petal portrait frame, and a large faint mandala behind the details in warm terracotta on cream.' },

  // Kartikeya (new chitra frame, R11): Murugan standing with the vel, a
  // peacock beside him, a carved stone portrait window at the top right, a
  // faint Shatkona watermark behind the details, and a dark charcoal bronze
  // border of beaded chain horseshoe arches and vel heads. Sparkle rebuilt
  // by mirror of bottom-left corner; art scaled 1.36; pure white margin.
  { slug: 'kartikeya', title: 'Kartikeya', collection: 'devotional', layout: 'chitra', motif: 'murugan', deities: ['murugan'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A bronze Murugan with his vel and peacock above a carved stone window for the portrait, a faint Shatkona behind the details, and a charcoal border of bronze chain arches and vel heads.' },
  // Simha: golden pavilion with kalash and swastik, vertical rectangle photo
  // opening upper-centre, large faint walking lion watermark, deep teal
  // border with gold peacock feathers and swords. Sparkle rebuilt; art scaled 1.35.
  { slug: 'simha', title: 'Simha', collection: 'premium', layout: 'chitra', motif: 'simha', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: lion motif, no specific deity in list
    blurb: 'A golden pavilion with kalash and Swastik framing the portrait, a deep teal border of peacock feathers and swords, and a large faint walking lion behind the details on cream.' },
  // Trinetra (new chitra frame): Golden Divine Eye (Trinetra) in a sunburst
  // at the head, geometric Art Deco navy and gold frame, large faint Sri Yantra
  // watermark centred on cream paper, octagonal gold portrait opening top-right.
  { slug: 'trinetra', title: 'Trinetra', collection: 'premium', layout: 'chitra', motif: 'trinetra', deities: ['shiva'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A golden Divine Eye in a sunburst at the head, an octagonal gold portrait frame, strong Art Deco geometric corners in navy and gold, and a large faint Sri Yantra behind the details on cream.' },
  // Sri Yantra: Golden Vaishnava tilak (Urdhva Pundra) flanked by shankhas at
  // head, geometric Art Deco navy-and-gold frame, large faint Sri Yantra
  // watermark behind details, cream paper, upper-centre gold-bracketed rectangle
  // opening. Sparkle rebuilt from mirror; art scaled 1.30 for 20 CSS px margin.
  { slug: 'sri-yantra', title: 'Sri Yantra', collection: 'premium', layout: 'chitra', motif: 'narayan', deities: ['vishnu'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'A golden Vaishnava tilak flanked by shankhas at the head, an upper-centre gold-bracketed portrait frame, geometric navy-and-gold Art Deco corners, and a large faint Sri Yantra behind the details on cream.' },
  // Sudarshana (new chitra frame): dark charcoal field with gold U-mark/conch/chakra border,
  // Balaji's crowned face on a lotus at the head, an ornate arched temple frame for the
  // portrait, and a large faint Sudarshana Chakra watermark behind the details. Distinct
  // from the light-field 'balaji' devotional template.
  { slug: 'sudarshana', title: 'Sudarshana', collection: 'devotional', layout: 'chitra', motif: 'balaji', deities: ['balaji'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Dark charcoal field bordered by gold U-marks, conches and chakras, Balaji’s crowned face on a lotus at the head, an ornate arched temple frame for the portrait, and a large faint Sudarshana Chakra behind the details.' },
  // Jagannath (new chitra frame, devotional): Lord Jagannath of Puri — iconic
  // black face with large round white eyes, ornate crown with lotuses and peacock
  // feathers, multi-foil cusped arched portrait frame, red-gold floral scroll
  // border, faint chariot wheel with flag behind details.
  { slug: 'jagannath', title: 'Jagannath', collection: 'devotional', layout: 'chitra', motif: 'jagannath', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: new motif, no specific deity entry
    blurb: 'Lord Jagannath of Puri — the iconic round-eyed face crowned with lotuses and peacock feathers, inside a multi-foil cusped gold arched frame, on a rich red-and-gold floral scroll border with a faint chariot wheel and flag behind the details.' },
  // Brahma (new chitra frame): Lord Brahma seated on a lotus with four arms,
  // golden kalash with Swastika flanked by swans at the head, ornate arched
  // swan-crowned gold portrait frame, red lotuses and hanging temple bells,
  // warm parchment field with maroon border, faint four-armed Brahma watermark.
  { slug: 'brahma', title: 'Brahma', collection: 'devotional', layout: 'chitra', motif: 'brahma', deities: ['brahma'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Lord Brahma seated in padmasana on a full lotus, a golden kalash with Swastika flanked by hamsa at the head, an arched swan-crowned gold portrait frame, red lotuses and hanging bells along the borders, and a faint four-armed Brahma watermark on warm parchment.' },
  // Note: manifest-based artwork system retired; designs rebuilt as t1-t4 above.
  // t3-murugan-vel was rebuilt here as murugan-vel (layout chitra) from the same source artwork.
  // Durga Trishul (new chitra frame): Golden Trishul bearing Goddess Durga's
  // face at the head, ornate oval gold portrait frame (filigree scrollwork) at
  // top-right, torn-paper edge separating deep maroon panel from warm cream
  // parchment, faint Sri Yantra watermark, marigold and trishul borders.
  { slug: 'durga-trishul', title: 'Durga Trishul', collection: 'devotional', layout: 'chitra', motif: 'durga', deities: ['durga'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Deep maroon upper panel with a torn-paper edge, a golden Trishul bearing Goddess Durga’s face, an ornate oval frame for the portrait, marigold and trishul borders, and a faint Sri Yantra on the cream field below.' },
  { slug: 'vaibhav-lakshmi', title: 'Vaibhav Lakshmi', collection: 'devotional', layout: 'chitra', motif: 'lakshmi', deities: ['lakshmi'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Gold line-art Lakshmi on her lotus, a chamfered portrait window, and a faint Sri Yantra behind the details, on a charcoal page with a gold Art Deco frame.' },
  // Jagannath Mandir (new chitra frame, devotional): Lord Jagannath of Puri in
  // stone temple architecture — distinct from the red-and-gold floral 'jagannath'
  // template. Carved stone relief face between pillars, elephant frieze at the
  // bottom, cusped stone arch portrait opening top-right, faint chariot wheel
  // watermark centred, warm parchment field in sandstone tones.
  { slug: 'jagannath-mandir', title: 'Jagannath Mandir', collection: 'devotional', layout: 'chitra', motif: 'jagannath', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: new motif, no specific deity entry
    blurb: 'Stone temple architecture in sandstone tones with an elephant frieze, a carved Jagannath face between pillars, a cusped stone arch for the portrait, and a faint ornate chariot wheel behind the details.' },
  // Aditya (new chitra frame): a radiant rising sun over three lotuses at the
  // head, an oval portrait framed by a golden sunburst at the top right, a
  // large faint solar star behind the details, and a thin gold border with
  // corner sunbursts on warm cream.
  { slug: 'aditya', title: 'Aditya', collection: 'devotional', layout: 'chitra', motif: 'aditya', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: Surya/Aditya not in the deity list; sun-design, aesthetic choice
    blurb: 'Soft cream field inside a thin gold double border with corner sunbursts, a radiant rising sun over three lotuses at the head, an oval portrait framed by a golden sunburst, and a large faint solar star behind the details.' },
  // Shankha Mandala (new chitra frame): twin golden conches flank a centred
  // circular lotus-petal portrait frame at the head, a large intricate lotus
  // mandala sits behind the details, and a continuous gold lotus-vine border
  // frames a warm golden-beige field. Distinct from padma-shankha (single
  // conch emblem, rectangle portrait top-right, left lotus vine) and from the
  // top-right circular frames of lakshmi-padma, gokul and t1-lakshmi-elephants.
  { slug: 'shankha-mandala', title: 'Shankha Mandala', collection: 'devotional', layout: 'chitra', motif: 'shankha', deities: ['vishnu'], pricePaise: PRICE.standard, docLocales: ALL, pages: 1,
    blurb: 'Warm golden-beige field inside an elegant gold lotus-vine border, a circular lotus-petal frame flanked by twin golden conches, and a large intricate lotus mandala behind the details.' },
  // Annapurna (new chitra frame): Goddess Annapurna holding a ladle of grain
  // and a pot of food, a beveled terracotta rectangle portrait frame, a faint
  // purna-kalasha watermark, a terracotta wooden-style border with rope texture.
  { slug: 'annapurna', title: 'Annapurna', collection: 'devotional', layout: 'chitra', motif: 'annapurna', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: Annapurna (Parvati's grain-giving form) has no deity category in the catalogue yet
    blurb: 'Warm cream field inside a terracotta wooden-style border, Goddess Annapurna holding a ladle of grain and a pot of food, a simple rectangular frame for the portrait, and a faint purna-kalasha behind the details.' },
  // Kamadeva (new chitra frame): cream chamfered card, crossed sugarcane bow
  // and arrows with flower (the classic Kamadeva emblem) at the head, a
  // chamfered rose-gold portrait frame, a faint Sri Yantra behind the
  // details, and a thin double rose-gold border with corner triangles.
  { slug: 'kamadeva', title: 'Kamadeva', collection: 'devotional', layout: 'chitra', motif: 'kamadeva', deities: [], pricePaise: PRICE.standard, docLocales: ALL, pages: 1, // exception: Kamadeva (love god) has no deity category in the catalogue yet
    blurb: 'Soft cream chamfered card with a thin double rose-gold border, the crossed sugarcane bow and arrows of Kamadeva at the head, a chamfered frame for the portrait, and a faint Sri Yantra behind the details.' },
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
