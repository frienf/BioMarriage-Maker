# How to add a new template in 2 minutes

1. Create folder `public/templates/<template-id>/`.
2. Add `background.webp` (original art, untouched) and `thumb.webp` (thumbnail).
3. Add `manifest.json` following the schema in `src/templates/schema.ts`.
4. Run `npm run gen:index && npm run validate:templates`.
5. Commit. The gallery picks it up automatically.
