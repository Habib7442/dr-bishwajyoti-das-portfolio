# Prompt: "Who We Help" (lilac band) — Step 6

## Goal
Build `#who-we-help` after Chamber: a centred header (eyebrow, rust "Who We **Help?**" with the lime highlighter, intro), then 3 flat white cards (Children / Adults / Senior Citizens). Each card has a corner-shaped photo on a peach / butter / sky panel, a centred title, text, condition tags and a "Book for … →" link that jumps to the hero form with the right problem chip pre-selected. No badges on images, no circles, no frames. Build only this section.

## Docs read
`AGENTS.md` (§3 UI, §4 content/images, §8 band order), `DESIGN.md` (§2, §3, §4, §5 shapes, §6 who-we-help card, §9), `project-docs/DOCS.md` §7, your "Step 6" spec.

## Existing code inspected
- `data/site.ts`: an unused `audiences` array (old shape, Unsplash URLs). `booking.problems` = Ear, Nose, Throat, Allergy, Other.
- `components/sections/BookingCard.tsx`: form state is local (`useState`), and `update("problem", p)` validates and marks it touched. There's no way to set the problem from outside today.
- `lib/scroll-to-booking.ts`: `bookNow()` scrolls to `#home` and focuses `#bk-name`. Used by Navbar and Intro.
- `components/ui/highlighter.tsx` (`trigger="parent"` follows a parent's hidden→show variants), `lib/use-reveal.ts` (10%, scrolled-past, 2.5s instant fallback).
- `public/images/who/` **doesn't exist**, so all three cards will show the icon fallback for now.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **Card image shape vs DESIGN.md.** DESIGN.md §5/§6 say who-we-help images use an SVG blob `clipPath` of overlapping circles, with a 24px card radius. The client's "no blobs" rule and your spec replace that with corner-radius shapes (one big 120px corner per card) and a 28px radius (same as the About cards). I'll follow the spec and **update DESIGN.md §5/§6** to match. Say if you'd rather I leave DESIGN.md alone.

2. ⚠️ **No photos yet, so icon fallback.** The three `.jpg` files don't exist. A build-time `existsSync` check shows a coloured panel with a large rust Lucide icon (`Baby` / `User` / `HeartHandshake`, 64px, stroke 1.5) in the same corner shape. Drop the files into `public/images/who/` and rebuild; no code change. I **won't** use the old Unsplash placeholders from `audiences`, since your spec asks for the fallback. That array gets deleted (replaced by `whoWeHelp`).

3. **Pre-selecting the chip.** `bookNow(problem?)` dispatches a `booking:prefill` `CustomEvent` with `{ problem }` on `window`, then scrolls and focuses the name field as now. `BookingCard` listens for it and calls `update("problem", problem)`, which selects the chip and clears any "choose a problem" error. If the card is showing its success screen, it returns to the form first. Links are real `<a href="#home">`, so without JS they still jump to the form, just without the pre-selection.

4. **Problem mapping:** children → Ear, adults → Nose, seniors → Ear (as in your data). The `problem` field is typed as `Problem` from `booking.problems`, so a typo fails the type check.

5. **Header motion.** The `h2` fades up as one block (not word-by-word; the spec says "fade up"). The highlighter under "Help?" sweeps 0.5s after, driven by the same reveal. "Help?" is rust text on the lime bar, like "Throat." and "listening.". Only one accent per heading.

6. **Card motion.** Cards fade up 32px, staggered 0.12s. The image wrapper scales 1.08 → 1 on reveal.
   - Hover (fine pointers only): the card lifts 6px, the photo scales to 1.04 (0.4s ease-out), CSS only.
   - The reveal scale lives on a motion wrapper and the hover scale on the image, so they don't fight.
   - Reduced motion: opacity only; the hover scale is off (`motion-reduce:`).

7. ⚠️ **Spacing snapped to the DESIGN.md scale:**

   | Spec | Snapped to |
   |---|---|
   | `md:py-32` | `md:py-36` |
   | intro `mt-5` | `mt-4` |
   | cards `mt-14` | `mt-16` |
   | `gap-5 md:gap-6` | `gap-6` |
   | `pb-7` | `pb-8` |
   | tags `mt-5` | `mt-4` |

   Already on the scale: `p-4`, `px-3`, `mt-6`, `mt-2`, `gap-2`. Radii (`28px`, `22px`, `120px`) and `h-7` tags are sizes, not spacing.

8. **Mobile:** cards stack full width; image `aspect-[16/10]` below `md`, `aspect-[4/3]` from `md`. The 120px corner is capped by the browser on the shorter mobile panel, which is fine.

9. **Tags** use the card colour tints: `bg-peach/30`, `bg-butter/40`, `bg-sky/50`, ink text, 12px. Lime is never used on white.

## Files likely to change
- `data/site.ts`: add `whoWeHelp` (spec content, `problem` typed); delete `audiences`.
- `components/sections/WhoWeHelp.tsx`: new, server (layout, `existsSync` fallback).
- `components/sections/WhoWeHelpMotion.tsx`: new, client (`HeaderReveal`, `CardsReveal`/`CardItem`, `ImageReveal`, `BookForLink`).
- `lib/scroll-to-booking.ts`: `bookNow(problem?)` + prefill event (exported event name + type).
- `components/sections/BookingCard.tsx`: listen for `booking:prefill`.
- `app/page.tsx`: `<WhoWeHelp />` after `<Chamber />`.
- `DESIGN.md` §5/§6: who-we-help shape (only if you agree with ⚠️1).

## Implementation requirements
- **Section:** `<section id="who-we-help" aria-labelledby="who-title" className="relative bg-lilac py-24 md:py-36">`; container `mx-auto max-w-[1200px] px-6 lg:px-16`.
- **Header:** `text-center`.
  - Eyebrow: `text-xs font-medium tracking-[0.08em] uppercase text-ink/60`.
  - h2 `#who-title`: `mt-4 font-heading font-medium text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none tracking-[-0.03em] text-rust`, "Who We " + `<span className="relative z-0 inline-block">Help?<Highlighter trigger="parent"/></span>`.
  - Intro: `mx-auto mt-4 max-w-[46ch] text-[15px] leading-[1.65] text-ink/75`.
- **Grid:** `mt-16 grid gap-6 md:grid-cols-3`.
- **Card** `<article>`: `group flex flex-col rounded-[28px] bg-white p-4 pb-8 transition-[translate] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1.5 motion-reduce:hover:translate-y-0`.
  - Image panel: `relative aspect-[16/10] md:aspect-[4/3] overflow-hidden` + per-card radius (`rounded-[22px_120px_22px_22px]`, `rounded-[120px_22px_22px_22px]`, `rounded-[22px_22px_120px_22px]`) + `bg-peach` / `bg-butter` / `bg-sky`.
  - Inside it: the motion wrapper (scale 1.08→1) → `next/image fill object-cover sizes="(min-width:768px) 33vw, 100vw"` with `transition-[scale] duration-[400ms] ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100`. Or the fallback icon (`aria-hidden`; the panel gets `role="img" aria-label={imageAlt}`).
  - Text block `mt-6 px-3 text-center`:
    - h3 `font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.01em] text-rust`
    - p `mx-auto mt-2 max-w-[34ch] text-sm leading-[1.6] text-ink/75`
    - tags `<ul className="mt-4 flex flex-wrap justify-center gap-2">` with `li` `inline-flex h-7 items-center rounded-full px-3 text-[12px] text-ink` + tint
    - link `mt-6 inline-flex` "Book for {title} →" `text-sm font-medium text-rust underline-offset-4 hover:underline`, with `aria-label="Book an appointment for {title}: {problem} problem"`. The visible text stays as specified.
  - The link sits at the bottom (`mt-auto` wrapper) so links line up across cards of different text length.

## Accessibility requirements
- One h2; each card is an `<article>` with an h3. Tags are a `<ul>`.
- Photo alt from data; the fallback panel is `role="img"` with the same alt; icons `aria-hidden`.
- The links work without JS (`href="#home"`). Visible focus rings (the global rust outline).
- Contrast: rust on lilac/white, ink/75 on white, ink on the tints all pass AA.
- After the prefill, focus lands on the name input (existing `bookNow` behaviour), and the chip's `aria-checked` updates.

## Acceptance criteria
- [ ] 1440: centred rust title with the lime bar under "Help?", 3 white cards with corner-shaped panels in peach / butter / sky, centred text, tags and links.
- [ ] No badges, circles or frames.
- [ ] Clicking "Book for Children →" scrolls to the form, the **Ear** chip is `aria-checked="true"`, and the name input has focus. Adults → Nose. Seniors → Ear. (Checked in the browser via CDP.)
- [ ] 375: cards stack, `scrollWidth === innerWidth`.
- [ ] Icon fallbacks show now (no images present).
- [ ] Full-page no-scroll capture + scroll capture: every animated element is fully visible, and the highlighter is drawn.
- [ ] `tsc`, `lint`, `build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `next start` + CDP screenshots of `#who-we-help` at 1440 and 375, still/scroll visibility runs, and the "Book for …" click → chip/focus checks.

## Manual test steps
1. Open `http://localhost:3000/#who-we-help`: centred title, lime bar under "Help?", three cards with coloured icon panels (until the photos are added).
2. Click "Book for Adults →": the page scrolls to the hero form, "Nose" is selected and the cursor is in "Full name". Repeat for Children and Senior Citizens (Ear).
3. Hover a card on desktop: it lifts slightly.
4. At 375 in the device toolbar, the cards stack with no sideways scroll.
5. Add `children.jpg`, `adults.jpg` and `seniors.jpg` (1200×900, under 150 KB) to `public/images/who/`, run `npm run build`, and the photos replace the icons.
