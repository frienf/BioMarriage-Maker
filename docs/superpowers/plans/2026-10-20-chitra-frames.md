# Chitra Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 14 templates whose page is the owner's own design image, with only the biodata text and photo laid over it, taking the catalogue from 26 to 40.

**Architecture:** A prep script turns each source image into an A4 print copy, kept outside `public/`, and a 600px preview copy in `public/frames/`. A new layout kind `chitra` renders the image full-sheet, places the photo in the image's own slot, and flows the text inside the article's padding. Overflow therefore shows up in `article.scrollHeight`, which every existing guard already measures. One data row per frame; the print pages embed the print copy as a data URI.

**Tech Stack:** Next.js 15 / React 19, TypeScript run by `node --experimental-strip-types`, `node:test`, sharp (already in `node_modules`), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-20-chitra-frames-design.md`. It is the source of truth for colours, slugs, sources, motifs, photo shapes and blurbs; tasks cite it rather than repeat it.

## Global Constraints

- The sheet is 794 × 1123 CSS px. The print copy is 1240 × 1754 (A4 at 150 dpi); the preview copy is 600px wide. Print px → sheet px: divide by 1240/794 (1.5617) and round.
- Body text is 13.5–14.5px, and 13px only where `npm run fit` shows it is needed. Headings 16px; name 28px; invocation and kicker 13px; subtitle 14px; line height 1.32; column gap 24px; row grid `40% 8px minmax(0, 1fr)`; slot spacer clearance 16px.
- **Stop rule:** if a frame cannot fit a full biodata at 13px in en, hi and mr, stop and report it to the owner. Never go below 13px, and never crop the art.
- Colours (`paper`, `accent`, `rule`, `ink`) are copied verbatim from the spec's table. `accent` and `ink` must reach 4.5:1 against `paper`.
- No fonts are added. Heading face, body face, `headWeight`, `invocation`, `invLang` and `invFont` come from `DEV_THEMES[frame.motif]`.
- Every chitra catalogue row uses `collection: 'devotional'`, `layout: 'chitra'`, `pricePaise: PRICE.standard`, `docLocales: ALL`, `pages: 1`, an English title, and the blurb copied verbatim from the spec.
- Any file a test imports (`catalog.ts`, `chitra-frames.ts`, `chitra-art.ts`) uses relative imports with a `.ts` extension, with no `@/` alias and no JSX.
- The frame and photo `<img>` never use `loading="lazy"`.
- Never run `next build` in place while the dev server on :3000 is running; build in a scratchpad copy of the project.
- This folder is not a git repository. Each task ends at its checks; do not run `git init` without asking.

## Review Focus

1. **A long "about" that runs past the bottom of the text box** must make `article.scrollHeight` exceed 1125, so the editor warns, the review page blocks payment and fit fails. Pinned by check (a) in `frame-check.ts`, Task 2.
2. **A long unbroken value** (an email address, a pasted URL) in a ~170px value column must wrap, not spill into the other column or the border art. Use `overflow-wrap: anywhere` on values. Pinned by check (b), Task 2.
3. **A long name that wraps to two or more lines** must push the body down and never run under the photo. On Ekadanta the name plate must grow with it. Pinned by check (c) in Task 2 and the plate check in Task 4.
4. **A photo of any aspect ratio** must stay inside the opening with the drawn moulding visible. Pinned by the `?photo=1` landscape test photo in every side-by-side.
5. **A missing print copy at request time** (folder not deployed, or a typo in a slug) must make the print page fail, never print a blank frame. `frameDataUri` also must not read files for slugs that aren't frames. Pinned by the `frameDataUri` unit test, Task 2.

---

### Task 1: Prepare the 14 frame images

**Files:**
- Create: `scripts/prepare-frames.ts`
- Modify: `package.json`: add `"frames": "node --experimental-strip-types scripts/prepare-frames.ts"`, and add `sharp` to `devDependencies` at the version already installed (`npm ls sharp`), so the script no longer relies on a transitive install.
- Generated: `assets/frames/<slug>.jpg` ×14 and `public/frames/<slug>.jpg` ×14

**Interfaces:**
- Produces: `assets/frames/<slug>.jpg` (1240 × 1754, JPEG q90) and `public/frames/<slug>.jpg` (600px wide, JPEG q80) for the 14 spec slugs. Later tasks read them by slug only.

- [ ] **Step 1: Write `scripts/prepare-frames.ts`**

Types and table, all in source px:

```ts
type Box = { x: number; y: number; w: number; h: number };
type Prep = {
  src: string;              // file name in Design Template/
  crop?: Box;               // to the paper; only the three backdrop images
  sparkle?: Box | false;    // default { x: W - 96, y: H - 96, w: 80, h: 80 } when no crop; false skips
  fills?: Array<Box & { colour: string }>;
};
const FRAMES: Record<string, Prep> = { /* 14 entries, slug → Prep, sources from the spec table */ };
```

Per frame, in this order:
1. Sparkle repair: extract the mirror box `{ left: W - x - w, top: y, width: w, height: h }`, `.flop()` it, and composite it at `{ left: x, top: y }`.
2. Fills: composite `{ create: { width, height, channels: 3, background: colour } }` at each box.
3. Materialise with `.toBuffer()`, then `extract(crop)` if set. Composite and extract are separate pipelines because sharp extracts before it composites.
4. Padding colour: the mean of the four corner pixels (raw buffer) of the result.
5. `resize(1240, 1754, { fit: 'contain', background, kernel: 'lanczos3' }).jpeg({ quality: 90 })` → `assets/frames/<slug>.jpg`.
6. Resize that file to width 600, `.jpeg({ quality: 80 })` → `public/frames/<slug>.jpg`.

Create both folders if they are missing. Print one line per slug.

Starting estimates (measure exactly on 4× crops before trusting them):
- Gajalakshmi crop ≈ x 52–845, y 48–1150.
- Dhanu ≈ x 42–825, y 58–1180.
- Govind ≈ x 90–806, y 90–1110.
- Ekadanta fill: the white bar ≈ x 95–478, y 375–430, colour `#F9F9F5`.

- [ ] **Step 2: Run it**

Run: `npm run frames`
Expected: 14 lines, no errors.

- [ ] **Step 3: Verify sizes**

Run: `node -e "const s=require('sharp'),fs=require('fs');(async()=>{for(const f of fs.readdirSync('assets/frames')){const a=await s('assets/frames/'+f).metadata(),b=await s('public/frames/'+f).metadata();console.log(f,a.width+'x'+a.height,b.width)}})()"`
Expected: 14 rows, each `1240x1754 600`.

- [ ] **Step 4: Check each print copy against its source by eye**

For each slug, compose source and print copy side by side at the same height, in the scratchpad, and read the result. Expected:
- the sparkle is gone with no visible seam;
- the three backdrop images are cropped to the paper with no grey edge left;
- the padding is not noticeable;
- nothing is stretched (circles stay round);
- Ekadanta's bar is gone.

Fix any problem in that frame's `Prep` entry and rerun.

---

### Task 2: The chitra layout, on Vinayak

**Files:**
- Create: `src/templates/chitra-frames.ts`, `src/templates/chitra.tsx`, `src/templates/chitra-art.ts`, `scripts/frame-check.ts`, `tests/chitra-frames.test.ts`
- Modify: `src/templates/catalog.ts` (LayoutKind, SWATCHES, one row), `src/templates/render.tsx`, `src/app/print/[token]/page.tsx`, `src/app/print/sample/[slug]/page.tsx`, `scripts/proof-sheet.ts:48-53`, `tests/catalog.test.ts:9-14,26-32`, `package.json`

**Interfaces:**
- Consumes: Task 1's image files.
- Produces:
  - `chitra-frames.ts`:
    ```ts
    export const SHEET = { w: 794, h: 1123 } as const;
    export type SlotShape = 'rect' | 'oval' | 'path';
    export type ChitraFrame = {
      motif: Motif;
      paper: string; accent: string; rule: string; ink: string;
      text: { top: number; right: number; bottom: number; left: number };
      slot: { x: number; y: number; w: number; h: number; shape: SlotShape; radius?: number; path?: string };
      size: number;
      plate?: { w: number; h: number; fill: string };
    };
    export const CHITRA_FRAMES: Record<string, ChitraFrame>;
    export function slotSpacer(f: ChitraFrame): { w: number; h: number } | null;
    ```
  - `chitra-art.ts`: `export async function frameDataUri(slug: string): Promise<string>`
  - `chitra.tsx`: `export function ChitraTemplate({ data, slug, frameSrc }: { data: Biodata; slug: string; frameSrc?: string })`
  - `TemplateSheet` gains an optional `frameSrc?: string` prop.
  - DOM hooks for checks: `data-chitra-head`, `data-chitra-body`, `data-chitra-value` (each value cell), `data-chitra-photo` (the photo box), `data-chitra-plate` (Task 4). The name is the only `<h1>`.
  - The sample print route accepts `?photo=1`.
  - `npm run frames:check [slug…]`.

- [ ] **Step 1: Write the failing tests**

`tests/chitra-frames.test.ts` (`node:test`, `node:assert/strict`, sharp, paths via `new URL('../…', import.meta.url)`). Define a local `contrast(a, b)` using the WCAG relative-luminance formula.

```ts
test('every frame has a 1240 × 1754 print copy and a 600px preview copy', async () => { /* per slug: widths/heights via sharp metadata */ });
test('slot and text box lie inside the sheet', () => {
  // per frame: all text insets >= 0; text.left + text.right <= SHEET.w - 400; text.top + text.bottom <= SHEET.h - 400;
  // slot.x >= 0, slot.y >= 0, slot.x + slot.w <= SHEET.w, slot.y + slot.h <= SHEET.h
});
test('a slot that reaches into the text box is deep enough to beside-set the head, and leaves it 300px', () => {
  // s = slotSpacer(f); if s: assert s.h >= 60 and f.slot.x - 16 - f.text.left >= 300
});
test('accent and ink reach 4.5:1 against the paper', () => { /* contrast(f.paper, f.accent) >= 4.5, same for ink */ });
test('only a path slot carries a path', () => { /* (shape === 'path') === Boolean(path) */ });
test('body size stays between 13 and 14.5px', () => { /* 13 <= size <= 14.5 */ });
test('the print copy is read only for a known frame', async () => {
  assert.match(await frameDataUri('vinayak'), /^data:image\/jpeg;base64,/);
  await assert.rejects(frameDataUri('../../package'));
  await assert.rejects(frameDataUri('no-such-frame'));
});
```

`tests/catalog.test.ts`. Replace the first test and widen the accent skip:

```ts
test('the catalogue is the twelve designs, one devotional template per deity, and one chitra template per frame', () => {
  assert.equal(TEMPLATES.filter((t) => t.collection !== 'devotional').length, 12);
  const dev = TEMPLATES.filter((t) => t.layout === 'devotional');
  assert.ok(dev.every((t) => t.collection === 'devotional' && t.motif), 'a devotional template without a motif has no ornaments');
  assert.deepEqual(dev.map((t) => t.motif).sort(), [...MOTIFS].sort(), 'every deity has exactly one devotional-layout template');
  const chitra = TEMPLATES.filter((t) => t.layout === 'chitra');
  assert.ok(chitra.every((t) => t.collection === 'devotional'));
  assert.deepEqual(chitra.map((t) => t.slug).sort(), Object.keys(CHITRA_FRAMES).sort(), 'every frame has exactly one template');
  assert.equal(TEMPLATES.length, 26 + chitra.length);
});
// accent test: `if (t.layout === 'devotional' || t.layout === 'chitra') continue;`
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL, because `chitra-frames.ts` and `chitra-art.ts` cannot be found.

- [ ] **Step 3: Implement `chitra-frames.ts`**

Types as in Interfaces; `import type { Motif } from './motifs.ts'`. Add one row, `vinayak`, with `motif: 'ganesh'` and the spec's colours. Measure `text` and `slot` on 4× crops of `assets/frames/vinayak.jpg`, converted to sheet px:
- `slot` is the inner edge of the drawn photo frame;
- text sides sit 14px inside the border art's inner edge;
- text top sits 10px below the emblem's lowest painted pixel. If the slot would reach less than 60px into the text box, move the top down to clear the slot instead (a shallow spacer only knocks the invocation off-centre);
- text bottom sits 14px above the lowest border art;
- `size: 14` to start.

`slotSpacer`: return `null` when `slot.y + slot.h + 16 <= text.top`. Otherwise return:
- `w = (SHEET.w - text.right) - (slot.x - 16)`
- `h = slot.y + slot.h + 16 - text.top`

- [ ] **Step 4: Implement `frameDataUri(slug)` in `chitra-art.ts`**

1. Throw `Error('unknown frame')` unless `Object.hasOwn(CHITRA_FRAMES, slug)`.
2. Read `path.join(process.cwd(), 'assets', 'frames', slug + '.jpg')` with `node:fs/promises`.
3. Return `'data:image/jpeg;base64,' + base64`.

Use only `node:` imports and `./chitra-frames.ts`.

- [ ] **Step 5: Add Vinayak to the catalogue**

In `catalog.ts`:
- add `'chitra'` to `LayoutKind`;
- add `chitra: []` to `SWATCHES`;
- add a `// Devotional, on the owner's page designs` block after `khandoba` containing the Vinayak row (Global Constraints values; title `Vinayak`; blurb from the spec).

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS. The count goes from 45 to 52 (7 new tests).

- [ ] **Step 7: Implement `ChitraTemplate` in `chitra.tsx`**

`f = CHITRA_FRAMES[slug]`, `t = DEV_THEMES[f.motif]`, `built = buildSections(data)`. The root is an `<article lang={data.docLocale}>` with:
- `position: relative`; width and height `var(--a4-w)` / `var(--a4-h)`; `box-sizing: border-box`; `overflow: hidden`;
- `padding: text.top text.right text.bottom text.left`;
- `background: f.paper`, `color: f.ink`, font `t.body` at `f.size`, line height 1.32.

Children, in order:
1. **Frame image.** `<img src={frameSrc ?? '/frames/' + slug + '.jpg'} alt="" aria-hidden>`, absolute, inset 0, 100% × 100%.
2. **Photo.** Only when `data.photo?.src`: a `data-chitra-photo` box, absolute at `slot`, with `overflow: hidden` and the clip for its shape:
   - `oval` → `border-radius: 50%`;
   - `radius` → `border-radius: radius`;
   - `path` → `clip-path: path('…')`.

   Inside it, an `<img>` with `object-fit: cover` at `data.photo.position`, and `alt` = `labelsFor(locale).photoPlaceholder`.
3. **Slot spacer.** When `slotSpacer(f)` returns a size, an empty `float: right` div of that size.
4. **Head.** `data-chitra-head`, centred:
   - invocation: `t.invFont`, 13px, `f.accent`, `lang={t.invLang}`;
   - kicker: 13px, weight 600;
   - name: `<h1>`, `t.head` / `t.headWeight`, 28px, line height 1.15, `f.accent`;
   - subtitle: 14px, only if non-empty.
5. **Body.** `data-chitra-body`, with `clear: both`, `column-count: 2`, `column-gap: 24px`. One `<section>` per entry in `built.sections`:
   - heading `<h2>`: `t.head`, 16px, `f.accent`, `border-bottom: 1px solid f.rule`, `break-after: avoid`;
   - `text` as a `<p>`;
   - each row: a grid `40% 8px minmax(0, 1fr)` with `break-inside: avoid`; label in `f.accent`, colon, value `<span data-chitra-value>` in `f.ink`, weight 500, `overflow-wrap: anywhere`.

`render.tsx`:
- add the `frameSrc?: string` prop;
- add `case 'chitra': return <ChitraTemplate data={data} slug={def.slug} frameSrc={frameSrc} />`.

- [ ] **Step 8: Wire the print pages**

In both print pages, after `def` is known:
- `const frameSrc = def.layout === 'chitra' ? await frameDataUri(def.slug) : undefined;`
- pass `frameSrc` to `TemplateSheet`.

Sample page only (it is already dev-only): when `searchParams.photo === '1'`, set `data.photo = { src: TEST_PHOTO, position: '50% 50%' }`. `TEST_PHOTO` is a module constant: a `data:image/svg+xml` URI of a 600 × 400 SVG with a diagonal two-colour linear gradient and a centred circle. It is landscape, so cover-cropping into a portrait opening is exercised.

`proof-sheet.ts`: change the guard to `tpl.layout === 'devotional' || tpl.layout === 'chitra'`, and update its comment.

- [ ] **Step 9: Write `scripts/frame-check.ts`**

Add `"frames:check": "node --experimental-strip-types scripts/frame-check.ts"` to `package.json`.

Slugs come from argv, defaulting to every `layout === 'chitra'` template. Each check below runs on a fresh load of `/print/sample/<slug>?lang=en&photo=1`, waiting for `[data-print-ready="true"]`. The script collects failures and exits 1 if there are any.

- **(a) Overflow registers.** Append a `<p>` of `'lorem '.repeat(500)` to the last `section` in `[data-chitra-body]`. Assert `article.scrollHeight > 1125`.
- **(b) Long values wrap.** Set the first `[data-chitra-value]` to `'x'.repeat(80)`. Assert `scrollWidth <= clientWidth + 1`.
- **(c) Long name clears the photo.** Set the `<h1>` to `'Name '.repeat(14)`. Assert its bounding rect does not intersect `[data-chitra-photo]`'s.
- **Side-by-side.** Viewport 794 × 1123 at DPR 1, `lang=hi&photo=1`. Screenshot `.print-sheet`. Compose it to the right of `assets/frames/<slug>.jpg` resized to 794 × 1123, and write `proofs/compare/<slug>.png`.

- [ ] **Step 10: Run the checks on Vinayak**

Run: `npm test`, then `npm run typecheck`, then `npm run lint`
Expected: all clean.

Run: `npm run frames:check vinayak`
Expected: exit 0, and `proofs/compare/vinayak.png` written.

Run: `npm run fit`
Expected: `ok` for vinayak in en, hi and mr, and nothing `OVER`. If one is over, lower `size` by 0.5 (down to 13; then the stop rule applies) and rerun.

Run: `npm run proofs`
Expected: `27 of 27`, with no "Rasterised ornaments" line.

- [ ] **Step 11: Look at the side-by-side**

Read `proofs/compare/vinayak.png`. Expected:
- border, emblem, photo frame and watermark are the same on both halves;
- the test photo is inside the opening with the moulding visible;
- no text touches the art;
- the two columns are balanced.

Adjust Vinayak's numbers until all of that holds.

---

### Frame task procedure (Tasks 3–10)

For each frame in the task:
1. Add its `CHITRA_FRAMES` row: `motif`, shape and colours from the spec; `text`, `slot` and `size` measured exactly as in Task 2, Step 3.
2. Add its catalogue row to the chitra block, in spec table order.
3. Run `npm test`, then `npm run frames:check <slugs>`, then `npm run fit`. Expected: tests pass, the check exits 0, and the task's slugs are `ok` in en, hi and mr.
4. Read each `proofs/compare/<slug>.png` and judge it against Task 2, Step 11.

The catalogue test is relative, so no counts need bumping. Fit failures follow the stop rule.

### Task 3: Ganesha frames — Gajanan, Siddhivinayak, Gajmukh

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.
**Interfaces:** Consumes the `ChitraFrame` type and checks from Task 2.

- [ ] **Step 1: `gajanan`** — `ganesh`, oval slot. The arch narrows at the top: measure `text.top` where the arch is at least `text.left`/`text.right` wide; the head sits beside the oval via the spacer.
- [ ] **Step 2: `siddhivinayak`** — `ganesh`, rect slot. Keep the text box clear of the lotus vines in three corners.
- [ ] **Step 3: `gajmukh`** — `ganesh`, rect slot. The column of small Ganeshas on the right is watermark, so text may sit over it.
- [ ] **Step 4: Run the procedure's checks for all three.**

### Task 4: Ekadanta and its name plate

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/chitra.tsx`, `src/templates/catalog.ts`, `scripts/frame-check.ts`.
**Interfaces:**
- Consumes the `plate?: { w, h, fill }` field defined in Task 2.
- Produces the `data-chitra-plate` hook.

- [ ] **Step 1: Add the plate check to `frame-check.ts`**

In check (c), when `[data-chitra-plate]` exists, also assert that the plate's rect contains the `<h1>`'s rect.

- [ ] **Step 2: Run the check to see it fail**

Run: `npm run frames:check ekadanta`
Expected: FAIL, because ekadanta is not a template yet.

- [ ] **Step 3: Add the `ekadanta` row and the plate**

Row: `ganesh`, `shape: 'path'`, with `path` tracing the inside of the cusped arch in px relative to the slot box. `plate = { w, h, fill: '#FFFFFF' }`: the painted-out bar's size in sheet px.

In `ChitraTemplate`, when `f.plate` is set, wrap the kicker and name in a `data-chitra-plate` box:
- `display: inline-block`, `min-width: plate.w`, `min-height: plate.h`, `background: plate.fill`;
- `padding: 4px 12px`, `box-sizing: border-box`.

Tune `text.top` so the plate lands over the bar's old position.

Add the catalogue row.

- [ ] **Step 4: Run the procedure's checks for ekadanta**

Expected: frame-check exits 0, including the plate containing a 14-word name.

### Task 5: Shiva frames — Neelkanth, Bholenath

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `neelkanth`** — `mahadev`, rect slot (the inside of the wooden frame).
- [ ] **Step 2: `bholenath`** — `shiv`, rect slot. The parchment's darker edges are art, so keep the text box inside the icon border.
- [ ] **Step 3: Run the procedure's checks for both.**

### Task 6: Krishna frames — Vrindavan, Govind

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `vrindavan`** — `krishna`, oval slot (the inside of the lace ring). The peacock border is thick, so the text box is narrow; expect a smaller `size`.
- [ ] **Step 2: `govind`** — `krishna`, `shape: 'rect'` with `radius` matching the drawn corner.
- [ ] **Step 3: Run the procedure's checks for both.**

### Task 7: Ram frames — Kodanda, Dhanu

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `kodanda`** — `ram`, rect slot (inside the ornate corners).
- [ ] **Step 2: `dhanu`** — `ram`, rect slot (the grey card's face, not its shadow).
- [ ] **Step 3: Run the procedure's checks for both.**

### Task 8: Gajalakshmi

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `gajalakshmi`** — `lakshmi`, rect slot. The thickest border (about 535px of text width): the text bottom sits above the kalash row. If fit fails at 13px, apply the stop rule.
- [ ] **Step 2: Run the procedure's checks.**

### Task 9: Vithoba

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `vithoba`** — `vitthal`, `shape: 'path'` tracing the scalloped oval's inner edge, relative to the slot box.
- [ ] **Step 2: Run the procedure's checks.**

### Task 10: Sankat Mochan

**Files:** Modify `src/templates/chitra-frames.ts`, `src/templates/catalog.ts`.

- [ ] **Step 1: `sankat-mochan`** — `hanuman`, rect slot (inside the corner brackets). The text bottom sits above the mountain and gada band. This is the shortest text box and the most likely to hit the stop rule. If it does, report the measured heights in all three languages and stop.
- [ ] **Step 2: Run the procedure's checks**, plus check (a) on this frame by hand in the editor (`/en/editor?template=sankat-mochan&sample=1`; a saved draft takes precedence over the sample, so clear it first if one exists). Expected: the overflow warning appears once the "about" text passes the mountain band.

### Task 11: Finish

**Files:** Modify `tests/catalog.test.ts`, `README.md`. Regenerate `proofs/`, `public/brand/thumbs/`.

- [ ] **Step 1: Pin the final count**

In the first catalogue test, add `assert.equal(Object.keys(CHITRA_FRAMES).length, 14)` and `assert.equal(TEMPLATES.length, 40)`.

Run: `npm test`
Expected: PASS.

- [ ] **Step 2: Update the README**

Change 26 → 40 templates, 78 → 120 prerendered pages and the test count. Add `chitra` to the layout list (7 layouts), with one line explaining that frames are the owner's images prepared by `npm run frames`. Add `npm run frames` and `npm run frames:check` to the Checks table. In Motion, change the "twenty cards" note to forty.

- [ ] **Step 3: Run the full suite**

Run, in order: `npm run typecheck`, `npm run lint`, `npm run frames:check`, `npm run fit`, `npm run proofs`, `npm run thumbs`.

Expected:
- clean typecheck and lint;
- 14 frames checked with exit 0;
- 116 fit pairs `ok`;
- `40 of 40` proofs, no rasterised line;
- `40 of 40` thumbnails.

- [ ] **Step 4: Build in a scratchpad copy**

Copy the project, excluding `node_modules` and `.next`, link or copy `node_modules`, and run `npm run build` there.

Expected: success, with 120 template pages prerendered.

- [ ] **Step 5: Public-URL check**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/frames/vinayak.jpg`
Expected: `200`, and the file is 600px wide.

Run: `grep -r "assets/frames" .next/static` in the build copy.
Expected: no matches.

Open `/en/templates/vinayak` and list network requests.
Expected: only `/frames/vinayak.jpg`, and no data URI.
