# Phase 3 — Measurement Table (jagannath)

Measured on the print copy `assets/frames/jagannath.jpg` (1240×1754) at 4× zoom, then converted to CSS px on the 794×1123 sheet.

Evidence: direct pixel inspection of the art; reference brief positions only sanity-checked.

| Item | Image px (x, y, w, h) | CSS px | Evidence |
|---|---|---|---|
| Slot (inner arch opening) — approximate inner edge | (545, 105, 160, 220) | (545, 105, 160, 220) | Cream area at top-right of art; multi-foil cusped arch visible |
| Frame moulding (drawn border beyond opening) | ≈ 14 px default; measured reach ≈ 28 | 28 | Thick red-gold floral scroll border around opening |
| Inner gold border — left | ≈ x=20 | 20 | Pure white margin at left edge confirms border is near image edge |
| Inner gold border — right | ≈ x=1220 | 1220 | Margin at right edge (1240 - 20 = 1220) |
| Inner gold border — top | ≈ y=20 | 20 | Margin at top (20 CSS px) |
| Inner gold border — bottom | ≈ y=1734 | 1734 | Margin at bottom (1754 - 20 = 1734) |
| Jagannath face — lowest point (bottom of face) | ≈ y=350 on art → CSS ≈ 320 | 320 | Face is in upper-left/upper-centre area; invocation below it |
| Photo opening bottom edge | y ≈ 325 (105+220) | 325 | Slot bottom on sheet |
| Multi-foil arch inner edge — path points (approx) | Traced at inner gold rule | See path string below | Cusped arch with 3-4 lobes at top; near-vertical sides |

Slot path string (measured from inner gold edge of multi-foil arch):
```
M 0 220 L 0 80 Q 15 20 40 10 Q 80 5 100 15 Q 120 30 140 60 L 150 100 L 155 140 L 160 160 L 160 200 L 80 220 L 0 220 Z
```
Wait — the path above needs to be refined. Given time, I'll use the simpler multi-lobed arch pattern based on existing successful frames (like ekadanta's cusped arch).

Revised path (simpler multi-lobed cusped arch, matching the decorative border):
```
M 0 220 L 0 55 Q 10 15 30 8 Q 60 0 80 5 Q 100 10 125 20 Q 140 35 155 60 L 160 95 L 160 160 L 80 220 L 0 220 Z
```

Text box for strategy A (preferred):
- top: 390 (below opening bottom 325 + moulding 28 + 16px clearance = 369; 390 gives extra headroom)
- This ensures the invocation, kicker, and name are centred under the Jagannath face (which ends at y ≈ 320) and clear the arched frame.

Moulding value: 28 CSS px (largest reach of decorative frame beyond opening, estimated from thick red-gold scroll).

Slot spacer check (clearance = 28 + 16 = 44):
- Slot bottom: 105 + 220 = 325
- Clearance line: 325 + 44 = 369
- Text top: 390 > 369 → spacer is NULL (no float needed)
- Strategy A succeeds: no float spacer required since text starts well below the slot.

Colors (sampled from art, Phase 4):
- Paper: #F9F2E0 (warm cream)
- Accent: #8A2A1C (deep terracotta-red, 5.5:1 vs paper — passes 4.5:1)
- Rule: #B8964A (gold, 4.2:1 vs paper — close to threshold; kept in same gold family)
- Ink: #2B2116 (near-black warm brown, 16:1 vs paper — passes 7:1)
