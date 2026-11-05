import type { Motif } from './motifs.ts';

/**
 * The chitra templates: the owner's page designs, one row per frame.
 *
 * The frame image is the whole page (prepared by scripts/prepare-frames.ts);
 * these rows say where the photo opening and the text box sit on it, in CSS px
 * on the 794 x 1123 sheet, and which colours set the text. Measured on the
 * print copy at 4x zoom; docs/superpowers/specs/2026-10-20-chitra-frames-design.md
 * has the rules. tests/chitra-frames.test.ts holds every row to them.
 */

export const SHEET = { w: 794, h: 1123 } as const;

export type SlotShape = 'rect' | 'oval' | 'path';

export type ChitraFrame = {
  /** Whose fonts and invocation the page borrows from DEV_THEMES. */
  motif: Motif;
  paper: string;
  /** Name, headings and row labels. */
  accent: string;
  /** The line under each heading. */
  rule: string;
  /** Values. */
  ink: string;
  /** The text box, as insets from the sheet edge. */
  text: { top: number; right: number; bottom: number; left: number };
  /** The inside of the drawn photo frame. `radius` rounds a rect; `path` is
   *  relative to the slot's own top-left corner. */
  slot: { x: number; y: number; w: number; h: number; shape: SlotShape; radius?: number; path?: string };
  /** How far the drawn photo frame reaches outside the opening, in px. Default 14. */
  moulding?: number;
  /** Body font size in px. */
  size: number;
  /** Keep the complete header beside the floated photo clearance area. */
  containHeader?: boolean;
  /** A white plate behind the kicker and name, sized to the bar the prep script painted out. */
  plate?: { w: number; h: number; fill: string };
};

export const CHITRA_FRAMES: Record<string, ChitraFrame> = {
  vinayak: {
    motif: 'ganesh',
    paper: '#FCFBF7', accent: '#7A5A1E', rule: '#B8964A', ink: '#2B2116',
    text: { top: 333, right: 78, bottom: 78, left: 78 },
    slot: { x: 559, y: 100, w: 138, h: 194, shape: 'rect' },
    size: 14
  },
  // The arch narrows above y 330, so the box starts low enough that the head,
  // set beside the oval, clears the curve.
  gajanan: {
    motif: 'ganesh',
    paper: '#F3ECE2', accent: '#7A5A1E', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 282, right: 92, bottom: 91, left: 86 },
    slot: { x: 534, y: 222, w: 126, h: 182, shape: 'oval' },
    size: 14
  },
  // The design's white name bar was painted out by the prep script; the plate
  // redraws it around the kicker and name. Box bottom clears the chamfered corner.
  ekadanta: {
    motif: 'ganesh',
    paper: '#F9F9F5', accent: '#7A5A1E', rule: '#C8A75A', ink: '#2B2116',
    text: { top: 330, right: 60, bottom: 109, left: 62 },
    slot: {
      x: 504, y: 112, w: 190, h: 270, shape: 'path',
      path: 'M0 270 L0 66 Q1 54 19 50 L22 46 Q50 14 95 0 Q140 14 168 46 L171 50 Q189 54 190 66 L190 270 Z'
    },
    size: 14,
    plate: { w: 349, h: 49, fill: '#FFFFFF' }
  },
  // No border, only lotus vines in three corners: the box ends 14px above the
  // first lotus of the two bottom vines (y 840), whose bare stems run outside it.
  siddhivinayak: {
    motif: 'ganesh',
    paper: '#FCFBF7', accent: '#7A5A1E', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 262, right: 76, bottom: 297, left: 76 },
    slot: { x: 538, y: 76, w: 191, h: 268, shape: 'rect' },
    size: 14
  },
  // Seated Shiva behind the details is watermark; the box sits inside the icon border.
  neelkanth: {
    motif: 'mahadev',
    paper: '#FCF6E4', accent: '#6B1F1F', rule: '#A0522D', ink: '#2A1712',
    text: { top: 382, right: 70, bottom: 72, left: 72 },
    slot: { x: 586, y: 101, w: 120, h: 166, shape: 'rect' },
    size: 14
  },
  // The parchment's darker edges are art: the box stays inside the icon border.
  bholenath: {
    motif: 'shiv',
    paper: '#F9EBD0', accent: '#6E3B1E', rule: '#A6764F', ink: '#2A1A10',
    text: { top: 340, right: 96, bottom: 92, left: 94 },
    slot: { x: 542, y: 108, w: 154, h: 202, shape: 'rect' },
    size: 14
  },
  // The peacock border is the thickest drawn edge: a narrow box, and the lace
  // ring round the oval is 26px wide.
  vrindavan: {
    motif: 'krishna',
    paper: '#F8F6E4', accent: '#2E5B3A', rule: '#C2A25A', ink: '#22261E',
    text: { top: 290, right: 133, bottom: 122, left: 133 },
    slot: { x: 543, y: 139, w: 133, h: 180, shape: 'oval' },
    moulding: 26,
    size: 14
  },
  // Full width; the box ends above the feather and lotus in each bottom corner.
  govind: {
    motif: 'krishna',
    paper: '#F6F7F1', accent: '#3F5B47', rule: '#B8973E', ink: '#232A24',
    text: { top: 310, right: 56, bottom: 147, left: 56 },
    slot: { x: 561, y: 71, w: 160, h: 208, shape: 'rect', radius: 16 },
    size: 14
  },
  // Ram's silhouette behind the details is watermark; the box sits inside the inner rule.
  kodanda: {
    motif: 'ram',
    paper: '#F9F6EA', accent: '#2A3F73', rule: '#B8964A', ink: '#2A2116',
    text: { top: 368, right: 94, bottom: 125, left: 94 },
    slot: { x: 543, y: 131, w: 147, h: 206, shape: 'rect' },
    size: 14
  },
  // The photo is the raised grey card; its shadow is the moulding. Box bottom
  // clears the rounded inner corners.
  dhanu: {
    motif: 'ram',
    paper: '#F1E9DB', accent: '#9A4A2A', rule: '#C27A55', ink: '#2E2219',
    text: { top: 215, right: 51, bottom: 85, left: 50 },
    slot: { x: 557, y: 70, w: 161, h: 214, shape: 'rect' },
    size: 14
  },
  // The column of small Ganeshas on the right is watermark; text may sit over it.
  gajmukh: {
    motif: 'ganesh',
    paper: '#FBF8E9', accent: '#7A5A1E', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 352, right: 74, bottom: 107, left: 74 },
    slot: { x: 557, y: 117, w: 154, h: 205, shape: 'rect' },
    size: 14
  },

  // Lakshmi on her lotus, framed by maroon waves, elephants, kalash and gold coins.
  // Box ends above the kalash row. Cropped from grey backdrop in prep.
  // TODO: measure text box and slot from prepared print copy at 4x zoom.
  gajalakshmi: {
    motif: 'lakshmi',
    paper: '#F6F3E6', accent: '#7A1F22', rule: '#B8892E', ink: '#2B1416',
    text: { top: 340, right: 70, bottom: 120, left: 70 },
    slot: { x: 550, y: 100, w: 150, h: 200, shape: 'rect' },
    size: 14
  },

  // Vitthal in gold line, scalloped portrait frame, green/gold border with key-pattern corners.
  // TODO: measure text box and slot from prepared print copy at 4x zoom.
  vithoba: {
    motif: 'vitthal',
    paper: '#F4EDDA', accent: '#1F4A3A', rule: '#B8964A', ink: '#1E2A22',
    text: { top: 340, right: 70, bottom: 120, left: 70 },
    slot: {
      x: 540, y: 100, w: 160, h: 200, shape: 'path',
      path: 'M0 200 L0 50 Q1 30 25 20 L30 15 Q80 0 130 15 Q155 30 159 50 L159 200 Z'
    },
    size: 14
  },

  // Hanuman carrying mountain against sunburst, gada/mountain bands across aged page.
  // Box sits inside the icon border.
  // TODO: measure text box and slot from prepared print copy at 4x zoom.
  'sankat-mochan': {
    motif: 'hanuman',
    paper: '#F7EBCE', accent: '#8A3B12', rule: '#B5652E', ink: '#2B1A0C',
    text: { top: 340, right: 80, bottom: 100, left: 80 },
    slot: { x: 555, y: 110, w: 150, h: 195, shape: 'rect' },
    size: 14
  },

  // Vishnu reclining on Shesha (Sheshashayi). Burnt parchment, gold carved border
  // with lotus buds, gold naga emblem at head, oval photo opening top-right,
  // faint Vishnu watermark behind details. Sparkle removed; border rebuilt.
  sheshashayi: {
    motif: 'narayan',
    paper: '#F0DFB5', accent: '#7A5A1E', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 380, right: 78, bottom: 92, left: 78 },
    slot: { x: 542, y: 108, w: 154, h: 202, shape: 'oval' },
    moulding: 30,
    size: 14
  },
  't1-lakshmi-elephants': {
    motif: 'lakshmi',
    paper: '#F5F2EA', accent: '#8A5A2A', rule: '#8A5A2A', ink: '#3A2418',
    text: { top: 390, right: 70, bottom: 100, left: 70 },
    slot: { x: 545, y: 155, w: 160, h: 160, shape: 'oval' },
    moulding: 28,
    size: 14
  },
  // Shrinathji Pichwai: cusped arched window at top right (navy empty state, must be
  // fully covered by photo — no navy hairline at any edge at 400% zoom). Slot path
  // traces the inner navy opening edge; moulding measured from gold frame + ledge.
  shrinathji: {
    motif: 'krishna',
    paper: '#FFF5DE', accent: '#0E6B6F', rule: '#B8903A', ink: '#2C1E15',
    text: { top: 360, right: 80, bottom: 120, left: 80 },
    slot: { x: 550, y: 100, w: 165, h: 230, shape: 'path',
      path: 'M 14 218 L 14 120 L 20 74 L 26 57 L 33 52 L 39 43 L 46 42 L 52 38 L 58 33 L 71 31 L 81 25 L 90 29 L 103 33 L 110 35 L 116 38 L 122 42 L 135 54 L 142 68 L 145 74 L 151 113 L 151 218 L 14 218 Z' },
    moulding: 10,
    size: 14
  },
  // Murugan standing with the Vel under a peacock-feather border; notched
  // portrait frame top-right; faint mountain range with the sacred spear
  // behind the details. Text box starts below the Murugan emblem (10px clear)
  // and slotSpacer clears the photo frame which reaches into the text box.
  // Slot measured on print copy at 4x zoom: inside edge of drawn frame.
  'murugan-vel': {
    motif: 'murugan',
    paper: '#F2E6C9', accent: '#8A5A30', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 260, right: 78, bottom: 78, left: 78 },
    slot: { x: 540, y: 160, w: 142, h: 186, shape: 'rect' },
    moulding: 14,
    size: 14
  },

  // Padma Shankha (padma-shankha): golden conch (Shankha) in a lotus/sunburst
  // mandala at top centre, soft pink lotus vine down the left edge, a faint
  // full-bloom lotus watermark in the lower centre, a slender vertical rectangle
  // photo frame with thin double rose-gold border and leaf accents at top right.
  // Sparkle removed by mirror repair; mockup background cropped away.
  'padma-shankha': {
    motif: 'shankha',
    paper: '#FFFEF9', accent: '#9A5A20', rule: '#C2A25A', ink: '#2B2116',
    text: { top: 350, right: 70, bottom: 100, left: 78 },
    slot: { x: 555, y: 100, w: 165, h: 215, shape: 'rect' },
    moulding: 12,
    size: 14
  },
  surya: {
    motif: 'surya',
    paper: '#F8F0DC',
    accent: '#9A5A20',
    rule: '#C2A25A',
    ink: '#2B2116',
    text: { top: 340, right: 78, bottom: 92, left: 78 },
    slot: { x: 560, y: 100, w: 140, h: 140, shape: 'oval' },
    moulding: 30,
    size: 14
  },
  // Dhanalakshmi: deep-maroon cusped arch with gold kalash, coin garlands,
  // Lakshmi seated on lotus between elephants, oval portrait framed by gold
  // lotus crown and leaf ornament, faint Sri Yantra watermark.
  // Sparkle rebuilt from mirror of bottom-left; no crop needed.
  dhanalakshmi: {
    motif: 'lakshmi',
    paper: '#F5EDD5',
    accent: '#5A0E14',
    rule: '#B8964A',
    ink: '#2B1416',
    text: { top: 340, right: 70, bottom: 100, left: 78 },
    slot: { x: 550, y: 243, w: 124, h: 174, shape: 'oval' },
    moulding: 30,
    size: 14
  },
  // Bajrangbali: Hanuman seated in meditation with gada, rectangle photo window
  // top right, gada-over-Dronagiri watermark, terracotta chevron border with
  // clay pots in each corner. Generator sparkle removed; corner rebuilt from
  // mirror of bottom-left. Text box uses strategy B: starts below the seated
  // figure (lowest point y≈288 CSS + 8px = 296), so the header (invocation,
  // kicker, name) centres under the figure beside the window; slotSpacer clears
  // the window; body starts below the window. Window slot measured at the hard
  // inner edge of the drawn rust frame so a photo covers the baked inner shadow.
  // Moulding ≈14 CSS px (default). Figure centre x≈278 sits left of page centre 397.
  // Paper #fdfcf5 sampled from the art's outer margin; accent #7B3F2A (7.89:1),
  // rule #A05A32 (6.0:1, darkened from sampled #B8613F which was 4.24:1),
  // ink #2A1A10 (16.29:1).
  bajrangbali: {
    motif: 'hanuman',
    paper: '#fdfcf5',
    accent: '#7B3F2A',
    rule: '#A05A32',
    ink: '#2A1A10',
    text: { top: 296, right: 74, bottom: 39, left: 75 },
    slot: { x: 500, y: 117, w: 183, h: 248, shape: 'rect' },
    size: 14
  },
  // Lakshmi Padma (new): Goddess Lakshmi seated on a lotus in golden linework,
  // rich left-side lotus vine in teal and pink, circular lotus-petal portrait frame
  // (oval, equal w/h) at top-right with ~28 px moulding, faint lotus pond watermark.
  // Sparkle removed by mirror repair (box 744,1112,94,92). Strategy A: text starts
  // below lowest petal + 16 px (top=290) so head clears frame; no float spacer.
  // Colours sampled from art: paper #F5F0DD (384k px dominant), accent #A05A2C
  // (4.61:1 vs paper, bright gold), ink #2B2116 (13.81:1), rule same gold.
  'lakshmi-padma': {
    motif: 'lakshmi',
    paper: '#F5F0DD',
    accent: '#A05A2C',
    rule: '#A05A2C',
    ink: '#2B2116',
    text: { top: 290, right: 78, bottom: 100, left: 78 },
    slot: { x: 560, y: 100, w: 140, h: 140, shape: 'oval' },
    moulding: 28,
    size: 14
  },
  // Gokul (krishna pastoral): matka overflowing with curd and a horizontal
  // bansuri with hanging tassel at the head, continuous folk-style lotus vines
  // with white cows (decorative collars/spots) and peacocks down left, right and
  // bottom borders, a large very faint multi-layered lotus mandala centred,
  // a perfect circular lotus-petal portrait frame at top-right (equal w/h),
  // and a clean cream paper. Source 864x1232; sparkle rebuilt from mirror of
  // bottom-left corner; A4 ratio reached by contain-fit with cream padding.
  // Strategy A: text starts below lowest petal + 16 px clearance (top=315),
  // so invocation/kicker/name sit centred under the matka-flute group without
  // any float spacer. Moulding ≈26 px measured at 4x zoom. Colours sampled
  // from art: paper #FFE8D0 (dominant cream margin), accent #9A4825
  // (deep terracotta, 5.32:1 vs paper), ink #2B2116 (very dark brown, 16:1),
  // rule #8B4A2E (5.68:1).
  gokul: {
    motif: 'krishna',
    paper: '#FFE8D0',
    accent: '#9A4825',
    rule: '#8B4A2E',
    ink: '#2B2116',
    text: { top: 315, right: 78, bottom: 92, left: 78 },
    slot: { x: 545, y: 115, w: 150, h: 150, shape: 'oval' },
    moulding: 26,
    size: 14
  },
  // Trinetra: Golden Divine Eye (Trinetra) in sunburst at head, geometric
  // Art Deco navy/gold frame, large faint Sri Yantra watermark, octagonal
  // photo opening top-right with double gold border, cream paper. Sparkle rebuilt
  // by mirror of bottom-left; no crop needed. Strategy A verified.
  trinetra: {
    motif: 'trinetra',
    paper: '#F4F1E5',
    accent: '#9A5A20',
    rule: '#B8964A',
    ink: '#2B2116',
    text: { top: 340, right: 78, bottom: 92, left: 78 },
    slot: {
      x: 540, y: 100, w: 160, h: 210, shape: 'path',
      path: 'M 20 210 L 20 30 L 60 10 L 100 10 L 140 30 L 140 190 L 100 210 L 60 210 L 20 210 Z'
    },
    moulding: 14,
    size: 14
  },
  // Saraswati (new chitra frame): Goddess Saraswati seated on lotus with veena
  // and swan in golden linework, elegant swan corner ornaments, double gold border,
  // faint Saraswati yantra watermark, octagonal double-gold photo opening top-right.
  // Strategy A verified: spacer null when text.top >= 345 (slot bottom 315 + 30 clearance).
  saraswati: {
    motif: 'saraswati',
    paper: '#FFF9F5',
    accent: '#8A6A18',
    rule: '#C2A25A',
    ink: '#2B2116',
    text: { top: 345, right: 78, bottom: 92, left: 78 },
    slot: {
      x: 545, y: 105, w: 155, h: 210, shape: 'path',
      path: 'M 10 210 L 10 40 L 45 12 L 110 12 L 145 40 L 145 210 L 110 210 L 45 210 Z'
    },
    moulding: 14,
    size: 14
  },
  // Sri Yantra: Golden Vaishnava tilak (Urdhva Pundra) with flanking shankhas
  // at head, geometric Art Deco navy-and-gold frame, large faint Sri Yantra
  // watermark, cream paper, upper-centre gold-bracketed rectangle opening.
  // Sparkle rebuilt; art scaled 1.30 so dark frame clears 20 CSS px.
  // Simha (new chitra frame): Golden architectural pavilion with kalash and
  // Swastik framing a vertical rectangle photo opening upper-centre, large
  // faint walking lion watermark behind details, deep teal border with gold
  // peacock feathers and swords. Sparkle rebuilt from mirror; art scaled 1.35.
  // The drawn white opening spans x=516..726, y=330..624 on the 1240×1754
  // print copy. The pavilion projects about 73 CSS px to its left; text starts
  // below the opening plus that moulding and the standard 16px clearance.
  simha: {
    motif: 'simha',
    paper: '#FDFCF5',
    accent: '#9A5A20',
    rule: '#9A6A2A',
    ink: '#2B2116',
    text: { top: 490, right: 78, bottom: 52, left: 78 },
    slot: { x: 330, y: 211, w: 135, h: 189, shape: 'rect' },
    moulding: 73,
    size: 13
  },
  'sri-yantra': {
    motif: 'narayan',
    paper: '#F5EDD5',
    accent: '#7A5A1E',
    rule: '#B8964A',
    ink: '#2B2116',
    text: { top: 360, right: 78, bottom: 92, left: 70 },
    slot: { x: 420, y: 240, w: 300, h: 280, shape: 'rect' },
    moulding: 14,
    size: 14
  },
  // Kartikeya (new chitra frame, R11): Murugan standing with the vel, peacock
  // beside him, carved stone portrait window top-right, faint Shatkona watermark,
  // charcoal bronze border with chain arches and vel heads. Sparkle rebuilt
  // from mirror of bottom-left; art scaled 1.36 for 20 CSS px white margin.
  // Opening (recess inner edge): CSS x 549-650, y 169-332 (print 855-1014, 264-519);
  // frame outer bottom y=364 CSS (print y=568); lower statue line y=337 CSS (print y=462);
  // text starts below frame bottom +16 (top ≈ 389 CSS). Moulding ≈ 52 CSS (largest
  // reach above opening, measured from source 60 px above / 1.36 scale / 1240*794).
  kartikeya: {
    motif: 'murugan',
    paper: '#F5EFE3',
    accent: '#735533',
    rule: '#8A5A30',
    ink: '#2B2116',
    text: { top: 420, right: 78, bottom: 92, left: 78 },
    slot: { x: 549, y: 165, w: 150, h: 168, shape: 'rect', radius: 0 },
    moulding: 52,
    size: 14
  },
  // Sudarshana (new chitra frame): dark charcoal field (#2e3233) bordered by gold
  // U-marks, conches and chakras running to all four edges; Balaji's crowned face on
  // a lotus at the head; an ornate cusped arched temple frame top-right; a large faint
  // Sudarshana Chakra watermark centred on the page. Source 896 x 1200 upscaled 1.313x
  // (Lanczos) and centred on a pure white 1240 x 1754 canvas so the outermost drawn
  // pixel clears 20 CSS px on every side (measured 20.5 CSS px sides, 57 CSS px top/
  // bottom). Generator sparkle (bottom-right) painted out by mirroring the bottom-left
  // corner; verified clean at 400%. Balaji emblem and Sudarshana Chakra untouched.
  // Slot traces the inner edge of the drawn arch (measured on the print copy at 4x):
  // cusped top, near-vertical sides with pillars, flat bottom.
  // Text begins at y=420, below the slot bottom (374) plus 30px moulding and
  // the standard 16px clearance, so the header needs no float spacer.
  // Colours sampled from the art: paper #2e3233, accent #e4cf98 (8.44:1 vs paper),
  // rule #e4cf98, ink #f5f1e8 (11.5:1 vs paper).
  sudarshana: {
    motif: 'balaji',
    paper: '#2e3233',
    accent: '#e4cf98',
    rule: '#e4cf98',
    ink: '#f5f1e8',
    text: { top: 420, right: 78, bottom: 90, left: 78 },
    slot: { x: 541, y: 186, w: 113, h: 188, shape: 'path',
      path: 'M 0 188 L 0 30 L 1 20 L 5 10 L 14 0 L 102 0 L 109 10 L 112 20 L 113 30 L 113 188 L 0 188 Z' },
    moulding: 30,
    size: 14
  },
  // Brahma (new chitra frame): warm parchment with red lotus and hanging temple
  // bell borders, golden kalash with Swastika flanked by swans at the head, ornate
  // arched swan-crowned gold frame for the portrait at top right, faint four-armed
  // Lord Brahma seated on a lotus watermark behind the details. Sparkle rebuilt
  // by mirror of bottom-left; art scaled 1.36 so outermost drawn pixel clears
  // 20 CSS px on every side; margin filled with sampled parchment (#F5EDD5).
  // Slot path traces the inner gold edge of the arched opening; moulding ≈ 30 CSS
  // px (largest reach at top from swan crown, measured from reference). Strategy A:
  // text starts below frame bottom + 16 px (top ≈ 360 CSS) so header clears the
  // kalash–swan group; no float spacer needed since slot bottom (310) < text.top (360).
  // Colours: paper #F5EDD5 (cream parchment), accent #7A1F22 (maroon, 4.61:1 vs
  // paper — within 4.5:1 threshold; darkened slightly from art's deeper maroon
  // to meet contrast), rule #B8964A (gold, 4.94:1), ink #2B2116 (13.8:1).
  brahma: {
    motif: 'brahma',
    paper: '#F5EDD5',
    accent: '#7A1F22',
    rule: '#8A5A30',
    ink: '#2B2116',
    text: { top: 360, right: 78, bottom: 92, left: 78 },
    slot: { x: 540, y: 100, w: 160, h: 210, shape: 'path',
      path: 'M 0 210 L 0 80 Q 20 20 80 15 Q 140 20 160 80 L 160 210 L 0 210 Z' },
    moulding: 30,
    size: 14
  },
  // Jagannath: measured on the rescaled 1240x1754 print copy. The figure ends
  // at y≈355; the header starts at 366 and stays beside the portrait. The
  // inner border is x≈90..704 and ends near y=1027, leaving 14px clearance.
  // The scalloped path follows the pale opening; its upper ornament extends
  // approximately 38 CSS px above the opening.
  jagannath: {
    motif: 'jagannath',
    paper: '#F9F2E0',
    accent: '#8A2A1C',
    rule: '#B8964A',
    ink: '#2B2116',
    text: { top: 366, right: 104, bottom: 113, left: 104 },
    slot: {
      x: 498, y: 155, w: 158, h: 226, shape: 'path',
      path: 'M77.7 0.6 L81.5 1.9 L87.3 5.1 L95.6 7 L99.4 8.9 L102.6 12.1 L102.6 13.4 L103.3 14 L103.3 15.9 L103.9 16.6 L114.8 16.6 L116.1 17.9 L119.9 22.3 L119.9 24.3 L120.6 24.9 L120.6 26.8 L121.2 27.5 L130.2 28.1 L131.4 28.8 L135.3 33.2 L135.3 35.2 L135.9 35.8 L135.9 39.6 L136.6 40.3 L140.4 40.9 L144.2 42.8 L146.2 45.4 L146.8 46.7 L146.8 48.6 L147.4 49.2 L147.4 51.2 L146.8 51.8 L146.8 55 L146.2 55.6 L146.2 56.9 L151.3 59.5 L153.8 62 L153.8 62.7 L154.5 63.3 L154.5 65.9 L155.1 66.5 L154.5 67.8 L154.5 70.4 L153.8 71 L153.8 72.3 L149.4 80.6 L149.4 82.5 L148.7 83.2 L148.7 88.3 L149.4 88.9 L149.4 90.9 L150.6 92.1 L150.6 92.8 L153.2 95.3 L157.1 97.9 L157.1 224 L157.1 224.7 L0.8 224.7 L0.8 224 L0.8 97.3 L5.9 94.1 L5.9 93.4 L7.2 92.1 L8.5 89.6 L8.5 87.7 L9.1 87 L9.1 85.1 L8.5 84.5 L8.5 81.3 L6.6 78.1 L6.6 77.4 L5.9 76.8 L4.7 73.6 L3.4 71.6 L3.4 70.4 L2.7 69.7 L2.7 64.6 L3.4 64 L3.4 62.7 L5.3 60.1 L11.7 56.9 L11.1 55.6 L11.1 53.7 L10.4 53.1 L10.4 48 L11.1 47.3 L11.1 46 L13.6 42.8 L15.5 41.6 L21.3 39.6 L21.3 36.4 L23.9 30.7 L27.7 28.1 L36.7 27.5 L37.3 26.2 L37.3 23.6 L38 23 L38.6 21.1 L41.8 17.9 L43.1 17.2 L53.3 16.6 L54.6 14.7 L54.6 13.4 L55.9 11.5 L55.9 10.8 L57.2 10.2 L58.4 8.9 L62.3 7 L70.6 5.1 L76.4 1.9 Z'
    },
    moulding: 38,
    size: 13,
    containHeader: true
  },
  // Durga Trishul: the torn edge reaches y≈367, so text starts at 381;
  // the cream field's x≈67..728 sides and y≈1049 bottom leave 14px clearance.
  // The oval includes the opening's soft inner shadow; its filigree reaches
  // approximately 48px beyond the opening at top and bottom.
  'durga-trishul': {
    motif: 'durga',
    paper: '#FEF9E5',
    accent: '#9A5A20',
    rule: '#C2A25A',
    ink: '#2B2116',
    text: { top: 381, right: 80, bottom: 88, left: 80 },
    slot: { x: 565, y: 128, w: 132, h: 172, shape: 'oval' },
    moulding: 48,
    size: 13
  },
  // The inner white octagon starts at x≈55/739 CSS; 14px side clearance
  // yields x=70..724. The lower diagonals reach these sides near y=950;
  // y=929 keeps at least 14px perpendicular clearance. Figure ends near y=282.
  // The portrait opening was traced on the 1588px print at 4x; the outer
  // gold frame reaches roughly 20 CSS px beyond its white panel.
  'vaibhav-lakshmi': {
    motif: 'lakshmi',
    paper: '#2B2F30', accent: '#D9B866', rule: '#B8963E', ink: '#EFE8D6',
    text: { top: 292, right: 70, bottom: 194, left: 70 },
    slot: {
      x: 500, y: 100.5, w: 193, h: 252, shape: 'path',
      path: 'M33 0 L160 0 L193 34 L193 219 L160 252 L33 252 L0 219 L0 34 Z'
    },
    moulding: 20,
    size: 14
  },
  // Draft fallback geometry, transformed from the default-scale measurements;
  // the fallback print must be remeasured before this row can be delivered.
  kanha: {
    motif: 'krishna',
    paper: '#FAEACC', accent: '#6B4A22', rule: '#B08A3C', ink: '#2B2016',
    text: { top: 317, right: 140, bottom: 209, left: 136 },
    slot: { x: 608, y: 112, w: 115, h: 147, shape: 'oval' },
    moulding: 41,
    size: 13
  },
  // Jagannath Mandir (new chitra frame, R2/R8): Lord Jagannath of Puri in stone
  // temple architecture — carved stone relief face between pillars, elephant
  // frieze at the bottom, cusped stone arch portrait opening top-right, faint
  // chariot wheel watermark centred. Source 896 x 1200 upscaled 1.681x (Lanczos
  // + light unsharp) and centred on a pure white 1588 x 2246 canvas so the
  // outermost drawn pixel clears 20 CSS px on every side (side margin ~20.5 CSS
  // px, top/bottom ~57 CSS px). Generator sparkle (four-point logo, bottom right
  // over the elephant frieze) painted out by feathered mirror of an adjacent
  // frieze section; verified clean at 400%. Stone face, chariot wheel and
  // elephant frieze untouched.
  // Slot traces the inner edge of the drawn cusped arch (measured on the print
  // copy at 4x zoom): cusped top pinching to a single apex, near-vertical sides
  // with pillars, flat bottom. Moulding ~24 CSS px (largest reach, right pillar
  // outer edge minus opening inner edge, measured at CSS y=300).
  // Text box strategy A: top = slot bottom (381) + moulding (20) + 16px
  // clearance = 417, so the header centres under the stone Jagannath face.
  // Bottom = 161 to clear the elephant frieze top (CSS y≈970) by 8px.
  // Left/right = 116/104 to clear the pillar inner edges (CSS x≈107/686) by
  // 8px. Moulding ~20 CSS px (largest stone reach past the opening measured on
  // the print copy at CSS y=300: stone starts at CSS x≈630, opening ends at
  // CSS x≈628).
  // Colours sampled from the art: paper #F0E6D0, accent #8A5A30 (4.66:1 vs
  // paper), rule #7A5A30 (5.02:1), ink #2B2116 (13.15:1).
  'jagannath-mandir': {
    motif: 'jagannath',
    paper: '#F0E6D0',
    accent: '#8A5A30',
    rule: '#7A5A30',
    ink: '#2B2116',
    text: { top: 417, right: 104, bottom: 161, left: 116 },
    slot: {
      x: 498, y: 155, w: 158, h: 226, shape: 'path',
      path: 'M 11 215 L 11 95 L 14 85 L 19 75 L 27 65 L 33 55 L 42 53 L 47 48 L 59 45 L 66 40 L 67 39 L 77 40 L 82 45 L 95 48 L 101 53 L 107 55 L 115 65 L 124 75 L 129 85 L 130 95 L 130 215 L 11 215 Z'
    },
    moulding: 20,
    size: 14
  }
};

/** Text keeps 16px from the drawn photo frame. Measured from the opening, so the
 *  frame's own moulding is added: from the opening alone, 16 left
 *  Siddhivinayak's right column 5px from its frame. */
export function clearance(f: ChitraFrame): number {
  return (f.moulding ?? 14) + 16;
}

/**
 * The float that keeps the head clear of a photo reaching down into the text
 * box, or null when the photo ends above it. Width is measured from the text
 * box's right edge, where the float sits.
 */
export function slotSpacer(f: ChitraFrame): { w: number; h: number } | null {
  const clear = clearance(f);
  const bottom = f.slot.y + f.slot.h + clear;
  if (bottom <= f.text.top) return null;
  return { w: SHEET.w - f.text.right - (f.slot.x - clear), h: bottom - f.text.top };
}
