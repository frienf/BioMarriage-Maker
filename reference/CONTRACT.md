# Contract — Sudarshana chitra frame (max depth L99, no phases skipped)

**Route:** Chitra (layout 'chitra'). One new TEMPLATES row + one new CHITRA_FRAMES row, keyed `sudarshana`, motif `balaji`. No new component, no LayoutKind change, no per-template TSX. Existing rows untouched.

**Numeric rules honoured:**
- Sheet 794 × 1123 CSS px; print copy 1240 × 1754 px (ratio print:CSS = 1.5617, uniform, no stretch).
- R2/R7: uniform scale so outermost drawn pixel clears ≥ 20 CSS px (≈ 31 print px) from every sheet edge; centred; remainder pure white. Source 896 × 1200 (aspect 0.7467, 5.6% off A4 0.7071, ~108 dpi) upscaled with Lanczos (no generative redraw).
- Print copy → assets/frames/sudarshana.jpg (outside public/); 600 px preview → public/frames/sudarshana.jpg.
- R6: sparkle painted out by mirroring the bottom-left corner into the bottom-right sparkle box; verified clean at 400%.
- R3/R5: Balaji emblem and Sudarshana Chakra watermark never retouched/recoloured; nothing prints over them.
- R6: text box inside drawn inner border, ≥ 8 CSS px clear of ornaments; photo opening = inside of drawn frame (shape 'path').
- R7: no loading='lazy', no SVG <pattern>, nothing within 20 CSS px of paper edge.
- R8: fonts + invocation from DEV_THEmes.balaji; no hard-coded Georgia.
- Colours (sampled): paper #2e3233, ink #f5f1e8 (11.5:1 vs paper ≥ 7), accent #e4cf98 (8.44:1 vs paper ≥ 4.5), rule #e4cf98.
- R12: strategy A preferred (text top = photo-frame lower edge + 16 CSS px; no spacer if geometry allows).

**Stop conditions:** duplicate art, sparkle not removable cleanly, soft/smeared upscale, ambiguous arch, A/B/C all fail fit, any rule unsatisfiable, 5 loops exceeded.
