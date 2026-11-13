# Prompt: Who We Help tweaks (tags + links)

## Goal
1. Three condition tags per card, on one line.
2. "Book for … →" links get a rust arrow that slides 4px right on hover, plus a little more space above, and stay aligned across the 3 cards.

## Docs read / code inspected
`AGENTS.md`, `DESIGN.md` §4 spacing; `data/site.ts` (`whoWeHelp.groups[].conditions`), `components/sections/WhoWeHelp.tsx`.
- The card body is already `flex flex-1 flex-col`, and the link sits in a `mt-auto pt-6` wrapper, so the links already line up at the same height in all 3 cards. That stays.

## Decisions (⚠️ = please check)
1. **Tags:**
   - Children: Ear infections, Tonsils, Adenoids
   - Adults: Sinusitis, Allergies, Throat & voice
   - Seniors: Hearing loss, Vertigo, Tinnitus

   "Blocked nose", "Snoring" and "Balance" are dropped (they're still in the card text). The tag row becomes `flex-nowrap`, and I'll measure every card's tag row at 375, 768, 1024, 1280 and 1440.
2. ⚠️ **Tablet widths.** The 3-column grid starts at `md` (768), where each card's content is only about 170px wide. Three tags won't fit at 12px there, and maybe not even at 11px. Your fallback (`text-[11px] px-2.5`) covers mobile.
   - If they still don't fit at 768–1279, I'll apply the 11px / `px-2.5` size there too.
   - If even that isn't enough at 768, I'll move the 3-column grid to `lg` (cards stack on tablets, as on phones) rather than shrink the text further.
   - I'll report what the measurements needed.
3. ⚠️ **Link spacing:** `mt-7` (28px) is off the DESIGN.md scale, so I'll use `pt-8` (32px, was 24px) on the `mt-auto` wrapper.
4. **Arrow:** the "→" character becomes a Lucide `ArrowRight` (16px, stroke 1.5, rust, `aria-hidden`) inside the link, with `transition-transform duration-200 ease-out group-hover/link:translate-x-1` (4px). It also moves on keyboard focus (`group-focus-visible/link:translate-x-1`), and stays still with reduced motion (`motion-reduce:transition-none motion-reduce:translate-x-0`). The underline stays on the text only.

## Files likely to change
`data/site.ts`, `components/sections/WhoWeHelp.tsx` (and only if needed for ⚠️2, the grid breakpoint).

## Acceptance criteria
- [ ] Each card's 3 tags are on one line at 375, 768, 1024, 1280 and 1440 (measured: one `offsetTop` per row, no overflow).
- [ ] Hovering a link slides its arrow 4px right; links aligned across cards.
- [ ] `tsc`, `lint`, `build` pass; screenshots at 1440 and 375.

## Checks / manual test
`npx tsc --noEmit` · `npm run lint` · `npm run build` · CDP: tag-row measurements at the 5 widths, link `getBoundingClientRect().top` equal across cards at 1440.

Manual: open `/#who-we-help`, hover each "Book for … →" (the arrow nudges right), and resize from 375 to 1440 (the tags never wrap).
