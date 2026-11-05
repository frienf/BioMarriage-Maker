# Kanha — Phase 1 triage (verified against the real file)

Source: `Design Template/image_6719927e.jpg` = `reference/kanha.jpg` (copy, untracked)

(a) Size 864 × 1232 px · aspect 0.7013 · 0.82% off A4 (0.7071) — inside 1%, ratio reached by margin, never by stretch. dpi at A4 ≈ 104.5 × 105.4 ≈ 105.
Upscale to 1588 × 2246 (1.84x for height-limited contain, but see (d): planned art scale is 1.76x print ≈ 105→185 dpi effective… actually 1588/864 = 1.838 full-width target; implemented as uniform scale 1.76 on a 1588×2246 white canvas).

(b) R1–R15 vs the real file:
- R1 A4 ratio: 0.82% off — confirmed, no ratio fix needed.
- R2 torn edge: comes within 5–15 px of image edges (measured: drawn extent left 6, right 5, top 13, bottom 11 @thr 240); appearance confirmed by eye (deckle, stains). Ornaments stay ≥ 35 px in. Default scale chosen: 1.76 print px/source px (= 0.88 CSS) — margins of the outermost drawn pixel ≈ 22 / 21 / 31 / 29 CSS px (L/R/T/B). Margin = PURE WHITE. Never stretched.
- R3 border: confirmed. Vines + white magnolia-like flowers both sides; top-left swag; bottom swags; SEVEN peacocks: left-top (y≈150–345), left-middle (y≈600–810), right-middle (y≈585–800), bottom-left corner, two facing at bottom centre (crests y≈1068), bottom-right corner. Top-right corner has no vine — frame sits there; right vine starts ≈ y 310 below the frame.
- R4 intrusions (measured @thr 190, source px): left ≈ x 137–139 (max, at y≈314–316 and y≈655), right ≈ x 729 (right-middle peacock beak, y≈628–633). Bottom-centre crests y≈1068; bottom-corner crests y≈1020 (estimate, will measure precisely in Phase 3); emblem lowest ≈ y 249; frame lowest (base scroll) ≈ y 330; right vine starts y≈310 at x≈784+.
- R5 emblem: peacock feather over bansuri + tassel on the flute's left end; x≈315–550, y≈90–250. Sacred iconography — untouched.
- R6 photo frame: carved gold-bronze single-peacock crown, oval opening; outer extent ≈ (630,45)–(805,330); opening ≈ (655,118)–(783,282); blank parchment fill. Opening MUST be covered fully under a photo (empty state = drawn parchment oval). Slot shape: start 'oval', check misfit ≤ 1.5 CSS px, else traced path.
- R7 watermark: faint feather+flute with floral garland, x≈270–585, y≈475–760 — kept, text may sit over it (legibility is a verification item).
- R8 parchment texture: lighter centre, darker/stained edges. Paper sampled = MEDIAN over text zone (x 200–660, y 300–1000) = (249,234,204) = #F9EACC.
- R9 sparkle: four-point translucent white star + diamond below it, bottom-right over tail/parchment, approx x 792–856, y 1155–1222. NOT art — to be painted out with flopped bottom-left mirror (corners verified to match closely, tear included). No baked text / photo / name bar / other logo.
- R10 quality: ~105 dpi → upscale to 1588×2246 (crop-none). No ESRGAN installed; Lanczos + light unsharp (sigma 0.5) per R10. Result is upscaled, not sharper — will be said in report. Softness check at 200% before continuing.
- R11 colours (hypotheses vs sampled): paper median #F9EACC (hypothesis #F2E3BF — overridden); accent hypotheses #6B4A22 (dark sepia-bronze peacocks/frame), rule #B08A3C — will sample and adjust; ink near #2B2016. Any accent < 4.5:1 gets darkened within hue, both values reported. No new hues.
- R12 motif 'krishna' exists in MOTIFS/DEV_THEMES — used, not edited.
- R13 siblings (print copies viewed):
  - vrindavan — peacock feathers, flutes, pink lotus border, mukut emblem, Radha–Krishna watermark, cream paper; kanha = aged torn parchment, sepia+gold, peacock/magnolia vines, carved oval w/ peacock. Materially different.
  - govind — sage-and-white, gold crown+flute emblem, rounded-rect portrait, lotus/feather corners on white; kanha = dark sepia on torn parchment, peacock border. Different.
  - shrinathji — teal Pichwai border, cows+pink lotuses, tilak, navy arched window, gold-on-navy; kanha = sepia/gold, carved oval, peacock crown. Different.
  No duplication; proceed.
- R14 rows: TEMPLATES row appended at end of Chitra block (after vaibhav-lakshmi); CHITRA_FRAMES row appended at end of map. No existing row/art/component touched.
- R15 strategy A default: text box from frame-lowest+16 ≈ y_css 326 to just above bottom-centre crests, between x 139+8 / 729−8. Box ≈ 503 × 580 CSS px. Ladder if max load overflows: (1) R2 fallback (contain-fit, torn edge may clip), (2) size 13 (tests permit 13–14.5; simha/jagannath/durga-trishul ride at 13), else STOP and report text-area numbers.

(c) Inventory:
ART (keep untouched): torn/deckle parchment page + stains (texture); side vines + white magnolia-like flowers; top-left swag; bottom swags (both ends) ; SEVEN peacocks (list above); head emblem (feather over bansuri + tassel); faint watermark (feather+flute+garland, centre); carved oval frame + peacock crown; blank parchment oval (empty state).
BAKED LOGO (remove): four-point sparkle + diamond, bottom-right (~x 792–856, y 1155–1222), over bottom-right peacock tail & parchment.
BAKED TEXT / BAKED PHOTO / NAME BAR / PLATE: none found — no paint-outs beyond the sparkle.
WATERMARK: the faint centre motif is art, not a generator watermark — kept.
TEXTURE: edge stains/mottling — kept; paper colour sampled from text zone.

(d) Clearances at default scale (s_css = 0.88; x_css = 16.9 + 0.88·x_src, y_css = 19.4 + 0.88·y_src):
- torn edge: L 22, R 21, T 31, B 29 CSS px ≥ 20 ✓
- nearest ornament to each sheet edge: far beyond 20 CSS px (frame top y_css ≈ 59, left vine x_css ≈ 28.6? — measured border inner edges are the constraint, not the margins; ornaments clear the 20 CSS px edge rule with room: leftmost ornament source x≈6+…, but ornaments ≥35 px in ⇒ ≥ 47 print px ≈ 24 CSS px — borderline for the torn-edge leaves at x≈35 src! Actually vine leaves reach x≈30–40 src at places (top-left swag starts x≈20?). Will verify ornament-edge clearance on the print copy; the ≥20 CSS px rule applies to ornaments vs paper edge — check in Phase 3 overlay; if any ornament breaks it, that is the R2-fallback case (by design: ornaments stay, torn edge clips).
- Intrusions: left in y∈[250,1012] ≈ 139 src ⇒ x_css ≈ 139; right ≈ 729 src ⇒ x_css ≈ 658; bottom-centre crests y_css ≈ 19.4+0.88·1068 ≈ 959; bottom-corner crests ≈ 917.
- Clean text rectangle (A): top ≈ 326 (frame 330+16), bottom ≈ 951… wait — bottom-centre crests are at y_css 959 and corner crests 917; the box must clear the LARGEST intrusion, so bottom limit = corner crests 917 − 8 = 909. Box ≈ x 147–650 (w≈503), y 326–909 (h≈583).
- Full-biodata fit at 14 px in 503×583: tight. vrindavan fits at 528×711/14px; kanha is narrower AND 128 px shorter. Expect to need size 13 at best; if max load still overflows → fallback scale rung → then STOP if still failing. Ink/accent contrast will be verified numerically.

(e) Sibling deltas: see (b) R13 — different paper (aged torn parchment vs cream/white/sage/teal), border (peacocks + magnolia vines vs lotus/cows/feathers), frame (carved oval + peacock vs arch/window/scallop), direction (sepia+gold vs green/teal/gold). No material duplication.

(f) Route & risks:
Route: chitra (image is the page) — one CHITRA_FRAMES row + one TEMPLATES row; motif krishna; no new component; print copy assets/frames/kanha.jpg (1588×2246, ≥1588 ✓), preview public/frames/kanha.jpg (600 px).
Risks: (1) fit at 13–14 px in a ~503×583 box; (2) sparkle repair seam — corners match, expected clean, verify at 400%; (3) upscale softness — Lanczos+sharpen only, no generative fill; verify at 200%; (4) accent contrast vs parchment (gold vs #F9EACC is weak — will darken within hue); (5) bottom-corner crest measurement must be exact (the binding constraint for the box bottom); (6) print clipping of the torn edge — owner question.
Gate: art does not duplicate a sibling; sparkle removal is feasible (corners verified mirror-friendly); resolution gate pre-authorized. Proceed to Phase 2.
