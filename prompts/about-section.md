# Prompt: About the Doctor (lavender band) — Step 4

## Goal
Build the lavender **"Meet Your Doctor"** band (`#about`): header row (eyebrow + h2 + carousel arrows), a two-column block (round portrait on a peach disc + name, role, approach list, CTA), and a highlights carousel of round-icon cards below. Content lives in a new `about` block in `data/site.ts`. No `TODO` value is ever rendered in production. Build only this section.

## Docs read
- `AGENTS.md`, `DESIGN.md` (§2 colours + contrast, §3 type, §4 spacing, §5 shapes, §6 buttons + highlight card, §7 icons, §9 motion, §11 a11y), `project-docs/DOCS.md` §5 (About the Doctor)
- Your "Step 4: About the Doctor" prompt
- `prompts/intro-section.md` (Next 16 notes already verified there: `next/image` `qualities: [75, 80]`, no `priority`, no `new Date()` in server components; build-time `existsSync` check for files in `/public`)
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`

## Existing code inspected
- `app/page.tsx`: renders Navbar, Hero, Intro, FloatingWhatsApp. **Services is not rendered.**
- `components/sections/Services.tsx`: an unrendered draft from the hero commit. Its bottom curve divider draws a lavender ellipse. There is no `prompts/services-section.md`, so step 3 has not been done in this repo (see decision 1).
- `data/site.ts`: `qualifications`, `experienceYears`, `registrationNo` (all TODO); `images.doctor` is an **Unsplash stock portrait** (unused); an unused `highlights` array (old shape); `quickFacts.place` / `quickFacts.hours`.
- `lib/site-helpers.ts`: `isTodo`, `telHref`. `lib/motion.ts`: `ease`, `fadeUp`, `stagger`.
- `components/sections/IntroMotion.tsx`: `BookScrollPill` (scrolls to the hero form and focuses the name field), `PillPop`, `FadeUp`.
- `components/ui/pill.tsx` (`rust` variant), `components/ui/text-bits.tsx` (`Asterisk`, `Field`), `components/ui/carousel-arrows.tsx` (Embla-only, lime/lime; not reusable for a native scroll-snap track).
- `app/globals.css`: all needed tokens exist (`lavender`, `peach`, `butter`, `lilac`, `sky`, `lime`, `rust`, `ink`).
- `/reference/design.png` **does not exist in the repo**, so I'm working from your written description. Add it if you want the final screenshot comparison to be against the image.

## Decisions and assumptions (please check the ⚠️ ones)

1. ⚠️ **Services isn't on the page yet.** No lavender "temporary strip" exists to remove. I'll insert `<About />` after `<Intro />` in `app/page.tsx` and leave `Services.tsx` untouched. For now the page goes rust (Intro) → lavender (About) with no curve. The "cream → lavender curve joins seamlessly" check is **deferred to step 3**. The section's top padding is sized so the curve can sit on it later without a seam (the Services curve ends in `bg-lavender`, flush with this section's `bg-lavender`).
   *If you'd rather I render Services in this step too, tell me. I'd treat that as a separate prompt.*

2. ⚠️ **TODO handling differs from AGENTS.md for this section, at your request.** AGENTS.md says TODOs render as a *visible* placeholder. Your step says: hide them in production and show a small dashed placeholder **in development only** (`process.env.NODE_ENV === "development"`). I'll do it your way for this section only, with a tiny `DevTodo` component (dashed outline, ink/60 text, e.g. "Add qualification").

3. **Single source for doctor facts.** `about.qualifications`, `about.experienceYears` and `about.registration` reference `site.qualifications`, `site.experienceYears` and `site.registrationNo` instead of duplicating TODOs. "Practices at" and "Available" reference `quickFacts.place` / `quickFacts.hours`. Filling a value once updates the intro stats, the about section and the highlights.

4. ⚠️ **Languages aren't confirmed, so they're a TODO.** Your snippet hard-codes "Bengali, English, Hindi" with a "confirm" comment. That's an unconfirmed fact about the doctor, so I'll store it as `"TODO: confirm — Bengali, English, Hindi?"`. The "Speaks" card stays hidden until you replace it with the real list. `about.languages` becomes that single string (not an array) so there's one value to fill.

5. ⚠️ **Portrait.** `public/images/doctor/portrait.jpg` doesn't exist. Same pattern as the intro pill: a build-time `existsSync` check renders the **"BD" monogram fallback** on the peach disc until the file is added, with no code change needed. I'll **delete `site.images.doctor`** (the Unsplash stock "portrait of Dr. Biswajyoti Das") so a stock person can never be shown as the doctor. I'll also remove the unused old `highlights` export and `Highlight` type, which `about.highlights` replaces.

6. **What renders today**, given current data:
   - Portrait: monogram fallback. No experience pill (TODO). Name pill shown.
   - Role line: "ENT & Allergy Specialist" (qualifications hidden).
   - Bio: hidden (TODO); the approach list shows.
   - Highlights: only **2 cards** pass the filter (Practices at, Available), so the **≤3 rule gives a simple grid with no arrows**. The carousel and arrow code is still built and type-checked; it turns on automatically at 4+ cards. To show it in the browser test I'll check it once with a temporary local data edit and then revert.

7. ⚠️ **Conflicts where DESIGN.md wins (flagged per AGENTS.md §3):**
   | Your spec | DESIGN.md / rule | I'll use |
   |---|---|---|
   | Eyebrow white/80, 12px | White on lavender only at 24px+ | `text-ink/80` |
   | Role line white/90, 15px | same | `text-ink` |
   | Card `bg-white/20 backdrop-blur-sm border-white/30` | Highlight card `white/15`, flat | `bg-white/15 border border-white/30`, no blur |
   | Icon circle rotating peach/butter/lilac/sky | "Icon in a lime circle" | **lime** circle, rust icon 24px |
   | Lilac blob `blur-3xl` | No gradients on backgrounds (a blur is a soft gradient) | **Dropped**. Say if you want a flat lilac disc instead |
   | Arrows `size-11` | Icon circle `size-10` | `size-11` (44px tap target, §11) |

8. ⚠️ **Prev arrow contrast.** A white 1px outline + white icon on lavender is about 2.3:1, below the 3:1 WCAG needs for UI controls. I'll make the prev arrow `border-rust text-rust` (about 4.1:1) and the next arrow `bg-lime text-rust` as specified. Say if you prefer white to match the reference exactly.

9. **The h2 is white on lavender (about 2.3:1).** DESIGN.md mandates white headings at 24px+ on lavender, so I'm following it, but this is below WCAG's 3:1 large-text minimum. Worth a design decision later. The accent word "Doctor" is rust (about 4.1:1).

10. **Spacing snapped to the DESIGN.md scale:**
    - section `pt-20 md:pt-28 pb-24 md:pb-32` → `pt-24 md:pt-36 pb-24 md:pb-36` (DESIGN.md section padding)
    - block `mt-14` → `mt-16`; approach `mt-8` kept; CTA `mt-10` → `mt-12`; carousel `mt-20` → `mt-24`; track `gap-5` → `gap-6`
    - portrait outline offset 16px kept

11. **The lime ✳ near the portrait** is decorative (`aria-hidden`), not text, so the "lime text only on rust" rule doesn't apply. It spins slowly (`animate-[spin_12s_linear_infinite] motion-reduce:animate-none`, the same class as the intro).

12. **The track is native CSS scroll-snap, not Embla.** DESIGN.md §6 asks for a scroll-snap track, and this doesn't add a library. The arrows call `track.scrollBy({ left: ±(cardWidth + gap) })`. A `scroll` listener plus `ResizeObserver` sets the disabled state at each end.

13. **CTA:** a rust pill "Book an appointment" using `BookScrollPill` (scrolls to the hero form and focuses the name field; plain `#home` jump without JS), plus "Call +91 98643 71333" as an ink underlined `tel:` link, only rendered when `telHref` exists.

## Files likely to change
- `data/site.ts`: add the `about` block and `AboutHighlight` type; remove `highlights`/`Highlight` and `images.doctor`.
- `components/sections/About.tsx`: **new** server component (layout, data filtering, portrait `existsSync`).
- `components/sections/AboutMotion.tsx`: **new** client file with `PortraitReveal`, `PortraitPills`, `StaggerColumn`, `HighlightsCarousel` (track, arrows, stagger).
- `components/ui/dev-todo.tsx`: **new**, renders only in development.
- `app/page.tsx`: add `<About />` after `<Intro />`.

## Implementation requirements

### Data (`data/site.ts`)
```ts
export type AboutHighlight = { icon: "GraduationCap" | "Briefcase" | "Hospital" | "CalendarDays" | "Languages" | "BadgeCheck"; label: string; value: string };

export const about = {
  eyebrow: "Meet your doctor",
  titleLead: "Meet Your",
  titleAccent: "Doctor",
  name: site.name,
  role: site.title,
  portrait: "/images/doctor/portrait.jpg", // real photo of the doctor, required before launch
  portraitAlt: "Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar",
  qualifications: site.qualifications,
  experienceYears: site.experienceYears,
  registration: site.registrationNo,
  languages: "TODO: confirm — Bengali, English, Hindi?",
  bio: ["TODO: 2–3 short sentences in the doctor's own words about his training, experience and how he treats patients."],
  approach: [ /* the 3 items from your step, verbatim */ ],
  highlights: [
    { icon: "GraduationCap", label: "Qualification", value: site.qualifications },
    { icon: "Briefcase", label: "Experience", value: site.experienceYears },   // rendered as "{n}+ years" when numeric
    { icon: "Hospital", label: "Practices at", value: quickFacts.place },
    { icon: "CalendarDays", label: "Available", value: quickFacts.hours },
    { icon: "Languages", label: "Speaks", value: <languages> },
    { icon: "BadgeCheck", label: "Registration", value: site.registrationNo },
  ] as AboutHighlight[],
};
```
- The icon is mapped to Lucide components in `About.tsx` through a fixed record (no dynamic import).
- `quickFacts` is declared before `about`. I'll reorder `site.ts` if needed.

### Layout (server component, `components/sections/About.tsx`)
- `<section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-lavender pt-24 pb-24 md:pt-36 md:pb-36">`
- Container: `mx-auto max-w-[1200px] px-6 lg:px-16`.

**A. Header row:** `flex items-end justify-between gap-6`
- Eyebrow: `<p>` Inter 12px, uppercase, `tracking-[0.08em]`, `text-ink/80`, reading "MEET YOUR DOCTOR" (uppercased via CSS).
- h2 `#about-title`: `font-heading font-medium text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.03em] text-white`, "Meet Your <span class="text-rust">Doctor</span>". `mt-3`.
- Right: arrows (`hidden md:flex gap-3`), only when the carousel is active (4+ cards). Rendered by `HighlightsCarousel` through a portal-free pattern: the carousel component owns both the arrows and the track and renders the arrows into the header slot. To keep it simple, `HighlightsCarousel` receives `header` (the eyebrow + h2 nodes) and lays out the header row itself. In grid mode it renders the same header row without arrows.

**B. Main block:** `mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center md:gap-6`
- Portrait column `md:col-span-5`, `mx-auto w-full max-w-[320px] md:max-w-[440px]`, `relative`:
  - Rust outline circle: `absolute inset-0 translate-x-4 translate-y-4 rounded-full border-[1.5px] border-rust`, `aria-hidden`.
  - Disc: `relative aspect-square rounded-full overflow-hidden bg-peach`.
    - With photo: `<Image fill sizes="(min-width:768px) 440px, 320px" className="object-cover object-top">` inside a motion wrapper (slide-up reveal).
    - Fallback: centred "BD" in `font-heading font-semibold text-rust text-[clamp(5rem,12vw,9rem)] tracking-[-0.04em]`, `aria-hidden`, plus `role="img" aria-label={portraitAlt}` on the disc; `DevTodo` "Add doctor portrait" pinned at the bottom centre inside the disc.
  - Pills: `absolute bottom-4 right-0 md:-right-6 flex flex-col items-end gap-2`.
    - Experience (only if not TODO): `h-10 px-4 rounded-full bg-lime text-rust text-[13px]` with "**{n}+ years** experience".
    - Name: `h-10 px-4 rounded-full bg-white text-rust text-[13px]` with "**Dr. Biswajyoti Das** · ENT & Allergy". The name comes from `about.name`; "ENT & Allergy" is derived from the role by stripping " Specialist".
  - ✳: `absolute -top-2 right-6 text-[48px] text-lime`, spinning slowly, `aria-hidden`.
- Text column `md:col-span-6 md:col-start-7`:
  - h3: `font-heading font-medium text-[clamp(2rem,4vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-white`.
  - Role line `mt-2 text-[15px] text-ink`: role, plus " · {qualifications}" if confirmed; otherwise `DevTodo` "Add qualifications".
  - Bio (only confirmed paragraphs) `mt-6 space-y-4 max-w-[52ch] text-[15px] leading-[1.7] text-ink`; otherwise `DevTodo` "Add bio".
  - Approach `<ul className="mt-8 divide-y divide-white/30 border-y border-white/30">`. Each `<li className="flex gap-4 py-4">` has a `size-8 shrink-0 rounded-full bg-lime grid place-items-center` holding a Lucide `Check` (rust, 16px, stroke 1.5, `aria-hidden`), then `<h4>` (Bricolage 500, 18px, ink, `tracking-[-0.01em]`) and `<p>` (Inter 14px, `text-ink/80`, leading 1.6).
  - CTA row `mt-12 flex flex-wrap items-center gap-6`: `BookScrollPill` with the Pill `rust` classes, then the `tel:` link `text-[15px] font-medium text-ink underline underline-offset-4 decoration-ink/40 hover:decoration-ink`.

**C. Highlights:** `mt-24`
- `visible = highlights.filter(h => !isTodo(h.value))`; Experience renders as "{n}+ years".
- In development only, a `DevTodo` line lists the hidden ones ("Hidden until filled: Qualification, Experience, Speaks, Registration").
- **≤3 cards:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`, cards `w-full`.
- **4+ cards:** the track is a `<div id="about-highlights-track" role="region" aria-label="Doctor highlights, scroll" tabIndex={0}>` with `flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`. It bleeds to the right edge with `-mr-6 pr-6 lg:mr-[calc((1200px-100vw)/2-4rem)]`-style math. The exact bleed is computed with `mr-[calc(50%-50vw)]` on the track wrapper inside the container; cards stay aligned with the container's left edge.
  - Keyboard: ArrowLeft/ArrowRight on the focused track scroll by one card. Native arrow-key scrolling also works.
  - Focus ring on the track: `focus-visible:outline-2 outline-rust outline-offset-4`.
  - Arrows on desktop sit in the header row; on mobile, under the track, centred (`mt-8 flex justify-center gap-3 md:hidden`).
    - Prev: `size-11 rounded-full border border-rust text-rust disabled:opacity-40`.
    - Next: `size-11 rounded-full bg-lime text-rust hover:bg-lime-dark disabled:opacity-40`.
    - Both use `ArrowLeft`/`ArrowRight` 20px stroke 1.5, `aria-label="Previous"`/`"Next"` and `aria-controls="about-highlights-track"`.
- Wrapper: `<section aria-roledescription="carousel" aria-label="Doctor highlights">` (in grid mode, a plain `<div>` with `aria-label`). Note: this is an inner landmark, so it gets no heading; the `aria-label` names it.
- Card: `role="group" aria-label={label}` with `w-[220px] shrink-0 snap-start rounded-3xl bg-white/15 border border-white/30 p-6`.
  - `size-14 rounded-full bg-lime grid place-items-center` holding the icon (rust, 24px, stroke 1.5, `aria-hidden`).
  - Label `mt-4` Inter 12px uppercase `tracking-[0.08em] text-ink/70`.
  - Value `<p className="mt-2 font-heading font-medium text-xl leading-[1.2] text-ink">`.

### Motion (`AboutMotion.tsx`; `whileInView`, `viewport={{ once: true, amount: 0.2 }}`, easing `ease`)
- Portrait disc: `scale 0.9→1` + `opacity 0→1`, 0.9s. Photo inside: `y 20→0`, 0.9s, delay 0.15s.
- Pills: spring pop (`scale 0.6→1, opacity 0→1`, stiffness 260, damping 18), after the portrait (delay 0.6s), stagger 0.1s.
- Text column: children fade up 24px, stagger 0.1s, duration 0.7s.
- Cards: fade up 24px, stagger 0.08s, duration 0.6s.
- Reduced motion: the app is already wrapped in `MotionConfig reducedMotion="user"`, so transforms are dropped and opacity is kept. The ✳ uses `motion-reduce:animate-none`.

## Accessibility requirements
- One h2 (`#about-title`), an h3 for the name, h4 for approach titles. Highlight values are `<p>`, not headings.
- Portrait `alt` = `about.portraitAlt`; the fallback disc is `role="img"` with the same label. All decorative pieces (outline ring, ✳, monogram letters, icons) are `aria-hidden`.
- The track is focusable, has a visible focus ring, and scrolls with arrow keys. The arrows have labels and `aria-controls`, and are `disabled` at each end.
- Small text on lavender is ink; white only on the h2 (64px) and h3 (40px).
- Tap targets: arrows 44px, CTA pill 44px.

## Acceptance criteria
- [ ] At 1440px: lavender band with eyebrow + "Meet Your Doctor" header, a peach-disc portrait (monogram for now) with a rust offset ring and pills on the left, name / role / approach / CTA on the right, highlight cards below.
- [ ] `npm run build && npm start`: no "TODO" text and no dashed placeholders anywhere in the About section.
- [ ] `npm run dev`: dashed dev placeholders visible for portrait, qualifications, bio and hidden highlights.
- [ ] With 4+ highlights (temporary local data check): the arrows scroll by one card and disable at the ends; touch-swipe and keyboard arrow keys work.
- [ ] At 375px: portrait first (max 320px, centred), then text, then cards; no horizontal page scroll.
- [ ] `site.images.doctor` and the old `highlights` export are gone, and nothing references them.
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
- [ ] *(Deferred to step 3)* The Services curve joins this section seamlessly.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `npm start` (grep the HTML for "TODO" inside `#about`) · `npm run dev` with screenshots at 375 / 768 / 1280 / 1440 / 1536.

## Manual test steps
1. `npm run dev` and open `http://localhost:3000/#about`. Check the layout at 1440 and 375 widths in DevTools.
2. Tab from the navbar: "Book an appointment" pill → "Call …" link. On the pill, press Enter: the page scrolls to the hero and the name field gets focus.
3. In `data/site.ts`, set `experienceYears: "15"` and `qualifications: "MBBS, MS (ENT)"` temporarily. The lime "15+ years experience" pill and 4 highlight cards appear, and the carousel arrows show. Click Next until it disables; Tab to the track and press ← / →; on a touch device emulation, swipe. **Revert the values.**
4. Turn on "Emulate prefers-reduced-motion: reduce" in DevTools Rendering. Reload: only fades, the ✳ is static.
5. `npm run build && npm start`, open the page and confirm no dashed placeholders or "TODO" text appear in the lavender band.
6. Drop any square JPG at `public/images/doctor/portrait.jpg` (later: the real photo) and rebuild. The photo replaces the "BD" monogram.

## Images needed (from you)
- `public/images/doctor/portrait.jpg`: a **real photo of Dr. Biswajyoti Das**, chest-up, plain light background, at least 1200×1200. A background-removed PNG/WebP cut-out looks best on the peach disc. If you send a PNG/WebP, I'll change the path in `about.portrait`.
- Never a stock or AI-generated person.
