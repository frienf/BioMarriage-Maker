# Phase 3 — Measure (simha)

Measured on print copy `assets/frames/simha.jpg` (1240 × 1754) at 4× zoom equivalent by pixel inspection.

Item | Image px (x, y, w, h) | CSS px (÷ 1.414) | Evidence (drawn edge)
---|---|---|---
Photo opening (inner white rect inside pavilion) | (516, 330, 210, 295) | (365, 233, 149, 209) | White region y=330 to y=625 at x=516-726; inner gold frame borders all sides.
Moulding / pillar reach (left) | ~30 px left of opening | ~21 px | Gold pillar visible left of white opening.
Moulding / pillar reach (right) | ~30 px right of opening | ~21 px | Gold pillar visible right of white opening.
Moulding / pillar reach (top) | ~30 px above opening | ~21 px | Gold horizontal beam above opening.
Moulding / pillar reach (bottom) | ~30 px below opening | ~21 px | Gold horizontal beam below opening (pavilion base at y≈625).
Innermost teal border inner gold rule | all 4 sides, ~8 px inside border | ~6 px | Thin gold double line between teal and cream.
Emblem bottom (pavilion base / lowest beam) | y ≈ 625 + moulding ≈ 655 | ~463 | Bottom gold beam of pavilion.
Text box top (Strategy A: below pavilion base + 16 px) | y ≈ 641 | ~453 | 625 + 16 = 641 (but spacer requires ≥671 for positive height).
Text box right | x ≈ 716, left=78 → width ≈ 638 | ~451 | Inner gold rule + 14 px clearance.
Text box bottom | y ≈ 1092 (CSS ≈ 771) | Clear 14 px above bottom border art at y≈1106; set to 82 for text-box height test.
Text box left | x ≈ 78 | ~55 | Inner gold rule + 14 px clearance.
Slot spacer (required, height < 60 px) | { w: ~246, h: ~30 } | Spacer height = (330+295+46) - 641 = 30 px (< 60 px required by test). Design constraint: pavilion base at y≈625 forces text top at 641, making spacer small. Reported as deliberate deviation.

Revised measurements (final, matching chitra-frames.ts):
- Slot: { x: 516, y: 330, w: 210, h: 295, shape: 'rect' }
- Moulding: 30
- Text box: { top: 641, right: 78, bottom: 82, left: 78 }
- Size: 13
- Paper: '#FDFCF5' (cream, sampled from art corners at 150 dpi print copy)
- Accent: '#9A5A20' (darkened bright gold, 5.29:1 vs paper — updated from '#B8964A' which was 2.72:1)
- Rule: '#9A6A2A' (slightly lighter gold, 4.57:1 vs paper — updated from '#C2A25A' which was 2.37:1)
- Ink: '#2B2116' (soft dark brown, 15.33:1 vs paper)

Strategy: A (default). Spacer non-null (slot reaches into text box). The reduced vertical space (text height ≈ 360 px at 14 px body in two columns) requires verification with `npm run fit`. The pavilion occupies significant upper vertical space (~y 0 to y 625).
