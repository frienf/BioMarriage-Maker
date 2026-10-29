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
