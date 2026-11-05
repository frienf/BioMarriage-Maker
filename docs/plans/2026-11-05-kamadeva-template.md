# Plan: Kamadeva chitra template (new slug `kamadeva`)

**Date:** 2026-11-05
**Status:** implementation complete; verification green (see reference/kamadeva-final-verification.md)
**Feature:** One precision-measured, print-ready Chitra template `kamadeva` from `Design Template/image_4630a88d.jpg` (Kamadeva: crossed sugarcane bow and arrows with flower emblem, chamfered rose-gold portrait frame top-right, faint Sri Yantra watermark, cream card).

## Contract (honoured in full)

- Route: Chitra (layout 'chitra'). One new TEMPLATES row + one new CHITRA_FRAMES row, keyed `kamadeva`, motif `kamadeva`. No new component, no LayoutKind, no per-template TSX. Existing rows untouched.
- Sheet 794 × 1123 CSS px; print copy 1588 × 2246 px; ratio print:CSS = 2.0 uniform, no stretch. Source 864 × 1232 (0.7013, within 1% of A4 0.7071).
- R2/R8: uniform Lanczos upscale ≈ 1.84× so the outermost drawn pixel clears ≥ 20 CSS px from every sheet edge; centred; new margin pure white. Report the final scale.
- Print copy → assets/frames/kamadeva.jpg (outside public/); 600 px preview → public/frames/kamadeva.jpg.
- R1: marble backdrop cropped away completely; only cream card + rose-gold border print.
- R3/R5: bow emblem and Sri Yantra watermark never retouched/recoloured; nothing prints over them.
- R6: text box inside innermost rose-gold line, ≥ 8 CSS px clear of ornaments; photo opening = inside of drawn chamfered frame (shape 'path').
- R7: no loading='lazy', no SVG <pattern>, nothing within 20 CSS px of paper edge.
- R9: colours sampled from the art; accent ≥ 4.5:1 and ink ≥ 7:1 against paper.
- R10: motif `kamadeva` (invocation ॥ ॐ कामाय नमः ॥, invLang 'sa', layout classic, saraswati-classical font pairing reused, tileOpacity 0.10–0.12, no figure, no twoPage). No drawn logo/ornament required by any test — verified by grep.
- R12: strategy A preferred (text top = photo-frame lower edge + 16 CSS px; header centres under the bow emblem).
- R13: report strategy used + fit result with text-area numbers.
