# Prompt: Lime CTA band + Footer + Privacy page — Step 9 (final)

## Goal
Finish the page with the lime block:
- **CTA band** (`#book`): a big centred rust "Book your appointment today", a timings line, a rust WhatsApp pill and an outline call pill.
- **Footer** on the same lime background:
  - brand: monogram, name, tagline and two booking pills
  - Menu, Treatments and Visit columns (social links only once real URLs exist)
  - bottom row: ©, disclaimer, Privacy, Locallify credit

Also:
- Add a simple `/privacy` page, `sitemap.ts` and `robots.ts`.
- Footer "Treatments" links open the matching Services row.
- The floating WhatsApp button hides over the CTA and footer.
- Run the final site-wide checks.

## Docs read
- `AGENTS.md`: §1 scope, §3 UI and contrast, §4 TODO rules, §6 links, §8 footer credit, §10 SEO, §11 traps
- `DESIGN.md`: §2, §3, §4, §6 (buttons, floating button), §9
- `project-docs/DOCS.md`: §10–11
- Next docs:
  - `migrating-to-cache-components.md` (`new Date()` in prerender)
  - `01-directives/use-cache.md`
  - `01-metadata/sitemap.md` and `robots.md`
- your "Step 9" spec

## Existing code inspected
- `app/`: there is **no `sitemap.ts` and no `robots.ts` yet**. `manifest.ts`, `icon.png`, `apple-icon.png`, `favicon.ico` and the OG/Twitter images exist.
- There is **no SVG favicon**. The "BD" monogram exists only as markup in `About.tsx` and as the PNG icons.
- `components/sections/FloatingWhatsApp.tsx`: shows once `#home` has scrolled above the viewport. Nothing hides it near the end of the page yet.
- `components/sections/Navbar.tsx`:
  - Its links are bare `#anchors` (they would break on `/privacy`).
  - "Book Now" calls `bookNow()`, which needs `#home` on the same page.
- `components/sections/ServicesMotion.tsx`:
  - The accordion state is `open: string[]` (single row open).
  - Rows 5–7 sit behind "See All" (`servicesVisible = 4`), and only those have ids (`service-<slug>`).
  - There is no hash handling.
- `app/globals.css`: `html { scroll-padding-top: 5rem }` (80px) and the `todo` utility.
- `lucide-react`: there are **no brand icons** (Facebook, Instagram, YouTube or Google).
- **The built HTML contains no visible "TODO" text** today. TODO values are already hidden or omitted by every section.
- `/reference/design.png` is **still not in the repo** (as noted in earlier prompts). I'm working from your description of the bottom lime block.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **Contrast on lime.** Your spec uses rust/80, /75 and /70 for small text. Measured on lime, those come to **4.02, 3.64 and 3.30 : 1**, all below AA (4.5). Full rust is **5.96 : 1**. All text on lime will be full rust, with hierarchy from size and weight:
   - headings: semibold
   - links: regular, underline on hover
   - meta: 12px
   - Dividers (rust/20) and pill borders (rust/30) are not text, so they're fine.

   Without this, Lighthouse Accessibility ≥ 95 would fail.

2. ⚠️ **Spacing snapped to the scale.**

   | Spec | Snapped to |
   |---|---|
   | `md:pt-32` | `md:pt-36` |
   | `md:pb-20` | `md:pb-24` |
   | `mt-5` | `mt-6` |
   | `px-7` | `px-8` |
   | `pt-14` | `pt-16` |
   | `gap-10` | `gap-12` |
   | `gap-2.5` | `gap-3` |
   | `mt-14` | `mt-16` |
   | `pb-10` | `pb-12` |

   `h-12`, `h-8`, `px-4`, `size-10`, `mt-8`, `gap-3` and `pt-6` are already on the scale.

3. **Floating button.** I'll hide it while the CTA band **or** the footer is on screen. It observes `#home` (as now) plus `#book` and `#site-footer`, and shows only when it is past the hero and neither is intersecting. Since the footer follows the CTA, the button stays hidden from the CTA to the end of the page. Nothing is covered, so the extra `pb-24` isn't needed.

4. ⚠️ **Current year.** `cacheComponents` is on, and `new Date()` in a server component breaks the prerender (AGENTS §11).
   - The © year will be a tiny client component, `<CurrentYear />`, as the Next docs suggest ("move it into a Client Component").
   - I'll confirm the build stays fully static. If it doesn't, the fallback is a `"use cache"` helper.

5. ⚠️ **Privacy "Last updated".** A build date would change on every deploy, even when the policy text hasn't changed, which is misleading on a legal page. I'll store a fixed `privacy.lastUpdated: "14 November 2026"` in data and update it when the text changes. Say if you really want the build date.

6. **Privacy page scope.** AGENTS.md §1 says "no extra pages", and you've explicitly asked for this one. I'll add `/privacy` to the in-scope list in AGENTS.md.
   - Layout: navbar, cream band, a 720px column, then the footer (without the CTA band).
   - The content block carries `// TODO: review with the doctor before launch` as a **code comment only** (nothing visible).
   - Metadata: title "Privacy Policy" (it becomes "Privacy Policy | Dr. Biswajyoti Das") and canonical `/privacy`.

7. **Links on `/privacy`.** The Navbar and Footer take a `base` prefix: `""` on `/` and `"/"` elsewhere, so links become `/#services` and so on.
   - `bookNow()` falls back to `location.assign("/#home")` when there's no `#home` on the page.
   - The floating button doesn't appear there (no `#home`), which is fine.

8. **Treatment links open their row.** Links go to `#services-<slug>`.
   - Every row wrapper gets `id="services-<slug>"` (renamed from `service-<slug>`), so the browser's own jump works.
   - `ServicesList` reads `location.hash` on mount and on `hashchange`. For a matching slug it opens that row, turns on "See All" when the row is hidden (Vertigo is row 5), then scrolls it into view (`block: "center"`, instant if reduced motion is on).
   - Short labels come from a new optional `shortTitle` field on each service: "Ear & Hearing", "Sinus", "Allergy", "Throat & Voice", "Vertigo". The footer takes the first 5 services.

9. **Data shape.** Your spec's `site.footer` becomes a top-level `footer` export, matching `faq`, `chamber` and the others. It holds:
   - `ctaTitle`, `ctaText`, `tagline`, `social` (all TODO), `credit`, `disclaimer` and `whatsappMessage`
   - `whatsappMessage` reuses `site.whatsappMessage` ("Hello Doctor, I'd like to book an appointment.")
   - `ctaText` is built from `quickFacts` so it stays in sync with the timings.

   The `fullAddress` built for the FAQ is exported and reused in the footer. It's fuller than `chamber.address`, which still lacks the street.

10. **CTA buttons.**
    - **WhatsApp:** `bookingHref`, the same `wa.me` link and message as the rest of the site. If WhatsApp is TODO it falls back to Quickobook with the label "Book Online".
    - **Call:** `telHref`, hidden while the phone is TODO.
    - The hero form builds its own message from the form fields. This band has no form, so it uses the standard message.

11. **Social column.** Every value is TODO today, so the whole "Follow" block is hidden. I'll still add simple single-stroke glyphs (Facebook, Instagram, YouTube, Google "G") in `components/icons/` so it works as soon as a URL is filled in. Each one is an icon link with an `aria-label`.

12. **Monogram.** A `components/ui/monogram.tsx` component: a `size-11` (44px) `rounded-xl` rust square with a lime "BD" in Bricolage 600. It's reused in the footer (and is available to About later). There's no favicon SVG to copy, so this matches the PNG favicon by look.

13. **Directions.** `site.directionsUrl = https://www.google.com/maps/dir/?api=1&destination=<chamber.mapsQuery>`, opened in a new tab.

14. **Scroll offset.** I'll change the single `html { scroll-padding-top }` from 5rem to **6rem (96px)**. It has the same effect as `scroll-margin-top` on every section, in one place.

15. **sitemap / robots.**
    - `sitemap.ts` lists `/` (priority 1) and `/privacy` (0.3), built from `site.url`. There's no `lastModified`, since `new Date()` would hit the same prerender trap.
    - `robots.ts`: allow all, plus the sitemap URL and the host.

## Files likely to change
- `data/site.ts`: `footer`, `privacy`, `shortTitle` on services, `directionsUrl`, export `fullAddress`.
- `components/sections/Cta.tsx` (server) and `CtaMotion.tsx` (client: word reveal and button fade).
- `components/sections/Footer.tsx` (server), `components/ui/current-year.tsx` (client) and `components/ui/monogram.tsx`.
- `components/icons/Social.tsx` (four glyphs).
- `components/sections/FloatingWhatsApp.tsx`: also watch `#book` and `#site-footer`.
- `components/sections/ServicesMotion.tsx`: row ids and hash → open row.
- `components/sections/Navbar.tsx` and `lib/scroll-to-booking.ts`: `base` prefix and the `bookNow` fallback.
- `app/page.tsx`: `<Cta />` and `<Footer />` after `<Faq />`.
- `app/privacy/page.tsx`, `app/sitemap.ts`, `app/robots.ts`: new.
- `app/globals.css`: scroll padding 6rem.
- `AGENTS.md` §1: add the privacy page to scope.

## Implementation requirements

### CTA band
- `<section id="book" aria-labelledby="cta-title" className="bg-lime pt-24 pb-16 text-center md:pt-36 md:pb-24">`, container 1200px.
- `h2#cta-title`:
  - Bricolage 500, `clamp(2.5rem,6vw,4.75rem)`, `leading-none`, `tracking-[-0.03em]`, rust, `mx-auto max-w-[14ch]`.
  - Each word sits in an `overflow-hidden` span and slides up 100%, staggered 0.06s (`wordReveal`).
  - Screen readers get the plain heading text: the word spans are `aria-hidden`, and an `sr-only` copy holds the full text.
- `p` at `mt-6`: Inter 14px, rust, `{footer.ctaText}`.
- Buttons at `mt-8`, `flex flex-wrap justify-center gap-3`. They fade up 0.3s after the last word.
  - Rust pill: `h-12 px-8 bg-rust text-white hover:bg-rust-dark`, with the WhatsApp icon.
  - Outline pill: `h-12 px-8 border border-rust/40 text-rust hover:bg-rust/5`, "Call {site.phone}".
  - Both are 13px/500 with a rust focus ring.

### Footer
`<footer id="site-footer" className="bg-lime pb-12 text-rust">`, container 1200px, then a `border-t border-rust/20 pt-16` wrapper.

**Grid:** `grid grid-cols-2 gap-12 lg:grid-cols-12`.
- **Brand** (`col-span-2 lg:col-span-4`):
  - the monogram plus the name (Bricolage 600, 22px)
  - the tagline: 14px, `max-w-[32ch]`, `mt-4`
  - a pill row at `mt-6`, `flex flex-wrap gap-3`: two `h-8 px-4 rounded-full border border-rust/30 text-[12px] hover:bg-rust/5` links, "Book on WhatsApp" (`bookingHref`) and "Book online" (Quickobook, new tab).
- **Menu** (`col-span-1 lg:col-span-2`):
  - `h3` "Menu": 13px, semibold.
  - `ul` at `mt-4 grid gap-3`: 14px links with `hover:underline underline-offset-4`.
  - Links: Home `#home`, Services `#services`, About `#about`, Chamber `#contact`, Reviews `#reviews` (only when `reviewsState() !== "hidden"`), FAQ `#faq`. All carry the `base` prefix.
- **Treatments** (`col-span-1 lg:col-span-2`): same style; the first 5 services, `shortTitle`, linking to `#services-<slug>`.
- **Visit** (`col-span-2 lg:col-span-4`):
  - `h3` "Visit"
  - `<address className="not-italic">`: the hospital name (medium), then `fullAddress`
  - the timings line from `quickFacts.hours`, and "Sunday closed" (from the schedule's closed days)
  - the phone and WhatsApp links with Lucide `Phone` and the custom WhatsApp icon (16px, stroke 1.5), each hidden while TODO
  - "Get directions →" (new tab)
  - **Follow**, only if any social link is set: `mt-6`, `size-10 rounded-full border border-rust/30` icon links with `aria-label`s
- **Bottom row** (`mt-16 border-t border-rust/20 pt-6 flex flex-col gap-3 text-[12px] md:flex-row md:items-start md:justify-between md:gap-6`):
  - left: "© {CurrentYear} Dr. Biswajyoti Das. All rights reserved."
  - middle: the disclaimer (`md:max-w-[52ch] md:text-center`)
  - right: "Privacy Policy" (`/privacy`) · "Website by Locallify" (new tab, `rel="noopener noreferrer"`)

**Mobile:** brand → Menu and Treatments side by side → Visit → the bottom row (stacked).

### Privacy page
`app/privacy/page.tsx` (server) contains:
- the Navbar (`base="/"`)
- a `<main>`: `bg-cream pt-36 pb-24`, a `max-w-[720px]` column, `h1` "Privacy Policy", and "Last updated: {privacy.lastUpdated}"
- sections, each an `h2` plus paragraphs:
  1. **What the booking form collects:** name, phone, problem, preferred date and time, note.
  2. **How it's used:** nothing is stored on this website; the details only leave your phone when you tap "Book on WhatsApp", which opens WhatsApp with the message pre-filled.
  3. **Third-party services:** WhatsApp, Google Maps (the embedded map) and Quickobook (online booking), each under its own privacy policy.
  4. **No tracking:** no analytics or tracking cookies are set by this site.
  5. **Contact:** the phone number, or WhatsApp.
- the Footer (`base="/"`)

Text style: Inter 15px, ink/80, line-height 1.7. Headings are rust, Bricolage. The copy lives in `data/site.ts` under `privacy`.

### Motion
- CTA words: `wordReveal` with stagger 0.06; the buttons use `fadeUp` after.
- The footer content gets one gentle `Reveal` fade.
- All of it goes through `useReveal` (2.5s safety net). Reduced motion: opacity only.

## Accessibility requirements
- One `h1` per page. The CTA title is an `h2`; footer column titles are `h3`.
- `<footer>` is a landmark; the contact block is an `<address>`.
- New-tab links get an `sr-only` "(opens in a new tab)".
- Icon links have `aria-label`s, and every link has a visible focus ring (rust).
- All text on lime is full rust (5.96 : 1).

## Acceptance criteria
- [ ] At 1440: a big centred rust two-line title, a timings line, a rust WhatsApp pill and an outline call pill. Below them, the footer on lime: brand, Menu, Treatments, Visit, then the bottom row.
- [ ] At 375: clean stacking (Menu and Treatments in 2 columns), and the floating button is hidden over the CTA and footer.
- [ ] The footer "Vertigo" link reveals the hidden rows, opens Vertigo and scrolls to it. "Ear & Hearing" opens Ear.
- [ ] `/privacy` renders with a working navbar and footer; its links go back to `/#…`.
- [ ] `/sitemap.xml` lists `/` and `/privacy`; `/robots.txt` allows all and points to the sitemap.
- [ ] The production HTML for `/` and `/privacy` has no visible "TODO".

## Checks to run
1. `npx tsc --noEmit`, `npm run lint`, `npm run build` (the route table must stay `○ Static`).
2. `npm start`, then:
   - search the rendered HTML of `/` and `/privacy` for visible "TODO"
   - fetch `/sitemap.xml`, `/robots.txt`, `/icon.png`, `/apple-icon.png`, `/manifest.webmanifest`, `/opengraph-image.jpg` (expect 200)
3. In the browser (Chrome, scripted):
   - navbar anchors land below the fixed bar
   - every Book button (hero form, intro, services, about, chamber, who-we-help, FAQ, CTA, footer) opens `wa.me` or focuses `#bk-name`
   - Treatment links open the right row
   - no console errors or warnings
4. Lighthouse, mobile, on `npm start`: `npx lighthouse` (this downloads the CLI) with the local Chrome. I'll report the real scores.
5. Full-page screenshots at 1440 and 375.

## Manual test steps
1. `npm run dev`, then open `/` and scroll to the bottom. Check the lime CTA and footer layout against the reference.
2. Click "Book on WhatsApp" in the CTA. WhatsApp opens with "Hello Doctor, I'd like to book an appointment." Then click "Call …" and the dialer opens.
3. In the footer, click "Vertigo". The page scrolls up to Services, all rows are shown and Vertigo is open.
4. Open "Privacy Policy". Click "Services" in the navbar and you're back at `/#services`. Click "Book Now" and you land on the hero form.
5. At 375 (DevTools), scroll to the CTA. The floating WhatsApp button fades away and stays hidden through the footer.
6. Turn on reduced motion. The CTA title fades in without sliding.
7. Open `/sitemap.xml` and `/robots.txt`.
