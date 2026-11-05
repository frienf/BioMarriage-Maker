# Phase 1 — Triage (simha)

(a) Real dimensions: 864 × 1232 px (mode RGB, no embedded DPI). Aspect ratio H/W = 1.4259 (A4 = 1.4142). Difference = +0.83 % (source slightly taller than A4). Effective dpi at A4 (794×1123): 864/794 ≈ 109 dpi horizontally, 1232/1123 ≈ 110 dpi vertically — well below 150 dpi target. Will need Lanczos uniform upscale to ≥1588×2246.

(b) R1–R12 confirmation / corrections:
- R1: Confirmed — cream field + deep teal border + gold feathers/swords + inner gold rule.
- R2: Confirmed — continuous motifs all four sides; top scalloped/canopy gold inner edge.
- R3: Confirmed — golden two-pillar pavilion (mandap) upper-centre, kalash with flame, small swastik symbol. No baked name.
- R4: Confirmed — vertical rectangle photo opening between pillars, substantial pillar/beam reach on all sides. Slot shape = rect.
- R5: Confirmed — large faint gold walking lion in middle of cream field. Must stay as ART.
- R6: Confirmed — sparkle/diamond generator logo at bottom-right on teal border. Must be fully removed, rebuilt with paper colour / mirror repair.
- R7: Source 864×1232, ratio 1.426 (~0.83% off A4 1.414). Must reach A4 by uniform scaling + contain padding (white/paper colour at corners), not stretch. Must upscale uniformly with Lanczos + light unsharp mask to ≥1588×2246. Must maintain ≥20 CSS px clean white/paper margin on all sheet edges after scaling.
- R8: Colours sampled: cream paper (~#FDFCF5 / #F8F4E8), deep teal border (#145250 / #1A4F55 family), bright gold rule/accent (#B8964A / #C2A25A), soft dark brown ink (#2B2116 / #3A2A1C). Contrast ratios to be verified after final colour sampling.
- R9: New motif `simha` added to MOTIFS and DEV_THEMES. Font pair: reuse `var(--font-martel)` + `var(--font-hind)` (default for chitra/deity templates). Invocation: reuse `shiv` theme invocation `॥ ॐ नमः शिवाय ॥` (matches lion / regal theme); confirm exact wording with owner.
- R10: No duplicate. New template `simha`, not same as any existing 26 + chitra frames.
- R11: Add TEMPLATES row at end of chitra block; CHITRA_FRAMES row at end of that map.
- R12: Strategy A — text box starts below pavilion base + 16 px clearance. Since pavilion occupies significant upper vertical space (~y 0 to ~y 330 of 1123), reduced vertical text space. Must measure precisely in Phase 3.

(c) Inventory of elements (from visual inspection):
- ART: deep teal border with gold feathers/swords; inner gold double rule; golden pavilion (mandap) with two pillars, beams, kalash with flame, swastik; large faint gold walking lion watermark; cream paper base.
- BAKED LOGO (must remove): sparkle/diamond logo + small circle at bottom-right corner on teal border.
- PHOTO OPENING: clean vertical rectangle inside pavilion, upper-centre.
- NAME BAR / PLATE: none drawn (design has no baked name bar; text goes over cream field, but head places kicker/name below pavilion base).
- WATERMARK: faint gold lion (ART) — must NOT be retouched.
- TEXTURE: smooth cream paper, no rough texture; teal border has smooth gold ornament.

(d) Printable safe area: After applying 20 CSS px (≈ 28 px at 150 dpi, ≈ 42 px at 100 dpi) uniform margin from sheet edge, the inner art area is 794-40 = 754 × 1123-40 = 1083 CSS px. The clean text rectangle must stay within the inner gold rule and ≥8 px clear of every ornament. Given the pavilion takes ~300 px of vertical space, the remaining text area is ~760 px high. Must verify with measurement that full biodata fits at 14 px body.

Clean text rectangle (preliminary, measured in Phase 3): text box must start below pavilion base (lowest beam) + 16 px clearance. Based on visual estimate, pavilion base ~CSS y 300-330; so text top ≈ 346. Bottom must clear 14 px above lowest border art (~CSS y 1090), giving text height ≈ 744 px. Two-column body at 14 px = sufficient for standard biodata; must verify with `npm run fit`.

(e) No duplicate or near-duplicate. Not `simha` in existing 26 templates or chitra frames.

(f) Route decision: Chitra route (layout 'chitra', one prepared frame image + CHITRA_FRAMES row + TEMPLATES row + `simha` motif entry). No new component, no new LayoutKind.

Risks:
- Sparkle removal must fully rebuild border; any trace at 400% zoom = failure.
- Source is low-res (109 dpi at A4); upscale must stay sharp; generative redraw banned.
- Reduced vertical space from pavilion means body must be compact; if `npm run fit` fails at 14px, must confirm with owner whether to reduce to 13px or adjust layout.
- No baked plate/bar for name — kicker/name placed over cream, must stay clear of lion watermark's darkest lines.

No stop conditions triggered: file not missing; art does not duplicate; sparkle can be removed; upscaled gold linework must be inspected after upscale; photo opening is unambiguous (vertical rectangle inside pavilion); rules are satisfiable.
