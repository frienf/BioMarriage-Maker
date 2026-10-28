# Phase 1 report — reconcile the artwork/manifest template pipeline

Read-only. No code changed. Stop here for approval before Phase 2.

## 1. The parallel manifest-based system and what it duplicates

### What exists (the parallel system)

| Location | What it is |
|---|---|
| `public/templates/` | 8 folders: `design-01`…`design-04`, `green-lotus-02`, `lakshmi-elephants-01`, `murugan-vel-03`, `stone-arch-04`. Each holds `background.webp`, `thumb.webp`, `manifest.json`. Plus `index.json` listing all 8. |
| `src/templates/registry.ts` | `loadTemplate` / `loadAllTemplates` — fetch-based index over `public/templates/index.json`, returning `TemplateEntry` ({id, version, thumb, background, manifest}). |
| `src/templates/types.ts` | `TemplateEntry` type (only used by registry.ts). |
| `src/templates/artwork.tsx` | `ArtworkTemplate` ('use client'): fetches its own manifest, renders `background.webp` with `objectFit: 'fill'` (stretches), clip-path photo slot, hand-rolled section renderer, manifest theme font names used raw (`fontFamily: "serif"`), unused `photoCrop` prop. |
| `src/templates/catalog.ts` | Already reconciled here: `LayoutKind` includes `'artwork'`, `TemplateDef.manifestId?: string`, `SWATCHES.artwork: []`, and 4 artwork rows (`lakshmi-elephants-01`, `green-lotus-02`, `murugan-vel-03`, `stone-arch-04`). |
| `src/templates/render.tsx` | `case 'artwork'` passes `manifestId` + server-loaded `manifest` into `ArtworkTemplate`. |
| `src/app/print/[token]/page.tsx` | Reads `public/templates/<id>/manifest.json` from disk at print time and passes it to `TemplateSheet` — shared with all layouts, no parallel export. |
| `src/app/admin/template-editor/page.tsx` | Dev-only stub ("Scaffold — full editor TBD."), does not write anything yet. |
| Scripts | `validate-templates.ts` (validates index.json folders + ratio), `generate-index.ts` (writes index.json), `gen-template-images.mjs` (placeholder SVGs for the 4 named designs), `add-design-images.mjs` (made `design-01`…`design-04` from `Design Template/*.jpg`), `template-thumbs.ts` (catalog-based), one-off scripts `fix-catalog.js`, `fix-accents.js`, `fix-accents2.js`, `restore-catalog.js` (evidence of back-and-forth between the two systems). |

### What is actually duplicated vs shared

- **Gallery** — NOT duplicated. `src/app/[locale]/templates/page.tsx`, the detail page, `template-card.tsx`, `template-grid.tsx`, the editor switcher, and `pricing` all consume `TEMPLATES` from `catalog.ts` only. `registry.ts` / `loadAllTemplates` is **not imported anywhere** — dead code.
- **Export** — NOT duplicated. Single `src/lib/pdf.ts` (Chromium print of `/print/<token>`, waits for `[data-print-ready="true"]`, A4, zero margins) used by every layout.
- **Photo handling** — NOT duplicated. Single `PhotoStep` (device-local data URL, `object-position` slider) + `PortraitPhoto` in `base-parts.tsx` (`objectFit: 'cover'`, `objectPosition: data.photo.position || '50% 30%'`). `artwork.tsx` reads `data.photo.src`/`position` directly — same model, no separate photo UI.
- **Content layout** — not uniquely duplicated: every existing layout hand-rolls its section rows from `buildSections()` (`rows.ts`); `artwork.tsx` does the same. Consistent with current practice, but still worth centralising if a shared section renderer is wanted later (out of scope).
- **Pricing** — NOT duplicated. Single `pricePaise` per catalog row.

### What is genuinely redundant / orphaned

1. `src/templates/registry.ts` + `TemplateEntry` in `types.ts` — a second template index that nothing consumes. Delete.
2. `public/templates/design-01`…`design-04` — manifest folders from the old `add-design-images.mjs` run; not registered in the catalog, and `fix-catalog.js` shows the catalog used to point at them. Delete folders (the 4 named sample designs already have folders + catalog rows).
3. `scripts/add-design-images.mjs`, `gen-template-images.mjs` — placeholder-image generators tied to the old parallel flow. `gen-template-images.mjs` could be replaced by the new "add a template folder" script (Phase 2). Delete both; keep `validate-templates.ts`, `generate-index.ts` (already in `prebuild`), `template-thumbs.ts`.
4. `fix-catalog.js`, `fix-accents.js`, `fix-accents2.js`, `restore-catalog.js` — one-off catalog rewrite scripts. Delete.
5. `tests/template-visual-regression.test.ts` — acceptance scaffold that imports `loadTemplate` from `registry.ts`; must be updated/removed when `registry.ts` goes.

## 2. How existing layouts handle the concerns artwork must reuse

- **Page shell**: every template renders inside `PAGE` from `src/templates/base-parts.tsx` — `width: var(--a4-w)`, `height: var(--a4-h)`, `overflow: 'hidden'`. `render.tsx` exports `A4 = { w: 794, h: 1123 }`. `ScaledSheet` scales the box by CSS `--sheet-scale` for preview; it never reflows.
- **Photo**: single source of truth is `data.photo` (`{ src, position }` per `src/lib/biodata.ts` zod schema; `position` defaults to `'50% 30%'`). Layouts render `<img objectFit="cover" objectPosition={data.photo.position} />` inside a box; empty state shows a tinted silhouette/figure (see `PortraitPhoto` and devotional `Photo`). No per-template cropper anywhere. Editor measures fit with `el.scrollHeight > A4.h + 2`.
- **Overflow / auto-fit**: `PAGE` has `overflow: 'hidden'`; the editor's overflow check is generic (`TemplateSheet`-agnostic). Content that exceeds the A4 box clips — every layout must size content to fit; nothing paginates automatically except `pages: 2` (only `ganesh-mangal`).
- **Fonts**: self-hosted via `next/font` in `src/lib/fonts.ts`; `templateFontClass` applies all variables wherever a template renders. Layouts reference `var(--font-xxx)` with Devanagari fallback stacks. Manifest theme fields `fontHeading`/`fontBody` are raw strings (`"serif"`, `"sans-serif"`) with **no mapping to loaded fonts** — a gap to close in ArtworkLayout (map to variables or fall back to generic stack).
- **Colors**: `manifest.theme.text / heading / divider` used directly as CSS colors; catalog `accent` drives Kumkum/Akash/etc. and the print order's `order.accent`.
- **Export**: `src/app/print/[token]/page.tsx` already handles artwork by reading the manifest from disk server-side; `pdf.ts` prints that route. No artwork-specific export path needed.

## 3. Concrete plan (Phase 2)

### A. Catalog (`src/templates/catalog.ts`)
Mostly already done: `layout: 'artwork'` in the union, `manifestId?: string` on `TemplateDef`, `SWATCHES.artwork: []`, 4 rows registered. Decisions to confirm:
- Keep the 4 existing rows (collection/price/blurb are placeholders already; blurbs say "Image-based artwork from Design Template." — the task asked for TODO-marked placeholders; decide whether to adjust blurbs).
- `manifestId` required at runtime for artwork; type stays optional with the `!` non-null assertion at the render switch (same pattern as `chitra.slug`).

### B. `ArtworkLayout` component (`src/templates/artwork.tsx` rewrite)
Interface matching other layouts: `{ data, accent?, page?, instanceId? }` — manifest resolved by the caller (`render.tsx` / print page already pass it; client preview fetch kept as fallback). It renders:
1. **Background**: `background.webp?v=<version>` at fixed canvas ratio, untouched (no `objectFit: 'fill'` stretch — size to ratio inside the A4 box, no distortion).
2. **Photo**: slot box from `photoSlot.box` (percentages of A4), clip-path per `photoSlot.shape` (circle / rounded-rect / arch / svg-path), `objectFit: 'cover'` with `data.photo.position`; fallback tinted box ("Add photo") when no photo. Drop the unused `photoCrop` prop.
3. **Content**: `contentArea` box, `exclusions` respected (content box clipped; authoring keeps rows out of exclusion zones), theme colors, font names resolved to loaded font variables, sections rendered via `buildSections()` + `labelsFor()` like every other layout.
4. Reuse existing overflow logic (editor's `scrollHeight` check works on any `TemplateSheet`); `page` prop accepted for API parity (artwork is 1-page).

### C. Deletions
`src/templates/registry.ts`, `TemplateEntry` (`types.ts`), `public/templates/design-01`…`design-04`, `scripts/add-design-images.mjs`, `scripts/gen-template-images.mjs`, `scripts/fix-catalog.js`, `scripts/fix-accents.js`, `scripts/fix-accents2.js`, `scripts/restore-catalog.js`, and the registry-importing scaffold in `tests/template-visual-regression.test.ts`.

### D. Dev editor
Keep `src/app/admin/template-editor/page.tsx` (dev-only), implement it to write `manifest.json` only (drag/resize boxes → manifest). Nothing else.

### E. New script
`scripts/add-template.ts` (or `.mjs`): given `public/templates/<id>/` with `background.webp` + `thumb.webp`, zod-validate `manifest.json` with `ManifestSchema`, cache-bust via `version`, and print/append a catalog row for `src/templates/catalog.ts` (so adding a folder = one script run + one row). Wired into `prebuild` (`generate-index` + `validate-templates` already run there).

## 4. Verification approach (Phase 3)
- There is **no git repo** in this working directory, so "diff at 0% against git HEAD" cannot be checked yet. I suggest `git init` + a baseline commit of the current state before Phase 2, so Phase 3 can diff existing templates at 0%.
- Existing templates must render pixel-identically: nothing in `kumkum`/`akash`/`saral`/`mayur`/`paramparik`/`devotional`/`chitra` or `render.tsx`/`base-parts.tsx`/`rows.ts` is touched — only `artwork.tsx`, `catalog.ts` (additive), and deletions of dead code.
- Artwork templates with empty data / no photo must match `background.webp` exactly (content layer empty).
- Short / typical / very long biodata never overflows `PAGE` (editor overflow check + tests).
- PDF/PNG export matches preview (same `TemplateSheet` + `pdf.ts` route).
- `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` pass; `npm run prebuild` (`generate-index` + `validate-templates`) passes for the 8→4 folders.

---

Approval requested: confirm the plan above (especially: keep/adjust the 4 catalog rows, delete `design-01`…`design-04` and the dead `registry.ts`, and the `git init` baseline) before Phase 2 implementation.