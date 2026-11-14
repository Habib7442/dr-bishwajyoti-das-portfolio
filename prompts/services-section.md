# Prompt: Services (cream band) — FINAL

## Goal
Build `#services` between Intro and About:
- a giant rust "Our Services ✳" title running off the right edge, sliding left slightly on scroll
- a short intro
- a click-to-open accordion of 7 services (first open; large illustration in the open row; thumbnails on closed rows; thin rust dividers)
- a cream → lavender curve with the round lime "See All" button sitting on its lowest point

The curve joins About with no seam. "Book for this →" pre-selects the matching chip in the hero form. Build only this section.

## Docs read
- `AGENTS.md` (§3, §4 claims, §7 shadcn Accordion, §8 Services decisions, §11 mega-title trap), `DESIGN.md` (§3 type, §4 spacing, §5 radii, §6 service row / big round CTA, §9 motion)
- `project-docs/DOCS.md` §4, your "Services (FINAL)" spec
- `components/ui/accordion.tsx` (shadcn on **Base UI**: `value` is an array, the panel animates height via `--accordion-panel-height`)

## Existing code inspected
- `components/sections/Services.tsx`: an early unrendered draft (hover-open, Unsplash images, CSS curve). **Will be rewritten.**
- `data/site.ts`: `services` (8 items, old shape, Unsplash). Its only user is that draft.
- `About.tsx`: `<section id="about" … bg-lavender pt-24 pb-12 md:pt-36>`.
- `WhoWeHelpMotion.tsx` → `BookForLink` (calls `bookNow(problem)`); `lib/scroll-to-booking.ts` (prefill event); `lib/use-reveal.ts` (10%, scrolled-past, 2.5s instant fallback).
- **Images:** your 7 illustrations are copied to `public/images/services/{ear,sinus,allergy,throat,vertigo,snoring,endoscopy}.webp`, about 1585×992 (16:10), 193–350 KB. `next/image` serves resized versions. I checked them visually: warm painterly illustrations, nothing clinical or graphic, and the alt texts match.

## How I read the reference
`/reference/design.png` still isn't in the repo, so I'm working from your description: giant title off the right edge, thin rust dividers, first row open with a large image, small thumbnails on closed rows, round lime "See All" on a big cream→lavender curve.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **Wording, medical claims (AGENTS.md §4: no "painless").** Endoscopy short text "A painless camera check…" becomes **"A quick camera check of the nose and throat, done in the chamber, for a clear diagnosis."** Allergy "We find the cause and treat it." becomes **"The cause is traced through testing, then treated."** (matches the "Dr. Das…" third-person voice used elsewhere). Everything else is verbatim.

2. ⚠️ **Click only, no hover-open.** AGENTS.md §8 says rows also expand on hover on fine pointers. Your spec says click/tap only. I'll follow the spec and **update AGENTS.md §8** ("Rows open on click or tap").

3. ⚠️ **Sizes vs DESIGN.md §5/§6** (thumbnail 120×64 / 8px radius, open image 320×200 / 16px, H3 48px). Your spec has thumbnail 140×72 / `rounded-xl`, open image 16:10 at about 560px / 24px radius, and title `clamp(1.6rem, 3.4vw, 2.75rem)` (44px max). The spec matches the reference's large open image better, so I'll follow it and **update DESIGN.md §5/§6** to match. Say if you'd rather keep DESIGN.md's values.

4. **Accordion engine.** AGENTS.md §7 says to use the shadcn Accordion, so I'll build on its Base UI parts:
   - `Accordion` with `value` array (single open, first open by default)
   - `AccordionItem` / Trigger / Panel, which give `aria-expanded`, `aria-controls`, the `role="region"` panel and Enter/Space handling for free
   - the panel's built-in height animation (`--accordion-panel-height`), restyled to 0.5s ease `[0.22,1,0.36,1]`

   Motion handles the rest:
   - image fade + scale 0.96 → 1 on open
   - the thumbnail fades out on open
   - the "See All" rows stagger in

   This replaces `AnimatePresence + layout` from the spec with the same visible result and better a11y.

   Closing the open row is allowed (all rows closed) so a tap on the open row's header toggles it.

5. **Shared "Book for" link.** I'll move `BookForLink` from `WhoWeHelpMotion.tsx` to `components/ui/book-for-link.tsx`, used by both sections (no behaviour change). The arrow nudge matches the Who We Help links.

6. **Mega title.** "Our Services" + an inline SVG ✳ (lime fill, rust 1.5px stroke) + `aria-hidden` repeat " Our Services ✳", all `whitespace-nowrap` in an `h2` whose accessible name is just "Our Services".
   - The scroll slide uses `useScroll({ target: section, offset: ["start end", "end start"] })` → `x: 0 → -8vw`, and is turned off with `useReducedMotion()`.
   - The section is `overflow-hidden`.

7. **Curve.** `components/shapes/CurveDivider.tsx` (`top`/`bottom` colour token props, e.g. `top="cream" bottom="lavender"`) is an SVG with `viewBox="0 0 1440 240" preserveAspectRatio="none"`, height `clamp(120px,16vw,240px)`.
   - It draws a lavender rect, with a cream half-ellipse path whose lowest point is the exact bottom centre of the SVG, which is also the section's bottom edge.
   - About starts right below in `bg-lavender` (same token), so there's no seam.
   - The SVG gets `-mb-px` to avoid a sub-pixel hairline.

8. **"See All" button.** Absolute, `left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2`, so it's centred on the curve's lowest point, half on cream and half on About's lavender.
   - Because it overlaps into About, the Services section isn't `overflow-hidden` at the bottom edge. The mega title gets its own `overflow-hidden` wrapper instead, so horizontal overflow is still clipped.
   - `z-20` keeps it above About.
   - Label "+ See All" / "− Show Less". `aria-expanded`, `aria-controls="services-more"`.
   - On expand it smooth-scrolls to the first new row (instant with reduced motion).

9. **About spacing.** The button hangs 48px (mobile `size-24`) / 56px (desktop `size-28`) into About. About's top padding becomes `pt-36` at all sizes (144px, was 96px on mobile). That gives about 96px from the button to About's first content on mobile and about 88px on desktop, close to your 96px target and on the scale. I'll measure it.

10. ⚠️ **Spacing snapped to the scale:**

    | Spec | Snapped to |
    |---|---|
    | `md:pt-32` | `md:pt-36` |
    | open-row `gap-10` | `gap-12` |
    | `py-8 md:py-10` | `py-8 md:py-12` |
    | mobile image `mt-5` | `mt-4` |
    | curve `mt-20 md:mt-24` | `mt-24` |

    Row heights `h-[88px] md:h-[104px]`, thumbnail size and button sizes are sizes, not spacing.

11. **Fallback** (if an image file is missing): a soft block (`bg-peach/40` / `bg-butter/50` / `bg-lilac` rotating by index) with the Lucide icon (`Ear`, `Wind`, `Flower2`, `Mic`, `RotateCw`, `BedDouble`, `ScanEye`) centred in rust. All 7 files exist today, so it won't show unless one is removed.

12. **Data shape:** `services: Service[]` (`slug, title, short, image, imageAlt, icon, problem`) + `servicesVisible = 4`, replacing the old `services`. The `problem` type is tied to `booking.problems` (Ear / Nose / Allergy / Throat / Other).

## Files likely to change
- `data/site.ts`: new `services` + `servicesVisible`.
- `components/sections/Services.tsx`: rewrite (server: data, `existsSync` fallback, layout).
- `components/sections/ServicesMotion.tsx`: new client (`ServicesAccordion`, `MegaTitle`, `SeeAllButton`).
- `components/shapes/CurveDivider.tsx`: new.
- `components/ui/book-for-link.tsx`: new (moved); `WhoWeHelpMotion.tsx` / `WhoWeHelp.tsx` import from it.
- `components/sections/About.tsx`: `pt-36`.
- `app/page.tsx`: `<Services />` between Intro and About.
- `AGENTS.md` §8, `DESIGN.md` §5/§6 (⚠️2, ⚠️3).

## Implementation requirements
- **Section:** `<section id="services" aria-labelledby="services-title" className="relative bg-cream pt-24 md:pt-36">`. Title wrapper `overflow-hidden`. Container `mx-auto max-w-[1200px] px-6 lg:px-16`.
- **Title:** `font-heading font-semibold text-[clamp(3.5rem,11vw,8rem)] leading-[0.9] tracking-[-0.04em] text-rust whitespace-nowrap`. The ✳ is SVG at `0.7em`, `fill-lime stroke-rust` (stroke 1.5), `aria-hidden`.
- **Intro:** `mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75`; title block `mb-12 md:mb-16`.
- **List:** `mx-auto max-w-[1000px]`.
  - Each row: a divider span on top (`h-px bg-rust/30`, scaleX 0→1 origin-left, 0.8s, stagger 0.06s); the last row also has a bottom divider.
  - Header button `flex h-[88px] w-full items-center justify-between gap-6 text-left md:h-[104px]`, focus `focus-visible:ring-2 ring-rust ring-offset-2 ring-offset-cream`.
  - Title `font-heading font-normal text-[clamp(1.6rem,3.4vw,2.75rem)] tracking-[-0.02em] leading-[1.1] text-rust`, with `md:group-hover:translate-x-2` (0.3s).
  - Desktop thumb `hidden md:block relative h-[72px] w-[140px] overflow-hidden rounded-xl`; `alt=""`; hover `scale-105 -rotate-2` (0.3s); hidden when the row is open (fade).
  - Mobile toggle `md:hidden size-9 rounded-full bg-lime text-rust` with a `Plus` icon rotated 45° when open (becomes ×).
- **Open panel:**
  - Desktop: `grid grid-cols-12 items-center gap-12 py-8 md:py-12`. Left `col-span-5`: description `text-[15px] leading-[1.65] text-ink/80 max-w-[40ch]` + link `mt-6`. Right `col-span-7`: `relative aspect-[16/10] overflow-hidden rounded-[24px]`, image `fill object-cover`, `sizes="(min-width:1024px) 560px, 100vw"`, `imageAlt`.
  - Mobile: image (`rounded-[20px]`) → description `mt-4` → link `mt-6`.
  - The row title stays in the header button (it isn't repeated in the panel, to avoid duplicate headings).
- **More rows:** rows 5–7 are in `<div id="services-more" hidden={!showAll}>`, staggering in (fade up 24px, 0.08s) when shown.
- **Curve + button:** `mt-24`, `<CurveDivider top="cream" bottom="lavender" />`, button absolute as in decision 8.
  - `size-24 md:size-28 rounded-full bg-lime text-rust ring-8 ring-lime/30 font-medium text-[13px] hover:scale-[1.06] hover:ring-[12px] transition`.
  - Springs in (scale 0.6→1) when the curve is revealed.
- **Motion:** everything through `useReveal` (10%, 2.5s fallback). Reduced motion: opacity only, no title slide, no hover rotate/translate.

## Accessibility requirements
- One h2. Row titles are the accordion triggers inside `<h3>` (Base UI `Accordion.Header`), with `aria-expanded`/`aria-controls`; panels are `role="region"` + `aria-labelledby`.
- Thumbnails `alt=""`; large images use `imageAlt`; fallback icons `aria-hidden` with `role="img"` + label on the block.
- "See All": `aria-expanded`, `aria-controls="services-more"`, 96–112px target.
- "Book for this →" is a real `<a href="#home">`, with `aria-label="Book an appointment for {title}"`.
- Contrast: rust/ink on cream; rust on lime.

## Acceptance criteria
- [ ] Page order: Hero → Intro → Services → About → Chamber → Who We Help.
- [ ] 1440: giant title off the right edge, first row open with its illustration, thumbnails on closed rows, thin dividers, lime "See All" centred on the curve's lowest point.
- [ ] No seam: the pixel row at the Services/About boundary is lavender across the full width except the centre bulge (sampled from the screenshot).
- [ ] Clicking rows opens/closes them (one at a time). "Book for this →" selects the right chip (Ear / Nose / Allergy / Throat / Ear / Nose / Other) and focuses the name field.
- [ ] "See All" reveals 3 more rows and scrolls to the first; "Show Less" hides them.
- [ ] No overlays or tints on images.
- [ ] 375: title overflows (clipped, no horizontal page scroll), rows easy to tap, open row stacks.
- [ ] Fallback renders when an image is missing (checked by temporarily renaming one file, then restoring it).
- [ ] Full-page still and scroll captures: everything visible.
- [ ] `tsc`, `lint`, `build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `next start` + CDP: screenshots at 1440 and 375, visibility runs, row toggle + chip checks for all 7, See All / Show Less, seam pixel sample, button-to-About spacing measurement, fallback check.

## Manual test steps
1. Open `http://localhost:3000/#services`. The title runs off the right and drifts left as you scroll. The first row is open.
2. Click "Sinus & Nasal Blockage": it opens and "Ear Problems" closes. Click "Book for this →": the page scrolls up, "Nose" is selected, the cursor is in "Full name".
3. Click "+ See All": 3 more services fade in and the page scrolls to the first. Click "− Show Less" to hide them.
4. At 375, tap the lime + on a row: it opens with the image on top. No sideways scroll.
5. Check the curve flows into the lavender About band with no line or gap, and the lime button sits half on each colour.
6. Turn on reduced motion in DevTools Rendering: no title drift, rows just fade.
