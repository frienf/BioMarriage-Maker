# Devotional Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the 8 devotional templates motif side bands, corner rosettes, a tiled watermark and a 140 × 120 figure slot (owner PNG, or the SVG logo as a fallback), while still fitting a full biodata in every language.

**Architecture:** One absolutely positioned SVG layer in `DevotionalTemplate` draws the tiles, rules, bands (SVG `<pattern>`) and rosettes. The per-deity drawings live in `ornaments.tsx`. The frame numbers live in a pure `devotional-frame.ts`, so `node --test` can check that ornaments never enter the text box. `PrintReady` waits for every image as well as for fonts.

**Tech Stack:** Next 15 / React 19 / TypeScript, inline SVG, `node --test --experimental-strip-types` (can import `.ts`, not `.tsx`), Playwright scripts against the dev server.

**Spec:** `docs/superpowers/specs/2026-10-20-devotional-frames-design.md`

## Global Constraints

- A4 sheet is 794 × 1123 CSS px. Outer rule: inset 20px, 3px, `accent`. Top and bottom inner rules: inset 28px, 1px, `accent2`, running x 28 → 766.
- Side bands: 34px deep (x 20–54 and 740–774), with a 1px `accent2` line at their inner edges. Text box horizontal padding: **70px**.
- Figure slot: **140 × 120**, centred, top at y = 26, top rules cut behind it. Image `object-fit: contain`.
- Tiles: one roughly 44px symbol per cell, 150px half-drop grid, from y = 150 to 1095, between x = 54 and 740. `tileOpacity` 0.11 for all themes except **0.14 for Saraswati**.
- Symbols only in bands and tiles: no sacred text. Peacock feathers on Krishna only. Krishna's feather and flute are never crossed. Ganesha is vamamukhi.
- Body text never smaller than today: 15.5px (14.5px centered, minus 0.8px when `runsLarge`). A theme that can't fit becomes `twoPage`.
- Catalogue rows, slugs and prices are unchanged. No new dependencies.
- `fit`, `proofs`, `thumbs` and `e2e` need the dev server on :3000. Start it with the preview tool's `biodata` config, not a raw shell.
- The project is **not a git repository**. Each "Checkpoint" step is where a commit would go. If git is initialised before execution, commit there with the message given.

## Review Focus

1. **A full Hindi or Marathi biodata on a narrower text column**: Devanagari sets taller, so it must still fit. Owned by Task 2 (fit checks every locale) and Task 4 (tightening).
2. **Several devotional sheets on one page** (gallery, two-page print, a sheet inside a hidden container): each sheet must keep its own bands and tiles, so pattern ids are unique per instance. Owned by Task 3 (`frameIds` test).
3. **Ornaments overlapping text**, today's Hanuman bug: rosettes and bands must stay out of the text box. Owned by Task 3 (geometry test).
4. **Ganesh Mangal's page 2 is off-screen** when Chromium prints, so its figure must still load. Never use `loading="lazy"`. Owned by Task 6 (two-page proof with a stand-in PNG).
5. **A figure path that 404s** in a paid render must fail the render, never ship a blank slot. Owned by Task 1 (`decode()` gate) and Task 6 (missing-file probe).

---

### Task 1: PrintReady waits for images

**Files:**
- Modify: `src/app/print/[token]/print-ready.tsx`

**Interfaces:**
- Produces: `data-print-ready="true"` only after fonts **and** every `<img>` on the page have decoded. If an image fails, it stays `"false"`, and `renderOrderPdf` (`src/lib/pdf.ts`) times out and throws through its existing 15s `waitForSelector`.

- [ ] **Step 1: Change the effect** so that `done` runs after `document.fonts.ready` and then `Promise.all([...document.images].map((img) => img.decode()))`. On rejection, do **not** call `done`. Update the doc comment: an image that never decodes must fail the render rather than print a blank.
- [ ] **Step 2: Verify the happy path.** With the dev server up, run `npm run fit`. Expected: every template still reaches ready and prints its height line, with no timeout. (No PNG figures exist yet; this proves nothing regressed.) The missing-image path is probed end to end in Task 6, Step 3.
- [ ] **Step 3: Checkpoint.** `npm run typecheck && npm run lint` are clean. Commit message: `fix(print): wait for images before marking the page printable`.

### Task 2: Fit check measures every language

**Files:**
- Modify: `scripts/fit-check.ts`

**Interfaces:**
- Produces: one line per `(slug, locale)` pair, printed as `${slug}/${lang}`. Exits 1 if any pair overflows by more than 2px.

- [ ] **Step 1: Loop over `tpl.docLocales`** instead of `tpl.docLocales[0]`, keeping the rest of the measurement unchanged.
- [ ] **Step 2: Run `npm run fit` and record the baseline.** Expected: all devotional pairs pass, since nothing visual has changed yet. **If any non-devotional template fails in `hi` or `mr`, stop and report it to the owner.** That's a pre-existing overflow, outside this spec, and the owner decides whether to fix it first.
- [ ] **Step 3: Checkpoint.** Commit message: `test(fit): measure every document language, not just the first`.

### Task 3: Frame geometry and pattern ids

**Files:**
- Create: `src/templates/devotional-frame.ts`
- Test: `tests/devotional-frame.test.ts`

**Interfaces:**
- Produces:
  - `FRAME = { outer: 20, inner: 28, band: 34, bandUnit: 44, padX: 70, rosetteR: 21, figure: { w: 140, h: 120, top: 26 }, tile: { cell: 150, size: 44, top: 150, bottom: 1095 } } as const`
  - `frameIds(instanceId: string, motif: Motif): { band: string; tile: string }`

- [ ] **Step 1: Write the failing tests** in `tests/devotional-frame.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAME, frameIds } from '../src/templates/devotional-frame.ts';

const A4_W = 794; // matches A4.w in src/templates/render.tsx

test('bands and rosettes stay out of the text box', () => {
  assert.ok(FRAME.outer + FRAME.band < FRAME.padX, 'a band would run under the text');
  assert.ok(FRAME.outer + FRAME.band / 2 + FRAME.rosetteR < FRAME.padX, 'a rosette would sit on a row label');
});

test('tiles start below the figure, so none show through a transparent PNG', () => {
  assert.ok(FRAME.tile.top >= FRAME.figure.top + FRAME.figure.h);
});

test('the figure slot is narrower than the text box', () => {
  assert.ok(FRAME.figure.w < A4_W - 2 * FRAME.padX);
});

test('pattern ids differ per sheet and per layer, and are valid url(#) targets', () => {
  const a = frameIds('card-lakshmi', 'lakshmi');
  const b = frameIds('print-2', 'lakshmi');
  assert.notEqual(a.band, b.band);
  assert.notEqual(a.band, a.tile);
  for (const id of [a.band, a.tile, b.band, b.tile]) assert.match(id, /^[A-Za-z][\w-]*$/);
});
```

- [ ] **Step 2: Run `npm test`.** Expected: FAIL, with module `devotional-frame.ts` not found.
- [ ] **Step 3: Create `src/templates/devotional-frame.ts`** with `FRAME` exactly as in Interfaces, plus `frameIds`, which returns `dev-band-${motif}-${safe}` and `dev-tile-${motif}-${safe}`, where `safe` is `instanceId` with every character outside `[\w-]` replaced by `-`. Import `Motif` from `./motifs.ts`. A short comment on `FRAME` names the spec as its source.
- [ ] **Step 4: Run `npm test`.** Expected: PASS, including all existing tests.
- [ ] **Step 5: Checkpoint.** Commit message: `feat(devotional): frame geometry and per-sheet pattern ids`.

### Task 4: Side bands, rosettes and figure slot, fitted

**Files:**
- Modify: `src/templates/ornaments.tsx` (add `DeityBand`, `Rosette`; delete `DeityCorner` and its now-unused helpers; change `DeityLogo`'s viewBox)
- Modify: `src/templates/devotional.tsx`
- Modify: `src/templates/render.tsx` (the `case 'devotional'` line: pass `instanceId`)
- Modify: `README.md` (Ornaments bullet)

**Interfaces:**
- Consumes: `FRAME`, `frameIds` (Task 3).
- Produces:
  - `DeityBand({ motif, c, c2 }: Ink & { motif: Motif })` returns a `<g>` (not an `<svg>`) for **one repeat unit, `FRAME.bandUnit` (44) wide by `FRAME.band` (34) deep**, in band-local coordinates: y = 0 at the paper edge, +y inward.
  - `Rosette({ cx, cy, r, c, c2, paper }: { cx: number; cy: number; r: number; c: string; c2: string; paper: string })` returns a `<g>`: a paper-filled disc of radius `r`, eight ellipse petals (centre `cy − 0.55r`, rx `0.22r`, ry `0.45r`, `c` at 0.8 opacity, rotated in 45° steps), and a `c2` centre of radius `0.28r`.
  - `DevotionalTemplate` gains `instanceId?: string` (default `'d'`).
  - `DeityLogo` now fills its container: `viewBox="80 0 120 100"`, `width="100%"`, `height="100%"`.

- [ ] **Step 1: Draw `DeityBand` for all 8 motifs**, using the units from the spec's "Motifs per deity" table: marigold on a vine plus modak; bow plus crown; trishul, damru and rudraksha; lotus plus coin; gada plus mountain; veena, book and lotus bud; single feather plus kadamba; lotus fan plus bead. Use `c` and `c2` (plus the existing Krishna and Saraswati leaf greens), light fills, and draw everything inside the 44 × 34 unit so adjacent units don't overlap.
- [ ] **Step 2: Add `Rosette`, delete `DeityCorner`, and delete any constants only it used** (`BEADS_CORNER`, `GARLAND`, `SUN_TICKS`, `LOTUS_FAN`, `LOTUS_FAN_INNER`: check each with Grep before removing). Keep the audit notes at the top of the file and update its first line to "Deity logos, band units, tile symbols and rosettes".
- [ ] **Step 3: Replace the frame in `DevotionalTemplate`.** Remove the two border `<div>`s and the four `DeityCorner` `<div>`s. Add one `<svg aria-hidden="true" width={794} height={1123} style={{ position: 'absolute', inset: 0 }}>`. Draw order: (tiles, added in Task 5), rules, bands, rosettes, so the rosettes' paper discs cover the rule corners.
  - `<defs><pattern id={ids.band} width={FRAME.bandUnit} height={FRAME.band} patternUnits="userSpaceOnUse">` wrapping `<DeityBand/>`.
  - The outer rule, with a gap of `FRAME.figure.w + 20` centred at the top. The top and bottom inner rules at `FRAME.inner`, the top one with the same gap. The two vertical `accent2` lines at x = 54 and 740.
  - The bands (this is the part the signature doesn't determine):

```tsx
const H = 1123, W = 794, o = FRAME.outer, d = FRAME.band, run = H - 2 * o - 2 * d;
// Left: local x runs up the page, local y runs inward (rightwards).
<g transform={`translate(${o} ${H - o}) rotate(-90)`}><rect x={d} width={run} height={d} fill={`url(#${ids.band})`} /></g>
// Right: local x runs down the page, local y runs inward (leftwards).
<g transform={`translate(${W - o} ${o}) rotate(90)`}><rect x={d} width={run} height={d} fill={`url(#${ids.band})`} /></g>
```

  - Four `Rosette`s centred at `(o + d/2, o + d/2)` and their mirrors, `r = FRAME.rosetteR`, `paper = t.paper`.
- [ ] **Step 4: Replace the header** with a `FRAME.figure.w × FRAME.figure.h` box holding `<DeityLogo>`, then the invocation line 4px below it. The content wrapper's padding becomes `${FRAME.figure.top}px ${FRAME.padX}px 32px`. Apply the same header to page 2.
- [ ] **Step 5: Pass `instanceId` from `TemplateSheet`** (`render.tsx`) into `DevotionalTemplate`, and build `ids` with `frameIds(instanceId, motif)`.
- [ ] **Step 6: Run `npm run fit`.** Expected: some devotional pairs FAIL (overflow), because the narrower column and taller header aren't paid for yet.
- [ ] **Step 7: Tighten, in this order, re-running `npm run fit` after each, and stop when all pass:**
  1. Content stack `gap` 10 → 6 (and the split right column 12 → 8).
  2. `Heading` margin `0 0 3px` → `0 0 1px`.
  3. `lineHeight` 1.4 → 1.36 for classic and split.
  4. Invocation spacing under the figure 4px → 0.

  Never change a font size. If a theme still fails, set `twoPage: true` on it, set `pages: 2` on its catalogue row, add its slug to the two-page test in `tests/catalog.test.ts`, and tell the owner.
- [ ] **Step 8: Check visually.** Open `/print/sample/<slug>?lang=hi` for each of the 8 devotional slugs and take a screenshot of each. Confirm: no logo clipped by the new viewBox (if one is, widen it to `70 0 140 100` and re-run fit), the bands read as their deity, nothing overlaps text, and Ganesh Mangal page 2 matches page 1.
- [ ] **Step 9: Update the README** Ornaments bullet: "Eight deity logos, side-band units, tile symbols and corner rosettes".
- [ ] **Step 10: Checkpoint.** `npm test && npm run typecheck && npm run lint` clean, and `npm run fit` passes. Commit message: `feat(devotional): motif side bands, rosettes and figure slot`.

### Task 5: Tiled watermark

**Files:**
- Modify: `src/templates/ornaments.tsx` (add `DeityTile`; delete `DeityWatermark` and constants only it used)
- Modify: `src/templates/devotional-themes.ts` (`wmOpacity` → `tileOpacity`; delete `WM_POSITION`)
- Modify: `src/templates/devotional.tsx`

**Interfaces:**
- Consumes: `FRAME.tile`, `frameIds(...).tile` (Task 3), and the frame SVG (Task 4).
- Produces:
  - `DeityTile({ motif, c, c2 }: Ink & { motif: Motif })` returns a `<g>` symbol drawn in a **44 × 44** box.
  - `DevTheme.tileOpacity: number`: 0.11 for all themes, 0.14 for `saraswati`.

- [ ] **Step 1: Draw `DeityTile` for all 8:** modak, sun disc with rays, bilva (three leaves), lotus, gada, open book, butter pot, diya. One colour (`c`) is enough, since opacity does the rest.
- [ ] **Step 2: Delete `DeityWatermark` and any constants only it used** (e.g. `RAM_RAYS`, `KRISHNA_WM_BARBS`, `CHARAN`, `COINS`, `KADAMBA`, `DOTS24`, `BEADS36`: check each with Grep first). Keep the comment that Ram's watermark is not repeated "राम" text, reworded for tiles.
- [ ] **Step 3: Replace `wmOpacity` with `tileOpacity` in `devotional-themes.ts`, and delete `WM_POSITION`.** Rewrite the header note: tiles start at 0.11 (Saraswati 0.14 because yellow prints faint), the final values come from the owner's inkjet test print, and they must not be lowered without one.
- [ ] **Step 4: Add the tile layer** as the first thing drawn in the frame SVG. A `<pattern id={ids.tile} width={FRAME.tile.cell} height={FRAME.tile.cell} patternUnits="userSpaceOnUse">` places `<DeityTile/>` centred at `(cell/4, cell/4)` and `(3·cell/4, 3·cell/4)`, which makes the half-drop. Fill a `<rect>` with x 54 → 740 and y `FRAME.tile.top` → `FRAME.tile.bottom`, with `opacity={t.tileOpacity}`. Remove the old watermark `<div>`.
- [ ] **Step 5: Run `npm run fit`** (expected: unchanged, all pass), then take screenshots of the 8 sample pages. Confirm the tiles stay out of the bands, start below the figure, and every row is still readable.
- [ ] **Step 6: Checkpoint.** `npm test && npm run typecheck && npm run lint` clean. Commit message: `feat(devotional): tiled symbol watermark replaces the single mark`.

### Task 6: Figure artwork slot

**Files:**
- Modify: `src/templates/devotional-themes.ts` (add `figure?: string`)
- Modify: `src/templates/devotional.tsx` (PNG branch in the figure box)
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: the figure box from Task 4.
- Produces: `DevTheme.figure?: string`, a public path equal to `/deities/<motif>.png`. When it's set, the box shows the PNG; otherwise it shows `DeityLogo`.

- [ ] **Step 1: Write the failing tests** (add to `tests/catalog.test.ts`, importing `DEV_THEMES` from `../src/templates/devotional-themes.ts` and `existsSync` from `node:fs`):

```ts
test('every deity figure a theme names is a real file under public/deities', () => {
  for (const [motif, t] of Object.entries(DEV_THEMES)) {
    if (!t.figure) continue;
    assert.equal(t.figure, `/deities/${motif}.png`);
    assert.ok(existsSync(new URL(`../public${t.figure}`, import.meta.url)), `${motif}: ${t.figure} is missing`);
  }
});

test('Om Shanti has no figure: its slot keeps the ॐ', () => {
  assert.equal(DEV_THEMES.om.figure, undefined);
});
```

- [ ] **Step 2: Add `figure?: string` to `DevTheme`, set `figure: '/deities/lakshmi.png'` on `lakshmi` temporarily, and run `npm test`.** Expected: FAIL with "lakshmi: /deities/lakshmi.png is missing".
- [ ] **Step 3: Render the PNG branch.** In the figure box, when `t.figure` is set, render `<img src={t.figure} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />` with the same `eslint-disable-next-line @next/next/no-img-element` comment `Photo` uses. Add a comment: never `loading="lazy"`, because page 2 is off-screen when Chromium prints and would never decode.
- [ ] **Step 4: Probe a missing file in a render.** With the temporary Lakshmi value still set, load `/print/sample/lakshmi` in the browser pane, wait 5s, and read `document.querySelector('[data-print-ready]').dataset.printReady`. Expected: `"false"`, so a paid render would time out instead of printing a blank. Then remove the temporary `figure`. `npm test` now passes.
- [ ] **Step 5: Test the two-page case with a stand-in.** Copy `public/brand/thumbs/ganesh-mangal.png` to `public/deities/ganesh.png` and set `figure: '/deities/ganesh.png'` on `ganesh`. Run `npm test` (expected: PASS), then `npm run proofs`. Expected: `proofs/ganesh-mangal.pdf` is produced without a timeout and shows the stand-in on **both** pages. Then delete the stand-in file and the `figure` line.
- [ ] **Step 6: Checkpoint.** `npm test && npm run typecheck && npm run lint` clean. Commit message: `feat(devotional): owner figure artwork slot with SVG fallback`.

### Task 7: Release checks and owner handoff

**Files:**
- Modify: `README.md` (unit-test count in the Checks table)
- Regenerated: `proofs/*.pdf`, `public/brand/thumbs/*.png`

- [ ] **Step 1: Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build`.** Expected: all clean, and the build still prerenders 60 template pages. Update the README's "33 unit tests" to the new count.
- [ ] **Step 2: Run `npm run fit`, `npm run proofs` and `npm run thumbs`** (dev server up). Expected: fit passes for every pair; 20 PDFs and 20 PNGs are written. Open the 8 devotional PDFs and check them against the spec's motif table.
- [ ] **Step 3: Run `npm run e2e`** with Docker Postgres up (`docker compose up -d postgres`, then `npm run db:push`; it needs `.env.local`). Expected: a paid order renders its PDF. If Docker or `.env.local` isn't available, say so; don't skip silently.
- [ ] **Step 4: Hand off to the owner.** Ask for one home-inkjet print of `proofs/lakshmi.pdf`, `proofs/saraswati.pdf` and `proofs/murli-manohar.pdf`, with one question for each: "Can you see the tiles, and does any row get harder to read?" Set each theme's `tileOpacity` from the answer (the floor is whatever is still visible on paper), then re-run `npm run proofs`.
- [ ] **Step 5: Hand the art spec to the owner** (the spec's "Figure artwork" table). When a PNG arrives: save it to `public/deities/<motif>.png`, set `figure` on the theme, run `npm test`, `npm run fit`, `npm run proofs` and `npm run thumbs`, and retune that theme's `accent`/`accent2` if the art clashes.
