# Prompt: Light anatomy hero + booking card (Step 1 v2)

## Goal
Replace the dark photo hero with a **light** hero: a pastel anatomical ear illustration in the background, the headline block on the left (columns 1–7) and a WhatsApp booking form card on the right (columns 8–12). Switch the navbar to rust-on-light.

## Docs read
- `AGENTS.md`, `DESIGN.md`, `project-docs/DOCS.md`, the user's "Step 1 (v2)" prompt
- Next 16 local docs:
  - `01-getting-started/12-images.md`
  - `03-api-reference/02-components/image.md`: `priority` is deprecated, use `preload`; `qualities` is required
  - `13-fonts.md`
  - `01-getting-started/08-caching.md`: `new Date()` under `cacheComponents`
- Base UI shadcn sources in `components/ui/` (button, sheet)

## Existing code inspected
- `app/layout.tsx`: still the create-next-app default (Geist + Inter, placeholder metadata)
- `app/page.tsx`: still the create-next-app default
- `app/globals.css`: palette tokens already in `@theme`. It is **missing `--color-lime-dark` and `--color-sky`** from DESIGN.md.
- `data/site.ts`, `lib/site-helpers.ts`, `next.config.ts` (Unsplash `remotePatterns`, `qualities: [75, 80]`): done; keep them.
- `components/site/*`: written before DESIGN.md and AGENTS.md. Navbar, hero, intro, services, primitives, motion and carousel-arrows.
- Source image `C:\Users\Hbib\Downloads\ear_anatomy_hero_illustration.webp`:
  - **1672×941**, not the 2400×1350 the prompt states
  - the ear sits center-left, and the cochlea and nerve "waves" run to the right
  - the background is already cream and peach

## Decisions and assumptions (please check the ⚠️ ones)
1. ⚠️ **Sections A (setup) and D (Button) of the earlier Step-1 prompt were never given to me.** I'll do only the minimal setup this hero needs:
   - fonts in `layout.tsx`
   - the missing tokens
   - `MotionConfig`
   - moving `Pill` and `RotatingBadge` into `components/ui/`
   - a page that renders Navbar + Hero only

   I won't invent the rest of "A" and "D". If you have them, paste them and I'll fold them in.
2. ⚠️ **Image resolution.** At 1672px wide it will look a little soft on 1920+ screens. I'll copy it as-is to `public/images/hero-ear.webp`. Please replace it with a 2400×1350 export when you have one; no code change is needed.
3. **`priority` → `preload`.** `priority` is deprecated in the installed Next 16; `preload` does the same thing. I'll also set `fetchPriority="high"`.
4. ⚠️ **Same-day rule.** "Today allowed only before 9:00 AM" is implemented exactly as written (Asia/Kolkata time). The chamber opens at 2:30 PM, so a noon cutoff might be what you mean. Tell me if you want a different cutoff.
5. **Input font size.** The prompt says inputs are 15px but also requires "≥16px so iOS doesn't zoom". I'll use **16px** on all inputs, select and textarea.
6. **WhatsApp number format.** `site.whatsapp` will hold the **10-digit** number; the URL prepends `91`. I'll update the comment in `site.ts`, and `lib/site-helpers.ts` `bookingHref` will use the same rule.
7. **While `site.whatsapp` is TODO:**
   - The submit button is disabled.
   - A `title="WhatsApp number not set"` tooltip goes on a wrapping `<span>`, because disabled buttons don't fire hover.
   - A visible `todo` note appears under the button.
   - `console.warn` runs once on mount.
8. **While `site.phone` is TODO,** "Prefer to call?" shows the visible TODO placeholder, not a broken `tel:` link (AGENTS.md §4).
9. **Dates under `cacheComponents`.** `BookingCard` is a client component, but it still prerenders on the server. "Today" and `min` are computed in `useEffect` after mount, and the validation reads `new Date()` only at submit time. That way nothing time-dependent is rendered during prerender.
10. **Hero h1.** It keeps DOCS.md's words but drops the per-word lime color. Lime is not allowed on a light background, so only "Throat." gets the lime highlighter bar behind rust text.
11. **Gradients.**
    - DESIGN.md allows a gradient only as the hero overlay; the cream left→right fade is that overlay.
    - The grain is an SVG noise data-URI at 4% opacity.
    - The fallback when the image is missing is a solid cream band plus a peach `radial-gradient` blob. That breaks the letter of the "no gradients" rule, but you explicitly asked for it.
12. **DESIGN.md update.** Hero row → "illustration + cream overlay | rust heading | ink/80 body | lime highlighter + badge". The navbar spec changes to rust text, cream/85 when scrolled, and a rust hamburger. I'll edit DESIGN.md §2 and §6 to match, so the docs don't contradict the code.
13. **Folders.** Files move to the AGENTS.md / DESIGN.md structure (below). `components/site/` gets deleted once its pieces have moved. Intro and Services stay out of the page until their own prompts are approved; I'll keep their code in `components/sections/` but not render it.

## Files likely to change
- `public/images/hero-ear.webp` (new, copied from Downloads)
- `app/layout.tsx`:
  - Bricolage Grotesque, Inter and Instrument Serif via `next/font` → `--font-bricolage` / `--font-inter` / `--font-instrument`
  - basic metadata (full SEO comes in a later prompt)
  - `MotionProvider`
- `app/page.tsx`: Navbar + Hero
- `app/globals.css`:
  - add `--color-lime-dark: #CDD43C` and `--color-sky: #C9D6FF`
  - add a `grain` utility
  - change reduced motion to opacity only (no global animation kill, just stop the badge spin)
- `lib/motion.ts`: `ease`, `fadeUp`, `stagger`, `wordReveal` variants
- `components/ui/pill.tsx`, `components/ui/rotating-badge.tsx` (moved from `components/site/primitives.tsx`)
- `components/sections/Navbar.tsx`: rust-on-light, plus a full-screen rust overlay menu with staggered links
- `components/sections/Hero.tsx`: server component that does the layout
- `components/sections/HeroMotion.tsx`: client; image fade/scale, staggered words, highlighter sweep, fact pills, badge entrance
- `components/sections/BookingCard.tsx`: client form
- `lib/booking.ts`: pure helpers (validation, slot list, date formatting, WhatsApp message builder), kept separate so the UI stays thin
- `data/site.ts`: `whatsapp` comment, `timeSlots`, `problems`, booking copy
- `DESIGN.md`: hero and navbar rows
- delete `components/site/`

## Implementation requirements

### Hero section
- `<section id="home" class="relative isolate min-h-[100svh] overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24 bg-cream">`
- Layer order:
  1. fallback: cream + peach radial blob
  2. the `next/image` (`fill`, `preload`, `fetchPriority="high"`, `sizes="100vw"`, `object-cover`, `object-[55%_50%]`)
  3. overlay: `bg-cream/85` on mobile, `lg:bg-gradient-to-r lg:from-cream lg:via-cream/80 lg:to-cream/10`
  4. grain at 4%
  5. content
- Container: `max-w-[1200px] mx-auto px-6 lg:px-16`, `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center`. Left block `lg:col-span-7`, card `lg:col-span-5 lg:justify-self-end`.

### Left block
- **Eyebrow:** a 24×1px rust line + "ENT & Allergy Specialist · Silchar". Inter 12px, uppercase, tracking 0.08em, `text-rust`.
- **h1** (the only h1 on the page), three block lines:
  - Bricolage 500, `clamp(2.75rem,6.5vw,5.5rem)`, leading 0.95, tracking -0.04em, `text-rust`
  - "Throat." is wrapped in a `relative z-0` span. The lime bar is a Motion `span` placed `absolute inset-x-[-0.05em] bottom-[0.06em] h-[40%] -z-10 -skew-x-[2deg]` (skewed −2°), and its `scaleX` animates 0→1 from the left after the last word lands.
  - A real element is used instead of `::after` so Motion can animate it.
- **Sub text:** `mt-6 max-w-[40ch]`, Inter 16px, `text-ink/80`.
- **Fact pills:** `mt-8 flex flex-wrap gap-2`. Each pill is `h-9 px-4 rounded-full bg-white/70 backdrop-blur border border-rust/15 text-[13px] text-rust` with a 16px Lucide icon (stroke 1.5): `MapPin` "Nightingale Hospital, Meherpur", `Clock` "Mon–Sat · 2:30–9:00 PM", `IndianRupee` "Fee ₹500". The text comes from `site.ts`.
- **Badge:** `RotatingBadge`, 112px, desktop only (`hidden lg:grid`). It is placed absolutely on the card wrapper at `-left-10 -bottom-10` so it overlaps the card's bottom-left edge.

### Booking card (client)
- Card: `bg-white rounded-[28px] p-6 md:p-8 border border-rust/10 w-full max-w-[440px]`. No shadow.
- Header:
  - lime pill tag "Book Appointment" (rust text on lime: passes)
  - h2 "Get an appointment" (Bricolage 500, 28px, rust)
  - sub, Inter 13px, `text-ink/70`
- Fields:
  - Label: Inter 12px/500, rust, with `htmlFor`.
  - Input: `h-12 w-full rounded-2xl bg-cream border border-rust/15 px-4 text-base text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:border-rust focus-visible:ring-2 focus-visible:ring-lime`
  1. **Full name:** `autocomplete="name"`, required, trimmed, at least 2 characters.
  2. **Phone:**
     - a non-editable `+91` prefix inside the field (absolutely positioned span, input padded left)
     - `type="tel" inputMode="numeric" autocomplete="tel-national" maxLength=10`
     - strips non-digits as you type
     - must match `^[6-9]\d{9}$`
  3. **Problem chips:**
     - `role="radiogroup"` with `aria-labelledby`; each chip is a `button role="radio" aria-checked`
     - roving `tabIndex`: Left/Up and Right/Down move and select, Home/End jump to the ends
     - each chip is `h-11` (44px tap target)
     - selected: `bg-rust text-white`; unselected: `bg-cream text-rust border border-rust/20`
     - options: Ear · Nose · Throat · Allergy · Other; required
  4. **Preferred date:**
     - native `type="date"` with `min` = today (Asia/Kolkata), set after mount
     - errors: "Please pick a date", "Date can't be in the past", "Chamber is closed on Sundays", "Same-day booking closes at 9 AM, please pick tomorrow or later"
     - checked on change and on submit
  5. **Preferred time:** native `<select>` styled like the inputs, with a custom chevron. Placeholder "Select a time slot", then the four slots. Required.
  6. **Note:** optional textarea, `rows=2`, `maxLength=200`, with a live `n/200` counter and `rounded-2xl py-3`.
- Errors:
  - Shown under each field: `<p id="<field>-error" class="mt-1.5 text-xs text-rust" aria-live="polite">`.
  - The field gets `aria-invalid` and `aria-describedby`.
  - Errors appear after a blur or after the first submit attempt.
  - On a failed submit, focus moves to the first invalid field.
- Submit:
  - `type="submit"`, full width, `h-12 rounded-full bg-rust text-white hover:bg-rust-dark hover:-translate-y-px transition`
  - `MessageCircle` icon + "Book on WhatsApp"
  - Enter submits (it's a native `<form noValidate>`)
- On a valid submit:
  - Build the exact message from the prompt. Date format: `DD MMM YYYY, ddd`, e.g. "18 Nov 2026, Wed", in `en-IN`. Note: the text or "-".
  - `window.open("https://wa.me/91<number>?text=<encoded>", "_blank", "noopener")`
  - Switch the card to a success state:
    - a check icon in a lime circle
    - "Almost done! Send the message on WhatsApp to confirm."
    - a "Book another" text button that resets state and focuses the name field
    - focus moves to the success heading (`tabIndex=-1`) so screen readers hear it
- Footer line (Inter 12px, `text-ink/60`, centered): "Prefer to call? **{phone}**" (`tel:`, or the visible TODO placeholder) · "or book online" (`site.onlineBooking`, `target="_blank" rel="noopener noreferrer"`).
- Plain `useState`; no form library.

### Navbar
- Height 80px, shrinking to 64px after 80px of scroll. A `scrolled` state is set from a passive scroll listener.
- Transparent over the hero; scrolled: `bg-cream/85 backdrop-blur-md border-b border-rust/10`.
- Wordmark: Bricolage 600, rust.
- Links: Inter 11px/500, uppercase, tracking 0.08em, rust. Hover: `text-rust-dark` + a 2px lime underline (`decoration-lime underline-offset-8`).
- The Reviews link is hidden while `reviews` is empty.
- The CTA pill on desktop is not in this prompt's spec, so I'm leaving it out.
- Mobile:
  - The 44px hamburger button uses a rust icon.
  - The full-screen rust overlay is the Base UI Dialog via the shadcn `Sheet`, at `side="top"` with full height.
  - Links are white, Bricolage 40px, staggered in with Motion (0.06s each).
  - Closing: link click, Esc, or the close button.
  - Focus is trapped inside the menu (Base UI handles this).

### Motion (`lib/motion.ts` + `HeroMotion.tsx`)
All animations use ease `[0.22, 1, 0.36, 1]`, in this order:

| Step | Element | Animation | Timing |
|---|---|---|---|
| 1 | Background image | opacity 0→1, scale 1.06→1 | 1.6s |
| 2 | Eyebrow | fade up | — |
| 3 | h1 words | y 100%→0 + fade | 0.8s each, 0.08s stagger, start 0.2s |
| 4 | Highlighter | scaleX 0→1 | 0.5s, after the last word (~1.0s) |
| 5 | Sub text | fade up | 1.1s |
| 6 | Fact pills | fade up | 0.08s stagger from 1.2s |
| 7 | Booking card | fade up 32px | 0.8s, delay 0.5s |
| 8 | Badge | scale 0.6→1 + fade, then the CSS 20s spin | at 1s |

- Reduced motion: `MotionConfig reducedMotion="user"` drops transforms and keeps opacity. The CSS badge spin goes to `motion-reduce:animate-none`, and the highlighter shows fully drawn (opacity fade only).

## Accessibility requirements
- One `h1`. The card title is an `h2`.
- Every input has a `<label htmlFor>`. Chips form a radiogroup with arrow-key support. Errors are linked through `aria-describedby` and announced with `aria-live="polite"`.
- Visible focus rings on everything:
  - focus-visible rust ring on the light background
  - lime ring inside the rust overlay menu
- Tap targets are at least 44px.
- Contrast:
  - no lime text anywhere in the hero
  - rust on cream and white passes
  - `ink/60` on white is about 4.6:1, which just passes AA, so I'll use `ink/70` (about 6:1) for the 12px footer line to give it a safer margin
  - `ink/70` on white passes
- The decorative image has `alt=""`, because the illustration is purely decorative and the h1 carries the meaning.

## Acceptance criteria
- [ ] At 1440px:
  - headline on the left, card on the right
  - the ear is visible on the right side and in the gutter between them
  - the headline is fully readable
  - the badge overlaps the card's bottom-left corner
- [ ] At 375px:
  - headline first, then a full-width card
  - no horizontal scroll
  - all inputs ≥16px
  - the badge is hidden
- [ ] Validation covers:
  - empty fields
  - a bad phone number (e.g. `12345`, `5123456789`)
  - a past date
  - a Sunday
  - today after 9 AM
- [ ] With a test number in `site.whatsapp`, WhatsApp opens with the exact message format.
- [ ] With `whatsapp: "TODO"`, the button is disabled, the tooltip and TODO note show, and `console.warn` fires.
- [ ] Keyboard only: Tab through every field, change chips with the arrow keys, submit with Enter.
- [ ] No lime text in the hero, and AA contrast everywhere.
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · `npm run dev`, then screenshots at 1440 and 375 (headless Chrome via Playwright, run with `npx` from the scratchpad, not added to the project), checked against DESIGN.md. Fix any issues, then stop.

## Manual test steps (after implementation)
1. Run `npm run dev` and open http://localhost:3000.
2. Desktop:
   1. Watch the load sequence.
   2. Scroll past 80px: the navbar turns cream/blurred and shrinks.
3. Click **Book on WhatsApp** with the form empty: an error appears under every required field, and focus jumps to Full name.
4. Phone checks:
   1. Type `51234 56789`: you get "Enter a valid 10-digit mobile number".
   2. Type `9876543210`: the error clears.
5. Date checks:
   1. Pick the next Sunday: "Chamber is closed on Sundays".
   2. Pick today (after 9 AM): you see the same-day error.
6. Temporarily set `whatsapp: "9876543210"` in `data/site.ts`, fill everything in and submit. WhatsApp Web opens with the prefilled message, and the card shows the success state. Then click **Book another**.
7. With `whatsapp: "TODO"`, the button is disabled and shows a tooltip.
8. Keyboard: Tab from the top through the navbar → form, use ←/→ on the problem chips, and press Enter to submit.
9. In DevTools at 375px: the stacked layout has no horizontal scrollbar, and tapping an input doesn't zoom on iOS.
10. Turn on "Emulate prefers-reduced-motion: reduce": only fades remain and the badge doesn't spin.
