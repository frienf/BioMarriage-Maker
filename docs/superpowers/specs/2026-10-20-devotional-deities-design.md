# Devotional deities: six new templates on the A frame

**Date:** 2026-10-20
**Sub-project:** B of 4 (A foundation, done · **B new deities** · C pattern backgrounds · D new layouts)
**Builds on:** `docs/superpowers/specs/2026-10-20-devotional-frames-design.md` (A)
**Status:** design approved in brainstorming, awaiting spec review

## Intent

Families look for their own deity or kuldevi on the biodata. The catalogue
covers eight; B adds six more that the owner chose, including the
Maharashtrian deities that Marathi families ask for. Each new template is a
set of rows on A's machinery: the same frame, figure slot, fallback, vector
PDF check and fit check.

Success means:

- 26 templates (14 devotional), each new one in English, Hindi and Marathi at
  ₹49;
- each new template has a recognisable side band, tile and fallback logo that
  no other deity shares;
- a full biodata fits on one page in every language;
- every devotional PDF stays vector (no rasterised ornaments);
- each deity's artwork goes live by dropping one PNG in, as in A.

## Decisions

| Question | Decision |
|---|---|
| Which deities | Shiva (separate from Shiv Shakti), Durga, Ambabai, Vitthal, Tirupati Balaji, Khandoba. |
| Durga and Ambabai | Two templates: families search for different names. |
| Approach | Rows on A's machinery. No new layout kind, collection or component. |
| Layouts | Classic or split only. Centered has the least spare room today (9px; Saraswati 2px). |
| Price, collection, pages | ₹49, Devotional, one page each. |
| Languages | All three, Vitthal, Khandoba and Ambabai included. |
| Template titles | English only, like the existing 20. |
| Fonts | Only faces already loaded in `src/lib/fonts.ts`; no added page weight. |

## The six themes

Motif key `mahadev` (not `shiva`) keeps Shiva apart from Shiv Shakti's
existing `shiv`.

| Template (slug) | Motif key | Layout | `accent` / `accent2` | Heading / body | Invocation (`invLang`) |
|---|---|---|---|---|---|
| Shiva (`shiva`) | `mahadev` | classic | `#2F4A6B` / `#A07A3C` | Eczar 700 / Hind | ॥ हर हर महादेव ॥ (`hi`) |
| Durga (`durga`) | `durga` | split | `#B0202E` / `#2F7A3F` | Rozha One 400 / Martel | ॥ ॐ दुं दुर्गायै नमः ॥ (`sa`) |
| Ambabai (`ambabai`) | `ambabai` | split | `#1F6B45` / `#C9952C` | Tiro Devanagari Marathi 400 / Mukta | ॥ उदे गं अंबे उदे ॥ (`mr`) |
| Vitthal (`vitthal`) | `vitthal` | split | `#3B2F6B` / `#E07A1F` | Kurale 400 / Mukta | ॥ जय जय राम कृष्ण हरी ॥ (`mr`) |
| Tirupati Balaji (`balaji`) | `balaji` | classic | `#6E1423` / `#D4A017` | Martel 700 / Hind | ॥ ॐ नमो वेंकटेशाय ॥ (`sa`) |
| Khandoba (`khandoba`) | `khandoba` | classic | `#7B2D26` / `#E8B21A` | Khand 600 / Hind | ॥ येळकोट येळकोट जय मल्हार ॥ (`mr`) |

Every new theme:
- takes `ink`, `label`, `paper` and `tint` as dark and light variants of its accent, matching the existing themes;
- sets `tileOpacity: 0.11`;
- sets no `figure` until the artwork lands;
- sets no `runsLarge` unless `npm run fit` needs it.

The colours are starting points: when a PNG arrives, its theme's two colours
are retuned to the art (A's rule).

## Motifs

| Motif | Side band unit (A, then B) | Tile | Fallback logo |
|---|---|---|---|
| `mahadev` | Coiled naag, then trinetra (the third eye) | Nandi, seated | Shivling with tripundra and naag hood |
| `durga` | Red hibiscus (jaba), then ghanta | Navratri kalash with coconut and mango leaves | Her lion in profile under a tasselled chhatra |
| `ambabai` | Stack of green bangles, then nath (Maharashtrian nose ring) | Kumkum karanda (lidded box) | A lit samai (brass lamp stand) under a kumkum bindi |
| `vitthal` | Tulsi vrindavan, then bhagwa dindi flag | Pair of taal (cymbals) | Vitthal's feet on the brick (वीट) with tulsi leaves |
| `balaji` | Shankh, then chakra | Namam (U-shaped tilak mark) | Namam between shankh and chakra |
| `khandoba` | Deepmal (lamp tower), then dhal (shield) | Bhandara bowl with turmeric heap | Sword and shield crossed over a turmeric heap |

Drawing rules, from A, unchanged:

- **Band unit:** 34 × 88, upright, two 44px slots, x = 0 at the paper edge. It is mirrored for the right band, so it carries no text and nothing whose handedness matters.
- **Tile:** one ink in a 44 × 44 box.
- **Logo:** drawn on the 280 × 100 canvas inside x 80–200, so it fits the figure slot.
- **Ink and colour:** `accent` / `accent2`, plus the existing leaf greens where natural. Light fills.
- **No sacred text in any band or tile.** The namam is a mark, not writing.
- **Peacock feathers stay Krishna's alone,** Vitthal included.
- **No band, tile or logo reuses another deity's motif.** Checked against all 14 deities:
  - Shiv Shakti's trishul, damru, rudraksha, bilva and crescent moon;
  - Ram's bow, crown and sun;
  - Lakshmi's lotus and coin;
  - Saraswati's veena, book and lotus bud;
  - Om's diya and lotus fan;
  - Ganesha's marigold and modak;
  - Hanuman's gada and mountain;
  - Krishna's feather, kadamba and butter pot.

  The design review table was corrected for this: Shiva's band uses the trinetra instead of the crescent moon; Durga's band uses the hibiscus instead of the khadga (which stays Khandoba's) and her logo uses the lion instead of the trishul; Ambabai's band uses the nath instead of the lotus bud and her logo uses the samai instead of a crown.

## Artwork (supplied by the owner)

Same requirements as A (transparent PNG, 600–1200px tall, ≤ 400 KB, figure
only: no text, signature or generator marks; rights to sell it on printed
products), saved as `public/deities/<motif>.png`:

| File | Figure |
|---|---|
| `mahadev.png` | Seated Shiva (the reference sheet's figure) |
| `durga.png` | Durga, ideally on her lion |
| `ambabai.png` | Kolhapur Ambabai |
| `vitthal.png` | Vitthal on the brick, hands on hips |
| `balaji.png` | Venkateshwara |
| `khandoba.png` | Khandoba, ideally with sword and horse |

## Files

| File | Change |
|---|---|
| `src/templates/motifs.ts` | Append the six keys to `MOTIFS`. |
| `src/templates/devotional-themes.ts` | Six `DEV_THEMES` rows (the `Record<Motif, DevTheme>` type forces all six). |
| `src/templates/ornaments.tsx` | A `DeityLogo`, `DeityBand` and `DeityTile` branch per new motif: 18 drawings. |
| `src/templates/catalog.ts` | Six rows in the devotional block: `layout: 'devotional'`, the motif, `PRICE.standard`, all three locales, `pages: 1`, a one-sentence blurb naming the band and tile. |
| `tests/catalog.test.ts` | Template count 20 → 26; devotional count and distinct deities 8 → 14. |
| `README.md` | Counts: 20 → 26 templates, 60 → 78 prerendered pages, and the test count. |

Nothing else changes. The gallery, editor, PDF, thumbnails and showcase all
read the catalogue.

## Verification

| Check | Proves |
|---|---|
| `npm test`, `npm run typecheck`, `npm run lint` | 26 templates, 14 distinct devotional deities, figure paths real, all six themes present. |
| `npm run build` | 78 template pages prerendered (26 × 3). |
| `npm run fit` | 74 template/language pairs fit (24 × 3 + 2). |
| `npm run proofs` | 26 PDFs; every devotional PDF has no raster image beyond its `<img>`s. |
| Screenshots of the six new sample sheets (`hi`) | Each band, tile and logo is drawn and reads as its deity; nothing touches the text. No automated check catches a missing ornament branch (it renders empty), so this is checked by eye. |
| `npm run thumbs` | 26 thumbnails for the gallery and 3D showcase. |

## Build order

One task per deity, in the order Shiva, Durga, Ambabai, Vitthal, Balaji,
Khandoba. Each task adds that deity's motif key, theme row, three drawings
and catalogue row together, bumps the counts in the test, then runs `npm
test`, `npm run fit`, `npm run proofs` and takes a screenshot. The site
works after every task. A final task updates the README and regenerates
proofs and thumbnails.

## Out of scope

- Pattern backgrounds (C) and new layouts (D).
- Translated template titles.
- The artwork itself.
- A separate "Maharashtra" collection filter.
