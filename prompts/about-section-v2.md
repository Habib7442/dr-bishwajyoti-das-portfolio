# Prompt: About the Doctor — v2 editorial redesign (Step 4 v2)

## Goal
Replace the About section's layout with a bolder, editorial one. From top to bottom:
1. Arch portrait + big ink statement + name block
2. Three numbered, coloured approach cards
3. One white info bar (replaces the highlights carousel)
4. A tilted lime marquee ribbon that closes the section

Keep the `data/site.ts` content and the rule that TODO values are hidden. Dev reminders move from on-page dashed boxes to the browser console.

## Docs read
- `AGENTS.md`, `DESIGN.md` (re-read: §1 do/don't, §2 contrast, §3 type, §4 spacing, §5 arch shape, §6 buttons, §9 motion)
- Your "Step 4 (v2)" prompt
- `prompts/about-section.md` (v1)

## Existing code inspected
- `components/sections/About.tsx` + `AboutMotion.tsx` (v1): portrait disc, approach checklist, carousel. **Most of this will be rewritten.**
- `components/sections/HeroMotion.tsx`: `HeroHeadline` holds the word reveal and the lime highlighter inline. It runs on page load (`animate`), not when scrolled into view, and always renders an `h1`.
- `components/ui/dev-todo.tsx`: will be deleted (replaced by console logging).
- `components/sections/IntroMotion.tsx`: `BookScrollPill`. `components/ui/pill.tsx`: `rust` / `outline-dark` variants.
- `data/site.ts`: `about`, `quickFacts`, `quickFactsShort`, `site.fee`, `site.phone`.
- `public/images/doctor/portrait.webp`: 1254×1254, **opaque grey background** (not a cut-out).
- `app/page.tsx`: About is currently the **last section** on the page (no Chamber section yet).

## Decisions and assumptions (please check the ⚠️ ones)

1. ⚠️ **Statement colour: ink instead of white.** DESIGN.md §2 lists white headings for the About band. Your v2 asks for ink, which also fixes the 2.3:1 white-on-lavender problem I flagged in v1. I'll use ink, and **update the About row in DESIGN.md §2** (heading colour → ink, accent → rust + lime highlighter) so the two sources stop conflicting. Tell me if you'd rather I leave DESIGN.md alone.

2. ⚠️ **Blurred blobs, asked for again.** DESIGN.md §1 says no gradients on backgrounds, and a `blur-3xl` blob is a soft radial gradient. I dropped the blob in v1 for this reason. Since you've asked twice, I'll offer a choice:
   - **(a) default:** flat, unblurred discs (`bg-lilac/60` 520px behind the arch, `bg-peach/40` 320px top-right), which match the reference's flat colour blocking.
   - **(b)** blurred, exactly as written. Reply "blur" and I'll also note the exception in DESIGN.md.

3. ⚠️ **Portrait background.** The current photo has a grey background. As you specified, I'll use `mix-blend-multiply` as the temporary fix, plus a dev console warning.
   - Side effect: multiply also tints the white coat and skin toward peach. It looks acceptable but not great.
   - Proper fix: a background-removed PNG/WebP.
   - I **won't** send the doctor's photo to an online background-removal service without your OK. If you want that, say so (a Canva tool is available), or drop in your own cut-out.
   - New data flag `about.portraitCutout: false`. Set it to `true` when the transparent file arrives (multiply off, warning gone).

4. **Highlighter reuse.** I'll pull the lime highlighter bar out of `HeroHeadline` into a shared `components/ui/highlighter.tsx` (`<Highlighter delay trigger="load" | "view">`). The hero keeps the same visuals and timing. The About h2 gets a new `WordRevealHeading` (in-view trigger, renders `h2`) that uses the same word-slide timing (0.08s stagger, 0.8s, house ease) and the shared highlighter.

5. **Marquee overlap.** The section needs `overflow-x-clip` (not `overflow-hidden`) so the ribbon can hang half its height below the section while sideways overflow stays clipped. About is the **last section for now**, so the overlap will hang over the page bottom. I'll add `pb-12` padding below it until Chamber exists, then remove that in the Chamber step. It overlaps the next band once Chamber is added (rust, z-0 vs marquee z-10).

6. **Approach-card icons.** Lucide has `Ear`, but no nose or throat glyphs, and the cards are about *how he treats*, not body parts. I'll use `Ear` (Listens first), `MessagesSquare` (Explains clearly) and `HandHeart` (Treats gently), white on a rust circle, stroke 1.5. Icon names live in `about.approach[i].icon`.

7. **Pill content from data:** `quickFactsShort.place` ("Nightingale Hospital"), `quickFactsShort.hours` ("Mon–Sat · 2:30–9 PM"), plus the experience pill only if `experienceYears` isn't TODO. Icons: Lucide `MapPin` and `Clock` in a lime circle (no emoji).

8. **Info bar order and data:** Practices at (`quickFacts.place`), Available (`quickFacts.hours`), Fee (`site.fee`), Qualification, Experience ("{n}+ years"), Speaks, Registration. TODO items are skipped. **Today that shows 3 items: place, hours, fee.** Desktop is a flex row with equal-width items. Mobile is a 2-column grid with horizontal dividers, and an odd last item spans both columns, so it never looks empty.

9. **Statement copy** goes into data: `about.statement = { lead: "Good treatment starts with", accent: "listening." }`. No quotation marks and no attribution. Marquee words go into `about.marquee = ["Ear", "Nose", "Throat", "Allergy", "Hearing", "Sinus", "Voice"]`.

10. **Name appears once.** The v1 white name pill on the portrait is removed. The name block on the right becomes an `h3`.

11. **Dev reminders → console.** A tiny client `DevTodoLog` runs `console.warn` once in `development` only, listing the missing fields (portrait cut-out, qualifications, experience, bio, languages, registration). Nothing is rendered.

12. ⚠️ **Off-scale values snapped to the DESIGN.md scale:**
    | Spec | Snapped to |
    |---|---|
    | `md:pt-32` (128) | `md:pt-36` (144, DESIGN section padding) |
    | `gap-5` (20) | `gap-6` |
    | `p-7` (28) | `p-6` (mobile) / `md:p-8` |
    | `mt-10` (40) | `mt-12` |
    | `pl-5` (20) | `pl-4` |
    | `py-5` (20) | `py-4` |
    | outline offset 12px | kept (on scale) |
    | arch bottom radius 32px, card radius 28px | kept (radii aren't spacing) |
    | `min-h-[240px]` | kept (a size, not spacing) |

13. **Removed:** the v1 carousel (`CarouselScope`, `HighlightsTrack`, `CarouselArrows` in `AboutMotion.tsx`), the v1 disc portrait, the approach checklist, and `components/ui/dev-todo.tsx`. `about.highlights` is replaced by the info-bar list built in `About.tsx` from data (labels + values stay in `data/site.ts` as `about.info`).

## Files likely to change
- `data/site.ts`: `about` gains `statement`, `marquee`, `portraitCutout`, `approach[].icon`, and `info` (replaces `highlights`, adds Fee).
- `components/sections/About.tsx`: rewrite.
- `components/sections/AboutMotion.tsx`: rewrite (ArchReveal, OutlineArch, FloatPill, WordRevealHeading, CardsRow, InfoBar dividers, DevTodoLog).
- `components/ui/highlighter.tsx`: new, shared.
- `components/sections/HeroMotion.tsx`: use `Highlighter` (no visual change).
- `components/ui/marquee.tsx`: new, generic CSS marquee.
- `app/globals.css`: `@keyframes marquee` + `--animate-marquee: marquee 30s linear infinite`.
- `components/ui/dev-todo.tsx`: delete.
- `DESIGN.md`: About row in §2 (only if you agree to ⚠️1).

## Implementation requirements

### Section
`<section id="about" aria-labelledby="about-title" className="relative overflow-x-clip bg-lavender pt-24 md:pt-36">`. Container `mx-auto max-w-[1200px] px-6 lg:px-16`.

### Split block: `grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end`
**Arch (md:col-span-5), wrapper `relative mx-auto w-full max-w-[340px] md:max-w-[460px]`:**
- Background disc: lilac, 520px, `absolute -left-1/4 top-1/4 -z-0 rounded-full`, `aria-hidden`.
- Outline arch: `absolute inset-0 -translate-y-3 translate-x-3 rounded-t-full rounded-b-[32px] border-2 border-lime`, `aria-hidden`. It animates in from offset 0 / opacity 0 after the reveal.
- Arch: `relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[32px] bg-peach`. `clip-path inset(100% 0 0 0) → inset(0)`, 1s.
  - Inner `absolute inset-0 origin-bottom scale-105` holds a `next/image` (`fill`, `object-cover object-top`, plus `mix-blend-multiply` when `!portraitCutout`). The inner wrapper rises 24px after the reveal (delay 0.5s, 0.8s).
  - `sizes="(min-width: 768px) 460px, 340px"`.
- ✳ lime, 40px, `absolute -top-4 -left-2`, spin 12s, `motion-reduce:animate-none`, `aria-hidden`.
- Pills: `inline-flex h-11 items-center gap-2 rounded-full bg-white pr-4 pl-1.5 text-[13px] text-rust` with a `size-8 rounded-full bg-lime` icon circle (rust icon 16px, stroke 1.5).
  - Place pill: `absolute top-[18%] -right-4 md:-right-8`.
  - Hours pill: `absolute bottom-[12%] -left-4 md:-left-8`.
  - Experience pill (`bg-lime`, icon circle `bg-white`): `absolute top-1/2 -right-4 md:-right-12`.
  - Pop in (spring, stagger 0.15s, after the arch), then float: `y: [0, -6, 0]`, 4s, `repeat: Infinity`, `ease: "easeInOut"`, with a 0.6s start offset per pill.
  - These are not interactive. The text is real content (not `aria-hidden`).

**Text (md:col-span-6 md:col-start-7), `relative`:**
- Peach disc 320px `absolute -top-12 -right-24 bg-peach/40 rounded-full -z-0`, `aria-hidden`.
- Eyebrow `<p>`: 12px uppercase, `tracking-[0.08em] text-ink/70`.
- h2 `#about-title` (WordRevealHeading): `mt-4 font-heading font-medium text-[clamp(2.5rem,5vw,4.25rem)] leading-none tracking-[-0.03em] text-ink`. "listening." is `text-rust` with the highlighter behind it.
- Name block `mt-12 border-l-2 border-rust pl-4`:
  - h3 `font-heading font-semibold text-[28px] leading-[1.15] tracking-[-0.02em] text-rust`
  - role `text-sm text-ink/80`
  - qualifications (if confirmed) `text-[13px] text-ink/70`
- Bio (confirmed only): `mt-6 max-w-[48ch] text-[15px] leading-[1.7] text-ink/85`.
- CTAs `mt-8 flex flex-wrap gap-4`:
  - `BookScrollPill` with the rust pill classes: "Book an appointment"
  - `<a href={telHref}>` with `inline-flex h-11 items-center rounded-full border border-ink/30 px-6 text-[13px] font-medium text-ink hover:bg-ink/5`: "Call {site.phone}" (only if `telHref`)
- Mobile: the arch comes first, then text (source order already does this).

### Approach cards (`mt-24`)
- Mobile: a horizontal row `flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 scroll-px-6`, scrollbar hidden, cards `w-[82%] shrink-0 snap-start`. `md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0`, with cards `md:w-auto`.
- Card `<article>`: `flex min-h-[240px] flex-col justify-between rounded-[28px] p-6 md:p-8`, background in order `bg-cream`, `bg-butter`, `bg-peach`.
  - Top row `flex items-start justify-between`: number `font-heading font-semibold text-[64px] leading-none text-rust/25` (`aria-hidden`), and an icon `grid size-12 place-items-center rounded-full bg-rust text-white` (24px, `aria-hidden`).
  - Bottom: h4 `font-heading font-medium text-[26px] leading-[1.15] tracking-[-0.01em] text-rust`, p `mt-2 text-sm leading-[1.6] text-ink/80`.
- Hover on fine pointers: `whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}`, spring (`stiffness 300, damping 20`).
- In view: fade up 32px, stagger 0.1s.
- Wrapper `<div role="list">` with each card `role="listitem"` (a scroll row of articles). The mobile track gets `tabIndex={0}` + `aria-label="How Dr. Das treats patients"` so it scrolls with the keyboard.

### Info bar (`mt-6`)
- `<dl>` `rounded-[28px] bg-white px-6 py-6 md:px-10`.
- Desktop: `md:flex`, each item `md:flex-1 md:px-6 first:md:pl-0 last:md:pr-0`. Dividers are separate `motion.span`s (`w-px bg-rust/15 self-stretch`, scaleY 0→1, origin-top) between items.
- Mobile: `grid grid-cols-2`, items `py-4`, horizontal dividers `border-t border-rust/15` from row 2. If the count is odd, the last item gets `col-span-2`.
- Label `<dt>` 11px uppercase `tracking-[0.08em] text-ink/60`. Value `<dd>` `mt-1 font-heading font-medium text-lg leading-[1.25] text-rust`.
- Bar fades in.

### Marquee (`mt-24`)
- `<div aria-hidden className="relative z-10 -mb-[calc(var(--mh)/2)] ...">` uses a fixed half-height negative margin (`-mb-8 md:-mb-10`, roughly half of the ribbon height).
- Ribbon: `-ml-[5%] w-[110%] -rotate-2 bg-lime py-4 md:py-6`. The text is Bricolage 600 `clamp(1.75rem,4vw,3rem)` rust, `whitespace-nowrap`; ✳ in `text-rust/40`, `mx-6`.
- Generic `<Marquee>`: a flex track with the content rendered **twice**, `animate-marquee` (translateX 0 → -50%), `hover:[animation-play-state:paused]`, `motion-reduce:animate-none`.
- Temporary `pb-12` under the ribbon on the section (until Chamber exists).

### Dev logging
`<DevTodoLog missing={[...labels]} />` (client), with `useEffect` → `if (process.env.NODE_ENV === "development" && missing.length) console.warn("[About] Fill in data/site.ts:", missing)`.

## Accessibility requirements
- Headings: one h2 (statement), h3 (name), h4 per card. Word-reveal spans must keep the h2's accessible name reading "Good treatment starts with listening." (real spaces between words; the highlighter is `aria-hidden`).
- Portrait alt = `about.portraitAlt`. All discs, the outline arch, ✳, card numbers and icons are `aria-hidden`. The marquee is `aria-hidden`.
- Small text on lavender is ink/70+. No white small text anywhere in the section.
- Focus rings on the pills and the scrollable card row. Tap targets are 44px.
- Reduced motion (`MotionConfig reducedMotion="user"` + `motion-reduce:` classes): opacity only, no float, no hover tilt, marquee static, ✳ static. The clip-path reveal is replaced by a plain fade, because clip-path isn't a transform and motion won't drop it automatically. I'll check `useReducedMotion()`.

## Acceptance criteria
- [ ] 1440: arch portrait (peach, lime outline arch, 2 floating pills) left; ink statement with the lime highlight under "listening." and the rust name block right; 3 coloured numbered cards; a white info bar with 3 items + dividers; a tilted lime marquee ribbon.
- [ ] No grey box around the portrait (multiply fallback).
- [ ] The name appears once; no white small text on lavender; no dashed placeholders; dev console lists the missing fields.
- [ ] 375: arch → statement/name → swipeable cards → 2-column info grid (the 3rd item spans the full width) → marquee; `scrollWidth === innerWidth`.
- [ ] The hero highlighter still looks and times the same after the refactor.
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `next start` + CDP screenshots of `#about` at 1440 and 375 (plus a hero screenshot to confirm the highlighter refactor) · check `scrollWidth` at 375 · grep the production HTML for "TODO".

## Manual test steps
1. Open `http://localhost:3000/#about` at 1440 and check the layout against the acceptance list. Hover each card: it lifts and tilts.
2. Open the DevTools console: one `[About] Fill in data/site.ts:` warning lists the missing fields.
3. At 375 (device toolbar), swipe the cards and confirm the page itself doesn't scroll sideways.
4. Hover the marquee: it pauses. Turn on reduced motion in DevTools Rendering and reload: the marquee, pills and ✳ are static, and elements just fade in.
5. Reload the top of the page: the hero "Throat." highlighter still sweeps in after the words.
6. When a transparent portrait arrives, put it at `public/images/doctor/portrait.png`, set `about.portrait` to it and `portraitCutout: true`, then rebuild.
