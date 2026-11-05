# Kanha — Phase 0 contract (honouring this)

1. 4 print px per CSS px on the 794×1123 sheet; all geometry measured on the print copy at 4x, converted by /2.
2. Never stretch; reach A4 by margin only; uniform scale; white is PURE WHITE; torn edge ≥ 20 CSS px from every edge at default scale; result ≥ 1588 px wide.
3. Text stays ≥ 8 CSS px clear of every ornament; the photo opening is the inside of the drawn frame; faint watermark art may sit behind text.
4. Chitra route only: prepared frame image + one CHITRA_FRAMES row + one TEMPLATES row; no new component/layout/TSX; print copy in assets/frames/ (never public/); 600 px preview in public/frames/.
5. All text live; paint out only the generator sparkle (R9); emblem, watermark, peacocks, vines are untouched art; no baked text/photo/name plate exists.
6. Geometry measured, never estimated, never copied from another frame; oval misfit ≤ 1.5 CSS px or switch to a traced path; moulding = largest reach toward the text, reported.
7. Text box clears the largest intrusion 8 CSS px on every side; largest-intrusion clearance wins over convenience; fit ladder: fallback scale → size 13 (permitted) → STOP and report.
8. Motif `krishna` (fonts/invocation from DEV_THEMES); colours sampled (paper = median over text zone); accent ≥ 4.5:1 vs paper, ink ≥ 7:1 (and ≥ 4.5:1), darken within hue if needed, report both.
9. No other template's row/art/component changes; TEMPLATES row at end of Chitra block; CHITRA_FRAMES row at end of map; tests updated only to admit kanha's 1588×2246 size.
10. Where repo spec/comments disagree with the brief, the repo wins — and the disagreements get said out loud in the report.
11. Fonts/invocation never hard-coded; no loading='lazy'; no SVG <pattern>; nothing within 20 CSS px of the paper edge.
12. Deity tagging: `deities: ['krishna']` on the row; deity tests run; `reference/` stays untracked and uncommitted.
