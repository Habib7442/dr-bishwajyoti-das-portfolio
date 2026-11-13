# Prompt: About the Doctor — final clean version (Step 4 final) + Intro reveal fix

## Goal
Rebuild `#about` to the final spec: plain lavender, a solid cream arch photo, the ink statement with the lime highlighter, the name block + CTAs, 3 coloured numbered cards, the white info bar, and the lime marquee ribbon. **Delete** everything else from v1/v2: the blobs, outline arch, ✳, floating pills, multiply blend, carousel and dev placeholders. Also fix the Intro section's elements that sometimes never appear.

## Docs read
`AGENTS.md`, `DESIGN.md`, your "Step 4 (final)" spec, `prompts/about-section-v2.md`.

## Existing code inspected
- `About.tsx` / `AboutMotion.tsx` (v2), `components/ui/highlighter.tsx`, `components/ui/marquee.tsx`, `data/site.ts` (`about`)
- `IntroMotion.tsx`: every animated element has its **own** `whileInView` with `amount: 0.3`. A fast scroll (or a jump/anchor link) can carry a short element past the viewport without the IntersectionObserver ever reporting it, so it stays at opacity 0. That's the bug you saw.
- From v2 testing I know two related traps:
  - An element that starts with zero visible area (`clip-path: inset(100%)`, `scaleX: 0`) never counts as "in view".
  - `rounded-t-full` + `rounded-b-[32px]` makes the browser scale every radius down, so the bottom corners come out square.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **Portrait file.** `/images/doctor/portrait.png` doesn't exist; only `portrait.webp` (grey background) does. Pointing at the `.png` would show the "BD" monogram instead of his photo. So `about.portrait` stays `/images/doctor/portrait.webp` for now, with no filters or blend, on a cream arch. You'll see a **light grey rectangle-in-arch** look until a cut-out arrives: the grey is close to cream but not identical. When you add `portrait.png`, change that one path. The `portraitCutout` flag is deleted (no longer needed). A build-time `existsSync` check renders the monogram if the file is ever missing.

2. **Arch shape.** I'll use the explicit radius `rounded-[50%_50%_32px_32px/40%_40%_32px_32px]` instead of `rounded-t-full rounded-b-[32px]` (same look, but the bottom corners actually render; see trap above).

3. **Highlighter.** I'll reuse the same `Highlighter` component the hero uses. Its trigger comes from the `h2`'s reveal (not its own in-view check), which is what made it render in v2. "Sweeps after 0.3s" = 0.3s after the last word lands.

4. **Reveal safety net (Intro + About).** A new hook in `lib/use-reveal.ts`: `useReveal(ref)` returns `true` once **either**
   - IntersectionObserver sees ≥15% of the element (`once: true, amount: 0.15`), **or**
   - the element's top is above the viewport bottom (checked on mount and on scroll), so anything already scrolled past or jumped over is revealed immediately.

   Once reached, a 2.5s timer also forces the final visible state in case an animation stalls.

   ⚠️ I'm not starting the 2.5s timer at page load as written: that would make every below-the-fold animation finish before the user ever scrolls to it.

   Intro's `StatementLine`, `AccentWord`, `PillPop`, `FadeUp` and `StatsRow` switch from `whileInView` to `animate={shown ? … : …}` driven by this hook. The About section uses it the same way (one trigger per block; children follow via variants).

5. **Removed:** `DevTodoLog` (the console list). Your spec says to delete anything not described.

6. **Card hover:** lift 6px, 0.3s ease-out, fine pointers only, no rotation. A CSS `transition` with `@media (hover:hover)` (`[@media(hover:hover)]:hover:-translate-y-1.5`) needs no JS.

7. ⚠️ **Off-scale spacing snapped to the DESIGN.md scale** (4/8/12/16/24/32/48/64/96/144):

   | Spec | Use |
   |---|---|
   | `md:pt-32` | `md:pt-36` |
   | `gap-12 lg:gap-16` | kept |
   | `mt-5` (h2) | `mt-4` |
   | `mt-10` (name) | `mt-12` |
   | `pl-5` | `pl-4` |
   | `mt-20 md:mt-24` (cards) | `mt-24` |
   | `gap-5` | `gap-6` (md grid); `gap-4` mobile kept |
   | `p-7` | `p-6` |
   | `mt-5` (info bar) | `mt-6` |
   | `gap-y-5`, `pt-5` | `gap-y-4`, `pt-4` |
   | `mt-24 md:mt-28` (ribbon) | `mt-24` |
   | `py-5` | `py-4` |
   | ~40px below ribbon | `pb-12` (48) |
   | eyebrow line 24px wide | kept |

8. **Marquee:** reuse `components/ui/marquee.tsx`, changing the glyph spacing to `gap-8` per spec. The ribbon wrapper is `-mx-[5vw]` inside the section (`overflow-hidden` clips it), `-rotate-2`. The section goes back to `overflow-hidden`, and the `z-10` overlap trick is removed.

9. **Mobile breakpoint is `lg`** this time (spec: "Mobile (< lg)"): stacked below 1024px, split grid at `lg`. The arch is `max-w-[320px]` centred below `lg`, `max-w-[440px]` at `lg`+.

10. **Info bar mobile:** a 2-column grid, `border-t border-rust/10 pt-4` on items from index 2. An odd last item spans both columns (as in v2, so the bar never looks half empty).

## Files likely to change
- `data/site.ts`: drop `portraitCutout`; portrait stays `.webp` (decision 1).
- `components/sections/About.tsx`, `AboutMotion.tsx`: rewrite, smaller.
- `lib/use-reveal.ts`: new.
- `components/sections/IntroMotion.tsx`: switch to `useReveal`.
- `components/ui/marquee.tsx`: `gap-8` spacing.

## Implementation requirements

**Section:** `relative overflow-hidden bg-lavender pt-24 pb-12 md:pt-36`; container `mx-auto max-w-[1200px] px-6 lg:px-16`.

**Split:** `grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16`.
- Arch column `lg:col-span-5`: wrapper `relative mx-auto aspect-[4/5] w-full max-w-[320px] lg:max-w-[440px]`.
- Arch: `absolute inset-0 overflow-hidden bg-cream` + the arch radius.
- Photo: inside the rising layer, `fill`, `object-cover object-[50%_15%]`, `sizes="(min-width:1024px) 440px, 80vw"`.
- Monogram fallback: "BD" 120px Bricolage 600 rust, centred, `role="img"` with the portrait alt.
- Text column `lg:col-span-6 lg:col-start-7` (mt-12 from the arch on mobile via the grid gap):
  - eyebrow `flex items-center gap-3` with an `h-px w-6 bg-ink/40` line
  - h2 (mt-4)
  - name block `mt-12 border-l-2 border-rust pl-4` (h3 28px/600 rust; role 14px ink/80; qualifications 13px ink/70 if confirmed)
  - bio (if confirmed)
  - CTAs `mt-8 flex flex-wrap gap-3`: `BookScrollPill` rust pill + `tel:` outline pill `border-ink/25 text-ink hover:bg-white/30`
- Statement motion: words slide up, stagger **0.06s**, 0.8s, house ease; the highlighter follows 0.3s after the last word.
- Name/bio/CTAs: fade up **20px**, stagger 0.1s.

**Cards:** `mt-24`. Mobile: `-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6`, scrollbar hidden, `tabIndex=0`, `aria-label`. `md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:px-0`.
- Card `<article>`: `flex min-h-[240px] w-[82%] shrink-0 snap-start flex-col justify-between rounded-[28px] p-6 md:w-auto md:p-8`, backgrounds cream / butter / peach.
- Number 64px/600 `text-rust/25 leading-none` (`aria-hidden`); icon circle `size-12 bg-rust text-white`, Lucide 22px stroke 1.5.
- Title h4 26px/500 rust; text 14px ink/80 mt-2.
- Fade up 32px, stagger 0.1s.

**Info bar:** `mt-6`, `<dl>` `rounded-[28px] bg-white px-6 py-6 md:px-10`.
- Mobile: `grid grid-cols-2 gap-y-4`.
- `md:flex md:divide-x md:divide-rust/15` with items `md:flex-1 md:px-6 md:first:pl-0 md:last:pr-0`.
- Label 11px uppercase `tracking-[0.08em] text-ink/60`; value 18px/500 Bricolage rust `mt-1`.
- Fades in.

**Marquee:** `mt-24`, wrapper `relative -mx-[5vw]`; ribbon `-rotate-2 bg-lime py-4 md:py-6`; Bricolage 600 `clamp(1.75rem,4vw,3rem)` rust, ✳ `text-rust/40`, `gap-8`; 30s loop, pauses on hover, `motion-reduce:animate-none`, `aria-hidden`.

## Accessibility requirements
- One h2, one h3, three h4s. The h2's accessible name reads "Good treatment starts with listening.".
- Alt text on the portrait (or `role="img"` + label on the monogram).
- Decorative numbers, icons, eyebrow line and marquee are `aria-hidden`.
- Ink text only (no white small text). Focusable scroll row with a visible focus ring. 44px buttons.
- Reduced motion: opacity only (clip-path reveal → fade), static marquee.

## Acceptance criteria
- [ ] Plain lavender: no circles, outline arch, ✳ or pills. No blend modes or filters on the photo.
- [ ] Cream arch with rounded bottom corners, true skin tones.
- [ ] "listening." highlighter fully drawn (verified in the DOM: `transform: none`, width > 0).
- [ ] Cards, info bar (3 items today), tilted marquee.
- [ ] 375: arch → text → swipeable cards → info grid → marquee; `scrollWidth === innerWidth`.
- [ ] Intro: every statement line, the paragraph and the CTA end at opacity 1 after a fast jump (`scrollTo` straight past the section, then back) and with no scrolling at all after 2.5s once reached.
- [ ] No TODO text, no dev placeholders; `tsc`, `lint` and `build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `next start` + CDP screenshots of `#about` at 1440 and 375 · DOM checks for the highlighter and the Intro opacities after a jump-scroll test · grep the production HTML for "TODO".

## Manual test steps
1. Open `http://localhost:3000/` and press End, then Home. Scroll to the rust Intro: all four lines, the paragraph and the CTA are visible.
2. Click the navbar "About" link from the top: the arch, statement (with the lime bar under "listening."), cards and info bar are all visible when you land.
3. At 375 in the device toolbar, swipe the cards and confirm the page doesn't scroll sideways.
4. Turn on reduced motion in DevTools Rendering and reload: everything only fades and the marquee is still.
