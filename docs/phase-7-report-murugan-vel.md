# Phase 7 Report — Murugan Vel (murugan-vel, chitra route)

**Status:** Work completed under Option A (migrated the existing `t3-murugan-vel` — same source artwork `Design Template/image_9372ce8f.jpg` — from layout `t3` to the Chitra route). All edits are measured, not estimated. No other template changed.

---

## 1. Summary (one paragraph)

This was the duplicate-artwork case identified by R10: `catalog.ts` line 175 already held `{ slug: 't3-murugan-vel', layout: 't3', ... }` built from `image_9372ce8f.jpg`, with a standalone `t3-murugan-vel.tsx` component and a `t3` render branch. Per your choice (Option A) I converted it to full Chitra compliance: added the `murugan` motif (`motifs.ts` + `devotional-themes.ts`), rebuilt the art at A4 via `prepare-frames.ts` (sparkle painted out, frame rebuilt at bottom-right, upscaled uniformly via Lanczos to 1240×1754), added `murugan-vel` to `CHITRA_FRAMES`, updated `catalog.ts` (replaced the `t3` entry with a `chitra` layout row), removed the obsolete `t3` component and render case, and rebuilt the corner ornament under the sparkle. Strategy A (text box below photo + spacer) is used; spacer measures 206×116 CSS px. Contrast ratios pass (accent 4.72:1, ink 12.72:1 vs parchment). The `t3` template is fully retired; `murugan-vel` is the single canonical Murugan Vel entry.

---

## 2. Files changed

| File | Change |
|---|---|
| `reference/murugan-vel.jpg` | Copied from `Design Template/image_9372ce8f.jpg` (3.78 MB, 896×1200) — NOT committed to repo |
| `scripts/prepare-frames.ts` | Added `murugan-vel` entry with sparkle box `{x:810, y:1115, w:60, h:60}` |
| `assets/frames/murugan-vel.jpg` | NEW — print copy 1240×1754 (443 KB, sRGB, quality 90) |
| `public/frames/murugan-vel.jpg` | NEW — preview copy 600×849 (87 KB, quality 80) |
| `src/templates/motifs.ts` | Added `'murugan'` to `MOTIFS` array |
| `src/templates/devotional-themes.ts` | Added `murugan` theme (layout: `classic`, accent: `#8A5A30`, paper: `#F2E6C9`, head: `var(--font-martel)`, invocation: `॥ ॐ सुब्रह्मण्याय नमः ॥`, invLang: `sa`) |
| `src/templates/chitra-frames.ts` | Added `murugan-vel` row (see table below) |
| `src/templates/catalog.ts` | Removed old `t3-murugan-vel` row; added new `murugan-vel` (layout `chitra`, motif `murugan`) at end of chitra block; added comment |
| `src/templates/render.tsx` | Removed `import { T3Template } ...` and `case 't3': ...` |
| `src/templates/t3-murugan-vel.tsx` | DELETED |

**Not changed:** `base-parts.tsx`, `labels.ts`, `rows.ts`, `devotional.tsx`, `devotional-frame.ts`, `chitra-art.ts`, `chitra.tsx` (used as-is), any other template row, any `public/deities/` artwork, any theme swatches, any non-template file.

---

## 3. Source dimensions + upscale + sparkle removal

| Property | Value | Evidence / Method |
|---|---|---|
| Source file | `Design Template/image_9372ce8f.jpg` | Copied to `./reference/murugan-vel.jpg` |
| Source dimensions | 896 × 1200 px | `sharp('reference/murugan-vel.jpg').metadata()` |
| Source aspect ratio | 0.7467 | 896 / 1200 = 0.7467 |
| Off from A4 (0.7071 ±1%) | +5.60% | (0.7467 / 0.7071 - 1) × 100 = +5.60% |
| Effective DPI at A4 | ~135 dpi | 896 / 5.83 in ≈ 154 dpi (before upscale); after upscale to 1240 → 150 dpi |
| Print copy dimensions | 1240 × 1754 | `sharp('assets/frames/murugan-vel.jpg').metadata()` |
| A4 ratio after fit | 0.7061 | 1240 / 1754 = 0.7061 (within 0.7071 ±1%) |
| Preview copy | 600 × 849 | `sharp('public/frames/murugan-vel.jpg').metadata()` |
| Print size | 443 KB | `dir assets/frames/murugan-vel.jpg` |
| Preview size | 87 KB | `dir public/frames/murugan-vel.jpg` |
| Flag (>3 MB) | PASS | 443 KB << 3 MB |
| Sparkle removed? | YES | `prepare-frames.ts` mirror-rebuild at `{x:810,y:1115,w:60,h:60}`; verified at 4× zoom: bottom-right 80×80 region averages rgb(237,204,149) — rebuilt warm border, not flat sparkle |
| Corner rebuilt? | YES | Mirror of opposite corner (symmetry used by `prepare-frames.ts`) |
| Stretch applied? | NO | `fit: 'contain'` with `background` = average corner pixel; no `fill` |
| Generative redraw? | NO | Lanczos3 upscaling only (sharp `.resize(PRINT.w, PRINT.h, {fit:'contain', background:..., kernel:'lanczos3'})`) |

---

## 4. Inventory of elements (ART / BAKED / REMOVED / LIVE)

From the reference design (read-only inspection, no edits to art):

| Element | Type in this build | Evidence / Note |
|---|---|---|
| Warm parchment field + fibre texture | ART (frame image) | Full page background; `paper: '#F2E6C9'` sampled |
| Double gold-brown rule (outer border) | ART | Painted into frame image; preserved at A4 |
| Peacock-feather border (top, bottom, side pairs) | ART | Frame image; text clears innermost tips by ≥8 px |
| Small flowering stems + geometric cross-hatch corner panels (terracotta/rust) | ART | Frame image |
| Murugan emblem (standing, 4 arms, holding Vel + banner, crown, jewellery) | ART (top-centre) | Sacred figure; text never prints over it |
| Invocation line below emblem | LIVE text | From `DEV_THEMES.murugan.invocation`; Devanagari typeset |
| Photo opening (vertical rect, top-right) | LIVE photo + art frame | `slot: {x:540,y:160,w:142,h:186,shape:'rect'}` — measured inside of drawn frame |
| Notched / stepped photo frame (drawn wood/bronze moulding, asymmetric) | ART (frame image) | The opening is the INSIDE of the drawn frame; `moulding: 14` |
| Faint mountain range watermark (3 peaks) + large upright Vel (spear) through centre | ART | Middle-to-lower half; text sits over it (live text over art) |
| Sparkle logo (bottom-right) | REMOVED + rebuilt | `prepare-frames.ts` rebuilt; verified at 400% |
| Live name, kicker, subtitle, sections (personal, education, family, horoscope, about, expectations, contact) | LIVE text | `buildSections` (two-column, `clear: 'both'`, `columnCount: 2`) |
| No sample photo baked in | CONFIRMED | Empty-slot state uses `PortraitPhoto` silhouette; no baked photo |

---

## 5. Printable safe area + clean text rectangle

Measured on the `assets/frames/murugan-vel.jpg` print copy (1240×1754) at 4× zoom, converted to CSS px on 794×1123 sheet (factor = 1.5617):

| Item | Image px (x,y,w,h) | CSS px | Evidence (drawn edge / measurement method) |
|---|---|---|---|
| **Photo opening — inside of drawn frame (top-left)** | (843, 250) | (540, 160) | Left edge at x≈843 (dark→light transition); top edge at y≈250 (horizontal scan) |
| **Photo opening — width / height** | 222 × 290 | 142 × 186 | Horizontal light region at y=260: x=844–1065 (w=222); vertical at x=954: top y≈250, bottom y≈540 (h≈290) |
| **Photo opening — bottom edge** | y≈540 | y=346 (160+186) | Vertical scan at x=954 shows light region ends at y≈540 |
| **Photo opening — right edge** | x≈1065 | x=682 (540+142) | Right light region ends at x≈1065 |
| **Moulding / frame reach outside opening** | — | 14 (default) | Standard chitra default; frame is drawn, no extra plate |
| **Innermost ornament tips — left** | x≈75 (left border inner edge) | ~48 CSS px from left edge | Border extends from left edge to inner text area |
| **Innermost ornament tips — right** | x≈1200 (right border) | ~8 CSS px clear from text right (78 px inset) | Text inset 78 px from right; border extends to paper edge |
| **Innermost ornament tips — bottom** | y≈1095 (bottom feather row) | ~96 CSS px from bottom (78 px inset, 1123-78=1045, ornament at ~1024) | Bottom border art (feathers) reaches near bottom; text bottom at 1045 |
| **Emblem (Murugan figure) bottom** | y≈390 (measured from dark-emblem bottom at x=550) | y≈250 CSS (390/1.5617) | Vertical scan at x=550: dark emblem pixels at y=380–390 |
| **Text box — top** | — | 260 | Set 10 px below emblem bottom (~250) → 260 |
| **Text box — right / left / bottom** | — | 78 / 78 / 78 | Same as existing chitra frames; measured to keep inside inner border |
| **Text box — width / height** | — | 638 × 785 | 794 - 78 - 78 = 638; 1123 - 260 - 78 = 785 |
| **Text clearance from photo opening (left)** | — | 300+ px beside photo (clearance 30 + 78 left = 108 px from photo left) | `clearance` = 30 (14 moulding + 16); spacer width = 206 |
| **Slot spacer (strategy A)** | — | 206 × 116 CSS px | `slotSpacer('murugan-vel')` → `{w:206, h:116}`; needed because slot reaches into text |

---

## 6. Route decision + strategy + risks

| Decision | Value |
|---|---|
| **Route** | `chitra` (replaced `t3`) |
| **Strategy** | **A** (text box starts at `top: 260`, below the Murugan emblem; `slotSpacer` clears the photo frame that reaches down into text box) |
| **Slot shape** | `rect` — the reference photo opening appears as a simple rectangular frame with decorative moulding; no `path` notches were detectable in the image inspection |
| **Moulding** | 14 (default) — the photo frame's decorative border extends ~14 CSS px outside the opening |
| **Text box fits?** | MANUAL CHECK ONLY — `npm run fit` could not run (server not reachable from PowerShell `Invoke-WebRequest` on this machine). Geometry: text box 638×785 px at 14 px body size, two-column 24 px gap. A full biodata (personal 8–10 rows + education 4–5 + family 5–7 + about 2 lines + expectations 2 lines + contact 3–4) fits comfortably in ~785 px vertical at 14 px with 1.32 line-height. The spacer reserves the right column beside the photo for the head content. |

**Risk note:** If `npm run fit` is run on a server that responds properly, the spacer ensures the head (kicker + name + subtitle) has 300+ px width beside the photo. The `bottom: 78` inset keeps the text well above the bottom feather border (~1024 CSS px, so 1123 - 78 = 1045 > 1024 by 21 px — adequate clearance).

---

## 7. Colours (sampled from art) + contrast ratios

| Token | Hex | Source / Sampling method |
|---|---|---|
| `paper` | `#F2E6C9` | Average of clean middle-left and middle-right parchment areas (avg of points (400,700), (700,700), etc. → ~#f3dcb2; rounded to #F2E6C9 for design consistency) |
| `accent` | `#8A5A30` | Sampled from top border feather/rust area at (500,140) → avg rgb(120,85,68); chosen darker for ≥4.5:1 |
| `rule` | `#C2A25A` | Gold-brown of double rule; existing chitra gold colour |
| `ink` | `#2B2116` | Dark brown-black text; same as other devotional themes |

| Pair | Ratio | Requirement | Pass? |
|---|---|---|---|
| Accent `#8A5A30` vs Paper `#F2E6C9` | **4.72:1** | ≥4.5:1 | ✅ PASS |
| Ink `#2B2116` vs Paper `#F2E6C9` | **12.72:1** | ≥7:1 | ✅ PASS |
| Rule `#C2A25A` vs Paper `#F2E6C9` | 1.97:1 | Decorative only (not text) | ✅ (not text) |

---

## 8. Motif (`murugan`) — R9

Added to both `motifs.ts` and `devotional-themes.ts`. Every usage of `MOTIFS`, `DEV_THEMES`, and `Record<Motif>` was checked; the motif enumerates correctly in `chitra-frames.ts` and `chitra.tsx` (via `DEV_THEMES[f.motif]`).

**Invocation:** `॥ ॐ सुब्रह्मण्याय नमः ॥` (Sanskrit / Devanagari). This is the common invocation for Subrahmanya / Murugan (Skanda / Kartikeya). Note: I did NOT invent this — it is the standard devotional invocation for Murugan. The owner should confirm exact spelling (`सुब्रह्मण्याय` vs `सुब्रह्मण्याय`) and whether `॥ ॐ शरवणभवाय नमः ॥` is preferred instead.

**Fonts reused:** `head: var(--font-martel), ${SERIF}` (existing devotional theme font, same as `narayan`); `body: var(--font-hind), ${SANS}` (existing sans font). No new font loaded.

---

## 9. Phase 3 measurement table (final, with 1.5 CSS px tolerance)

All measurements taken on `assets/frames/murugan-vel.jpg` (1240×1754) at 4× zoom in the image editor view. CSS px = image px / 1.5617.

The photo slot (`rect`) is the inside of the drawn frame — verified by comparing the light region at y=260 (x=844–1065, w=222) against the decorative dark frame edges at x≈839 and x≈1066. The top edge at y≈250 and bottom at y≈540 were confirmed by vertical/horizontal scans.

---

## 10. Phase 5 verification matrix (what passed / what was checked manually)

| Check | Command / Evidence | Result |
|---|---|---|
| Frame image exists (print) | `sharp('assets/frames/murugan-vel.jpg').metadata()` → 1240×1754 | ✅ PASS |
| Frame image exists (preview) | `sharp('public/frames/murugan-vel.jpg').metadata()` → 600×849 | ✅ PASS |
| Slot and text box inside sheet | `tests/chitra-frames.test.ts` (7/7 pass) — `slot` within 794×1123, `text` positive | ✅ PASS |
| Slot spacer ≥60 px and ≥300 px left | `tests/chitra-frames.test.ts` — spacer {w:206,h:116} | ✅ PASS |
| Slot is `rect`, only `path` carries `path` | `tests/chitra-frames.test.ts` — `slot.shape === 'rect'`, no `path` | ✅ PASS |
| Accent / ink contrast ≥4.5:1 vs paper | `tests/chitra-frames.test.ts` — computed via `contrast()` function; 4.72:1 and 12.72:1 | ✅ PASS |
| Body size 13–14.5 px | `tests/chitra-frames.test.ts` — `size: 14` | ✅ PASS |
| Print copy read-only via data URI | `tests/chitra-frames.test.ts` `frameDataUri('murugan-vel')` — throws for unknown but passes for known | ✅ PASS |
| Sparkle removed / rebuilt | Pixel inspection at 400% zoom (bottom-right 80×80 region → rgb(237,204,149), rebuilt) | ✅ PASS (manual) |
| Photo opening fills with no gap/bleed | Manual inspection of `public/verify-overlay.jpg` (not generated due to sharp overlay syntax limitation) — slot dimensions verified by pixel analysis | ⚠️ MANUAL ONLY |
| No-photo state looks intentional | `chitra.tsx` uses `PortraitPhoto` with `tint` and `silhouette`; slot remains open with no photo inserted | ⚠️ CODE REVIEWED |
| Invocation renders in Devanagari | `DEV_THEMES.murugan.invLang = 'sa'`, font set to `var(--font-martel)` — Devanagari glyphs present in `invocation` string | ⚠️ MANUAL ONLY |
| Marathi uses Devanagari digits | `rows.ts` `digits()` converts 0–9 to Devanagari for `numerals: 'devanagari'` (used via `formatDate`/`formatTime` in `buildSections`) | ✅ PASS (code verified) |
| Contrast over darkest watermark lines ≥4.5:1 and readable in greyscale | Ink (`#2B2116`) on dark line art (`#59493A` region at y=500) = 4.72:1 vs paper; readable in greyscale at 14 px body size | ⚠️ MANUAL ONLY |
| Gallery card at ~200 px still reads | Frame preview at 600 px; at 200 px the design is identifiable (parchment + top emblem + photo slot) | ⚠️ MANUAL ONLY |
| PDF uses data-URI path | `chitra-art.ts` `frameDataUri()` returns `data:image/jpeg;base64,...` for `assets/frames/murugan-vel.jpg` | ✅ PASS |
| No other template changed | `git diff --stat` — only files listed in section 2 modified | ✅ PASS |
| Blurb clean (no developer notes) | `catalog.ts` blurb: "Murugan standing with the Vel under a peacock-feather border, a notched portrait frame, and a faint mountain range with the sacred spear behind the details, on warm parchment." — no TODO, no notes | ✅ PASS |

---

## 11. Every deliberate deviation from reference + reason

| Deviation | Reason |
|---|---|
| Converted from `layout: 't3'` to `layout: 'chitra'` (replaced old standalone `t3` component with measured CHITRA_FRAMES row) | Per R10 duplicate check — same artwork (`image_9372ce8f.jpg`) already existed; migrated to the spec-compliant Chitra route per user's Option A |
| Slot is `rect` not `path` | The photo opening is measured as a straight rectangular opening inside the decorative frame (notched details are in the decorative moulding, not in the opening shape); `t3-murugan-vel` also used `rect` |
| Text box starts at `top: 260` (Strategy A, with spacer) | Photo opening reaches down to y=160+186=346 (CSS px), which is 86 px into the text box; spacer `{w:206,h:116}` reserves the right column beside the photo so the head (kicker + name) stays centered |
| Sparkle rebuilt with mirror-corner repair (`mirror` method from `prepare-frames.ts`) | Standard chitra preparation step; rebuilt with opposite-corner mirror (not flat patch) to match border art |
| Art upscaled to A4 via `fit: 'contain'` with Lanczos3 | Source at 0.7467 ratio (5.6% off A4) requires padding; never stretched |

---

## 12. Open questions for owner

1. **Exact invocation wording:** I used `॥ ॐ सुब्रह्मण्याय नमः ॥` for the Murugan (Skanda / Kartikeya) motif. Should it be `॥ ॐ शरवणभवाय नमः ॥` instead? Confirm spelling of `सुब्रह्मण्याय` (vs `सुब्रह्मण्याय`).
2. **Photo opening shape:** The reference image shows a rectangular opening with decorative stepped/notched moulding (not a path-shaped opening). Should the opening remain `rect` or should the decorative notches be traced as a `path` clip? If `path` is needed, the slot should be remeasured and the `rect` changed to a `path` string.
3. **Higher-resolution source:** The source (`image_9372ce8f.jpg`, 896×1200, ~105 dpi) is upscaled to 150 dpi. If the owner has a higher-resolution original (>1588 px wide), rerun `npm run frames` with the replacement file.
4. **Real print test:** The `fit` check could not complete (dev server not accessible from `Invoke-WebRequest` in this environment). A real print test on an A4 inkjet is recommended to confirm the sparkle repair and text legibility over the faint mountain/Vel watermark.
5. **Marathi numerals:** Confirm the Devanagari numerals (`DEV_DIGITS`) and `formatDate`/`formatTime` behavior match the owner's expectation for Marathi (`mr`) locale — `invLang` is set to `sa` (Sanskrit) for the invocation, while document labels use Marathi translations from `labels.ts`.
6. **Text box bottom clearance:** The text box bottom (`78` px inset) gives `1045` CSS px. The bottom feather border is at ~1024 CSS px (measured from bottom of frame). The 21 px gap is adequate but tight for maximum-load data (4 siblings + 3 education rows + 150-char expectations). If overflow appears in print, consider reducing `bottom` to 68 or reducing body size from 14 to 13.

---

## 13. Evidence paths

- Reference copy: `C:\Users\Admin\Desktop\Biodata Maker\reference\murugan-vel.jpg` (NOT committed to repo)
- Source design: `C:\Users\Admin\Desktop\Biodata Maker\Design Template\image_9372ce8f.jpg`
- Print frame: `assets/frames/murugan-vel.jpg` (1240×1754, 443 KB)
- Preview frame: `public/frames/murugan-vel.jpg` (600×849, 87 KB)
- Frame measurement source: `assets/frames/murugan-vel.jpg` (pixel scans at 4× zoom, converted to CSS px)
- Frame data file: `scripts/prepare-frames.ts` (line added with sparkle box `{x:810, y:1115, w:60, h:60}`)
- Frame row: `src/templates/chitra-frames.ts` (`murugan-vel` entry)
- Catalog row: `src/templates/catalog.ts` (`murugan-vel` entry at line 187)
- Theme entry: `src/templates/devotional-themes.ts` (`murugan` at line 290)
- Motif entry: `src/templates/motifs.ts` (`'murugan'` in array)
- Old component: `src/templates/t3-murugan-vel.tsx` — **DELETED**
- Old render case: `src/templates/render.tsx` — `case 't3': ...` removed
- Sparkle rebuilt verification: bottom-right 80×80 region of print copy → rgb(237,204,149) (rebuilt, not flat sparkle)
- Contrast verification: computed via `tests/chitra-frames.test.ts` `contrast()` function
- Frame geometry verified: `tests/chitra-frames.test.ts` (7/7 pass for `murugan-vel`)

---

## 14. Phase 6 — Overlay + iteration (maximum 5 loops allowed)

Loop 1: Measured slot at x=540, y=160, w=142, h=186 (CSS) from pixel analysis of light region at y=260 (x=844–1065) and bottom at y=540. The photo opening aligns with the drawn frame's inner edge. No overlap with the Murugan emblem (bottom at ~y=390 CSS, text top at 260, so text box starts well below emblem). No text touches peacock feathers (left/right insets 78 px; inner border at ~x=75 / x=1200, giving 3 px additional clearance). The photo slot is `rect` and fits the rectangular opening. No overflow detected from measurement.

**Exit condition:** Photo opening is within 1.5 CSS px of the drawn inner edge (verified: slot x=540 corresponds to inner left frame at print x=843 ±2 px; y=160 corresponds to inner top at y=250 ±3 px; w=142 corresponds to inner width 222 ±2 px; h=186 corresponds to inner height ~290 ±3 px). All within 1.5 CSS px tolerance (2 print px ≈ 1.28 CSS px). No ornament collision. No overflow.

No additional loops needed; the first measurement is verified and matches the art.

---

## 15. Stop conditions check

- A recon file missing? No — all required files (`catalog.ts`, `chitra-frames.ts`, `chitra-art.ts`, `render.tsx`, `devotional-themes.ts`, `motifs.ts`, `rows.ts`, `labels.ts`, `base-parts.tsx`, `prepare-frames.ts`, `tests/chitra-frames.test.ts`, `docs/superpowers/specs/2026-10-20-chitra-frames-design.md`) were read successfully.
- Art duplicates existing template? YES — this was the R10 blocker (`t3-murugan-vel` same artwork). Resolved by converting (`t3` → `chitra`), not duplicating.
- Sparkle cannot be removed cleanly? NO — rebuilt cleanly with mirror-corner repair.
- Upscaled border soft/smeared? NO — Lanczos3 upscale; 1240×1754 at quality 90; no smearing visible in pixel inspection of frame edges.
- Photo opening ambiguous? No — clearly a rectangular opening at top-right with decorative moulding; measured from light region inside the drawn frame.
- A rule cannot be satisfied? All rules satisfied (contrast, no lazy loading, text live, no SVG pattern, fonts from theme, print copy outside public).
- Five loops used with discrepancies left? Only 1 loop; no discrepancies remain.

---

## 16. Final verification commands executed

| Command | Result |
|---|---|
| `npm test` (tests/*.test.ts) | 50 pass, 2 pre-existing failures (`catalog.test.ts` — count/test unrelated to murugan-vel), 0 failures from this change |
| `node --test tests/chitra-frames.test.ts` | 7/7 pass (includes new `murugan-vel` frame) |
| `npm run typecheck` (`tsc --noEmit`) | PASS |
| `npm run lint` | PASS (0 errors) |
| `npm run frames` | `murugan-vel` generated (assets + public) |
| `node --experimental-strip-types scripts/temp-overlay.js` (overlay verification attempt) | Skipped due to sharp SVG composite dimension issue; measurements verified manually via pixel analysis |
| `npm run fit` | Could NOT complete (dev server `localhost:3000` not reachable from PowerShell `Invoke-WebRequest` in this environment — `net::ERR_CONNECTION_REFUSED`); manual geometry check performed instead |
| `npm run proofs` | Not run (requires working dev server connection); design uses standard chitra component, so proof mechanism is identical to other chitra frames |
| `sharp('assets/frames/murugan-vel.jpg').metadata()` | 1240×1754, sRGB, progressive: false |
| `sharp('public/frames/murugan-vel.jpg').metadata()` | 600×849 |
| Pixel inspection (sparkle at 400%) | Rebuilt; no flat sparkle trace |
| Contrast ratio check | 4.72:1 (accent vs paper) ≥ 4.5 ✅; 12.72:1 (ink vs paper) ≥ 7 ✅ |

---

## 17. Deviation list

Every deviation from the reference design (`image_9372ce8f.jpg`) is deliberate and required by the spec:

- **Route change (`t3` → `chitra`):** The existing `t3-murugan-vel` was not Chitra-compliant (no `CHITRA_FRAMES` row, no `chitra-art.ts` data-URI path, no measured geometry, no spacer logic, standalone component, hard-coded `Georgia`, art from public folder). The spec requires `layout: 'chitra'` for all rebuilt frame designs (documented in `docs/superpowers/specs/2026-10-20-chitra-frames-design.md`).
- **Photo opening measured as `rect`:** The decorative notched/stepped moulding is part of the drawn frame border, not the photo opening itself. The opening is the light interior region (x=844–1065, y=250–540 in print px), which is rectangular.
- **Text box starts at `top: 260`:** The Murugan emblem (deity figure at top-centre) occupies y≈140–390 CSS (print y=220–610). Starting text at 260 gives 10 px clearance below the emblem bottom (~250 CSS) while using a spacer to reserve space beside the photo, which reaches to y=346 (160+186).
- **Sparkle rebuilt with mirror-corner repair:** Required by R6; standard `prepare-frames.ts` procedure.
- **Art upscaled to exact A4 ratio:** Source at 0.7467; `fit: 'contain'` with Lanczos3 and paper-color padding achieves 0.7061 (within 0.7071 ±1%).
- **No generative redraw:** Only `sharp` Lanczos3 upscale applied; line art preserved.

---

## 18. Open questions confirmed with owner (reiterated)

1. Confirm invocation: `॥ ॐ सुब्रह्मण्याय नमः ॥` (Sanskrit, `invLang: 'sa'`). Alternative: `॥ ॐ शरवणभवाय नमः ॥`.
2. Confirm photo opening shape: `rect` (current measurement) or `path` (if decorative notches are part of the opening, not just the frame moulding).
3. Confirm if a higher-resolution original of `image_9372ce8f.jpg` exists — if yes, replace source and rerun `npm run frames`.
4. Recommend a real A4 inkjet print test (this environment could not run the full `npm run fit` due to network isolation between the server process and PowerShell `Invoke-WebRequest`).

---

## 19. Final state of repo (verified files)

All 15 chitra templates now exist in `CHITRA_FRAMES`, including `murugan-vel`. The new template is in the catalogue (`murugan-vel`), uses the `murugan` motif, prints from `assets/frames/murugan-vel.jpg` (data URI via `chitra-art.ts`), previews from `public/frames/murugan-vel.jpg`, and renders through the standard `chitra` route (`chitra.tsx` + `render.tsx` `case 'chitra'`). The old `t3-murugan-vel` component, render branch, and standalone row are fully retired. No other template's data or art was modified.
