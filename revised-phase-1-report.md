# Phase 1 — Revised (post-correction) — read-only report

Status: git init + baseline commit `a89ca5b` done; jpeg-js removed; package.json/lock clean.
No layout code written yet. Overlays (`measured-overlays/*.svg`) created; manifest artwork NOT deleted (per #2).

## Revised plan (per instructions):
- Source = one flattened JPG raster per design (full-page art). No layer splitting.
- Code builds: CSS photo mask (mask on drawn opening), content text, body region (starts below header band), thin geometric rules ONLY (no SVG redraw of deity figures, borders, or watermarks).
- Photo mask: CSS `border-radius` / `clipPath` positioned exactly on the drawn opening.

## The 4 supplied designs (measured, with overlay boxes at measured-overlays/)

| Design | File | Size | Ratio | A4 pass (0.707 ±1%) | Photo slot sheet px | Slot type | Deity panel / header art | Content body sheet px (start / bottom) | Sparkle (bottom-right) |
|---|---|---|---|---|---|---|---|---|---|
| T1 Lakshmi+elephants | image_146c7743.jpg | 896×1200 | 0.7467 | FAIL (+5.6%) | l502 t158 r654 bo326 w152 h168 | circle (ESTIMATED from bright opening) | top-left panel l124 t122 r443 bo290 (includes elephants + Lakshmi + platform) (ESTIMATED) | l97 t197 r697 bo872 (below header y197; clears slot + panel via split) | l620 t960 r666 bo995 (MEASURED) |
| T2 Green lotus | image_404a553f.jpg | 864×1232 | 0.7013 | PASS (within 1%) | l549 t101 r723 bo273 w174 h173 | circle (MEASURED) | Lakshmi figure top-center l332 t64 r495 bo228 (MEASURED) | l189 t27 r769 bo1089 (full-width; must clear lotus strip ~x270 sheet; ends at gold bottom ~y1089) (MEASURED bottom line y30, bottom border none) | l765 t1050 r788 bo1088 (MEASURED) |
| T3 Murugan+vel | image_9372ce8f.jpg | 896×1200 | 0.7467 | FAIL (+5.6%) | l543 t136 r678 bo333 w135 h197 | rect (ESTIMATED) | deity/window frame l350 t60 r520 bo310 (ESTIMATED) | l70 t340 r725 bo1065 (inner frame; feathers near source y1095 → sheet y1024; body trimmed y1065) (MEASURED top border y3, bottom y1183) | l800 t1070 r835 bo1130 (MEASURED) |
| T4 Stone arch | image_30039c0.jpg | 864×1232 | 0.7013 | PASS (within 1%) | l512 t127 r671 bo373 w159 h246 | arch + sill/corbels (ESTIMATED; includes drawn opening + lower decorative corbel) | carved niche/deity panel l90 t65 r460 bo330 (ESTIMATED) | l74 t150 r719 bo980 (excludes left border art ~x74 and arch slot; bottom below sill y373; above decorative band) (MEASURED top line y0, bottom y1231) | l780 t1080 r810 bo1130 (MEASURED) |

Exclusions (red boxes in overlays):
- T1: photo slot + deity panel + platform (ESTIMATED); content split left/right to avoid both.
- T2: photo slot + figure (MEASURED); content full-width; left content must start past lotus strip (~sheet x270).
- T3: photo slot + deity panel (ESTIMATED); content within inner frame.
- T4: photo slot (includes arch + sill/corbels) + niche (ESTIMATED); content excludes left border art and arch slot.

Body region definition (per instruction — below header band):
- T2: starts at y27 (no separate header band; full-width paper); must clear left strip.
- T4: starts y150 (below decorative top border). Content excludes arch.
- T1/T3: start below drawn header/art zone (~y197 / y340).

Ratio fix (per instruction — tolerance 1%, scale by width, trim ≤9px bottom):
- T2/T4 (0.7013 ±0.8% of target): PASS. Scale by width; no trim needed.
- T1/T3 (0.7467): FAIL by +5.6%. Scaling width to 794 produces height ≈1064 (trim ≈59px), exceeding 9px trim. **Fix requires regeneration, not trimming.**
- Revised method: regenerate T1/T3 at exact A4 ratio 0.707 ±1% with width ≥1588 (2× output), keep current art composition, then remap slot/body against new pixels.

Point 5 (crisp + sparkle):
- All 4 sources < 1588×2246: max 896×1200 (T1/T3) < 1588; 864×1232 (T2/T4) < 1588.
- Each overlay shows a lime sparkle box at bottom-right (visible decorative point in JPG).
- **Recommendation: regenerate all 4 at ≥1588×2246 A4 ratio, flatten to JPG, keep art flat (one layer per design).** Art is decorative only — no interactive elements required.

Point 2 (no SVG redraw): confirmed. Plan = one background JPG + CSS photo-mask position + text/block code only. No SVG recreation of deity panels, borders, or frames (those stay in the background raster). Thin geometric rules (only where needed for layout structure) are CSS.

No code written. Overlays exist (`measured-overlays/*.svg`). Manifest system NOT deleted (per instruction #2: do not delete artwork until rebuilt passes verification). Awaiting Phase 2 approval with T1/T3 regeneration decision.
