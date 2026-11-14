# Prompt: Patient Reviews (cream band) — Step 7

## Goal
Build `#reviews` after Who We Help. It has three states, driven only by real data in `data/reviews.ts`:

| State | When | What shows |
|---|---|---|
| **Full** | 2+ reviews | Header (eyebrow, h2, optional rating line) with round prev/next arrows, a horizontal scroll-snap track of white review cards (tag, optional headline, serif quote with "Read more", name/date, stars, "via {source}"), and a "Write a review" CTA |
| **Fallback** | under 2 reviews, and at least one of `writeReviewUrl` / `listingUrl` set | Compact "Your feedback matters" band with the URL buttons; if exactly 1 review exists, it shows as a single centred card |
| **Hidden** | under 2 reviews and both URLs empty | No section, and the navbar's "Reviews" link is removed |

No invented reviews, ratings or counts anywhere. No review JSON-LD.

## Docs read
`AGENTS.md` (§4 reviews rule, §7 carousel, §8 anchors, §10 SEO), `DESIGN.md` (§2 band order / review accent, §3 review quote + headline type, §6 review card + icon-circle buttons, §9), `project-docs/DOCS.md` §8, your "Step 7" spec.

## Existing code inspected
- `data/reviews.ts`: old shape (`name, tag, quote, stars, source`), empty array.
- `app/page.tsx` passes `nav` (including "Reviews" → `#reviews`) straight to `Navbar`. **Bug:** that link is live today and points at a section that doesn't exist. Fixed here.
- `components/sections/Navbar.tsx` renders whatever `links` it gets (desktop + mobile menu).
- `app/layout.tsx`: Instrument Serif as `--font-instrument` → `font-serif`.
- Reusable: `Highlighter` (`trigger="parent"`), `useReveal`, `Pill` (`rust`, `outline-dark`), the scroll-snap track pattern from About v1 (removed later; I'll rebuild a small one here), `lib/seo.ts` (no review markup, and none will be added).

## How I read the reference
`/reference/design.png` isn't in the repo. From your description: big rust title left, round arrows right, a row of white cards with a coloured tag pill, bold headline, serif quote, name and stars.

## Decisions and assumptions (⚠️ = please check)

1. **Today's real state = Hidden.** `reviews` is empty, and I don't have the doctor's Google/Justdial listing URL or "write a review" link, so `reviewSummary.listingUrl` / `writeReviewUrl` stay `""`. The section renders nothing and "Reviews" disappears from the navbar (desktop + mobile).
   - To turn on the fallback, paste the two URLs into `reviewSummary`.
   - To turn on the full carousel, paste 2+ real reviews.
   - I won't look these URLs up or fill them in myself.

2. ⚠️ **AGENTS.md §4 conflict.** It says that "while `reviews` is empty, the Reviews section and its nav link stay hidden". Your spec adds the fallback band when URLs exist. I'll follow the spec and update that line: "hidden while there are no real reviews AND no listing/review URLs; with URLs only, a 'Your feedback matters' band shows".

3. **One rule, one helper.** `reviewsState()` in `data/reviews.ts` returns `"full" | "fallback" | "hidden"`. `app/page.tsx` uses it to decide whether to render `<Reviews />` and to filter `#reviews` out of `nav` before passing it to `Navbar`. The Navbar component itself doesn't change.

4. **Data shape** exactly as in your spec (`name, rating, text, headline?, tag?, source, sourceUrl?, date?`) + `reviewSummary` (`rating`, `count`, `source`, `listingUrl`, `writeReviewUrl`). Comments in the file explain the rules: word-for-word, names as shown, never invented.

5. **Title.**
   - `count` set: "{count}+ Reviews" (number rust, "Reviews" ink, no highlighter).
   - Otherwise: "What Patients **Say**" with the lime highlighter (one accent).
   - The rating line (★ + "{rating} on {source}" + "See all reviews →") shows only when `rating` is set; the link only when `listingUrl` is set.

6. **Track** (native scroll-snap; no Embla, same reasoning as About v1):
   - It bleeds to the right edge (`mr-[calc(50%-50vw)]`).
   - Arrows scroll by one card + gap and disable at each end.
   - The arrows hide (space kept) when every card fits.
   - Desktop: arrows in the header row, bottom-aligned with the title. Mobile: centred under the track.
   - The track is focusable with ←/→ handling and has a visible focus ring.
   - Cards are `w-[85%]` on mobile (spec: "~85%"), `sm:w-[320px] md:w-[360px]`.

7. **"Read more."** The quote is clamped to 6 lines (`line-clamp-6`). The button only appears if the text actually overflows (measured after mount). Expanding animates the height from the clamped height to the full height (motion, 0.4s); collapsing reverses. Reduced motion: instant. The button has `aria-expanded`, plus `aria-controls` pointing at the quote.

8. **Stars:** 5 Lucide `Star` icons (filled rust for the rating, `rust/20` for the rest), `role="img" aria-label="{n} out of 5 stars"`. Decorative "“" glyph: Instrument Serif 96px `text-rust/15`, absolute top-right, `aria-hidden`.

9. **Tags** per DESIGN.md §6 / your spec: Ear butter, Nose lilac, Throat sky, Allergy peach, General cream; ink text, 11px.

10. ⚠️ **Spacing snapped to the scale:**

    | Spec | Snapped to |
    |---|---|
    | `md:py-32` | `md:py-36` |
    | `gap-5` | `gap-6` |
    | `p-6 md:p-7` | `p-6 md:p-8` |
    | fallback `py-20` | `py-24` |
    | headline `mt-4`, quote `mt-3`, `pt-6`, `mt-12` | kept (on the scale) |

11. **Test screenshots of the Full state** (your request):
    - I'll back up `data/reviews.ts`, temporarily add 4 **obviously fake layout fixtures** (name "Layout Test 1–4", text "TEST ONLY — layout placeholder, not a real review…", one long enough to trigger "Read more"), build, and screenshot.
    - Then I restore the file from the backup and confirm with `git diff` / `grep "Layout Test"` that nothing remains. The fixtures are never committed.
    - The fallback state is screenshotted the same way with temporary placeholder URLs (`https://example.com/...`), restored after.
    - The Hidden state is the real committed state.

## Files likely to change
- `data/reviews.ts`: new shape, `reviewSummary`, `reviewsState()`.
- `components/sections/Reviews.tsx`: new, server (state switch, header, layout).
- `components/sections/ReviewsMotion.tsx`: new, client (track + arrows, `ReviewQuote` with Read more, reveal wrappers).
- `app/page.tsx`: conditional `<Reviews />` after `<WhoWeHelp />`; filtered nav.
- `AGENTS.md` §4 (⚠️2).

## Implementation requirements
- **Section (full):** `<section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-cream py-24 md:py-36">`; container `mx-auto max-w-[1200px] px-6 lg:px-16`.
- **Header:** `flex items-end justify-between gap-6`.
  - Eyebrow `text-xs font-medium tracking-[0.08em] uppercase text-ink/60`.
  - h2 `mt-4 font-heading font-medium text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none tracking-[-0.03em] text-ink`.
  - Rating line `mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/75`.
  - Arrows: `hidden md:flex gap-3`. Prev `size-11 rounded-full border border-rust/40 text-rust`; next `size-11 rounded-full bg-rust text-white hover:bg-rust-dark`; `disabled:opacity-40`, `aria-label="Previous review"` / `"Next review"`, `aria-controls` = the track id.
- **Track wrapper:** `<section aria-roledescription="carousel" aria-label="Patient reviews">` with `mt-12`. Track `flex snap-x snap-mandatory gap-6 overflow-x-auto pr-6 lg:pr-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`, `tabIndex=0`, focus ring.
- **Card `<article aria-label="Review by {name}">`:** `relative flex w-[85%] shrink-0 snap-start flex-col rounded-[24px] bg-white p-6 sm:w-[320px] md:w-[360px] md:p-8`.
  - Tag `inline-flex h-6 self-start items-center rounded-full px-3 text-[11px] font-medium text-ink` + colour.
  - Headline `mt-4 font-heading text-[19px] font-medium leading-[1.25] text-rust`.
  - Quote `mt-3 font-serif text-[17px] leading-[1.55] text-ink/85` (+ Read more `mt-2 text-[13px] font-medium text-rust underline-offset-4 hover:underline`).
  - Footer `mt-auto pt-6`, inner `border-t border-rust/10 pt-4 flex items-center justify-between`: name `text-[13px] font-medium text-ink`, date `text-xs text-ink/50`, stars `size-4`.
  - `via {source}` `mt-3 text-[11px] text-ink/50 hover:underline` (a link only if `sourceUrl`, opening in a new tab).
- **CTA:** `mt-12 text-center`, text `text-sm text-ink/70`, `Pill variant="rust"` "Write a review" (new tab) only if `writeReviewUrl`.
- **Fallback section:** `id="reviews"`, `bg-cream py-24`, centred `mx-auto max-w-[640px] text-center`.
  - h2 "Your **feedback** matters" with the highlighter.
  - Text `mt-4 text-[15px] leading-[1.65] text-ink/75`.
  - The optional single card (`max-w-[420px] mx-auto mt-12 text-left`).
  - Buttons `mt-8 flex flex-wrap justify-center gap-3`: `Pill rust` "Write a Google review" + `Pill outline-dark` "See listing", each only if its URL is set.
- **Motion:** header fade-up (+ highlighter through parent variants), cards fade up 24px stagger 0.08s, all via `useReveal` (10%, 2.5s fallback). Reduced motion: opacity only.

## Accessibility requirements
- One h2. Cards are `<article>` with `aria-label`. Stars are `role="img"` with an `aria-label`. The quote glyph is `aria-hidden`.
- Arrow buttons have `aria-label` + `aria-controls`, 44px, and a disabled state. The track is keyboard-scrollable.
- "Read more" has `aria-expanded` / `aria-controls`. External links open in a new tab with `rel="noopener noreferrer"`.
- Contrast: ink/rust on white/cream pass. Lime is used only as the highlighter bar behind rust/ink text.

## Acceptance criteria
- [ ] Committed state (empty reviews, empty URLs): no `#reviews` section, no "Reviews" in the desktop or mobile nav.
- [ ] Fallback screenshot (temp URLs): centred band, highlighter on "feedback", two buttons.
- [ ] Full screenshot (temp fixtures): title + arrows, white cards with tag, serif quote, name, stars, "via"; "Read more" expands the long one; arrows scroll and disable at the ends; 375: cards ~85% wide, arrows under the track.
- [ ] After the screenshots, `data/reviews.ts` contains no fixtures (`grep "Layout Test"` → nothing) and `reviewSummary` URLs are back to `""`.
- [ ] No `Review` / `AggregateRating` in the JSON-LD.
- [ ] `tsc`, `lint`, `build` pass (on the final, real state).

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` for each state (fixture builds are discarded) · CDP: section presence + nav link list, screenshots at 1440 and 375, Read more height change, arrow disable states, scrollWidth · `grep` for fixtures and review JSON-LD.

## Manual test steps
1. Open `http://localhost:3000`: no "Reviews" in the navbar (desktop or ☰ menu), and no reviews section after Who We Help.
2. Paste the doctor's Google "write a review" link into `reviewSummary.writeReviewUrl` (and the listing URL into `listingUrl`). Reload: the "Your feedback matters" band appears with the buttons, and "Reviews" is back in the navbar.
3. Paste 2+ real reviews (word for word, names as shown). Reload: the carousel appears. Use the arrows, swipe on a phone, and tap "Read more" on a long review.
