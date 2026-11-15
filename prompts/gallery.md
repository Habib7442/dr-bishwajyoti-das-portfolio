# Gallery

The user asked for this on 2026-11-15: "make gallery page … show all these posters there in individual page … show as cards along with images". It adds `/gallery` and `/gallery/[slug]` beyond the AGENTS.md page list, at the user's explicit request.

## Built
- `/gallery` (`app/gallery/page.tsx`): eyebrow, h1 "What the doctor sees", and an intro. Then a grid of cards (1 / 2 / 3 columns), one per `scopeViews` entry. Each card has a navy top with the circle photo (`ScopePhoto`), then the title (h2), the text and "View photo →". The whole card links to its photo page.
- `/gallery/[slug]` (`app/gallery/[slug]/page.tsx`): an "All photos" back link, the full `ScopeViewPoster` (title as the h1, photo preloaded), "Related service" pills (the poster's services + Endoscopic ENT Check-ups), and the CTA. Static params come from `scopeViews`.
- `components/ScopePhoto.tsx`: shared circle crop (focus / rotate / zoom), used by the poster and the cards.
- Posters stay on the service pages. `/services/endoscopy` links to the gallery.
- Copy lives in `pages.gallery` (data/site.ts). Nav: "Gallery" (hidden at 768–1023 so the name isn't truncated). Footer menu: "Gallery". The sitemap includes `/gallery` and each photo page. `loading.tsx` uses PageLoader on both routes.
- No labels on the photos (standing client preference).

## Adding a photo later
Add an entry to `scopeViews` in `data/scopeViews.ts` (photo in `public/images/practice/`). The gallery card, its page and its sitemap entry appear automatically.

## Checks
tsc, lint and build pass (`/gallery/laryngoscopy` and `/gallery/otoendoscopy` are prerendered). Puppeteer at 1440, 1024, 768 and 375: no horizontal scroll and no console errors. The navbar fits at 768.
