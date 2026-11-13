# Prompt: Animation safety net + mobile fixes

## Goal
1. One shared viewport setting (`once: true, amount: 0.1`) for every scroll reveal, plus a global fallback: anything not revealed **2.5s after page load**, or scrolled past, jumps to its final visible state.
2. About arch below `lg`: fade + rise instead of the clip-path reveal.
3. About arch at 375: full arch with the head visible (`max-w-[300px]`, `object-[50%_12%]`).
4. Intro image pill: confirm it always renders next to "allergy" on mobile.
5. Booking problem chips: all 5 on one line at 375.

## Docs read
`AGENTS.md`, `DESIGN.md` §9 (motion), §11 (tap targets), your request.

## Existing code inspected
- `lib/use-reveal.ts`: reveals on IntersectionObserver (`amount 0.15`) or once the element's top passes 90% of the viewport. No timer.
- Users: `AboutMotion.tsx` (RevealGroup, ArchReveal, StatementHeading) and `IntroMotion.tsx` (StatementLine, AccentWord, PillPop, FadeUp, StatValue, StatItem).
- **One `whileInView` left:** `components/ui/reveal.tsx` (`amount: 0.2`). It's used by the Services draft and nothing currently on the page.
- `lib/motion.ts`: `ease`, `fadeUp`, `stagger`, `wordReveal`; no shared viewport constant.
- `Intro.tsx`: `ImagePill` has **no** breakpoint class hiding it. Its parent `<span className="whitespace-nowrap">` keeps "allergy" and the pill together. `/images/intro-pill.webp` exists, so it renders the photo. I'll confirm with a 375 screenshot; a code change is only needed if the screenshot shows a problem.
- `BookingCard.tsx` chips: `h-9 px-3 text-[13px] md:h-11 md:px-3.5`, in `flex flex-wrap gap-1.5`.
- About arch: `max-w-[320px] lg:max-w-[440px]`, `object-[50%_15%]`, radius `rounded-[50%_50%_32px_32px/40%_40%_32px_32px]`.

## Decisions and assumptions (⚠️ = please check)

1. **One source of truth.** I'll add `export const VIEWPORT = { once: true, amount: 0.1 } as const` and `REVEAL_FALLBACK_MS = 2500` to `lib/motion.ts`. `useReveal` uses both. `components/ui/reveal.tsx` switches from `whileInView` to `useReveal`, so there are **no `whileInView` calls left** and every reveal goes through the same hook with the same safety net.

2. ⚠️ **The 2.5s-after-load fallback has a visible side effect.** It's the only way a full-page screenshot (which never scrolls) can show everything. But it also means that on a real phone, anything you haven't scrolled to within 2.5s of loading will already be in its final state when you get there, with no reveal animation. In practice, the scroll reveals will only play for sections you reach in the first 2.5s.
   - Timer: `setTimeout` for `2500 − performance.now()` ms, so it's measured from page load, not from when the component mounted.
   - Elements still off-screen at that moment snap visible *without* animating (`transition: { duration: 0 }`), so nothing plays out of sight.
   - Scrolled-past detection stays as it is.

   If you'd rather keep scroll reveals for a normal reader, a longer timer (e.g. 6–8s) is the alternative. I'll build exactly 2.5s unless you say otherwise.

3. **Arch reveal by breakpoint.** `ArchReveal` reads `(min-width: 1024px)` with `useSyncExternalStore` (server snapshot = mobile, i.e. the fade). From `lg` up it uses the clip-path from the bottom + photo rises 24px. Below `lg` the whole arch fades + rises (opacity 0→1, y 24→0), with no clip-path and no inner rise. Reduced motion stays opacity-only.

4. **Arch at 375:** wrapper `w-full max-w-[300px] lg:max-w-[440px] mx-auto aspect-[4/5]`, photo `object-[50%_12%]`.
   - I'll keep the explicit arch radius rather than `rounded-t-full`. They look identical, but `rounded-t-full` combined with `rounded-b-[32px]` makes the browser flatten the bottom corners (seen in v2).
   - I'll check in the screenshot that the top of the head isn't cropped.

5. ⚠️ **Chips at `h-8` are 32px tall, below the 44px tap-target rule (DESIGN.md §11).**
   - I'll apply the visual size you asked for (`h-8 px-3 text-[12px] gap-1.5`) below `md`.
   - Each chip gets an invisible larger hit area: `relative after:absolute after:inset-x-0 after:-inset-y-1.5`, which makes a 44px-tall touch zone.
   - The chips stay 32px visually, as you specified. The vertical gap between rows doesn't matter because they'll be on one row.
   - `md+` keeps `h-11 px-3.5 text-[13px]`.

6. **Chips must fit at 375:** after the change I'll measure the radiogroup in the browser (all 5 chips on the same `offsetTop`). If they still wrap, I'll drop to `px-2.5` and report it, rather than going smaller on text.

## Files likely to change
- `lib/motion.ts`: `VIEWPORT`, `REVEAL_FALLBACK_MS`.
- `lib/use-reveal.ts`: use both constants; add the load timer and an `instant` flag for snapped elements.
- `components/ui/reveal.tsx`: `useReveal` instead of `whileInView`.
- `components/sections/AboutMotion.tsx`, `IntroMotion.tsx`: pass the `instant` flag through (snap with `duration: 0`).
- `components/sections/AboutMotion.tsx`: `ArchReveal` mobile/desktop variants.
- `components/sections/About.tsx`: arch `max-w-[300px]`, `object-[50%_12%]`.
- `components/sections/BookingCard.tsx`: chip sizes + hit area.
- `components/sections/Intro.tsx`: only if the 375 screenshot shows the pill missing.

## Accessibility requirements
- Chips keep a 44px touch target (hit-area pseudo-element) and their focus rings.
- Reduced motion unchanged: opacity only.

## Acceptance criteria
- [ ] `grep -r whileInView components lib` → no results; one `VIEWPORT` constant with `amount: 0.1`.
- [ ] **Full-page screenshot** (no scrolling, 3s after load) at 375 and 1440: every Intro and About element has opacity 1, the "listening." highlighter is drawn, and the arch is fully revealed.
- [ ] **Normal scroll** (300px steps) at 375: every element ends at opacity 1.
- [ ] At 375 the arch is 300px wide, the full arch shape is visible, and the head isn't cropped.
- [ ] At 375 the Intro pill is visible next to "allergy" on the same line.
- [ ] At 375 all 5 chips share one row; each chip's touch area is ≥44px tall.
- [ ] `tsc`, `lint`, `build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `next start`, then:
- Full-page capture with no scrolling at 375 and 1440, 3s after load
- Scripted 300px-step scroll at 375
- DOM checks: min opacity of animated elements, highlighter width, chip `offsetTop`s, chip hit height

## Manual test steps (real phone)
1. Open the deployed or LAN dev URL on your phone (the dev server prints a `Network:` address). Scroll down slowly from the top. Intro and About content is all visible; anything reached after ~2.5s simply appears already in place.
2. Reload, wait 3s, and take a full-page screenshot (Chrome Android: Share → Long screenshot; iOS Safari: screenshot → Full Page). Everything is visible.
3. In the hero booking card, all 5 problem chips sit on one line. Tap "Other": it selects without mis-taps.
4. In About, the full arch is visible with his head inside it.
