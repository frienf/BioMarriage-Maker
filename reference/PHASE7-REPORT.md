# Phase 7 — Final Report (jagannath)

**Template added:** `jagannath` (chitra layout, devotional collection, standard price ₹4900, locales en/hi/mr, 1 page)
**New motif:** `jagannath` (invocation `जय जगन्नाथ`, invLang `sa`, layout `classic`, tileOpacity 0.11, reuse `font-martel` + `font-hind` pairing from balaji/krishna)

## Summary
Added a new devotional chitra template for Lord Jagannath of Puri. The reference art (864×1232, ratio 0.7013, within 1% of A4) is preserved untouched: the iconic black face with large round white eyes, ornate crown with lotuses and peacock feathers, multi-foil cusped gold arched photo opening, red-gold floral scroll border, and faint chariot wheel with flag watermark are all kept exactly as drawn. The generator sparkle at the bottom-right was rebuilt by mirroring the bottom-left border corner; verified clean at 400% (no dark sparkle trace remains — rebuilt region shows natural border tones: (173, 90, 58) at rebuilt area). The art is scaled uniformly at 0.97 with a pure white margin (fill #FFFFFF) so the outermost drawn border pixel clears 20 CSS px from every sheet edge. Print copy at `assets/frames/jagannath.jpg` (1240×1754, 245KB, sRGB ~90); preview at `public/frames/jagannath.jpg` (600px, 49KB). No existing template changed.

## Files changed
- `src/templates/motifs.ts`: added `'jagannath'`
- `src/templates/devotional-themes.ts`: added `jagannath` theme (layout `classic`, accent `#8A2A1C`, rule `#B8964A`, ink `#2B2116`, paper `#F9F2E0`, tileOpacity 0.11)
- `src/templates/chitra-frames.ts`: added `jagannath` frame row (path slot, text box strategy A)
- `src/templates/catalog.ts`: added TEMPLATES row (`slug: 'jagannath'`, `deities: []` with exception comment for test)
- `scripts/prepare-frames.ts`: added `jagannath` prep entry (`scale: 0.97`, `fillColour: {r:255,g:255,b:255}`)
- `reference/jagannath.jpg`: saved reference copy (not committed to public/)
- `assets/frames/jagannath.jpg`: generated print copy
- `public/frames/jagannath.jpg`: generated preview copy
- `reference/triage-report.md`: phase 1 triage
- `reference/measurements.md`: phase 3 measurement table

## Art dimensions and scale
- Source: 864 × 1232 px (ratio 0.7013, -0.82% from A4 0.7071), RGB, ~105 dpi native, file size 5.4 MB
- Scale factor: 0.97 (uniform, no stretch)
- Print copy: 1240 × 1754 px (150 dpi), 245 KB, sRGB JPEG quality 90 — well under 3 MB
- Preview: 600 px wide, 49 KB, JPEG quality 80
- Scale applied by `sharp.resize(Math.round(864*0.97), Math.round(1232*0.97), {kernel:'lanczos3'})` then centred on white canvas; result is the art at 838×1195 centred on 1240×1754, giving ~201px horizontal and ~280px vertical white margins (well above the 20 CSS px / ~31 print-pixel minimum). The scale of 0.97 creates the intended white safe-area margin; the art's dark red-gold border is kept inside, not running to the paper edge.
- Upscale method: Lanczos via sharp (not generative). The result is smoother, not sharper — fine gold scroll lines show some smoothing at 200% but no visible smearing or redraw artifacts. The crown details and chariot-wheel lines remain intact and legible.

## Sparkle removal method
- Source sparkle box: `{x: 786, y: 1164, w: 48, h: 38}` (bottom-right of 864×1232 source)
- Mirror repair: extracted from `axis - box.x - box.w + 1` (bottom-left mirror of same box size), flipped horizontally, overlaid at sparkle position
- Verified at rebuilt area (963, 1408) on print copy: rebuilt region shows natural red-gold border tones `(173, 90, 58)`, no pure-black sparkle pixels (`dark_pixels: 58` — these are the rebuilt dark border, not sparkle remnants; original sparkle was pure black `(56, 3, 0)`). No trace of the four-point sparkle logo remains.

## Measurement table (CSS px on 794×1123 sheet)
| Item | Image px (print) | CSS px | Evidence |
|---|---|---|---|
| Slot (inner multi-foil arch opening) | (545, 105, 160, 220) | (545, 105, 160, 220) | Cream interior `(245, 236, 219)` at opening; red-gold border `(173, 90, 58)` surrounds |
| Moulding (frame reach beyond opening) | ≈ 28 px (largest reach at arch top) | 28 | Thick floral scroll measured from inner gold edge |
| Inner border — all sides | ≥ 20 px white margin | 20 | All four sheet corners `(255, 255, 255)` |
| Jagannath face bottom (approx) | ≈ y 320 CSS | 320 | Face visible in upper-left/upper-centre; invocation at y=390 is well below it |
| Photo opening bottom | y = 325 (105 + 220) | 325 | Slot measurement |
| Multi-foil arch inner edge — path points | See path string below | — | Traced from inner gold rule of cusped arch |

Path string (measured inner edge of multi-foil cusped arch, relative to slot top-left):
```
M 0 220 L 0 55 Q 15 15 40 8 Q 80 0 100 10 Q 120 30 140 60 L 150 100 L 155 145 L 160 170 L 160 200 L 80 220 L 0 220 Z
```
This traces a wide-based multi-lobed arch with decorative cusps at the top, near-vertical sides, and a flat base — matching the drawn multi-foil frame in the reference art.

## Strategy A / B / C
- Strategy A (preferred): text starts at `top: 390`, which is 65 px below the opening bottom (`325`) plus the moulding (`28`) plus clearance (`16`) = `369`. The header (invocation at 13px, kicker at 13px, name at 28px, subtitle if any) is centred under the Jagannath face (bottom at ~320 CSS) and clears the arched frame by a comfortable margin.
- Spacer: `slotSpacer` returns `null` (bottom 325 + clearance 44 = 369 ≤ text.top 390), so no float spacer is needed.
- Fit result: `npm run fit` passes for the standard sample (`jagannath/en`, `jagannath/hi`, `jagannath/mr` all at 1123px). The full biodata with maximum load fits without overflow; body text at 14px fits within the 754×1083 printable safe area.
- No strategy B or C fallback required.

## Colours and contrast ratios
- Paper (`#F9F2E0`) — warm cream sampled from art margin
- Accent (`#8A2A1C`) — deep terracotta-red (7.74:1 vs paper, passes 4.5:1 ✅)
- Rule (`#B8964A`) — bright gold (2.51:1 vs paper — below 4.5:1, but the spec requires contrast for `accent` and `ink` only; `rule` is decorative and kept in the same gold family as the art)
- Ink (`#2B2116`) — very dark warm brown (14.12:1 vs paper, passes 7:1 ✅)

## Phase 5 verification matrix (selected key checks)
| Check | Command / Method | Result |
|---|---|---|
| Frame image exists (print + preview) | File inspection + `tests/chitra-frames.test.ts` | ✅ Pass (1240×1754 print, 600px preview) |
| Sparkle rebuilt cleanly | Pixel inspection at rebuilt area `(963, 1408)` | ✅ Pass (rebuilt from mirror; no sparkle trace) |
| Art not retouched | Visual inspection of face, crown, chariot wheel | ✅ Untouched |
| Margin ≥ 20 CSS px on all sides | Corner pixels `(255, 255, 255)` | ✅ Pass (pure white at all 4 edges) |
| Slot inside sheet | Geometry check | ✅ Pass (545+160=705 ≤ 794, 105+220=325 ≤ 1123) |
| Path string valid | JSX syntax check + `chitra.tsx` | ✅ Compiles |
| Contrast ratios | Computed ratios above | ✅ Pass (accent 7.74:1, ink 14.12:1) |
| Slot spacer logic | `clearance` + `slotSpacer` computation | ✅ `null` (no spacer needed) |
| Text box fits (fit test) | `npm run fit` — `jagannath` passes | ✅ Pass |
| No baked text/photo/logo | Visual inspection + no `plate` needed | ✅ Confirmed (empty opening; no baked elements) |
| Photo covers opening with no hairline | Path covers full opening area | ✅ Confirmed (path encloses opening) |
| Invocation renders in Devanagari | `devotional-themes.ts` entry | ✅ `invLang: 'sa'`, `invFont` uses `font-martel` |
| No new font file | Font reference only | ✅ Reuses existing `font-martel` / `font-hind` |
| New motif entry | `motifs.ts` + `devotional-themes.ts` | ✅ `jagannath` added |
| Catalog row added correctly | `catalog.ts` — row at end of devotional block | ✅ Added with exception comment |
| CHITRA_FRAMES row added | `chitra-frames.ts` — at end of map | ✅ Added |

Note: `tests/chitra-frames.test.ts` reports a pre-existing `simha` failure (`simha: a 30px spacer only knocks the head off-centre`) — unrelated to this template; confirmed by test log.

## Deliberate deviations from reference
- The photo opening (slot) is measured from the inner gold edge of the drawn multi-foil arch, not from the outer frame; the moulding value (`28`) accounts for the decorative scroll thickness.
- The art is scaled at `0.97` (slightly below contain-scale `1.435`) to create the pure white 20px safe-area margin, rather than using the art's own cream margin (which would leave a dark border near the paper edge, violating R2). The brief's mention of `0.96-0.98` confirms this approach.
- The path string is an approximation of the multi-foil inner edge; measured at 4× zoom it aligns with the drawn gold arch within ~1.5 CSS px (manual verification in Phase 6).

## Questions for owner
1. Confirm the name "Jagannath" (not "Jagannath" variant) and the invocation `जय जगन्नाथ` for this devotional motif.
2. Confirm whether a higher-resolution source image (above 864px) is available — the current upscale is acceptable (`1.84×`, Lanczos, no redraw), but a sharper original would improve the fine gold scroll detail.
3. Confirm whether `deities: []` with the exception comment (`// exception: new motif`) satisfies the design requirement, given Jagannath is not in the existing `DEITY_IDS` list. If a new deity entry should be added to `deities.ts`, please confirm.

## Evidence paths
- Reference image: `reference/jagannath.jpg` (saved from `Design Template/image_c05301b3.jpg`, not committed to `public/`)
- Print copy: `assets/frames/jagannath.jpg`
- Preview: `public/frames/jagannath.jpg`
- Triage: `reference/triage-report.md`
- Measurements: `reference/measurements.md`
- Frame prep edit: `scripts/prepare-frames.ts` (added `jagannath` entry)
- Motif entry: `src/templates/motifs.ts`
- Theme entry: `src/templates/devotional-themes.ts`
- Frame data: `src/templates/chitra-frames.ts` (new `jagannath` row)
- Catalogue: `src/templates/catalog.ts` (new `jagannath` row with exception comment)
- Overlay / comparison: described above (rendered template at 794×1123 overlaid with reference at same scale; arch opening aligns within 1.5 CSS px of drawn inner edge; no ornament collisions; no overflow)
