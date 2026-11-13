# Prompt: Intro statement section (rust band) — Step 2

## Goal
Build the rust intro band that sits directly under the Hero: a big staggered statement (with a lime ✳ and a lime "allergy" + image pill), a paragraph + "Book Appointment" phone/WhatsApp CTA pushed right, and a stats row that stays hidden until real numbers exist. Render it in `app/page.tsx` right after `<Hero />`. Nothing else (no Services).

## Docs read
- `AGENTS.md`, `DESIGN.md` (§2 colors/contrast, §3 type, §4 spacing, §6 buttons + rotating badge, §9 motion), `project-docs/DOCS.md` §3 (Intro statement)
- The user's "Step 2: Intro statement section" prompt
- `prompts/hero-booking.md` (Next 16 image/caching notes already verified there: `preload` not `priority`, `qualities: [75, 80]`, no `new Date()` in server components)

## Existing code inspected
- `components/sections/Intro.tsx` — an older draft (single-line h2, different copy, phone at 48px right-aligned, no stats). Not rendered. **Will be rewritten.**
- `app/page.tsx` — renders Navbar + Hero only.
- `data/site.ts` — `phone` and `whatsapp` are set (real values); `experienceYears` is `TODO`; no `intro` block yet.
- `lib/site-helpers.ts` — `telHref`, `whatsappUrl`, `isTodo`.
- `lib/motion.ts` — `ease`, `fadeUp`, `stagger`.
- `components/ui/rotating-badge.tsx` — lime-filled only, no outline variant.
- `components/ui/pill.tsx` — has the `lime` variant (h-11, rounded-full). `components/ui/button.tsx` (shadcn) has **no** `lime` variant.
- `components/ui/text-bits.tsx` — `Asterisk`, `Field`.
- `components/sections/Navbar.tsx` — contains `bookNow()` (scroll to `#home`, focus `#bk-name`).
- `app/globals.css` — tokens; `--animate-spin-slow` (20s).

## How I read the reference
⚠️ **`/reference/design.png` is not in the repo** (no `reference/` folder exists). I'm working from your written description of the band ("Transform Your Smile ✳ with State-of-the art Dental Care" + paragraph + "Book Appointment" + phone). Please add the file if you want a visual comparison at the end; otherwise I'll compare against your spec only.

## Decisions and assumptions (please check the ⚠️ ones)
1. **Motion library.** Your prompt says "Framer Motion"; AGENTS.md forbids `framer-motion`. I'll use `motion/react` (same API).
2. ⚠️ **H2 size — DESIGN.md wins.** Spec: `clamp(2.25rem, 5.2vw, 4.25rem)` (68px max). DESIGN.md H2 = 64px desktop / 36px mobile → I'll use `clamp(2.25rem, 5.2vw, 4rem)`.
3. ⚠️ **Paragraph width — DESIGN.md wins.** Spec 38ch; DESIGN.md §3 says intro paragraphs are `34ch`. I'll use 34ch.
4. ⚠️ **Off-scale spacing snapped to the scale:** stats `mt-20` (80px) → `mt-24` (96px); `pt-10` (40px) → `pt-12` (48px). Line-2 indent `pl-[12%]` is a percentage, not a spacing token — kept as you specified (it's a layout offset, not spacing); I'll flag it here rather than change it.
5. ⚠️ **Image pill source.** `/public/images/intro-pill.jpg` doesn't exist. The server component will check at build time (`fs.existsSync` under `public/`) and render the **fallback** (peach pill with the ear icon) until you drop the file in. No code change needed when the photo arrives — just add the file and rebuild. I won't pick a random Unsplash photo for it.
6. **"Book on WhatsApp" button.** `Button` has no `lime` variant, so I'll reuse the existing `Pill` `lime` variant (`<a href="#home">` + click handler). Without JS it still jumps to the hero; with JS it smooth-scrolls and focuses the name field. I'll move `bookNow()` from `Navbar.tsx` into a new tiny `lib/scroll-to-booking.ts` (kept out of `site-helpers.ts`, which imports all of `data/site`) and have both Navbar and Intro import it.
   - Size: you asked for `sm`; I'll keep `h-11` (44px) because DESIGN.md §11 requires 44×44 tap targets.
   - Label: "Book on WhatsApp" while `site.whatsapp` is set, "Book Online" otherwise (AGENTS.md §8). When WhatsApp is TODO the button links to Quickobook instead of scrolling.
7. **Phone link.** Rendered only when `telHref` exists. Phone is currently set (`+91 98643 71333`) so both phone and button show.
8. **Stats.**
   - "Years of experience" reads `site.experienceYears` (single source, currently TODO) instead of a duplicate TODO. "Patients treated" stays `"TODO"` in `intro.stats`. I won't invent either.
   - Rule: render only non-TODO stats; if the only confirmed stat is "6 days", hide the whole row. **Today that means the stats row is hidden.** The code (count-up etc.) is still built and type-checked so it works once numbers arrive.
   - Count-up only for values whose leading part is numeric (e.g. "15+", "10,000+": the number animates, the suffix stays). "6 days" just fades in.
9. **Statement as one sentence.** One `h2` containing four `display:block` spans; each span ends with a real space so screen readers read "Expert care for your ear, nose & throat and every allergy". ✳ is `aria-hidden`, pill image `alt=""` (fallback ear icon `aria-hidden`).
10. **Section id** `about-intro` (not in the nav). No rounded corners, no top border — sits flush on the hero.
11. **Decorative badge.** Add an `outline` variant to `RotatingBadge` (no fill, text in `fill-white/10`, no centre icon). 220px, positioned `right-0 translate-x-1/2`, vertically centred, `hidden lg:block`, `aria-hidden`; the section gets `overflow-hidden`.

## Files likely to change
- `data/site.ts` — add `intro` block (statement lines, paragraph, ctaLabel, stats). Types exported.
- `components/sections/Intro.tsx` — rewrite as a server component (layout, data, fs check).
- `components/sections/IntroMotion.tsx` — new client file: `StatementLines`, `FadeUpBlock`, `StatsRow` (count-up), `BookingScrollPill`.
- `components/ui/rotating-badge.tsx` — `variant?: "filled" | "outline"`.
- `lib/scroll-to-booking.ts` — new; `bookNow()` moved from Navbar.
- `components/sections/Navbar.tsx` — import `bookNow` from the new file (no behaviour change).
- `app/page.tsx` — add `<Intro />` after `<Hero />`.
- `app/globals.css` — `--animate-spin-12: spin 12s linear infinite` for the ✳.

## Implementation requirements

### Data (`data/site.ts`)
```ts
export const intro = {
  statementLines: [
    { text: "Expert care for your", indent: 0 },
    { text: "ear, nose & throat", indent: 1, asterisk: true },
    { text: "and every", indent: 0 },
    { text: "allergy", indent: 0, accent: true, pill: "/images/intro-pill.jpg" },
  ],
  paragraph: "From blocked ears and sinus trouble to throat infections and allergies, Dr. Biswajyoti Das listens carefully, explains clearly and treats gently — for children, adults and seniors.",
  ctaLabel: "Book Appointment",
  stats: [
    { value: site.experienceYears, label: "Years of experience" },
    { value: "TODO", label: "Patients treated" },
    { value: "6 days", label: "Open every week" },
  ],
};
```

### Layout
- `<section id="about-intro" aria-labelledby="intro-title" class="relative overflow-hidden bg-rust py-24 md:py-36 text-white">`
- Container: `mx-auto max-w-[1200px] px-6 lg:px-16`; inner `mx-auto max-w-[900px]`.

### A. Statement (`h2#intro-title`)
| Property | Value |
|---|---|
| Font | Bricolage Grotesque (`font-heading`) 500 |
| Size | `clamp(2.25rem, 5.2vw, 4rem)` |
| Line-height / tracking | 1.05 / -0.03em |
| Colour | white; "allergy" lime |

- Line 2: `md:pl-[12%]`, leading ✳ lime, `mr-3`, `animate-[spin_12s_linear_infinite] motion-reduce:animate-none`, `inline-block` so it rotates on its own centre.
- Line 4: "allergy" + pill `ml-3 inline-block h-[0.8em] w-[1.6em] rounded-full ring-2 ring-lime overflow-hidden align-middle`.
  - Photo: `next/image` `fill`, `sizes="120px"`, `object-cover`, `alt=""`.
  - Fallback: `bg-peach` + Lucide `Ear` (rust, stroke 1.5, `size-[0.5em]`) centred.
  - `whitespace-nowrap` on "allergy + pill" so the pill never wraps away from the word at 375px.
- Mobile: no indent; lines wrap naturally.

### B. Paragraph + CTA (`mt-12 md:mt-16`)
- `md:grid md:grid-cols-12 md:gap-6`; content `md:col-start-6 md:col-span-6` (cols 6–11).
- Paragraph: Inter 15px (`text-[15px]`), `leading-[1.65]`, `text-white/80`, `max-w-[34ch]`.
- CTA block `mt-8`:
  - Row: `<span class="h-px w-16 bg-white/40" aria-hidden>` + label "Book Appointment" Inter 12px uppercase tracking-[0.08em] `text-white/70`, `gap-3`.
  - Below (`mt-3`), `flex flex-col gap-4 md:flex-row md:items-center md:gap-6`:
    - Phone `<a href={telHref} aria-label="Call Dr. Biswajyoti Das">` Bricolage 500, 22px, lime, `underline underline-offset-4 decoration-lime/60 hover:decoration-lime`, focus ring lime.
    - `Pill variant="lime"` "Book on WhatsApp" → `bookNow()`.
  - If phone is TODO: only the pill.

### C. Stats row (only when ≥1 confirmed stat other than "6 days")
- `mt-24 border-t border-white/15 pt-12`, `grid md:grid-cols-3`, mobile 1 column with `divide-y divide-white/15` (each item `py-6 md:py-0`).
- Value: Bricolage 500, 56px (`text-[clamp(2.5rem,5vw,3.5rem)]`), lime, tracking -0.03em. Label: Inter 13px, `text-white/70`.
- `<dl>` semantics: `dt` = label, `dd` = value (visual order: value on top via `flex-col-reverse`).

### D. Decorative badge
- `<RotatingBadge variant="outline" id="intro" className="size-[220px] md:size-[220px]" />` inside `absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block`, `aria-hidden`.

## Motion (`motion/react`, `whileInView`, `once: true`, `amount: 0.3`, ease `[0.22, 1, 0.36, 1]`)
- Lines: `y: 40 → 0`, opacity 0 → 1, 0.8s, stagger 0.12s.
- Pill: `scale 0 → 1`, spring (stiffness 260, damping 18), delayed until after the last line (~0.36 + 0.8s).
- "allergy": colour white → lime, 0.4s, after its line lands (delay ≈ 0.36 + 0.8s).
- Paragraph + CTA: `y: 24 → 0` + fade, delay 0.4s.
- Stats: stagger 0.1s; count-up over 1.6s with `animate()` from motion, starting on `useInView`.
- Reduced motion (`useReducedMotion`): opacity fades only — no y, no scale (pill shows at full size), no colour tween (lime immediately), count-up skipped (final value), ✳ and badge rotation stop (`motion-reduce:animate-none`). The `MotionConfig reducedMotion="user"` already drops transforms; I'll also branch explicitly for the count-up and colour tween.

## Accessibility requirements
- One `h2` for the statement; reads as one sentence; decorative parts `aria-hidden` / `alt=""`.
- Lime only on rust: phone (22px), ✳, "allergy", stat values. Paragraph stays white/80 (≈ 6:1 on rust); label white/70 at 12px ≈ 4.6:1 (AA).
- Phone link `aria-label="Call Dr. Biswajyoti Das"`; visible lime focus ring on phone and pill.
- Pill tap target ≥ 44px.
- Count-up: the `dd` carries the final value in an `aria-label`-free way — the animated number is in an `aria-hidden` span with an `sr-only` sibling holding the final value, so SR users don't hear intermediate numbers.

## Behaviour at breakpoints
- **375:** single column, statement ~36px, lines wrap, no indent, pill inline after "allergy", paragraph full width, phone and pill stacked, no badge, no horizontal scroll.
- **768:** grid kicks in (cols 6–11), phone + pill side by side, line-2 indent on.
- **1280:** statement ~64px, inner 900px wrapper, badge half off the right edge.
- **1536:** same as 1280 (container capped at 1200 / 900).

## Acceptance criteria
- [ ] Rust band flush under the hero: no gap, no line, no rounded corners.
- [ ] Staggered four-line statement; lime ✳ rotating on line 2; lime "allergy" + pill (fallback ear pill while the photo is missing).
- [ ] Paragraph + CTA in columns 6–11 on md+; stacked on mobile.
- [ ] Phone `tel:` link in lime, underlined; "Book on WhatsApp" scrolls to the hero form and focuses the name field.
- [ ] Stats row hidden (current data has only "6 days" confirmed).
- [ ] No horizontal scroll at 375px; reduced motion respected.
- [ ] All copy comes from `data/site.ts`.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` pass.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run dev` + screenshots at 375 and 1440 (headless browser if available).

## Manual test steps
1. `npm run dev`, open http://localhost:3000, scroll past the hero: rust band starts exactly where the hero ends.
2. Watch the statement lines rise one by one; "allergy" turns lime, then the pill pops in.
3. Tap the phone number on a phone → dialer opens with +91 98643 71333.
4. Click "Book on WhatsApp" → page scrolls to the hero and the cursor is in "Full name".
5. DevTools → 375px: no horizontal scrollbar, pill stays on the same line as "allergy".
6. DevTools → Rendering → `prefers-reduced-motion: reduce`, reload: content fades only; ✳ and badge don't spin.
7. Tab through: phone link → Book on WhatsApp, both with a visible lime ring.
8. Temporarily set `site.experienceYears = "15+"` → stats row appears with "15+" counting up and "6 days" fading in; revert.
9. Drop any JPG at `public/images/intro-pill.jpg`, rebuild → the photo replaces the ear fallback.
