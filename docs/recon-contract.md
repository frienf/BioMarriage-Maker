# Phase 0 — Recon contract (simha / image_921253d2.jpg)

Files read in full: catalog.ts, chitra.tsx, chitra-frames.ts, chitra-art.ts, render.tsx, devotional-themes.ts, motifs.ts, rows.ts (partial), base-parts.tsx, prepare-frames.ts, tests/chitra-frames.test.ts, docs/superpowers/specs/2026-10-20-chitra-frames-design.md, package.json.

Numeric rules (from spec, in my own words):
- Print copy: exactly 1240×1754 (A4 at 150 dpi). Preview: 600px wide. Print copy never under public/.
- Slot = inside edge of drawn photo opening inside the pavilion. Text box = padding from sheet edge, 14px clear of inner gold rule / ornament, top 10px below emblem base, bottom 14px above lowest border art.
- No stretch: source scaled uniformly with `fit: 'contain'`, padding with paper-colour at corners, then to A4. Never generative redraw.
- Sparkle/logo at bottom-right removed via mirror repair (mirror bottom-left to bottom-right, flipped). Residual rebuilt with pure white / matching paper.
- Contrast: accent ≥4.5:1 against paper; ink ≥4.5:1 (preferably ≥7:1 per R8).
- All text live. Photo opening = inside of pavilion rectangle. No SVG pattern, no lazy loading, no hard-coded Georgia.
- One new motif entry (`simha`); one new CHITRA_FRAMES row; one new TEMPLATES row. Nothing else changes.

Reference read (image_921253d2.jpg, 864×1232):
- R1 confirmed: cream/ivory central field; deep teal/emerald outer border with repeating gold peacock feathers and crossed/upright swords; thin gold double rule between border and cream.
- R2 confirmed: continuous gold feather/sword motifs on all four sides of teal band. Top has scalloped/arced gold inner edge (canopy). Inner gold rule visible.
- R3 confirmed: ornate golden two-pillar pavilion (mandap) at upper centre, crowned by kalash with flame and small swastik-like symbol. No baked name over it.
- R4 confirmed: clean vertical rectangle photo opening between two golden pillars, upper-centre. Moulding = reach of pillars and beams beyond opening (substantial, ~20-30 px).
- R5 confirmed: large faint gold walking lion in middle of cream field. Must remain as ART, text may overlay but must stay legible over darkest lines.
- R6 confirmed: small sparkle/diamond generator watermark at bottom-right corner sitting on teal border. Must be fully removed, border rebuilt.
- R7 confirmed: source 864×1232 (ratio 1.426 vs A4 1.414, ~0.8% off). Must bring to A4 ratio by uniform scaling + contain padding (white/paper colour). Must upscale uniformly to ≥1588×2246 with Lanczos + light unsharp mask (or ESRGAN). No generative redraw. Must leave ≥20 CSS px clean margin on all sides.
- R8 confirmed (hypotheses): cream/ivory paper (#FDFCF5 sampled from reference); soft dark brown ink (#2B2116); bright gold accent (#B8964A / #C2A25A); deep teal border (#145250 / #1A4F55 family).
- R9 confirmed: motif `simha` missing from MOTIFS and DEV_THEMES. Must add. Suggested invocation: reuse `shiv` theme's `॥ ॐ नमः शिवाय ॥` or confirm exact wording with owner. Font pair: `Martel` + `Hind` (default for chitra/deity themes).
- R10: No duplicate `simha` in catalogue or frames. Not the same as any existing chitra frame (all existing chitra frames are deity-specific with different art).
- R11: Place new row at end of chitra block in TEMPLATES and at end of CHITRA_FRAMES.
- R12: Strategy A (default) — text box starts below pavilion base + 16px clearance. Given the pavilion occupies significant upper vertical space, vertical text space is reduced. Must verify with measurement that full biodata fits at body 14px.
