# Route pages + loading states + page transitions

## Goal

Every navbar and footer link opens its own page. Page changes show:
- a thin sky progress bar
- a branded loader, or a skeleton on heavier pages, when loading is slow
- a subtle fade-up on the new page

The navbar and footer stay visible the whole time.

## Docs read

- AGENTS.md
- `node_modules/next/dist/docs/` — re-read before coding:
  - the file conventions for `loading.js` and `template.js`
  - `useSearchParams` (it needs a `<Suspense>` boundary during prerender with `cacheComponents`)
  - linking and navigating (prefetching, scroll behaviour)

## Existing code inspected

- Routes in `app/`:
  - `/`
  - `/services`, `/about`, `/book`, `/privacy`
  - metadata routes: `sitemap.xml`, `robots.txt`, `manifest`, icons, OG image
- **Navbar / Footer / FloatingWhatsApp are rendered by each page, not by `layout.tsx`.** A `loading.tsx` only replaces the page, so as things stand the navbar and footer would vanish while it shows.
- Links today:
  - nav: Home `#home`, Services `/services`, About `/about`, Reviews `#reviews` (hidden: no real reviews), Contact `#contact`
  - footer menu: Home, Services, About, Chamber `#contact`, Reviews `#reviews`, FAQ `#faq`
  - footer Treatments: `/services#<slug>`
- `SectionLink` + `HashScroll`: scroll to sections with no `#` in the URL. Navbar `aria-current` comes from `usePathname`.
- Motion library: `motion/react` ("Framer Motion" under its current name; AGENTS.md bans the `framer-motion` package).

## Decisions (owner chose "Create /chamber + /faq")

1. **New pages:**
   - `/chamber`: the Chamber section (map, timings, fee) + CTA band. Its `h2` becomes the page `h1`.
   - `/faq`: the FAQ section + CTA band, with an `h1`.
   - `/reviews`: the Reviews section. While `reviewsState()` is `"hidden"`, the page calls `notFound()` and is left out of the sitemap, and its nav/footer links stay hidden (same rule as today).
2. **Links become page routes:**
   - Home → `/`
   - Contact / Chamber → `/chamber`
   - Reviews → `/reviews`
   - FAQ → `/faq`
   - the navbar logo and footer brand → `/`
   - Footer Treatments stay `/services#<slug>`: a page route plus a card anchor, handled by the existing `HashScroll`.
3. **The home page keeps all its sections.** Only the links change.
4. **Navbar, Footer and FloatingWhatsApp move into `app/layout.tsx`.** The pages stop rendering them. The Reviews-link filter moves into the layout.
5. **FAQPage JSON-LD stays on `/` only.** The same FAQ on two pages must be marked up once, and `/` is the main page.
6. **`Contact` keeps its label** in the navbar and links to `/chamber`. The footer says "Chamber".

## Files likely to change

- new:
  - `app/chamber/page.tsx`, `app/faq/page.tsx`, `app/reviews/page.tsx`
  - `loading.tsx` in `app/`, `app/services/`, `app/about/`, `app/book/`, `app/chamber/`, `app/faq/`, `app/reviews/`, `app/privacy/`
  - `app/template.tsx`
  - `components/ui/route-progress.tsx`, `components/ui/page-loader.tsx`, `components/ui/page-skeletons.tsx`
- `app/layout.tsx`: Navbar, Footer, FloatingWhatsApp, `<Suspense><RouteProgress /></Suspense>`
- every `app/**/page.tsx`: drop Navbar, Footer and FloatingWhatsApp
- `data/site.ts` (`nav` hrefs, `pages.chamber` / `pages.faq` / `pages.reviews` copy and meta from existing facts), `components/sections/Footer.tsx` (menu hrefs)
- `components/sections/Navbar.tsx`: active state, mobile menu closes on route change
- `components/sections/Chamber.tsx`, `Faq.tsx`, `Reviews.tsx`: a `headingAs` prop (`h1` on their own page)
- `app/sitemap.ts`: add `/chamber`, `/faq`, and `/reviews` only when it is visible
- `app/globals.css`: `@keyframes` + `@utility` for shimmer and wave pulse
- `AGENTS.md`: scope update for the new pages

## Implementation requirements

### 1. RouteProgress (`components/ui/route-progress.tsx`, client)
- Rendered once in the layout, inside `<Suspense fallback={null}>`, because `useSearchParams` needs it under `cacheComponents`.
- **Start:** a capture-phase document `click` listener for `a[href]`. It ignores:
  - external origins, `tel:`, `mailto:`, `wa.me`
  - `target="_blank"` and `download`
  - modifier keys or a non-left button
  - clicks already `defaultPrevented` (in-page booking scroll)
  - a link to the same pathname + search; a hash-only change counts as the same page

  It also starts on `popstate` (back/forward).
- **Finish:** an effect on the `pathname` + `searchParams` change.
- **Show delay:** a 150ms timer before anything is visible. If the route finishes first, nothing shows.
- **Progress:** jumps to 20%, then creeps toward 85% with decreasing steps (an interval adding `(85 - p) * 0.08`). On finish it goes to 100% and fades out over 300ms. It auto-finishes after 10s.
- **Look:**
  - `fixed inset-x-0 top-0 z-[100] h-[3px]`
  - the bar is `bg-accent` with a width transition
  - the leading edge has a 2px navy glow (`shadow-[0_0_2px_var(--color-primary)]`) on a small right-end element
- **Reduced motion** (`useReducedMotion`): no width easing. The full bar appears and fades.
- `aria-hidden` on the bar, plus a separate `sr-only` `aria-live="polite"` region that says "Loading page" once per navigation (cleared on finish).

### 2. PageLoader (`components/ui/page-loader.tsx`, server-safe, CSS-only animation)
- Area: `min-h-[70svh] bg-base grid place-items-center`, `role="status" aria-live="polite"`.
- **Icon:** the Lucide ear paths inline at 56px, `stroke-primary`, stroke-width 2.
- **Waves:** three sky arcs (`stroke-accent`) to the right of the ear. Keyframes `opacity 0→1→0` and `scale 0.9→1.1`, 1.2s infinite, delays 0 / 0.2 / 0.4s.
- **Text:** "Loading…" (13px Inter, `text-ink/60`).
- **Delay:** the whole loader starts at `opacity-0` and fades in with a 250ms animation-delay, so fast loads never flash it.
- **Reduced motion:** `motion-reduce:animate-none` on the waves (shown static at 0.6 opacity). The delayed fade still applies.
- Used by the `loading.tsx` of `/`, `/about`, `/book`, `/chamber`, `/faq` and `/privacy`.

### 3. Skeletons (`components/ui/page-skeletons.tsx`)
- **`ServicesSkeleton`** (used by `app/services/loading.tsx`): an eyebrow + title bar, then 4 rows, each with a title bar and a small rounded block on the right, separated by `border-primary/10` dividers.
- **`ReviewsSkeleton`** (used by `app/reviews/loading.tsx`): a title bar, then 3 card outlines in a row (1 column on phones, 3 on desktop).
- **Blocks:** `bg-primary/8 rounded-xl` plus a `shimmer` utility, a light gradient `::after` sweeping left → right on a 1.4s loop. Static with reduced motion.
- **Behaviour:** the same 250ms delayed fade-in as the loader, and `role="status"` with an sr-only "Loading…".

### 4. Page transition (`app/template.tsx`, client)
- A `motion.div` keyed by `usePathname()`:
  - `initial={{ opacity: 0, y: 12 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}`
  - no exit animation
- Reduced motion: `MotionConfig reducedMotion="user"` already drops the transform, leaving opacity only.
- **Scroll:** Next's `Link` already scrolls to the top on navigation. `HashScroll` handles `#hash` and pending-section targets. No extra scroll code.

### 5. Navbar active state
- **Current page:**
  - `text-primary font-semibold underline decoration-accent decoration-2 underline-offset-8`
  - `aria-current="page"`
- **Other links:** `text-primary/70 hover:text-primary`.
- **Mobile menu:**
  - the current link is highlighted the same way (on navy: `text-white` + a sky underline; others `text-white/70`)
  - the Sheet becomes controlled (`open` state) and closes on a pathname change

### 6. Prefetch
- All internal links are `next/link` (already true, plus the new routes). Production prefetches links in the viewport, so the static pages mostly change instantly and the loader rarely shows.

## Accessibility requirements

- One `h1` per page. The Chamber, FAQ and Reviews sections get `headingAs="h1"` on their own pages.
- The progress bar is `aria-hidden` with a single polite announcement. The loaders are `role="status"`.
- Reduced motion is respected by all four pieces: bar, loader, skeleton shimmer and page fade.
- `aria-current="page"` on the active nav link (desktop and mobile).

## Acceptance criteria

- `npm run build`: `/chamber` and `/faq` prerender as static (○). `/reviews` is a 404 while there are no reviews.
- Every navbar and footer link goes to a page route. The Treatments links go to `/services` cards.
- The navbar and footer stay on screen during `loading.tsx` and the page fade.
- No progress bar or loader flicker on fast navigation in `npm start`.
- Back/forward shows the progress bar, and the active link updates.

## Checks to run

`npx tsc --noEmit`, `npm run lint`, `npm run build`, then `npm start` and screenshots via headless Edge (as in the footer step).

## Manual test steps

1. `npm run build && npm start`, then click every navbar and footer link. Each opens its own page, the active link updates, and the mobile menu closes on its own.
2. DevTools → Network → Slow 3G, then click Services. The skeleton appears after about 250ms; the navbar and footer stay.
3. Same with About / Chamber / FAQ: the ear loader with pulsing waves appears.
4. With no throttling, click between pages. No loader or bar flash, just the 0.35s fade-up.
5. Back/forward: the bar runs and the page changes.
6. With reduced motion turned on (OS setting): no wave pulse, no shimmer, no rise, just fades.
7. Lighthouse (mobile) on `/` and `/services`: Performance ≥ 90.
