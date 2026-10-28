# Chitra frames: fourteen templates built on the owner's page designs

**Date:** 2026-10-20
**Sub-project:** owner-supplied page frames. Outside the A–D plan; closest to D (new layouts). C (pattern backgrounds) is unchanged and still to come.
**Source:** the 14 page designs in `Design Template/`
**Status:** design approved in brainstorming, awaiting spec review

## Intent

The owner drew 14 finished biodata pages: border, deity emblem, empty photo
frame and faint watermark, with the middle left blank for the details. They
want templates that look exactly like those pages. The painted ones
(Hanuman, Gajalakshmi's elephants, the watercolour Shiva, the peacock border)
cannot be redrawn in SVG to match, so the owner's images become the page and
only the text and photo are laid over them.

Success means:

- 40 templates: 14 new ones, all in Devotional at ₹49, one page each, in
  English, Hindi and Marathi;
- each new sample sheet, set beside its source image at the same size, shows
  the same border, emblem, photo frame and watermark. The only differences are
  the added text and photo, and the generator sparkle painted out;
- a full biodata fits in every language with body text at 13px or larger, and
  text never runs into the border art;
- the full-size blank frames are never served from `public/`; anyone browsing
  the site only ever receives a copy about 600px wide;
- PDF text stays selectable, and `npm run proofs` passes.

## Decisions

| Question | Decision |
|---|---|
| Approach | The owner's image is the page. A script crops, cleans and fits each image to A4; text and photo go on top. Nothing is redrawn. |
| Scope | The 14 page frames. The 5 pattern sheets wait for C. The six-card folk-art sheet is a reference only. |
| Collection, price, pages | Devotional, ₹49 (`PRICE.standard`), one page. |
| Languages | All three. |
| Titles | English only, like the existing 26. |
| Fonts and invocation | Each frame uses its deity's existing `DEV_THEMES` heading and body fonts and its invocation line. No fonts added. |
| Body text | Two columns at 13.5–14.5px (13px only where `npm run fit` shows it is needed). Measured in brainstorming: a full biodata in one column would need 12.5px or smaller to fit these frames. |
| Print copy vs preview copy | Print copy, 1240 × 1754 (A4 at 150 dpi), kept in `assets/frames/` outside `public/`, embedded as a data URI only on the server-rendered print pages. Preview copy, 600px wide, in `public/frames/`, for the gallery, template page and editor. |
| Photo | Placed inside the image's own photo frame, cut to its opening. With no photo, the frame stays exactly as drawn. |
| Colour picker | None, as for the devotional layout (`SWATCHES.chitra = []`). |
| Rights | Supplied by the owner, who confirms the images may be sold on printed products. The visible generator sparkle is painted out during preparation. |

## The fourteen frames

| Template (slug) | Source `Design Template/image_…` | Theme for fonts and invocation | Photo opening | Preparation |
|---|---|---|---|---|
| Vinayak (`vinayak`) | `2d80ef02` | `ganesh` | rectangle | — |
| Gajanan (`gajanan`) | `430871a3` | `ganesh` | oval | — |
| Ekadanta (`ekadanta`) | `6f2e0c6a` | `ganesh` | path (cusped arch) | white name bar painted out with the paper colour; the layout draws it again as a name plate |
| Siddhivinayak (`siddhivinayak`) | `c3e8c406` | `ganesh` | rectangle | — |
| Gajmukh (`gajmukh`) | `fb1b0709` | `ganesh` | rectangle | — |
| Neelkanth (`neelkanth`) | `9b354efe` | `mahadev` | rectangle | — |
| Bholenath (`bholenath`) | `f4c0e80a` | `shiv` | rectangle | — |
| Vrindavan (`vrindavan`) | `d598dc6b` | `krishna` | oval | — |
| Govind (`govind`) | `e88ec56a` | `krishna` | rounded rectangle | cropped off the grey backdrop |
| Kodanda (`kodanda`) | `63be21ea` | `ram` | rectangle | — |
| Dhanu (`dhanu`) | `b0a679dd` | `ram` | rectangle | cropped off the taupe backdrop |
| Gajalakshmi (`gajalakshmi`) | `5eb9d767` | `lakshmi` | rectangle | cropped off the grey backdrop |
| Vithoba (`vithoba`) | `753afda` | `vitthal` | path (scalloped oval) | — |
| Sankat Mochan (`sankat-mochan`) | `9fbaaf29` | `hanuman` | rectangle | — |

The text colours are starting points, with hues taken from each image (the
thin gold lines average out pale, so the text colours are set darker than the
art). `accent` is used for the name, headings and row labels; `ink` for the
values; `rule` for the line under each heading. `accent` and `ink` must
reach 4.5:1 against the frame's `paper` colour.

| Slug | `paper` (sampled) | `accent` | `rule` | `ink` |
|---|---|---|---|---|
| `vinayak` | `#FCFBF7` | `#7A5A1E` | `#B8964A` | `#2B2116` |
| `gajanan` | `#F3ECE2` | `#7A5A1E` | `#C2A25A` | `#2B2116` |
| `ekadanta` | `#F9F9F5` | `#7A5A1E` | `#C8A75A` | `#2B2116` |
| `siddhivinayak` | `#FCFBF7` | `#7A5A1E` | `#C2A25A` | `#2B2116` |
| `gajmukh` | `#FBF8E9` | `#7A5A1E` | `#C2A25A` | `#2B2116` |
| `neelkanth` | `#FCF6E4` | `#6B1F1F` | `#A0522D` | `#2A1712` |
| `bholenath` | `#F9EBD0` | `#6E3B1E` | `#A6764F` | `#2A1A10` |
| `vrindavan` | `#F8F6E4` | `#2E5B3A` | `#C2A25A` | `#22261E` |
| `govind` | `#F6F7F1` | `#3F5B47` | `#B8973E` | `#232A24` |
| `kodanda` | `#F9F6EA` | `#2A3F73` | `#B8964A` | `#2A2116` |
| `dhanu` | `#F1E9DB` | `#9A4A2A` | `#C27A55` | `#2E2219` |
| `gajalakshmi` | `#F6F3E6` | `#7A1F22` | `#B8892E` | `#2B1416` |
| `vithoba` | `#F4EDDA` | `#1F4A3A` | `#B8964A` | `#1E2A22` |
| `sankat-mochan` | `#F7EBCE` | `#8A3B12` | `#B5652E` | `#2B1A0C` |

Blurbs (one sentence each, naming what the eye sees first):

- **Vinayak:** Ganesha in a laurel wreath inside an interlaced gold border, with a mandala Ganesha faintly behind the details.
- **Gajanan:** A gold temple arch on handmade beige paper, a small line Ganesha at its peak and an oval portrait.
- **Ekadanta:** A line Ganesha and an arched portrait window inside a double gold frame with lotus corners.
- **Siddhivinayak:** Ganesha in gold line with lotus vines in three corners and a mandala Ganesha behind the details.
- **Gajmukh:** A gold line Ganesha face, flowering vine corners and a column of small Ganeshas down the right side.
- **Neelkanth:** A watercolour trishul and damru in a ring of flame, a border of naag, damru and bilva, and Shiva in meditation behind the details.
- **Bholenath:** A trishul and damru in flame on old parchment, with a border of trishul, damru, bilva and spirals.
- **Vrindavan:** Peacock feathers, flutes and pink lotus around the page, Krishna's mukut above, and Radha Krishna faintly behind the details.
- **Govind:** Krishna's crown and flute in gold on white, inside a sage border with lotus and feather corners.
- **Kodanda:** Ram's bow and arrow on an enamel sun, a border of bows, arrows and suns, and his silhouette behind the details.
- **Dhanu:** A terracotta bow and arrow inside a sun, faint sun discs across the page, and a fine double rule.
- **Gajalakshmi:** Lakshmi on her lotus, framed by maroon waves, caparisoned elephants, kalash and gold coins.
- **Vithoba:** Vitthal in gold line, a scalloped portrait frame, and a green and gold border with key-pattern corners.
- **Sankat Mochan:** Hanuman carrying the mountain against a sunburst, with gada and mountain bands across an aged page.

## Preparing the images

`scripts/prepare-frames.ts` (`npm run frames`) uses sharp, which is already
installed. It is idempotent: rerun it when the owner replaces a source with a
higher-resolution original under the same name. For each frame, in order:

1. **Crop** to the paper, only for the three images on a backdrop (Govind, Dhanu, Gajalakshmi).
2. **Sparkle.** Replace a box in the bottom-right corner (default 80 × 80 source px, per-frame override) with the mirror image of the same box in the bottom-left corner. The borders are mirror-symmetric, so this restores the border art under the sparkle instead of leaving a flat patch. Images already cropped clear of the sparkle skip this step.
3. **Fill** any listed rectangles with the paper colour (Ekadanta's name bar only).
4. **Fit** into 1240 × 1754 with `fit: 'contain'`, padding with the average of the four corner pixels. Never stretched: the 896 × 1200 sources are 3:4, A4 is 1:√2, and a stretch would turn Hanuman's sun disc into an egg.
5. **Write** the print copy to `assets/frames/<slug>.jpg` (quality 90) and the preview copy, resized to 600px wide, to `public/frames/<slug>.jpg` (quality 80).

The preparation data (crop, sparkle box, fills) lives in the script. The
layout data lives in `chitra-frames.ts`. The script and the page never
share numbers.

## The page

One component, `src/templates/chitra.tsx`, on the fixed 794 × 1123 sheet.
Everything decorative comes from the image.

**Per-frame data** (`src/templates/chitra-frames.ts`, keyed by slug, sheet px).
Each row holds the colours above, plus:
- `motif`: whose fonts and invocation to use;
- `text: { top, right, bottom, left }`: the text box, as insets from the sheet edge;
- `slot: { x, y, w, h, shape, radius?, path? }`: the photo opening. `shape` is `'rect' | 'oval' | 'path'`; `radius` makes a rounded rectangle;
- `size`: body font px;
- `plate?: { w, h, fill }`: Ekadanta's name plate.

**How the values are measured.** On the print copy at 4× zoom, then
divided by 1240 / 794:
- the slot is the inner edge of the drawn photo frame;
- the text box sides sit 14px inside the inner edge of the border art;
- its top sits 10px below the emblem's lowest painted pixel;
- its bottom sits 14px above the lowest border art (the mountain band on Sankat Mochan, the kalash row on Gajalakshmi).

**Layers:**

1. The frame `<img>`, absolutely positioned over the whole sheet. `src` is the
   print copy's data URI when the print page provides one (`frameSrc` prop),
   otherwise `/frames/<slug>.jpg`. Never `loading="lazy"`: PrintReady would
   wait on an image that never decodes.
2. The photo, when there is one: absolutely positioned in `slot`, cut to the
   opening (`border-radius` for oval and rounded, `clip-path: path()` for
   path), with `object-fit: cover` and the biodata's own `photo.position`.
3. The text, **in normal flow**, inside the article's padding, which is set to
   `text`. Anything that grows past the bottom of the text box makes the
   article's `scrollHeight` exceed 1123. The editor's warning, the review
   page's payment block and `npm run fit` all already measure exactly that, so
   none of them change.

**The text:**

- **Slot spacer.** Where the slot reaches down into the text box, an empty
  float on the right reserves it (computed from `slot` and `text`, 16px
  clear). The head flows to its left.
- **Head.** Centred, in this order:
  - the invocation (13px, `accent`);
  - the kicker (13px, semibold);
  - the name (28px, the theme's heading face, `accent`);
  - the subtitle, if any (14px, `ink`).

  On Ekadanta, the kicker and name sit in a white plate. At its smallest the
  plate is exactly the bar that was painted out; it grows if a long name wraps.
- **Body.** A two-column block with `clear: both`, 24px gap, line height 1.32:
  - headings are 16px in the heading face, `accent`, with a 1px `rule` line under them;
  - rows use a `40% 8px 1fr` grid: label in `accent`, colon, value in `ink` at weight 500;
  - "about" and "expectations" text flows as paragraphs;
  - a row never splits across columns, and a heading never ends a column (`break-inside: avoid` on rows, `break-after: avoid` on headings).

If a frame cannot fit a full biodata at 13px in every language, the
implementation stops and brings that frame back to the owner. It does not
shrink the type further or crop the art.

## Files

| File | Change |
|---|---|
| `scripts/prepare-frames.ts` | New: the preparation steps above. |
| `package.json` | `"frames"` script. |
| `assets/frames/*.jpg` | New: 14 generated print copies. |
| `public/frames/*.jpg` | New: 14 generated preview copies. |
| `src/templates/chitra-frames.ts` | New: 14 rows and their types. |
| `src/templates/chitra.tsx` | New: the layout. |
| `src/templates/chitra-art.ts` | New, server only: reads a print copy and returns its data URI. |
| `src/templates/catalog.ts` | `'chitra'` added to `LayoutKind`; `SWATCHES.chitra = []`; 14 rows in the devotional block (`layout: 'chitra'`, `PRICE.standard`, all three locales, `pages: 1`, the blurb). |
| `src/templates/render.tsx` | `case 'chitra'`; an optional `frameSrc` prop passed through. |
| `src/app/print/[token]/page.tsx`, `src/app/print/sample/[slug]/page.tsx` | For chitra templates, pass `frameSrc` from `chitra-art.ts`. |
| `scripts/proof-sheet.ts` | The raster check covers `chitra` as well as `devotional`: no more image objects than two per `<img>`. |
| `tests/catalog.test.ts` | 40 templates; the Devotional collection is the 14 devotional-layout templates (one per motif) plus the 14 chitra templates. |
| `tests/chitra-frames.test.ts` | New. Checks that: <br>• every chitra catalogue row has a frame row, and the reverse; <br>• both image copies exist; <br>• slot and text box lie inside the sheet; <br>• where the slot reaches into the text box, at least 300px of width is left beside it for the head; <br>• `accent` and `ink` reach 4.5:1 against `paper`. |
| `README.md` | Counts 26 → 40 templates and 78 → 120 prerendered pages, the test count, the layout list, and the "twenty cards" note in Motion (now forty). |

Nothing else changes. The gallery, editor, review page, PDF, thumbnails and
showcase all read the catalogue.

## Verification

| Check | Proves |
|---|---|
| `npm test`, `npm run typecheck`, `npm run lint` | 40 templates; every frame has its data and both images, geometry inside the sheet, text contrast. |
| `npm run build` (in the scratchpad copy, never in place while :3000 runs) | 120 template pages prerendered (40 × 3). |
| `npm run fit` | 116 template/language pairs fit (74 + 14 × 3). |
| `npm run proofs` | 40 PDFs; no chitra or devotional PDF carries a raster beyond its `<img>`s. |
| Side-by-side screenshots: each sample sheet (`hi`) next to its source image at the same size | Border, emblem, photo frame and watermark match; the sparkle is gone; the photo sits inside its opening; no text touches the art. Checked by eye, because no automated check sees art. |
| An overlong "about" typed into the editor on Sankat Mochan, the shortest text box | The overflow warning shows as soon as the text passes the box's bottom edge. Proves the padding-based measurement works. |
| Request `/frames/<slug>.jpg` and look for any `assets/frames` URL | Previews are 600px wide; the print copy has no public URL. |
| `npm run thumbs` | 40 thumbnails. |

## Build order

1. **Preparation.** Write the script and generate all 14 copies. Check each print copy by eye against its source: crop, sparkle repair, padding.
2. **Layout on one frame.** Add the layout kind, `chitra.tsx`, `chitra-art.ts`, the render case, the print pages' `frameSrc`, the proofs check and both tests, with Vinayak as the only frame. Run tests, fit, proofs and the side-by-side. The site works from here on.
3. **One task per deity group.** Each adds its frame rows (measured), catalogue rows and test counts, then runs tests, fit (3 languages) and the side-by-side:
   - the other Ganeshas (Gajanan, Ekadanta with its plate, Siddhivinayak, Gajmukh);
   - Shiva (Neelkanth, Bholenath);
   - Krishna (Vrindavan, Govind);
   - Ram (Kodanda, Dhanu);
   - Gajalakshmi;
   - Vithoba;
   - Sankat Mochan.
4. **Finish.** Update the README, regenerate proofs and thumbnails, build in the scratchpad copy, run typecheck and lint, and do the public-URL check.

## Risks

- **Print sharpness.** The sources are 864–896px wide, about 105 dpi on A4. The print copy is upscaled to 150 dpi with Lanczos, which smooths edges but adds no detail. The fix is higher-resolution originals and one rerun of `npm run frames`.
- **Deployment.** The print routes read `assets/frames/` at request time, so that folder must ship with the server. On a traced or serverless build, it needs an `outputFileTracingIncludes` entry for `/print`.
- **Mirror repair.** The bottom-right corner may not exactly mirror the bottom-left (Sankat Mochan's gada and mountains are not symmetric). The side-by-side catches a visible seam; the fix is that frame's sparkle box.

## Out of scope

- Pattern backgrounds (C) and the six folk-art deities.
- Translated template titles.
- A colour picker or two-page version for chitra templates.
- Redrawing any frame in SVG.
