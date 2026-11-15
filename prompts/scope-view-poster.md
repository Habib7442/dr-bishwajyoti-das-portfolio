# "What the doctor sees" scope posters

The user supplied the full spec on 2026-11-15. It replaces the baked JPG poster from `prompts/laryngoscopy-graphic.md`.

## Built
- `data/scopeViews.ts`: laryngoscopy + otoendoscopy (text, photo, focus, labels as % of the circle, `services` for compact placement). TODO: the doctor confirms the labels.
- `components/ScopeViewPoster.tsx` (client): a navy card with the text block, a numbered legend (`<ol>`), and the photo cropped to a circle with numbered marker buttons. Hovering or focusing a marker highlights it and its legend row; tapping toggles it. Each marker has a white tooltip. Animation: the circle scales from 0.92 to 1, the markers pop in one after another, and the markers pulse while idle (reduced motion: fade only, via MotionConfig). Dev-only click-to-log of a marker position.
- `/services/endoscopy`: an h2 "What the doctor sees" with both posters (h3 titles). `/services/throat` → laryngoscopy (compact). `/services/ear` → otoendoscopy (compact).

## Update (2026-11-15): labels removed
At the user's request, the posters show **no labels**: no numbered markers, tooltips, legend or dev click helper, and `labels` was removed from the data. Each poster is now the eyebrow, title and text plus the circle photo. (The label notes below are historical.)

## Deviations from the spec
- **Laryngoscopy shown turned 180°** (`rotate: 180`): the source photo is upside down. Turned, it's in the standard view and the spec's labels (epiglottis at the top) are correct.
- **`zoom: 1.1`**: a slightly tighter crop, so the black scope edge doesn't show inside the circle. The photos are not altered otherwise.
- Label positions measured from screenshots: cords 43/46, airway 50/62 (the spec had them swapped for this photo). Ear: malleus 51/25, eardrum 49/57, canal 16/55.
- Card padding p-6 / md:p-12 / lg:p-16 (compact md:p-8). The spec's p-10/p-14 (40/56 px) aren't on the DESIGN.md spacing scale.
- No shadow on the tooltip (DESIGN.md: no shadows).
- Legend rows react to hover only. Keyboard users focus the markers, so each label isn't tabbed twice.
- `/services/ear-problems` doesn't exist: the ear page is `/services/ear`.
- `/practice` (gallery + lightbox) is **not built**: it doesn't exist yet, and AGENTS.md doesn't list it. Waiting for the user's decision.

## Checks
tsc, lint, build pass. Screenshots via puppeteer-core at 1440 and 375 (endoscopy, throat, ear): no horizontal scroll, and the markers are on the right structures.
