# Laryngoscopy explainer graphic

User approved "generate in your best way" (2026-11-15). This file records what was built.

## Goal
Show a labelled real laryngoscopy photo (desktop 1600×1000, mobile 1080×1350) and add it to `data/practice.ts`.

## Decisions
- **Built in code, not Canva.** The Canva tools can't mask a photo into a circle or set font family or letter spacing. `scripts/laryngoscopy-graphic.cjs` draws an SVG overlay (text turned into paths from Inter and Bricolage Grotesque via opentype.js) and composites it with sharp.
- **The photo is rotated 180° only, nothing else.** In the source the cords meet at the bottom, which puts the epiglottis at the bottom. After rotating, the image is in the standard view: epiglottis at the top, the V of the cords, and the dark airway between them. The doctor should confirm the labels.
- **No anatomy labels** (user request, 2026-11-15): there are no leader lines, dots or label text. On desktop, the text block is centred vertically against the circle.
- `data/practice.ts` adds `width`/`height`, `mobileSrc`, and `services` (slugs) to the requested entry. Featured, consented images show on `/services/throat` and `/services/endoscopy`.
- Art direction: `getImageProps` + `<picture>`, using the portrait source below 640px (as in the Next image docs).

## Files
`public/images/practice/{laryngoscopy-raw,laryngoscopy-v2,laryngoscopy-mobile-v2}.jpg` (renamed to `-v2` when the labels were removed, so cached copies of the old labelled versions can't be shown), `data/practice.ts`, `components/ui/practice-figure.tsx`, `app/services/[slug]/page.tsx`, `scripts/laryngoscopy-graphic.cjs`.

## Manual test
1. `npm run dev` → `/services/throat` and `/services/endoscopy`: the graphic shows under the hero, with the caption below it.
2. At 375px, the portrait version loads (Network tab: `laryngoscopy-mobile.jpg`). At 768/1280/1536px, the landscape version loads.
3. No horizontal scroll at 375px. Other service pages show no graphic.
