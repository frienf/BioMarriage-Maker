# T1 Migration — Final Verification (Phase 7 update)

## Completed items (verified by script checks):
- Reference image preserved: Design Template/image_146c7743.jpg (not in public/)
- Frame print copy: assets/frames/t1-lakshmi-elephants.jpg (1240x1754, quality 90)
- Frame preview: public/frames/t1-lakshmi-elephants.jpg (600px, quality 80)
- Catalog row updated: layout 'chitra', collection 'devotional', motif 'lakshmi', blurb replaced
- Chitra-frames entry added: 't1-lakshmi-elephants' with motif 'lakshmi', slot oval, moulding 28
- Old component deleted: src/templates/t1-lakshmi-elephants.tsx (verified)
- Render.tsx cleaned: T1 import and case removed (verified)
- LayoutKind cleaned: 't1' removed
- SWATCHES cleaned: 't1' entry removed

## Critical remaining items for full spec compliance:
- Frame must be regenerated at 1588x2246 (current is 1240x1754 standard size)
- Sparkle removal: must verify at 400% zoom that no generator watermark remains at bottom-right (~838, 1150 in source)
- White margin: must verify at least 20 CSS px (40 print px) on every side (scale ~0.84 expected)
- Phase 4b migration grep results: must grep for all 't1-lakshmi-elephants', 'T1Template', 'image_146c7743', 'layout: t1', etc. and confirm no broken references
- Phase 5 full verification: npm run fit, npm run proofs, all locale/photo combinations
- Phase 6 overlay: render at 794x1123 and compare with reference at 50% opacity
- Phase 7 final report: measure from prepared print copy at 4x zoom, produce table

## Note on art quality (R7):
Source image_146c7743.jpg is 896x1200. At standard A4 scale (~0.84), art would be ~753x1008 with 20px white margins. The user explicitly requires 1588x2246 canvas. The standard-sized frame (1240x1754) passes tests but does not fully meet the R7 requirement. A final regeneration at 1588x2246 is required before final merge.
