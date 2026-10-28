# Devotional frames: motif borders, tiled watermark, deity figures

**Date:** 2026-10-20
**Sub-project:** A of 4 (A foundation + upgrade the 8 · B new deities · C pattern backgrounds · D new layouts)
**Status:** design approved in brainstorming, awaiting spec review

## Intent

The eight devotional templates look plain next to the reference designs the
owner supplied: those have a motif border, a watermark repeated across the
page, and an illustrated deity figure. Sub-project A gives the existing eight
those three things, in place, and builds them as reusable pieces that B, C and
D will use.

Success means:

- all 8 devotional templates have the new frame, tiled watermark and figure
  slot, in English, Hindi and Marathi;
- a fully filled biodata still fits on its page(s) in every language, at
  today's text size;
- a paid PDF never prints with a missing or half-loaded image;
- the templates work before any artwork arrives, and each deity's art goes live
  by dropping one file in.

## Decisions

| Question | Decision |
|---|---|
| New templates or upgrade? | Both, in sub-projects. A upgrades the existing 8 in place; B/C/D add new ones. |
| Figure art | The owner supplies one raster PNG per deity. Borders and tiles are SVG, drawn in code. |
| Sacred text | Symbols only in borders and tiles. Sacred text stays where it is today: the one invocation line, and Om Shanti's single ॐ. The audit's "no repeated राम behind a phone number" rule stands. |
| Border weight | Layout **B**: full motif bands on the left and right sides only, a thin rule top and bottom, an eight-petal rosette in each corner, and a 120px figure breaking through the top rule. |
| Watermark | Tiles **B**: about a 44px motif every 150px, in a half-drop grid, starting at 11% strength. Tiles stay inside the text box, never under the side bands. |
| Approach | Extend the existing `DevotionalTemplate`. No second layout kind. |
| Prices | Unchanged (₹49). |

## Geometry (A4 = 794 × 1123 CSS px)

- Outer rule: inset 20px, 3px, `accent` (unchanged: inside what home printers reach).
- Inner rules, 1px `accent2`: across the top and bottom at inset 28px, and down each side at the bands' inner edges (x = 54 and 740), so no rule crosses a band.
- Side bands: 34px deep, from x = 20 to 54 (left) and 740 to 774 (right), between the corner rosettes.
- Corner rosettes: centred in the 34 × 34 corner squares, radius about 21px.
- Text box: horizontal padding goes from 54px to **70px**. Ornaments never enter it. This also fixes today's Hanuman defect, where the bottom corner ornaments overlap the Contact, Phone and Address rows.
- Figure slot: a **140 × 120 box**, centred, top edge at y ≈ 26, with the top rules cut behind it. Image fitted with `object-fit: contain`.
- Tile layer: x 54 to 740, from **below the figure slot** (y ≈ 150) down to y = 1095, half-drop grid, `tileOpacity` per theme. Starting below the figure keeps tiles from showing through the gaps in a transparent PNG.
- Ganesh Mangal's page 2 gets the same frame, figure slot and tiles as page 1.

## Components and files

| File | Change |
|---|---|
| `src/templates/ornaments.tsx` | Delete `DeityCorner` and `DeityWatermark` (only `devotional.tsx` uses them). Add `DeityBand` (one repeating band unit per motif, drawn in a band-local frame where y = 0 is the paper edge and +y points inward), `DeityTile` (one tile symbol per motif) and a shared `Rosette`. Keep `DeityLogo` as the figure fallback. Keep the audit notes at the top of the file. |
| `src/templates/devotional.tsx` | Replace the frame, corner and watermark block with one absolutely positioned SVG layer: outer and inner rules, two side bands filled by `<pattern>`, four rosettes, and a tile `<pattern>` clipped to the text box. Add the figure slot (PNG if `figure` is set, otherwise `DeityLogo` scaled into the same box). Tighten spacing (see Fit). Accept `instanceId`. |
| `src/templates/devotional-themes.ts` | Remove `wmOpacity` and `WM_POSITION`. Add `tileOpacity: number` (initially 0.11, and 0.14 for Saraswati because her yellow prints faint; final values come from the test print) and `figure?: string` (a public path such as `/deities/lakshmi.png`). |
| `src/templates/render.tsx` | Pass `instanceId` to `DevotionalTemplate`, as Paramparik already gets it. SVG pattern ids are built from it so the 20 sheets in the gallery don't collide. |
| `src/app/print/[token]/print-ready.tsx` | Set ready only after `document.fonts.ready` **and** `img.decode()` for every image on the page. |
| `scripts/fit-check.ts` | Measure every locale in `docLocales`, not only the first. |
| `tests/catalog.test.ts` | Add a test: every theme with `figure` set points to a file that exists under `public/`. |
| `public/deities/*.png` | The owner's artwork (see below). |

Data flows one way: ornaments → devotional template → `TemplateSheet`. Nothing
outside the files above changes. The catalogue rows, slugs and prices stay as
they are.

## Motifs per deity

All in the theme's `accent` and `accent2`, plus the leaf greens Krishna and
Saraswati already use. Light fills, no solid flooded areas.

| Template | Side band unit | Tile |
|---|---|---|
| Ganesh Mangal (`ganesh`) | Marigold on a running vine, then a modak | Modak |
| Ram (`ram`) | Bow, then crown | Sun disc with rays |
| Shiv Shakti (`shiv`) | Trishul, damru, rudraksha bead | Bilva leaf (three leaves) |
| Lakshmi (`lakshmi`) | Lotus, then gold coin | Lotus |
| Hanuman (`hanuman`) | Gada, then mountain peak | Gada |
| Saraswati (`saraswati`) | Veena, open book, lotus bud | Open book |
| Murli Manohar (`krishna`) | Single peacock feather, then kadamba blossom | Butter pot (makhan matki) |
| Om Shanti (`om`) | Lotus petal fan, then bead | Diya |

Constraints carried over from the market audit:

- Peacock feathers appear on Krishna only.
- Krishna's feather and flute are never crossed.
- No sacred text in any band or tile.
- Ganesha is vamamukhi (trunk turned to his left) wherever he appears.

## Figure artwork (supplied by the owner)

| | Requirement |
|---|---|
| Files | `public/deities/{ganesh,ram,shiv,lakshmi,hanuman,saraswati,krishna}.png`. Om Shanti has no figure; its slot keeps the SVG ॐ logo. |
| Background | Transparent. No paper texture, torn edge or shadow cast onto the background. |
| Size | 600 to 1200px tall; roughly square or a little wider than tall. |
| File weight | 400 KB or less. |
| Content | The figure only. No text, signature, "Artisan Heritage" lettering or generator marks. |
| Ganesha | Vamamukhi. |
| Shiv Shakti | The trishul-and-damru emblem, not the seated Shiva (that belongs to sub-project B's Shiva template). |
| Rights | Owned by the owner, or licensed for printed products sold commercially. |

If a delivered PNG clashes with its theme, that theme's `accent` and `accent2`
are retuned to the art.

## Fallback and failure handling

- **No artwork yet:** `figure` is unset, and the slot shows `DeityLogo` scaled to the same 140 × 120 box. Layout and fit are identical with or without art, so art can land deity by deity.
- **Wrong path:** the `catalog.test.ts` check fails `npm test`.
- **An image fails to load during a PDF render:** `img.decode()` rejects, so the ready flag never sets. `renderOrderPdf` then hits its existing 15-second `waitForSelector` timeout and throws. The order shows the existing failure and retry path, and no paid PDF ships without its figure. The same wait now also covers the customer's own photo.

## Fit

Classic layout B was estimated about 33px over a full biodata before
tightening. Space is reclaimed in this order, stopping when `npm run fit`
passes in every language:

1. Section gap 10px → 6px.
2. Heading bottom margin 3px → 1px.
3. Line height 1.4 → 1.36 (classic and split).
4. Invocation line moved closer to the figure.

Body text never goes below today's 15.5px (14.5px on centered, less 0.8px for
`runsLarge`). If a theme still overflows after all four, it becomes two pages
(`twoPage: true`, the same as Ganesh Mangal).

## Verification

| Check | Proves |
|---|---|
| `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` | No regressions; `figure` paths are real. |
| `npm run fit` (all locales) | No template clips a full biodata in any language. |
| `npm run proofs`, `npm run thumbs` | All 8 PDFs, including Ganesh Mangal page 2, and the gallery cards are regenerated and checked by eye. |
| `npm run e2e` (Docker Postgres) | A paid order renders a PDF that contains the figure. |
| One home-inkjet test print of Lakshmi, Saraswati and Krishna (owner) | Sets each `tileOpacity`: visible on paper, never competing with the text. |

## Build order

Each step leaves the site working.

1. `PrintReady` waits for images.
2. New frame (bands, tiles, rosettes) for all 8; old corner and watermark code deleted; `instanceId` threaded through.
3. Spacing tightened until `npm run fit` passes in every locale (with the fit check extended first).
4. Figure slot with the SVG fallback, plus the missing-file test.
5. Proofs, thumbnails, the owner's test print, then `tileOpacity` set.
6. PNGs dropped in as they arrive; proofs and thumbnails re-run.

## Out of scope

- Shiva as its own template, and other new deities (sub-project B).
- Full-page pattern backgrounds: tiled figure, floral damask, mandala, trellis (sub-project C).
- New page arrangements beyond classic, centered and split (sub-project D).
- Re-rendering PDFs already cached for paid orders: they keep the old look until their 14-day retention ends.
