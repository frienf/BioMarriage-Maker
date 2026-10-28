# Devotional Deities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six devotional templates (Shiva, Durga, Ambabai, Vitthal, Tirupati Balaji, Khandoba) as rows on sub-project A's frame, taking the catalogue from 20 to 26 templates.

**Architecture:** Each deity is a motif key (`motifs.ts`), a theme row (`devotional-themes.ts`), three SVG drawings (`ornaments.tsx`: `DeityLogo`, `DeityBand`, `DeityTile` branches) and a catalogue row (`catalog.ts`). Nothing structural changes. The catalogue tests are generalised once, to "one devotional template per motif", so each deity task starts red by adding its key.

**Tech Stack:** Next 15 / React 19 / TypeScript, inline SVG, `node --test --experimental-strip-types` (imports `.ts`, not `.tsx`), Playwright scripts against the dev server.

**Spec:** `docs/superpowers/specs/2026-10-20-devotional-deities-design.md` (builds on `docs/superpowers/specs/2026-10-20-devotional-frames-design.md`)

## Global Constraints

- Drawings: band unit 34 × 88 upright (motif A centred at y = 22, motif B at y = 66, x = 0 is the paper edge, mirrored for the right band); tile one ink (`c`) in a 44 × 44 box; logo on the 280 × 100 canvas inside x 80–200.
- Drawings use only plain shapes (`path`, `circle`, `ellipse`, `rect`, `line`) with solid fills and opacity. No `<pattern>`, gradient, filter, mask or `<image>`: Chromium rasterises them in the PDF and `npm run proofs` fails.
- No sacred text in bands or tiles (the namam is a mark). No text at all in a band unit, because it is mirrored. Peacock feathers are Krishna's alone. No band, tile or logo reuses another deity's motif (the spec's checked list).
- Inks: the theme's `accent` / `accent2`, plus the existing `LEAF` green where natural. Light fills.
- Layouts are classic or split only. ₹49 (`PRICE.standard`), devotional collection, all three locales, `pages: 1`, `tileOpacity: 0.11`, no `figure`.
- Fonts come only from `templateFontClass` (all needed faces are already there). Never change a body font size; if a theme fails fit, set `runsLarge: true` first, then tell the owner.
- `fit`, `proofs`, `thumbs` need the dev server on :3000. Start it with the preview tool's `biodata` config. Stop it before `npm run build` (both use `.next`) and restart it after.
- Not a git repository: each "Checkpoint" is where a commit would go.

## Review Focus

1. **A Marathi-only glyph in an invocation** (ळ in "येळकोट", or a typo pasting a lookalike) must typeset, not print as a box. Owned by Task 1 (`every invocation typesets in the template faces`).
2. **A new heading face sets taller than A's** (Eczar 700, Tiro Marathi, Kurale, Martel 700) in Hindi or Marathi, so a full biodata must still fit. Owned by each deity task (fit runs every locale).
3. **A missing ornament branch renders empty** without any error. Owned by each deity task (DOM probe: the logo, the first band unit and the first tile each contain shapes).
4. **A drawing that rasterises** (a gradient, blur or pattern sneaking in) would print soft. Owned by each deity task (`npm run proofs` vector check).
5. **Home page copy still says "Twenty designs"** once 26 exist. Owned by Task 8 (copy uses `{count}`, plus a test).

---

### Task 1: Catalogue tests follow the motif list

**Files:**
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Produces: the tests every deity task relies on. Appending a key to `MOTIFS` without its catalogue row fails `npm test`; a theme invocation with an untypesettable character fails `npm test`.

- [ ] **Step 1: Replace** the tests `'the catalogue is the twenty templates the site advertises'` and `'every devotional template names a different deity'` with these. Import `unsupportedGlyphs` from `../src/lib/glyphs.ts`; `DEV_THEMES` and `MOTIFS` are already imported.

```ts
test('the catalogue is the twelve designs plus one devotional template per deity', () => {
  assert.equal(TEMPLATES.filter((t) => t.layout !== 'devotional').length, 12);
  const dev = TEMPLATES.filter((t) => t.collection === 'devotional');
  assert.ok(dev.every((t) => t.layout === 'devotional' && t.motif), 'a devotional template without a motif has no ornaments');
  assert.deepEqual(dev.map((t) => t.motif).sort(), [...MOTIFS].sort(), 'every deity has exactly one template');
});

test('every invocation typesets in the template faces', () => {
  for (const [motif, t] of Object.entries(DEV_THEMES)) assert.deepEqual(unsupportedGlyphs(t.invocation), [], motif);
});
```

- [ ] **Step 2: Run `npm test`.** Expected: PASS, 44 tests (two replaced, two added). This is a restatement of what the catalogue already is; its red comes in Task 2.
- [ ] **Step 3: Checkpoint.** Commit message: `test(catalog): one devotional template per motif; invocations typeset`.

### Per-deity procedure (Tasks 2–7)

Every deity task follows these steps with the values in its own task. The steps are written once here.

**Files (every deity task):** `src/templates/motifs.ts`, `src/templates/devotional-themes.ts`, `src/templates/ornaments.tsx`, `src/templates/catalog.ts`.

- [ ] **D1: Append the motif key** to the end of `MOTIFS` in `motifs.ts`.
- [ ] **D2: Run `npm test` and `npm run typecheck`.** Expected: `npm test` FAILs `every deity has exactly one template`, and typecheck FAILs because `DEV_THEMES` is missing the key.
- [ ] **D3: Add the theme row** to `DEV_THEMES` with the task's values, using the file's `SERIF` / `SANS` fallbacks after each `var(--font-…)`. `invFont` is the heading face. Set `tileOpacity: 0.11`; leave `figure`, `twoPage` and `runsLarge` unset.
- [ ] **D4: Draw the three branches** in `ornaments.tsx`: `DeityLogo` (fallback logo), `DeityBand` (motif A, then motif B, plus a small connector at y = 44 like the existing bands) and `DeityTile`, under the Global Constraints.
- [ ] **D5: Add the catalogue row** at the end of the devotional block in `catalog.ts`: `layout: 'devotional'`, the motif, `pricePaise: PRICE.standard`, `docLocales: ALL`, `pages: 1`, `collection: 'devotional'`, and the task's slug, title and blurb verbatim.
- [ ] **D6: Run `npm test`, `npm run typecheck` and `npm run lint`.** Expected: all PASS.
- [ ] **D7: Run `npm run fit`.** Expected: every pair passes, including `<slug>/en`, `<slug>/hi` and `<slug>/mr`. If the new slug fails, set `runsLarge: true` on its theme, re-run, and report it.
- [ ] **D8: Run `npm run proofs`.** Expected: exit 0, and no "Rasterised ornaments" line.
- [ ] **D9: Probe the DOM and look.** In the browser pane on `/print/sample/<slug>?lang=hi`, evaluate the expression below. Expected: all three counts are greater than 0. Then take a screenshot and confirm the logo, band and tile read as the task's motifs and nothing touches the text.

```js
const svgs = document.querySelectorAll('article svg');
const shapes = (el) => el ? el.querySelectorAll('path,circle,ellipse,rect,line').length : 0;
({ logo: shapes(document.querySelector('article header svg')),
   band: shapes(svgs[0].querySelector('svg g')),
   tile: shapes(svgs[0].querySelector('g[opacity] g')) })
```

- [ ] **D10: Checkpoint.** Commit message: `feat(devotional): <title> template`.

### Task 2: Shiva

| Field | Value |
|---|---|
| Motif key / slug / title | `mahadev` / `shiva` / `Shiva` |
| Layout | `classic` |
| accent / accent2 / ink / label / paper / tint | `#2F4A6B` / `#A07A3C` / `#141D29` / `#3A4A60` / `#FBFAF6` / `#E8EDF3` |
| head / headWeight / body | Eczar (`--font-eczar`), 700 / Hind (`--font-hind`) |
| invocation / invLang | `॥ हर हर महादेव ॥` / `hi` |
| Band A / B | Coiled naag / trinetra (the third eye: a vertical almond eye) |
| Tile | Nandi, seated, in profile |
| Logo | Shivling with three horizontal tripundra lines and a naag hood rising behind it |
| Blurb | A coiled naag and the third eye down both borders, with Nandi faintly behind the details. |

- [ ] Steps D1–D10.

### Task 3: Durga

| Field | Value |
|---|---|
| Motif key / slug / title | `durga` / `durga` / `Durga` |
| Layout | `split` |
| accent / accent2 / ink / label / paper / tint | `#B0202E` / `#2F7A3F` / `#2A0C10` / `#5E2A30` / `#FFFBF7` / `#FBE8EA` |
| head / headWeight / body | Rozha One (`--font-rozha`), 400 / Martel (`--font-martel`) |
| invocation / invLang | `॥ ॐ दुं दुर्गायै नमः ॥` / `sa` |
| Band A / B | Red hibiscus (five broad petals, long stamen) / ghanta (temple bell) |
| Tile | Navratri kalash: pot, five mango leaves, coconut on top |
| Logo | Her lion in profile under a tasselled chhatra (umbrella) |
| Blurb | Red hibiscus and the temple bell down both borders, with a Navratri kalash faintly behind the details. |

- [ ] Steps D1–D10.

### Task 4: Ambabai

| Field | Value |
|---|---|
| Motif key / slug / title | `ambabai` / `ambabai` / `Ambabai` |
| Layout | `split` |
| accent / accent2 / ink / label / paper / tint | `#1F6B45` / `#C9952C` / `#0F2A1C` / `#2F5240` / `#FDFCF6` / `#E6F1EA` |
| head / headWeight / body | Tiro Devanagari Marathi (`--font-tiro-mr`), 400 / Mukta (`--font-mukta`) |
| invocation / invLang | `॥ उदे गं अंबे उदे ॥` / `mr` |
| Band A / B | Stack of green bangles (four thin ellipses) / nath (Maharashtrian nose ring with pearls) |
| Tile | Kumkum karanda: round lidded box with a knob |
| Logo | A lit samai (tall brass lamp stand with a flame) under a kumkum bindi |
| Blurb | Green bangles and a nath down both borders, with a kumkum karanda faintly behind the details, in Kolhapur green and gold. |

- [ ] Steps D1–D10.

### Task 5: Vitthal

| Field | Value |
|---|---|
| Motif key / slug / title | `vitthal` / `vitthal` / `Vitthal` |
| Layout | `split` |
| accent / accent2 / ink / label / paper / tint | `#3B2F6B` / `#E07A1F` / `#1A1530` / `#463D6B` / `#FDFBF7` / `#EEEAF6` |
| head / headWeight / body | Kurale (`--font-kurale`), 400 / Mukta (`--font-mukta`) |
| invocation / invLang | `॥ जय जय राम कृष्ण हरी ॥` / `mr` |
| Band A / B | Tulsi vrindavan (planter with tulsi on top) / bhagwa dindi flag (triangular pennant on a staff) |
| Tile | Pair of taal (two small cymbals joined by a cord) |
| Logo | Vitthal's two feet on the brick (वीट: a plain rectangle, no letters), with tulsi leaves either side |
| Blurb | Tulsi vrindavan and the Varkari dindi flag down both borders, with taal faintly behind the details. |

- [ ] Steps D1–D10.

### Task 6: Tirupati Balaji

| Field | Value |
|---|---|
| Motif key / slug / title | `balaji` / `balaji` / `Tirupati Balaji` |
| Layout | `classic` |
| accent / accent2 / ink / label / paper / tint | `#6E1423` / `#D4A017` / `#2A0A10` / `#5A2A33` / `#FFFCF5` / `#F8E9E6` |
| head / headWeight / body | Martel (`--font-martel`), 700 / Hind (`--font-hind`) |
| invocation / invLang | `॥ ॐ नमो वेंकटेशाय ॥` / `sa` |
| Band A / B | Shankh (conch) / chakra (spoked disc) |
| Tile | Namam: a broad U, with a narrow upright line in the centre |
| Logo | Namam (accent2 U, accent centre line) between a shankh and a chakra |
| Blurb | Shankh and chakra down both borders, with the namam faintly behind the details. |

- [ ] Steps D1–D10.

### Task 7: Khandoba

| Field | Value |
|---|---|
| Motif key / slug / title | `khandoba` / `khandoba` / `Khandoba` |
| Layout | `classic` |
| accent / accent2 / ink / label / paper / tint | `#7B2D26` / `#E8B21A` / `#2A110E` / `#5A3029` / `#FFFCF3` / `#FCF0D2` |
| head / headWeight / body | Khand (`--font-khand`), 600 / Hind (`--font-hind`) |
| invocation / invLang | `॥ येळकोट येळकोट जय मल्हार ॥` / `mr` |
| Band A / B | Deepmal (tapering lamp tower with lamp ledges) / dhal (round shield with four bosses) |
| Tile | Bhandara bowl: shallow bowl with a heaped turmeric mound |
| Logo | Sword and dhal crossed over a turmeric heap |
| Blurb | The Jejuri deepmal and Khandoba's shield down both borders, with bhandara faintly behind the details. |

- [ ] Steps D1–D10.

### Task 8: Count-free copy, README and release checks

**Files:**
- Modify: `src/i18n/messages/en.json`, `hi.json`, `mr.json` (`home.how1Body`)
- Modify: `src/app/[locale]/page.tsx` (the `how${n}Body` call)
- Modify: `README.md`
- Test: `tests/messages.test.ts`
- Regenerated: `proofs/*.pdf`, `public/brand/thumbs/*.png`

**Interfaces:**
- Consumes: all six deities (Tasks 2–7).

- [ ] **Step 1: Write the failing test** in `tests/messages.test.ts`, using that file's existing `load(locale)` helper:

```ts
test('the home page counts templates from the catalogue, never in words', () => {
  for (const l of ['en', 'hi', 'mr']) {
    assert.match(load(l).home.how1Body, /\{count\}/, `${l} hard-codes the number of designs`);
  }
});
```

- [ ] **Step 2: Run `npm test`.** Expected: FAIL with "en hard-codes the number of designs".
- [ ] **Step 3: Make the copy count-free.** `how1Body` starts with `{count} designs, from…` (en), `{count} डिज़ाइन: …` (hi) and `{count} रचना: …` (mr), with the rest of each sentence unchanged. In `page.tsx`, the call becomes `t(\`how${n}Body\` as 'how1Body', { count: TEMPLATES.length })`.
- [ ] **Step 4: Run `npm test`.** Expected: PASS, including the translation-parity tests.
- [ ] **Step 5: Update the README.** Change 20 → 26 templates, "60 template pages prerendered (20 × 3 locales)" → "78 … (26 × 3 locales)", "Prints all 20 templates" → "Prints all 26 templates", and set the unit test count to the new total.
- [ ] **Step 6: Run the release checks.**
  - `npm test`, `npm run typecheck`, `npm run lint`: clean.
  - Stop the dev server, run `npm run build` (expected: clean, and 78 template HTML files across `.next/server/app/{en,hi,mr}/templates`), then restart the dev server.
  - `npm run fit`: 74 `ok` lines, exit 0.
  - `npm run proofs`: 26 of 26, no "Rasterised" line.
  - `npm run thumbs`: 26 of 26.
- [ ] **Step 7: Look at the gallery.** On `/en/templates`, the devotional filter shows 14 cards, each with its own band. The home page reads "26 designs".
- [ ] **Step 8: Checkpoint and handoff.** Commit message: `feat(devotional): six new deities; count-free home copy`. Give the owner the spec's artwork table (six PNGs, A's format) and the invocations to confirm.
