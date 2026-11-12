/**
 * Turns the owner's page designs into the chitra templates' frame images.
 *
 *   npm run frames
 *
 * For each frame: repair the generator sparkle with the mirror image of the
 * opposite corner, paint out any listed rectangles, crop to the paper, then fit
 * into A4 without stretching. Writes two copies:
 *   assets/frames/<slug>.jpg  1588 x 2246, the print copy. Not public: only the
 *                             paid print page embeds it, as a data URI.
 *   public/frames/<slug>.jpg  600px wide, the preview copy, too coarse to print
 *                             as a free blank.
 * Rerun after replacing a source with a higher-resolution original under the
 * same name. All boxes are in source pixels. Use `npm run frames --
 * --standardize-existing` to resize existing approved print copies without
 * regenerating their previews; originals are backed up in the temp directory.
 */
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { CHITRA_FRAMES } from '../src/templates/chitra-frames.ts';

type Box = { x: number; y: number; w: number; h: number };
type Prep = {
  src: string;
  /** To the paper; only for the images photographed on a backdrop. */
  crop?: Box;
  /** The sparkle's box. Unset (and no crop) means the bottom-right 80px corner;
   *  false skips the repair. */
  sparkle?: Box | false;
  /** Feather the mirrored repair within its box, preserving the adjacent art. */
  sparkleFeather?: number;
  /** PNG mask (same size as the sparkle box) restricting the mirrored paste
   *  to the sparkle's silhouette — for a sparkle bigger than the feathered box
   *  can safely cover. The mask's own alpha decides each pixel. */
  sparkleMask?: string;
  fills?: Array<Box & { colour: string }>;
  /** Optional pre-scale factor. When set, the art is scaled uniformly by this
   *  factor and centred on a paper-colour A4 canvas, so the outermost drawn
   *  pixel clears the 20 CSS px print margin on every side. */
  scale?: number;
  /** Canvas fill colour for the scaled-art path; defaults to the average of
   *  the four corner pixels. Set to pure white when the art's own corners are
   *  dark border (the art has no paper margin to extend, per R2). */
  fillColour?: { r: number; g: number; b: number };
  /** Optional higher-resolution output for a single frame. In the scale path it
   *  is also the canvas size; the contain path letterboxes into it. */
  printSize?: { w: number; h: number };
  jpegQuality?: number;
  /** Light unsharp mask applied after the upscale (sigma 0.5). */
  sharpen?: boolean;
};

const at = (cx: number, cy: number): Box => ({ x: cx - 30, y: cy - 30, w: 60, h: 60 });

const FRAMES: Record<string, Prep> = {
  vinayak: { src: 'image_2d80ef02.jpg', sparkle: at(811, 1177) },
  gajanan: { src: 'image_430871a3.jpg', sparkle: at(804, 1174) },
  ekadanta: { src: 'image_6f2e0c6a.jpg', sparkle: false, fills: [{ x: 93, y: 374, w: 386, h: 57, colour: '#F9FAF4' }] },
  siddhivinayak: { src: 'image_c3e8c406.jpg', sparkle: { x: 786, y: 1158, w: 48, h: 46 } },
  gajmukh: { src: 'image_fb1b0709.jpg', sparkle: at(836, 1140) },
  neelkanth: { src: 'image_9b354efe.jpg', sparkle: at(811, 1172) },
  bholenath: { src: 'image_f4c0e80a.jpg', sparkle: at(809, 1167) },
  vrindavan: { src: 'image_d598dc6b.jpg', sparkle: at(806, 1174) },
  govind: { src: 'image_e88ec56a.jpg', crop: { x: 90, y: 90, w: 716, h: 1019 } },
  kodanda: { src: 'image_63be21ea.jpg', sparkle: at(848, 1150) },
  dhanu: { src: 'image_b0a679dd.jpg', crop: { x: 44, y: 61, w: 779, h: 1121 }, sparkle: { x: 784, y: 1148, w: 40, h: 52 } },
  gajalakshmi: { src: 'image_5eb9d767.jpg', crop: { x: 52, y: 48, w: 792, h: 1103 }, sparkle: { x: 812, y: 1118, w: 32, h: 34 } },
  vithoba: { src: 'image_753afda.jpg', sparkle: at(843, 1145) },
  'sankat-mochan': { src: 'image_9fbaaf29.jpg', sparkle: at(841, 1145) },
  // Lakshmi Padma (new chitra frame): Goddess Lakshmi seated on lotus,
  // rich left lotus vine in teal/pink, circular lotus-petal photo frame,
  // faint lotus pond watermark. Source same as t2-green-lotus but layout chitra.
  'lakshmi-padma': { src: 'image_404a553f.jpg', sparkle: { x: 744, y: 1112, w: 94, h: 92 } },
  't1-lakshmi-elephants': { src: 'image_146c7743.jpg', sparkle: { x: 810, y: 1115, w: 60, h: 60 } },
  dhanalakshmi: { src: 'image_3b973a6e.jpg', sparkle: { x: 810, y: 1115, w: 60, h: 60 } },
  shrinathji: { src: 'image_dbe7aec9.jpg', sparkle: { x: 810, y: 1120, w: 55, h: 55 } },
  'murugan-vel': { src: 'image_9372ce8f.jpg', sparkle: { x: 810, y: 1115, w: 60, h: 60 } },
  // Padma Shankha (padma-shankha): golden Shankha in lotus mandala, left
  // lotus vine border, faint full-bloom lotus watermark. Mockup crop to white
  // page; sparkle repaired from mirror of bottom-left.
  'padma-shankha': { src: 'image_43cc0159.jpg', crop: { x: 68, y: 68, w: 760, h: 1064 }, sparkle: { x: 788, y: 1116, w: 71, h: 72 } },
  // Bajrangbali: Hanuman seated in meditation with gada, rectangle photo window
  // top right, gada-over-Dronagiri watermark, terracotta chevron border with
  // clay pots in each corner. Generator sparkle at bottom-right over corner pot;
  // repaired by mirroring the bottom-left corner. Pre-scaled by 1.40 (~0.98 of
  // contain) so the outermost drawn pixel sits at least 20 CSS px from every
  // sheet edge; the new margin is filled with the flat paper colour.
  bajrangbali: {
    src: 'image_5a8ef5d0.jpg',
    sparkle: { x: 784, y: 1150, w: 80, h: 82 },
    scale: 1.40
  },
  // Gokul: Krishna pastoral (matka + bansuri at head, cows/peacocks with lotus
  // vines on sides and bottom, circular petal photo opening top-right, large
  // faint mandala watermark). Source 864x1232; sparkle repaired from mirror.
  gokul: { src: 'image_447fcba9.jpg', sparkle: { x: 790, y: 1160, w: 54, h: 54 } },
  // Trinetra: Golden Divine Eye (Trinetra) in sunburst at head, geometric Art Deco
  // navy/gold frame, large faint Sri Yantra watermark, octagonal photo opening
  // top-right, cream paper. Sparkle rebuilt by mirror of bottom-left.
  trinetra: { src: 'image_8b9cfae6.jpg', sparkle: { x: 816, y: 1120, w: 80, h: 80 } },
  'simha': { src: 'image_921253d2.jpg', sparkle: { x: 784, y: 1140, w: 80, h: 82 }, scale: 1.35 },
  // Sri Yantra: Golden Vaishnava tilak (Urdhva Pundra) with flanking shankhas,
  // geometric navy-and-gold Art Deco frame, large faint Sri Yantra watermark,
  // cream paper, upper-centre gold-bracketed rectangle photo opening. Source
  // 896x1200; sparkle rebuilt from mirror of bottom-left; scaled to 1.30 so
  // the outermost drawn dark frame clears 20 CSS px on every side.
  'sri-yantra': { src: 'image_b0b91b63.jpg', sparkle: { x: 816, y: 1120, w: 80, h: 80 }, scale: 1.30 },
  // Kartikeya (new chitra frame): Murugan standing with the vel, peacock beside
  // him, carved stone portrait window top right, Shatkona watermark, charcoal
  // border of bronze chain arches and vel heads. Source 864x1232 (ratio 0.7013,
  // within 1% of A4). Sparkle (four-point logo, bottom right ~808,1178) painted
  // out by mirroring the bottom-left corner. A4 ratio reached by uniform scale
  // 1.36 (~0.873 CSS-scale) so the outermost drawn pixel clears 20 CSS px on
  // every side; the margin is pure white because the border runs to the edge
  // (corner-colour padding would be dark). No crop: the art is the page.
  kartikeya: {
    src: 'image_62c73637.jpg',
    sparkle: { x: 786, y: 1164, w: 48, h: 38 },
    scale: 1.36,
    fillColour: { r: 255, g: 255, b: 255 }
  },
  // Sudarshana (new chitra frame): dark charcoal field, Balaji emblem on lotus at the
  // head, ornate arched temple frame top-right, faint Sudarshana Chakra watermark,
  // gold U-mark/conch/chakra border running to all four edges. Generator sparkle
  // (four-point logo, bottom-right ~760-896,1000-1200) painted out by mirroring the
  // bottom-left corner. A4 ratio reached by uniform scale 1.313 so the outermost
  // drawn pixel clears 20 CSS px on every side; the margin is pure white because
  // the border runs to the source edge (corner-colour padding would be dark).
  sudarshana: {
    src: 'image_2e3b5d17.jpg',
    sparkle: { x: 760, y: 1000, w: 136, h: 200 },
    scale: 1.313,
    fillColour: { r: 255, g: 255, b: 255 }
  },
  brahma: {
    src: 'image_53320a22.jpg',
    sparkle: { x: 790, y: 1160, w: 54, h: 54 },
    scale: 1.36,
    fillColour: { r: 245, g: 237, b: 213 }
  },
  // Jagannath (new chitra frame, R2/R8): Lord Jagannath of Puri — iconic face
  // with large round eyes, chariot wheel and flag watermark, multi-foil arched
  // photo opening top-right, rich red-and-gold floral border on cream. Source
  // 864x1232; sparkle rebuilt by mirror of bottom-left. Scale is in print-image
  // pixels per source pixel, not a fraction of the A4 contain size: 1.36 keeps
  // the border inside the 20 CSS px print-safe margin without shrinking the page.
  jagannath: {
    src: 'image_c05301b3.jpg',
    sparkle: { x: 776, y: 1134, w: 80, h: 85 },
    scale: 1.36,
    fillColour: { r: 255, g: 255, b: 255 }
  },
  'vaibhav-lakshmi': {
    src: 'image_cfb7be50.jpg',
    sparkle: { x: 780, y: 1142, w: 64, h: 66 },
    fillColour: { r: 43, g: 47, b: 48 },
    printSize: { w: 1588, h: 2246 },
    jpegQuality: 95,
    sharpen: true
  },
  'durga-trishul': {
    src: 'image_3183c394.jpg',
    sparkle: { x: 782, y: 1152, w: 82, h: 80 },
    scale: 1.38,
    fillColour: { r: 76, g: 0, b: 10 }
  },
  // Kanha: Krishna — peacock feather over a bansuri at the head, peacocks and
  // white flowering vines on aged torn-edge parchment, carved oval portrait
  // frame crowned by a peacock. Source 864x1232 (0.82% off A4). The four-point
  // generator sparkle bottom-right (over the tail, ~x 786-864, y 1148-1232) is
  // rebuilt from the flopped bottom-left corner, whose tail and torn edge match.
  // Fallback scale 1.82 retains the border ornaments while allowing the
  // cosmetic torn edge into the printer margin. Lanczos + light unsharp.
  kanha: {
    src: 'image_6719927e.jpg',
    sparkle: { x: 786, y: 1148, w: 78, h: 84 },
    scale: 1.82,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  'jagannath-mandir': {
    src: 'image_779fcffb.jpg',
    // Blend a mirrored elephant into the original surrounding carving.
    sparkle: { x: 795, y: 1103, w: 94, h: 88 },
    sparkleFeather: 10,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Aditya (new chitra frame, R8): radiant rising sun over three lotuses at the
  // head, oval portrait framed by a golden sunburst top-right, thin double gold
  // border with concave-corner scallops and corner sunbursts, large faint
  // multi-pointed solar star watermark. Source 896 x 1200 (ratio 0.7467, ~5.6%
  // off A4). NOTE: this source carries NO generator sparkle logo - the
  // four-point star does not appear anywhere in the file; the BR corner
  // sunburst is simply drawn brighter by the generator and is ART (corner
  // sunbursts must not be retouched). `sparkle: false` skips the default
  // mirror-repair so the BR corner is left exactly as drawn. Ratios reached by
  // uniform scale 1506/896 (same as the other 896x1200 frames): the outermost
  // drawn pixel clears 20 CSS px on the sides (margins ~41 print px) with
  // white margins top and bottom (~57 CSS px). Lanczos upscale + light unsharp
  // mask; the result is upscaled, not sharper.
  aditya: {
    src: 'image_6cde4e46.jpg',
    sparkle: false,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Shankha Mandala (new chitra frame, R2/R7/R8): twin golden conches flank a
  // centred circular lotus-petal photo frame, with a large faint lotus mandala
  // behind the details inside a continuous gold lotus-vine border on warm
  // golden-beige paper. Source 896 x 1200 (ratio 0.7467, 5.6% off A4); its
  // bottom floral band is cropped by the source edge and is left as drawn.
  // Generator sparkle (four-point logo, bottom right over the border) is
  // painted out by a feathered mirror of the bottom-left corner; box 802,1104
  // 76x76 covers the star and its glow. Uniform scale 1506/896 = 1.6808 (0.948
  // of the A4 contain size): 1506 x 2017 art centred on pure white 1588 x 2246
  // leaves 20.5 CSS px sides and 57 CSS px top/bottom. Lanczos + light unsharp.
  'shankha-mandala': {
    src: 'image_8dae3b9.jpg',
    sparkle: { x: 802, y: 1104, w: 76, h: 76 },
    sparkleFeather: 10,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Annapurna (new chitra frame, R1-R8): Goddess Annapurna seated holding grain
  // ladle and pot of food at top-left, simple beveled terracotta rectangle
  // portrait frame at top-right (white empty-state opening), faint large
  // purna-kalasha watermark centred in the lower half, thick terracotta
  // wooden-style border with rope texture and triangular corner blocks on
  // warm cream. Source 896 x 1200 (ratio 0.7467, 5.6% off A4).
  // A large translucent four-point sparkle (~80x64 source px) sits over the
  // bottom-right corner's boxed-diagonal motif, invisible to white-pixel
  // scans (it peaks near 30% opacity). It is removed by pasting the flopped
  // bottom-left corner (byte-matching art beneath) through
  // reference/annapurna-sparkle-mask.png — the star's connected component
  // (d>45), dilated 2px, blurred 1.5px — so no other source pixel is touched.
  // Regenerate the mask with reference/annapurna-gen-sparkle-mask.mjs if the
  // source art is ever replaced. Uniform scale 1506/896 = 1.6808 on a pure
  // white 1588 x 2246 canvas (20.5 CSS px sides, 57 CSS px top/bottom).
  // Lanczos + light unsharp; upscaled, not sharper.
  annapurna: {
    src: 'image_3564d7eb.jpg',
    sparkle: { x: 780, y: 1095, w: 112, h: 88 },
    sparkleMask: 'reference/annapurna-sparkle-mask.png',
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Kamadeva (new chitra frame, R1-R8): cream chamfered card on a light
  // marble backdrop: the marble is a mockup element only and is cropped
  // away entirely (crop 33,40,798,1157 in source px). Crossed sugarcane
  // bow and arrows with flower (classic Kamadeva emblem) at the head, a
  // chamfered rose-gold portrait frame top-right with a light-grey
  // empty-state panel, a large faint Sri Yantra watermark in the cream
  // field, and a thin double rose-gold / copper border with corner
  // triangles. Source 864 x 1232 (ratio 0.7013, 0.8% off A4).
  // NOTE: this source carries NO generator sparkle logo anywhere on the
  // card (bottom-right empty region verified against neighbouring cream;
  // corner triangles are ART and are left untouched) so `sparkle: false`
  // skips the default mirror-repair. A4 reached by uniform scale
  // 1.8721 (cropped 798x1157 -> 1494x2166) centred on a pure white
  // 1588 x 2246 canvas: the outermost drawn pixel clears 23.5 CSS px on
  // the sides and 20.0 CSS px top/bottom. Lanczos + light unsharp; the
  // result is upscaled, not sharper.
  kamadeva: {
    src: 'image_4630a88d.jpg',
    crop: { x: 33, y: 40, w: 798, h: 1157 },
    sparkle: false,
    scale: 1.8721,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Balaji Namam (new chitra frame): soft cream field framed by tall stone
  // temple pillars with gold motifs and a teal outer border; the classic
  // Shankha–Namam–Chakra triad at the head; an ornate gold circular frame
  // with kirti-mukha on a lotus pedestal at top right; a large faint Balaji
  // face watermark centred. Source 896 x 1200 (ratio 0.7467, 5.6% off A4).
  // Generator sparkle (four-point logo, bottom-right over the pillar base)
  // painted out by mirroring the bottom-left corner; verify clean at 400%.
  // Uniform scale 1506/896 = 1.6808 on a pure white 1588 x 2246 canvas:
  // side margins ~20.5 CSS px, top/bottom ~57 CSS px. Lanczos + light
  // unsharp; upscaled, not sharper.
  'balaji-namam': {
    src: 'image_75199cb.jpg',
    sparkle: { x: 780, y: 1110, w: 80, h: 80 },
    // 1502/896 = 1.6786: scaled art 1502 x 2010 centred on 1588 x 2246 gives
    // 43px expected side margins; with ~2px Lanczos antialiasing the outermost
    // drawn pixel lands at ~41px = 20.5 CSS px, clearing the 20 CSS px rule.
    scale: 1502 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Jagannath Dark (new chitra frame, R1-R13): deep charcoal field with a
  // geometric gold Art-Deco border (stepped corners, 8-pointed stars), a
  // gold line-art Jagannath face in a lotus/sunburst medallion at the head,
  // a chamfered (octagonal) gold portrait frame with a dotted bead border at
  // the top right (light empty-state panel), and a large faint chariot wheel
  // in a lotus outline behind the details. Source 864 x 1232 (ratio 0.7013,
  // 0.82% off A4). The only non-art element is the generator sparkle (white
  // 4-pointed logo, abs ~x 761-842, y 1137-1213) over the bottom-right corner
  // star; it is removed by pasting the flopped bottom-left corner through a
  // star-shaped mask (reference/jagannath-dark-sparkle-mask.png), so only the
  // sparkle silhouette is replaced — every other source pixel is untouched
  // (the corners are mirror-symmetric at dx = 0, mean abs diff 3.1 levels).
  // Uniform scale 1508/864 = 1.7454 on a pure white 1588 x 2246 canvas:
  // 20.0 CSS px sides, 24.0 CSS px top/bottom. Lanczos + light unsharp;
  // upscaled, not sharper.
  'jagannath-dark': {
    src: 'image_9c7d10bf.jpg',
    sparkle: { x: 650, y: 1050, w: 214, h: 182 },
    sparkleMask: 'reference/jagannath-dark-sparkle-mask.png',
    scale: 1508 / 864,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Sheshashayi (new chitra frame): burnt-edge parchment, carved gold-and-brown
  // wave scroll with inward lotus buds, gold five-hooded naga emblem over a
  // lotus at the head, oval photo opening top-right under a jewelled cobra
  // crown with a looped snake tail below, faint Vishnu-on-Shesha watermark in
  // the middle. Source image_f627742.jpg (896 x 1200, ratio 0.7467, +5.6% off
  // A4). Generator sparkle (four-point logo, bottom-right ~x 838, y 1140)
  // over the border corner; repaired by mirroring the bottom-left corner with
  // feathering. A4 ratio reached by uniform scale 1506/896 so the outermost
  // drawn pixel clears 20 CSS px on every side; the margin is pure white
  // (R1: white outside the parchment is part of the art). Lanczos + light
  // unsharp; upscaled, not sharper.
  sheshashayi: {
    src: 'image_f627742.jpg',
    sparkle: { x: 800, y: 1100, w: 70, h: 76 },
    sparkleFeather: 6,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Durga Yantra (new chitra frame): cream field framed by dark charcoal
  // geometric panels with stepped gold Art-Deco border and gold lotus/star
  // motifs; Goddess Durga's face in gold line at the head (third eye, crown,
  // tilak); chamfered gold portrait frame top-right over the dark panel;
  // large faint lotus-yantra with central hexagram behind the details.
  // Source 864 x 1232 (ratio 0.7013, within 1% of A4). Generator sparkle
  // (grey four-point logo, bottom-right ~x 788-822, y 1168-1192) painted out
  // by feathered mirror of the bottom-left corner; verified clean at 400%.
  // A4 ratio reached by uniform scale 1508/864 so the outermost drawn pixel
  // clears 20 CSS px on every side; margin is pure white because the border
  // runs to the source edge (corner-colour padding would be dark). No crop:
  // the art is the page. Lanczos + light unsharp; upscaled, not sharper.
  'durga-yantra': {
    src: 'image_a5ad13d2.jpg',
    sparkle: { x: 784, y: 1164, w: 44, h: 30 },
    sparkleFeather: 6,
    scale: 1508 / 864,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Parvati (new chitra frame): cream field with gold floral lotus-vine border,
  // maroon inner rule, Parvati with crescent moon and lotus at the head, oval
  // gold frame topped with lotus and crescent top-right, faint Sri Yantra in a
  // multi-layered lotus watermark. Source 896 x 1200 (ratio 0.7467, 5.6% off
  // A4). Generator sparkle (four-point logo, bottom-right over floral border)
  // removed by feathered mirror of the bottom-left corner; verified clean at
  // 400%. Uniform scale 1506/896 = 1.6808 on a pure white 1588 x 2246 canvas
  // (20.5 CSS px sides, 57 CSS px top/bottom). Floral border runs to source
  // edges so fill is pure white. Lanczos + light unsharp; upscaled, not sharper.
  parvati: {
    src: 'image_cdc55465.jpg',
    sparkle: { x: 780, y: 1120, w: 80, h: 70 },
    sparkleFeather: 6,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Lakshmi Padma Cream (new chitra frame, R1-R8): soft cream field inside a
  // thin sage-and-gold double border with stepped corners and lotus motifs;
  // a gold-line Lakshmi seated on a full lotus at the head; a cusped multi-
  // foil gold arch at the top right (pure-white empty-state opening); a large
  // faint geometric lotus watermark. Source 864 x 1232 (ratio 0.7013, 0.82%
  // off A4). This source carries NO generator sparkle: the bottom-right
  // corner was compared against the mirrored bottom-left at 4x (mean abs
  // diff 3.8 levels) and the stepped border + corner lotus are clean ART,
  // left untouched, so `sparkle: false` skips the mirror-repair. Uniform
  // scale 1508/864 = 1.7454 (Lanczos + light unsharp; upscaled, not sharper)
  // centred on a pure white 1588 x 2246 canvas: outermost drawn pixel lands
  // ~44 CSS px from the sides and ~26 CSS px from top/bottom, all >= 20.
  'lakshmi-padma-cream': {
    src: 'image_82810107.jpg',
    sparkle: false,
    scale: 1508 / 864,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Jagannath Soft (new chitra frame, R1-R8): soft warm cream field inside a
  // triple (outer gold + thin gold + inner navy) chamfered border with gold
  // medallion stars outside each corner; gold line-art Jagannath face with
  // chakra/conch hands and a divider rule at the head; chamfered octagonal
  // gold portrait frame top-right (pure-white empty state); large faint
  // Jagannath face watermark centred. Source 864 x 1232 (ratio 0.7013,
  // 0.82% off A4). Generator sparkle (small translucent star over the BR
  // diagonal, ~x 795-825, y 1120-1192) removed by feathered mirror of the
  // BL corner (box 770,1100,80,92; corners mirror-symmetric, mean abs
  // diff ~24 levels; the bottom star tip touches the medallion top, so
  // the box includes it — the mirrored medallion top is identical art),
  // verified clean at 400%. Uniform
  // scale 1506/864 = 1.743 (864x1232 -> 1506x2148) centred on pure white
  // 1588 x 2246: the cream field edge (src x=0) sits at print x=41,
  // y=49, i.e. 20.5/24.5 CSS px from L/R/T/B, all >= 20 CSS px with a
  // 1px buffer for Lanczos bleed. (The corner medallions at src x=23
  // land ~40 CSS px in.) Lanczos + light unsharp; upscaled, not sharper.
  'jagannath-soft': {
    src: 'image_f92b3fd0.jpg',
    sparkle: { x: 770, y: 1100, w: 80, h: 92 },
    sparkleFeather: 10,
    scale: 1506 / 864,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Jagannath Triad (new chitra frame): soft warm cream field inside a thick
  // terracotta border with rope texture and a continuous triangular sawtooth
  // band; the Puri triad of Jagannath, Balabhadra and Subhadra at the head;
  // a simple rectangular photo frame at top-right; a faint Jagannath Temple
  // watermark in the lower half. Source 896 x 1200 (ratio 0.7467, 5.6% off
  // A4). Generator sparkle (four-point logo, bottom-right over the right
  // border area) painted out by mirroring the bottom-left corner. Uniform
  // scale 1506/896 on a pure white 1588 x 2246 canvas (20.5 CSS px sides,
  // 57 CSS px top/bottom). Lanczos + light unsharp; upscaled, not sharper.
  'jagannath-triad': {
    src: 'image_d52a7a85.jpg',
    sparkle: { x: 770, y: 990, w: 70, h: 140 },
    sparkleFeather: 6,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  },
  // Saraswati Vidya (new chitra frame): cream field with gold veena-instrument
  // side borders and top/bottom scroll flourishes, veena + books + lotus emblem
  // at the head, swan-topped ornate oval portrait frame top-right, large faint
  // seated Saraswati watermark. Source 896 x 1200 (ratio 0.7467, 5.6% off A4).
  // Generator sparkle (four-point logo, bottom-right ~x 820-880, y 1125-1165
  // over the corner veena) removed by feathered mirror of the bottom-left
  // corner; verified clean at 400%. Veena borders, emblem, swan frame and
  // watermark untouched. Uniform scale 1506/896 on a pure white 1588 x 2246
  // canvas (20.5 CSS px sides, 57 CSS px top/bottom). Lanczos + light unsharp;
  // upscaled, not sharper.
  'saraswati-vidya': {
    src: 'image_d6a38b0.jpg',
    sparkle: { x: 820, y: 1125, w: 60, h: 40 },
    sparkleFeather: 6,
    scale: 1506 / 896,
    fillColour: { r: 255, g: 255, b: 255 },
    printSize: { w: 1588, h: 2246 },
    sharpen: true
  }
};

const PRINT = { w: 1240, h: 1754 };
const STANDARD_PRINT = { w: 1588, h: 2246 };
const PREVIEW_W = 600;
const srcDir = path.resolve('Design Template');
const printDir = path.resolve('assets/frames');
const previewDir = path.resolve('public/frames');

await mkdir(printDir, { recursive: true });
await mkdir(previewDir, { recursive: true });

// Preserve the currently approved artwork and its 600px previews. This is a
// one-time migration of existing print copies; backups precede every write.
if (process.argv[2] === '--standardize-existing') {
  const tempRoot = path.join(os.tmpdir(), 'opencode');
  await mkdir(tempRoot, { recursive: true });
  const backupDir = await mkdtemp(path.join(tempRoot, 'chitra-frames-backup-'));
  const prepared: Array<{ slug: string; output: Buffer }> = [];
  for (const slug of Object.keys(CHITRA_FRAMES)) {
    const file = path.join(printDir, `${slug}.jpg`);
    const input = await readFile(file);
    const meta = await sharp(input).metadata();
    if (meta.width === STANDARD_PRINT.w && meta.height === STANDARD_PRINT.h) continue;
    if (meta.width !== PRINT.w || meta.height !== PRINT.h) {
      throw new Error(`${slug}: unexpected print dimensions ${meta.width}×${meta.height}`);
    }
    const corner = await sharp(input).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
    const output = await sharp(input).resize(STANDARD_PRINT.w, STANDARD_PRINT.h, {
      fit: 'contain', kernel: 'lanczos3', background: { r: corner[0], g: corner[1], b: corner[2] }
    }).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toBuffer();
    prepared.push({ slug, output });
  }
  for (const { slug } of prepared) await copyFile(path.join(printDir, `${slug}.jpg`), path.join(backupDir, `${slug}.jpg`));
  for (const { slug, output } of prepared) await writeFile(path.join(printDir, `${slug}.jpg`), output);
  console.log(`Standardized ${prepared.length} print copies; originals backed up to ${backupDir}. Previews were not changed.`);
  process.exit(0);
}

for (const [slug, p] of Object.entries(FRAMES)) {
  if (process.argv[2] && process.argv[2] !== slug) continue;
  const file = path.join(srcDir, p.src);
  const { width: W = 0, height: H = 0 } = await sharp(file).metadata();
  const layers: sharp.OverlayOptions[] = [];

  const box = p.sparkle === undefined && !p.crop ? { x: W - 96, y: H - 96, w: 80, h: 80 } : p.sparkle;
  if (box) {
    // Mirror about the paper's centre line: a photographed sheet is not centred
    // in its image, and the image's own centre would copy in a strip of backdrop.
    const axis = p.crop ? 2 * p.crop.x + p.crop.w - 1 : W - 1;
    let mirror = await sharp(file).extract({ left: axis - box.x - box.w + 1, top: box.y, width: box.w, height: box.h }).flop().toBuffer();
    if (p.sparkleMask) {
      // A bespoke mask (e.g. a large translucent sparkle): the mirrored crop
      // is kept only where the mask is opaque, leaving the untouched source
      // everywhere else — no seam, no box-edge ghost.
      const maskRaw = await sharp(path.resolve(p.sparkleMask)).raw().toBuffer({ resolveWithObject: true });
      const { width: mw, height: mh, channels: mc } = maskRaw.info;
      const { data: md } = maskRaw;
      const rgba = Buffer.allocUnsafe(mw * mh * 4);
      for (let i = 0; i < mw * mh; i++) {
        rgba[i * 4] = 255;
        rgba[i * 4 + 1] = 255;
        rgba[i * 4 + 2] = 255;
        rgba[i * 4 + 3] = mc === 1 ? md[i] : md[i * mc + (mc - 1)];
      }
      mirror = await sharp(mirror).ensureAlpha()
        .composite([{ input: await sharp(rgba, { raw: { width: mw, height: mh, channels: 4 } }).png().toBuffer(), blend: 'dest-in' }])
        .png()
        .toBuffer();
    } else if (p.sparkleFeather) {
      const inset = p.sparkleFeather;
      const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${box.w}" height="${box.h}"><rect x="${inset}" y="${inset}" width="${box.w - 2 * inset}" height="${box.h - 2 * inset}" rx="7" fill="white"/></svg>`);
      const feathered = await sharp(mask).blur(3).png().toBuffer();
      mirror = await sharp(mirror).ensureAlpha().composite([{ input: feathered, blend: 'dest-in' }]).png().toBuffer();
    }
    layers.push({ input: mirror, left: box.x, top: box.y });
  }
  for (const f of p.fills ?? []) {
    layers.push({ input: { create: { width: f.w, height: f.h, channels: 3, background: f.colour } }, left: f.x, top: f.y });
  }

  // Composite and extract are separate passes: within one pipeline sharp
  // extracts first, which would put the repairs in the wrong place.
  let page = await sharp(file).composite(layers).toBuffer();
  if (p.crop) page = await sharp(page).extract({ left: p.crop.x, top: p.crop.y, width: p.crop.w, height: p.crop.h }).toBuffer();

  // Optional pre-scale: scale the art uniformly so the outermost drawn pixel
  // clears the 20 CSS px print margin on every side of the sheet.
  if (p.scale) {
    const { width: cw, height: ch } = await sharp(page).metadata();
    let scaled = sharp(page).resize(Math.round(cw * p.scale), Math.round(ch * p.scale), { kernel: 'lanczos3' });
    if (p.sharpen) scaled = scaled.sharpen({ sigma: 0.5 });
    page = await scaled.toBuffer();
  }

  // Pad with the paper at the corners, so the bands added to reach A4 read as margin.
  const { data, info } = await sharp(page).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.height * info.width - 1];
  const [r, g, b] = [0, 1, 2].map((c) => Math.round(corners.reduce((sum, i) => sum + data[i * 3 + c], 0) / 4));

  const printFile = path.join(printDir, `${slug}.jpg`);
  const fill = p.fillColour ?? { r, g, b };
  if (p.scale) {
    // Composite the scaled art centred on the canvas (A4 at 1240x1754, or
    // p.printSize when a frame needs more than 150 dpi); the canvas borders
    // become the flat margin (pure white for frames whose border runs to the
    // edge; paper-colour for every other frame).
    const size = p.printSize ?? PRINT;
    const x = Math.round((size.w - info.width) / 2);
    const y = Math.round((size.h - info.height) / 2);
    await sharp({ create: { width: size.w, height: size.h, channels: 3, background: fill } })
      .composite([{ input: page, left: x, top: y }])
      .jpeg({ quality: p.jpegQuality ?? 90 })
      .toFile(printFile);
  } else {
    const size = p.printSize ?? PRINT;
    const resized = sharp(page)
      .resize(size.w, size.h, { fit: 'contain', background: fill, kernel: 'lanczos3' });
    if (p.sharpen) resized.sharpen({ sigma: 0.5 });
    await resized
      .jpeg({ quality: p.jpegQuality ?? 90, ...(p.jpegQuality ? { chromaSubsampling: '4:4:4' as const } : {}) })
      .toFile(printFile);
  }
  const currentPrint = await readFile(printFile);
  const currentMeta = await sharp(currentPrint).metadata();
  if (currentMeta.width !== STANDARD_PRINT.w || currentMeta.height !== STANDARD_PRINT.h) {
    await writeFile(printFile, await sharp(currentPrint).resize(STANDARD_PRINT.w, STANDARD_PRINT.h, {
      fit: 'contain', kernel: 'lanczos3', background: fill
    }).jpeg({ quality: p.jpegQuality ?? 90 }).toBuffer());
  }
  await sharp(printFile).resize(PREVIEW_W).jpeg({ quality: 80 }).toFile(path.join(previewDir, `${slug}.jpg`));
  console.log(`${slug.padEnd(14)} ${p.src} -> assets/frames/${slug}.jpg, public/frames/${slug}.jpg`);
}
