# Extra pages: /book, /services, /about

## Goal

Add three standalone pages next to the one-page home:

- `/book`: the booking form on its own page, with the chamber details beside it
- `/services`: every service as a card in a grid (not an accordion)
- `/about`: the "Meet your doctor" block on its own page

The home page keeps all its sections, so local SEO and the current flow stay the same. The new pages reuse the existing components and data. No copy is invented.

## Scope change (flag)

AGENTS.md §1 says "no extra pages (beyond `/privacy`)". The owner asked for these three pages, so that rule changes. Updates to AGENTS.md:
- §1 "In scope" item 14 lists `/privacy`, `/book`, `/services` and `/about`
- §9 file structure lists the new routes

## Docs read

- AGENTS.md, `app/page.tsx`, `app/privacy/page.tsx` (the pattern for a page with navbar, content and footer)
- `node_modules/next/dist/docs/`: re-read the metadata guide (`14-metadata-and-og-images.md`) and the sitemap file convention before coding

## Existing code inspected

- `components/sections/Navbar.tsx`: the `base` prop prefixes `#anchors` with `/`. "Book Now" scrolls to the hero form on home and links to `/#home` on other pages.
- `components/sections/Footer.tsx`: the same `base` prop. The Treatments column links to `#services-<slug>`.
- `components/sections/Hero.tsx`: hosts `<BookingCard />`. `lib/scroll-to-booking.ts` sends a window event that pre-selects a problem chip.
- `components/ui/book-for-link.tsx` and `BookScrollPill`: `#home` links that scroll to the hero form.
- `components/sections/About.tsx`: a self-contained section whose `StatementHeading` is an `h2`.
- `components/sections/Services.tsx` / `ServicesMotion.tsx`: the accordion plus an icon fallback when an image is missing.
- `data/site.ts`: `nav`, `services` (slug, title, short, image, imageAlt, icon, problem), `about`.
- `lib/seo.ts`: JSON-LD (Physician, MedicalClinic, WebSite and **FAQPage**) is injected in `app/layout.tsx`, so it is on every page.
- `app/sitemap.ts`: lists `/` and `/privacy`.

## Decisions and assumptions (correct me before approving)

1. **The home page stays as it is.** The new pages are additions and nothing moves off the home page.
2. **Navigation** (`data/site.ts` → `nav`):
   - Home `/`, Services `/services`, About `/about`, Reviews `/#reviews` (still hidden by `reviewsState()`), Contact `/#contact`
   - The navbar and footer prefix `base` only for hrefs that start with `#`. Page links are used as they are.
   - The current page's link gets `aria-current="page"` (via `usePathname`, since Navbar is already a client component).
3. **"Book Now" (navbar) goes to `/book` on every page**, home included. The hero form on the home page stays, and the "Book for this" / "Book an appointment" links inside home sections still scroll to it.
4. **Pre-selecting a problem across pages:** the service cards on `/services` link to `/book?problem=Ear` (and so on). `BookingCard` reads `?problem=` on the client after mount and checks it against `booking.problems`. The page stays static: there is no `searchParams` in the server component, which would make it dynamic under `cacheComponents`.
5. **`/about` reuses `<About />`** with a new `headingAs="h1"` prop, so the statement heading is the page's single `h1`. On home it stays `h2`.
6. **JSON-LD:**
   - FAQPage moves out of the layout and onto the home page only, because the FAQ is only visible there and Google wants FAQ markup to match visible content.
   - Physician, MedicalClinic and WebSite stay site-wide.
7. **The footer Treatments links** go to `/services#<slug>`, the full card, instead of the home accordion.
8. **`<FloatingWhatsApp />`** appears on all three new pages, as on home.

## Files likely to change

- new: `app/book/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`, `components/sections/ServiceCards.tsx`
- `data/site.ts`: `nav` hrefs, plus a `pages` object with the page titles, intros and meta descriptions (built only from existing facts)
- `components/sections/Navbar.tsx`: page-link handling, `aria-current`, "Book Now" → `/book`
- `components/sections/Footer.tsx`: page-link handling, Treatments → `/services#slug`
- `components/sections/BookingCard.tsx`: read `?problem=` on mount
- `components/sections/About.tsx` + `AboutMotion.tsx`: `headingAs` prop
- `lib/seo.ts`, `app/layout.tsx`, `app/page.tsx`: split FAQPage JSON-LD out of the site-wide graph
- `app/sitemap.ts`: add the three URLs
- `AGENTS.md`: scope update (above)

## Implementation requirements

### `/book`
- Navbar (`base="/"`), then `<main>` with a `bg-base` band (`pt-36 pb-24`, container `max-w-[1200px] px-6 lg:px-16`):
  - left (lg: 7 cols):
    - an eyebrow and an `h1` "Book an appointment"
    - one intro line from `data/site.ts`
    - the three quick-fact chips (place, hours, fee) that the hero uses
    - plain alternatives: Call (only if `telHref`), WhatsApp (only if a number exists), and the Quickobook link
  - right (lg: 5 cols): `<BookingCard />`, max-w 440px
- Then the existing `<Chamber />` section (map + timings), then `<Footer base="/" />`.
- The `bk-*` field ids stay unique because only one BookingCard is on the page.

### `/services`
- `bg-base` header band (`pt-36`):
  - eyebrow
  - `h1` "Our Services" (font-heading, `text-[clamp(2.5rem,6vw,4.5rem)]`, primary; one accent word at most)
  - the existing services intro line
- Card grid: 1 column at 375, 2 at 768, 3 at 1280+, gap 24px. **All** services are shown (no `servicesVisible` cut).
- Each card is an `article` with `id={slug}`, `rounded-[28px] bg-white p-6 md:p-8`, no shadow. It contains:
  - an image (`aspect-[16/10] rounded-[20px]`), or the existing icon fallback when the file is missing
  - an `h2` title (font-heading 26px, primary)
  - the `short` text (15px, `ink/80`)
  - a "Book for this →" link to `/book?problem=<problem>` with an `aria-label` "Book an appointment for <title>"
- Then `<WhoWeHelp />` and `<Cta />`, then the footer.

### `/about`
- `<About headingAs="h1" />`, then `<WhoWeHelp />` and `<Cta />`, then the footer.
- `BookScrollPill` inside About scrolls to `#home`, which doesn't exist on `/about`. When the hero form isn't on the page, it links to `/book` instead: the helper checks for `#bk-name`, and the plain href becomes `/book`.

### Shared
- Every page gets `metadata` with title (template `%s | Dr. Biswajyoti Das`), description and `alternates.canonical`.
- The sitemap adds `/book`, `/services` and `/about` (monthly, priority 0.8).
- Server components only. The only client changes are the Navbar pathname and BookingCard's query read.

## Accessibility requirements

- Each page has exactly one `h1`, and card titles under it are `h2`.
- The nav link for the current page gets `aria-current="page"`.
- Every card link has a descriptive `aria-label`, and focus rings stay visible.
- Images have meaningful alt text (from the data). The fallback keeps `role="img"` + `aria-label`.

## Acceptance criteria

- `/book`, `/services` and `/about` prerender as static (○) in `npm run build`.
- Navbar links work from every page. "Book Now" opens `/book`.
- `/services` → "Book for this" on Sinus → `/book?problem=Nose` with the Nose chip selected.
- Footer Treatments links land on the right card on `/services`.
- FAQPage JSON-LD is only on `/`. The other graphs are still on every page.
- No horizontal scroll at 375px on any new page.
- TODO values stay visible placeholders, and nothing is invented.

## Checks to run

`npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Manual test steps

1. `npm run dev`, then open `/services` at 375 / 768 / 1280 / 1536 and check the 1/2/3 column grid.
2. Click "Book for this" on any card: `/book` opens with that chip selected and the form ready.
3. Open `/about` and check that it has one `h1` (DevTools → search `<h1`).
4. On `/about`, click "Book an appointment": it goes to `/book`.
5. From `/book`, click navbar Home, Contact and Services: each lands in the right place.
6. View the source of `/services`: no `FAQPage` in the JSON-LD. View the source of `/`: `FAQPage` is there.
7. Open `/sitemap.xml`: it lists five URLs.
8. Tab through each new page: the order is logical and focus rings are visible.
