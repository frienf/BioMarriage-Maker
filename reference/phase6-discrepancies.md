PHASE 6 — OVERLAY / ITERATE DISCREPANCIES (durga-trishul)
Overlay: reference (864x1232 scaled to 1240x1754) vs rebuilt art at 50% opacity (reference/reference/overlay_final.jpg).
Loops used: 1 (initial build; adjustments made before loop). Maximum 5 allowed.

Verified discrepancies and fixes:
1. Art alignment: Trishul face, gold oval frame, torn edge, Sri Yantra all align well with reference; decorative borders match. PASS.
2. Oval opening: measured against drawn inner gold rim. The rebuilt art's oval opening (CSS x≈483, y≈83, w≈54, h≈64) aligns with the decorative frame. PASS (within 2 CSS px of reference position after conversion).
3. Torn edge registration: rebuilt torn edge appears at CSS y≈179-205; text box starts at 340, well below with ~135px clearance. PASS.
4. Sparkle: rebuilt cleanly from mirror of bottom-left corner; no sparkle trace at 400% zoom (reference/durga-trishul-sparkle-400.jpg shows pure rebuilt border). PASS.
5. Margin: visible maroon border fills ~90 CSS px at decorative art top, reducing toward bottom; ≥20 CSS px on all sides (top has largest visible margin at ~90px). PASS.
6. Text box: never crosses torn edge; clears gold border by ≥8px; header centered under Trishul; no float spacer needed. PASS.
7. Photo opening: oval shape 'oval'; empty beige state preserved; photo would cover fully. PASS (verified by code review of chitra.tsx slot rendering).
8. Art quality at 200%: gold filigree, Trishul lines, and Sri Yantra lines show slight softening from 1.84x upscale but remain clearly legible; no visible smear at decorative elements. Reported as "upscaled, not sharper" per R8. PASS (did not stop; shown in overlay).
9. Sacred iconography: Trishul-with-Durga-face and Sri Yantra untouched. PASS.
10. Scale: final 0.97 (reported), uniform (no stretch); margin filled with deep maroon #4C000A. PASS.

No iterations needed after initial measurement adjustments. Exit Phase 6.
