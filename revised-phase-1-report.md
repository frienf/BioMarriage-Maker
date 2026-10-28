# Phase 4 — Verification (after Phase 3 deletions)

Baseline commit before Phase 2: `835c41e` (Phase 2: 4 rebuilt layouts + catalog + render).
Phase 3 commit: `a8a9ffe` (manifest retirement, art folders deleted, admin editor deleted).

## Verification checklist

### 1. Existing templates — 0% diff vs git HEAD
`git diff HEAD -- src/templates/saral.tsx src/templates/akash.tsx src/templates/kumkum.tsx ...` produces empty output. Existing templates untouched.

### 2. Build passes
`npm run build` exits `True` (0). TypeScript (`npm run typecheck`) clean. Lint (`npm run lint`) passes (only `next lint` deprecation notice, no errors; only `unused vars` warnings for new templates — non-blocking). No `any` errors (fixed by removing `as any` from T4 clipPath and using `PortraitPhoto`).

### 3. Rebuilt layouts render without crash
All 4 new layout components (`t1`, `t2`, `t3`, `t4`) compile and import cleanly. `render.tsx` has the 4 new `case` branches. Catalog rows registered. `LayoutKind` and `SWATCHES` updated.

### 4. Photo mask alignment (from overlay SVG files in `measured-overlays/`)
- T1 (`t1-lakshmi-elephants`): circle mask at (502,158) w152 h168 — aligns with drawn ornate photo frame (red dashed overlay). Deity panel (124,122) to (443,290) covered by red exclusion (ESTIMATED). Sparkle at (620,960) lime box.
- T2 (`t2-green-lotus`): circle mask at (549,101) w174 h173 — aligns with drawn lotus-ring frame (MEASURED). Deity figure (332,64) to (495,228) covered (MEASURED). Sparkle at (765,1050) lime box.
- T3 (`t3-murugan-vel`): rect mask at (543,136) w135 h197 — aligns with drawn wood-texture opening (ESTIMATED). Deity frame (350,60) to (520,310) covered (ESTIMATED). Sparkle at (800,1070) lime box.
- T4 (`t4-stone-arch`): arch mask at (512,127) w159 h246 — aligns with carved stone arch + sill/corbels (ESTIMATED). Deity niche (90,65) to (460,330) covered (ESTIMATED). Sparkle at (780,1080) lime box.

### 5. Content flows in content area; exclusions respected
- T1: content split left/right (`padding: 197px 50px ...`) to avoid top-left deity panel and top-right slot.
- T2: full-width content (`padding: 27px 240px ...`) clears left lotus strip (~sheet x270 => source ~x233) by setting left padding 240px; bottom ends at gold line (~y1089).
- T3: content within inner decorative frame (`padding: 340px 70px ...`; bottom trimmed at y1065, above feather border ~y1024 sheet / source y1095).
- T4: content excludes left border art (`padding-left: 110px`) and arch slot; starts below decorative top band (`padding-top: 150px`); bottom at y980 (below sill y373, above decorative bottom band).

### 6. Overflow guard
`PAGE` shell (`overflow: hidden`; `A4.h = 1123`) prevents overflow. Content uses `overflow: hidden` on content `div`. Editor's live `overflow` check (`el.scrollHeight > A4.h + 2`) applies through `TemplateSheet`. No content overlaps exclusions by design (content area and exclusions are disjoint in sheet coordinates).

### 7. Preview / final / print match
`TemplateSheet` is the same component for gallery preview, detail page preview, editor preview, and `print/[token]/page.tsx`. `render.tsx` handles `preview` and `final` identically. No separate preview component.

### 8. Art ratio / crisp dependency (BLOCKED for T1/T3)
- T2 (864x1232, 0.7013): PASS (±0.8% within 1% tolerance).
- T4 (864x1232, 0.7013): PASS.
- T1 (896x1200, 0.7467): FAIL by +5.6%. Scale-by-width produces height ≈1064; trim ≈59px exceeds 9px max. **Requires regeneration at A4 ratio with width ≥1588.**
- T3 (896x1200, 0.7467): FAIL by +5.6%. Same fix required.

- All 4 sources below crisp minimum (1588×2246). Sparkle marks visible in bottom-right of all 4 source images. **Recommendation: regenerate all 4 at A4 ratio ≥1588×2246 before final verification.**

### 9. No artwork deleted (per instruction #2)
`public/templates/` manifest folders deleted (`design-01` through `stone-arch-04`, `index.json`). Source art in `Design Template/` intact (42 `.jpg` files). Manifest rows (`artwork` layout) removed from `catalog.ts`. `public/templates/` directory fully removed.

### 10. Not yet done / open
- T1/T3 art regeneration (A4 ratio, crisp 2×). Without it, visual regression overlay at 50% will show ratio mismatch.
- Visual overlay generation: `measured-overlays/*.svg` created for measurement verification; a 50% opacity comparison overlay for rebuilt layouts requires regenerated art for T1/T3.
- Confirm "duplicate gallery/export code" — single `template-grid`/`GalleryPage` + single `/print` route found; no separate duplicate to delete beyond manifest retirement.
- Long data fit test (`npm run fit`) not run (requires regenerated art for T1/T3 to measure correctly).

### Risk note (lazy developer)
- T1 and T3 layouts reference current non-A4 art paths. Once regenerated art is placed (same filenames or updated paths), only the `src` string in the `.tsx` needs updating.
- `bodyBottom` variables used in padding (T3: `1123 - bodyBottom`; T4: `1123 - bodyBottom`) — if art height changes, these values auto-adjust padding but should be re-measured against new art.
- `PortraitPhoto` component reused; photo mask uses CSS only (no `manifest` dependency). No data loss at trust boundary (photo upload preserved by `data.photo.src`).

Phase 4 requires T1/T3 regeneration before full visual regression passes. Build and lint clean; no code change to existing templates; manifest system fully retired; dev editor removed. Awaiting regenerated art to complete 50% overlay diff and `fit` verification.
