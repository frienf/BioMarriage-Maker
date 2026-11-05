# Phase 1 Triage - sheshashayi

## (a) Real dimensions
- Source: 896 x 1200 px (`image_2123925d.jpg`)
- Aspect: 0.7467 (A4 target 0.7071 = 794/1123)
- Percent off: +5.61% (wider than A4; must add height, not trim width)
- DPI at A4 (794px sheet): 108 dpi (fails 150-dpi gate)
- Pre-authorised fix (R7): extend canvas to A4 ratio (~33px top + bottom), then upscale to 1588x2246.

## (b) R1-R10 confirmations
- R1 Parchment art: CONFIRMED (burnt-edge parchment, torn edges, white outside art kept white)
- R2 Border: CONFIRMED (carved gold/brown wave scroll with lotus buds protruding inward; innermost tips ~x 95 left, x 805 right, y 1095 bottom in source px)
- R3 Emblem: CONFIRMED (gold five-hooded naga over lotus, x 370-530, y 68-275, tail below; nothing prints over it)
- R4 Photo opening: CONFIRMED (oval at top-right, inside of drawn frame; opening about x 660-772, y 168-312; frame has jewelled cobra crown above ~y 95 and looped tail below ~y 345; asymmetric reach)
- R5 Watermark: CONFIRMED (faint Vishnu reclining on Shesha, x 195-700, y 430-722; text sits over it; legibility must be verified)
- R6 Sparkle: CONFIRMED (bottom-right generator watermark, about x 838, y 1140; must paint out and rebuild border corner; verify at 400%)
- R7 Quality: CONFIRMED (896px ≈ 108dpi at A4; 0.7467 vs 0.7071 = +5.6% off; fix pre-authorised: extend canvas, upscale uniformly to 1588x2246 with Lanczos + light unsharp mask)
- R8 Colours: Starting from art sampling; parchment around #F0DFB5 (#BE965B at edges, darker at bottom-left); ink dark brown; accent dark brown-gold; border gold.
- R9 Motif: CONFIRMED (new 'narayan' motif needed; existing motifs are ganesh/om/krishna/shiv/lakshmi/ram/hanuman/saraswati/mahadev/durga/ambabai/vitthal/balaji/khandoba; none match Sheshashayi)
- R10 Strategy: A selected (text box starts below oval tail + 16px; invocation, kicker, name centre under naga emblem; no float spacer needed if fit passes)

## (c) Element inventory
- ART (keep): parchment sheet, carved gold/brown border with lotus buds, gold naga emblem (top centre), oval photo frame (top right, with crown and tail), Vishnu reclining watermark (middle), parchment texture/mottling
- BAKED LOGO (paint out): sparkle logo bottom-right (~838, 1140)
- BAKED TEXT: none visible in reference
- BAKED PHOTO: none (frame is empty oval)
- NAME BAR / PLATE: none
- TEXTURE: parchment mottling, darker burnt edges

## (d) Printable safe area / clean text rectangle (Strategy A, estimated before measurement)
- Oval tail reaches ~y 345 source = ~323 CSS px
- Emblem bottom ~y 275 source = ~258 CSS px
- Strategy A text box: top ≈ 340 (below oval tail + 16 = 323 + 16 ≈ 339), left/right/bottom from border clearance
- Clean text rectangle: ≈ 610 px wide × 640 px tall (after measurement, confirm)

## (e) Catalogue duplicates
- No existing 'sheshashayi' or 'Sheshashayi' in TEMPLATES
- No duplicate blurb; new devotional entry with unique deity/theme
- No other frame has Vishnu reclining (Sheshashayi) watermark or oval portrait with cobra crown

## (f) Route and risks
- Route: chitra (existing layout, component, art pipeline). No new component, no new LayoutKind.
- Risks: sparkle removal (mirror repair must match asymmetric border); upscale softness (check at 200%); oval opening precision (must be within 1.5 CSS px of drawn rim); legibility over Vishnu watermark lines; invocation confirmation from owner; A4 ratio extension must not stretch art.

Gate: Resolution/aspect gates pre-authorised by R7. Sparkle removal is standard mirror method (works on symmetric borders). Design does not duplicate any template. Proceed.
