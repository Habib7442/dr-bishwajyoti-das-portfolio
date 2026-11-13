# Prompt: Chamber, Timings & Location (rust band) — Step 5

## Goal
Build `#contact`, the rust "Visit the Chamber" band, directly after About. On the left: eyebrow, two-line title ("Visit the" white / "Chamber" lime), intro, a live open/closed status in India time, the weekly schedule with today highlighted, fee + what to bring, and CTAs. On the right: a lazily loaded Google Maps card with an address row + directions button **below** it. Nothing on top of the map, no circles or frames. Also update the JSON-LD to use the new schedule. Build only this section.

## Docs read
- `AGENTS.md` (§6 booking links / no Maps JS API, §8 decisions, §10 SEO), `DESIGN.md` (§2 contrast, §3 type, §4 spacing, §6 buttons, §9 motion)
- `project-docs/DOCS.md` §6, your "Step 5" spec
- `prompts/animation-safety-mobile.md` (reveal hook + 2.5s fallback)

## Existing code inspected
- `data/site.ts`:
  - `site.address` (`postalCode: "788015"`, commented "verify Meherpur PIN")
  - `site.openingHours` (Mon–Sat 14:30–21:00), `site.fee`, `site.phone`, `site.onlineBooking`
  - `site.mapEmbed: "TODO"`, `site.mapLink`
  - `faqs` already says the fee is paid at the chamber and lists what to bring (consistent with the new `bringList`)
- `lib/seo.ts`: `buildJsonLd()` already emits `Physician` + `MedicalClinic` with address, `openingHoursSpecification` (from `site.openingHours`), `priceRange: site.fee`, and `telephone`.
- `lib/site-helpers.ts`: `whatsappUrl(message)`, `telHref`, `isTodo`. `lib/booking.ts`: `nowInChamberTz()` (Asia/Kolkata via `Intl`).
- `lib/use-reveal.ts` + `lib/motion.ts` (`VIEWPORT`, 2.5s fallback). `components/ui/pill.tsx` (`lime`, `outline-light`).
- `app/page.tsx`: Navbar, Hero, Intro, About. `About` ends with `pb-12` under the marquee (kept: your spec says no overlap tricks).
- `components/sections/FloatingWhatsApp.tsx`: unaffected.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **No arch photo or rotating badge.** AGENTS.md §8 and DOCS.md §6 say the chamber band has an arch photo with the rotating badge on its corner. Your client style rules ("no badges on images, no frames, no circles") and this spec replace that with the map card. I'll follow the spec and update the AGENTS.md §8 badge line ("…in the hero only"), so the two stop conflicting. Say if you'd rather I leave AGENTS.md alone.

2. ⚠️ **Intro copy accuracy.** "Consultations are held every **evening** except Sunday…", but hours start at 2:30 PM, which is afternoon. I'll use: "Consultations run every afternoon and evening except Sunday at Nightingale Hospital, Meherpur." Say if you want your exact wording.

3. **One source for hours.** `chamber.schedule` (your shape) replaces `site.openingHours`.
   - JSON-LD `openingHoursSpecification` is generated from the schedule by grouping days with the same open/close (giving one spec, Mon–Sat 14:30–21:00) and skipping closed days.
   - `site.days` / `site.hours` (used by the FAQ and hero quick facts) stay as display strings.
   - **Address:** I'll keep `site.address` for JSON-LD (it has the structured fields). `chamber.address` is the display line. Both keep the TODO comment about the full street address and PIN. No TODO strings go into the page or the JSON-LD.

4. **Map source** (AGENTS.md §6: plain iframe embed from `site.mapEmbed`): if `site.mapEmbed` is filled in, use it. While it's `TODO`, use your `https://www.google.com/maps?q=…&output=embed` query URL. No Maps JS API, no key.

5. **Map loading:**
   - Desktop (`lg`+, fine pointer): IntersectionObserver with `rootMargin: 300px` swaps the placeholder for the iframe.
   - Below `lg`: the placeholder stays until the "Tap to load map" button is pressed.
   - Placeholder: a cream block, rust `MapPin` (40px), the hospital name and a rust pill button "Load map" ("Tap to load map" on mobile). No image.
   - Map filter `saturate(0.85) sepia(0.12)` on the iframe only, as specified.

6. **Live status** (`components/sections/ChamberStatus.tsx`, client):
   - Pure logic in `lib/chamber-hours.ts`: `getChamberStatus(schedule, now)` reads the weekday + minutes in `Asia/Kolkata` via `Intl.DateTimeFormat` and returns `{ kind: "open", closes } | { kind: "later", opens } | { kind: "closed", nextDay, opens }`.
   - Times are formatted "9:00 PM" / "2:30 PM".
   - The server renders a neutral placeholder: `bg-white/10`, "Checking today's hours…" with the same height, so nothing jumps. The client fills it on mount and refreshes every 60s.
   - Today's row highlight uses the same India-time weekday, computed client-side (the server renders no highlight).
   - Testing: I'll run `getChamberStatus` in Node for Tue 15:00, Tue 22:00, Sun 11:00 IST (plus Sat 22:00 → next day Monday, and Tue 13:00 → "opens today"), and show you the output.

7. **WhatsApp CTA:** `whatsappUrl("Hello Doctor, I'd like to book an appointment at Nightingale Hospital, Meherpur.")`. The message lives in `chamber.whatsappMessage`. Label "Book on WhatsApp". If the number were TODO, it would fall back to Quickobook with the label "Book Online" (AGENTS.md §8). The "Call" pill only renders if `telHref` exists.

8. **"Chamber" white → lime:** same CSS class-toggle approach as the Intro accent word (motion colour tweens leave inline styles behind). It's driven by `useReveal`, so the 2.5s fallback and the instant-snap flag cover it.

9. ⚠️ **Spacing snapped to the DESIGN.md scale:**

   | Spec | Snapped to |
   |---|---|
   | `md:py-32` | `md:py-36` |
   | `mt-5` | `mt-4` |
   | `mt-10` | `mt-12` |

   All other values (`mt-4`, `mt-6`, `mt-8`, `gap-12`, `lg:gap-16`, `py-3`, `gap-3`) are already on the scale.

10. **Map card height:** desktop `lg:aspect-auto lg:h-full lg:min-h-[620px]` in a `lg:items-stretch` cell, so it matches the info column's height (the grid itself stays `items-start` for the text). Mobile `aspect-[4/3]`. Card radius 32px, `bg-cream`, `overflow-hidden`.

## Files likely to change
- `data/site.ts`: add the `chamber` block (spec + `whatsappMessage`); remove `site.openingHours`.
- `lib/chamber-hours.ts`: new, pure; schedule → status, today, JSON-LD spec, time formatting.
- `lib/seo.ts`: `openingHoursSpecification` from `chamber.schedule`.
- `components/sections/Chamber.tsx`: new, server (layout, data).
- `components/sections/ChamberMotion.tsx`: new, client (`TitleReveal`, `ScheduleList` with today highlight, `MapCard`, `FadeRise`).
- `components/sections/ChamberStatus.tsx`: new, client.
- `app/page.tsx`: add `<Chamber />` after `<About />`.
- `app/globals.css`: `@keyframes pulse-dot` (or Tailwind `animate-ping` on the dot, with `motion-reduce:animate-none`).
- `AGENTS.md` §8: badge line (only if you agree with ⚠️1).

## Implementation requirements

**Section:** `<section id="contact" aria-labelledby="chamber-title" className="relative overflow-hidden bg-rust py-24 text-white md:py-36">`; container `mx-auto max-w-[1200px] px-6 lg:px-16`; `grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16`.

**Left (`lg:col-span-6`):**
1. Eyebrow: `flex items-center gap-3 text-xs font-medium tracking-[0.08em] uppercase text-white/70` with an `h-px w-6 bg-white/40` line.
2. h2 `#chamber-title` `mt-4 font-heading font-medium text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]`: two `block` lines in `overflow-hidden` wrappers, each sliding up (stagger 0.1s). Line 2 toggles `text-white` → `text-lime` after landing.
3. Intro `mt-6 max-w-[40ch] text-[15px] leading-[1.65] text-white/80`.
4. Status `mt-6`: `inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium`, with `role="status" aria-live="polite"`.
   - Open: `bg-lime text-rust` with a dot `size-2 rounded-full bg-rust`, plus a pulse ring (`animate-ping` copy, `motion-reduce:animate-none`).
   - Later/closed: `bg-white/10 text-white`.
5. Schedule `mt-8 max-w-[440px]` as a `<dl>`. Rows `flex justify-between py-3 text-[15px] text-white/90`, with `<dt>` day and `<dd className="tabular-nums">` "2:30 PM – 9:00 PM" or "Closed" (`text-white/50`).
   - Dividers: an absolutely positioned `h-px bg-white/15` per row, `scaleX 0→1` from the left, staggered 0.05s with the row fade.
   - Today: `font-medium text-lime` on both, plus `<span className="ml-2 text-[11px] uppercase tracking-[0.08em] text-lime">Today</span>`.
6. Fee + bring `mt-12 grid gap-8 md:grid-cols-2`.
   - Labels: `text-[11px] uppercase tracking-[0.08em] text-white/60`.
   - Fee `mt-2 font-heading font-medium text-[40px] leading-none text-lime`; note `mt-2 text-[13px] text-white/70`.
   - Bring: `<ul className="mt-3 space-y-2">`; each item `flex gap-2 text-sm text-white/85` with a lime `Check` 16px, stroke 1.5, `aria-hidden`.
7. CTAs `mt-12 flex flex-wrap items-center gap-3`:
   - `Pill variant="lime"` with the WhatsApp icon: "Book on WhatsApp"
   - `Pill variant="outline-light"`: "Call {site.phone}"
   - `<a target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 underline underline-offset-4 hover:text-white">`: "Book online →"

**Right (`lg:col-span-6`, `flex flex-col`):**
- Card: `relative aspect-[4/3] overflow-hidden rounded-[32px] bg-cream lg:aspect-auto lg:min-h-[620px] lg:flex-1`. It fades + rises 32px on reveal.
- iframe: `absolute inset-0 h-full w-full border-0 [filter:saturate(0.85)_sepia(0.12)]`, `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, `title="Map to Nightingale Hospital, Meherpur, Silchar"`, `allowFullScreen`.
- Address row `mt-4 flex items-center justify-between gap-4`:
  - Hospital `font-heading text-xl font-medium text-white`; address `text-sm text-white/70`.
  - Directions `<a>`: `grid size-12 shrink-0 place-items-center rounded-full bg-lime text-rust hover:bg-lime-dark`, Lucide `Navigation` 20px, `aria-label="Get directions"`, `href="https://www.google.com/maps/dir/?api=1&destination=<encoded mapsQuery>"`, new tab.

**Motion:** all through `useReveal` (`once`, 10%, 2.5s fallback). Title lines, rows + dividers, and the map card. Reduced motion: opacity only (transforms dropped by `MotionConfig`); the dot doesn't pulse.

**SEO:** `openingHoursSpecification` from `chamber.schedule` (grouped, closed days omitted); address and `priceRange` from data as before. I'll validate the JSON shape by printing it after the build.

## Accessibility requirements
- One h2. The schedule is a `<dl>` with `<dt>`/`<dd>` in each row (`<div>` wrappers are allowed in a `dl`).
- `role="status" aria-live="polite"` on the status pill. The iframe has a `title`. The directions link has an `aria-label`.
- Small text is white/70+ on rust. Lime is used for the title, the fee and the today row (lime on rust is about 7.4:1).
- The map placeholder button is a real `<button>`, keyboard reachable, with a visible focus ring. All buttons are 44px+.

## Acceptance criteria
- [ ] 1440: rust band; title + status + schedule + fee/bring + CTAs left; tall rounded map card right with the address row beneath.
- [ ] Status logic is correct for Tue 15:00 (open until 9 PM), Tue 13:00 (opens today 2:30 PM), Tue 22:00 (closed, opens Wednesday), Sat 22:00 (opens Monday) and Sun 11:00 (opens Monday). Node output shown.
- [ ] Today's row is lime (checked in the browser for today's IST weekday).
- [ ] Nothing on top of the map. No circles, frames or badges.
- [ ] Desktop: the iframe appears only once the card is within 300px of the viewport. 375: only after the button tap. Directions link URL correct.
- [ ] 375: info first, then map; `scrollWidth === innerWidth`.
- [ ] JSON-LD has one `OpeningHoursSpecification` with Mon–Sat 14:30–21:00 and no TODO values.
- [ ] Every element visible in the full-page no-scroll capture and in the scroll capture.
- [ ] `tsc`, `lint`, `build` pass.

## Checks to run
`npx tsc --noEmit` · `npm run lint` · `npm run build` · Node run of `getChamberStatus` for the 5 cases · `next start` + CDP: screenshots at 1440 and 375, full-page still/scroll visibility, iframe presence before/after scroll (desktop) and before/after tap (375), JSON-LD dump.

## Manual test steps
1. Open `http://localhost:3000/#contact`. The status pill matches the current time in India, and today's row is lime.
2. On desktop, scroll toward the section: the map loads before you reach it. On a phone (or 375 in DevTools), the map shows the placeholder until you tap "Tap to load map".
3. Tap the lime arrow under the map: Google Maps directions open in a new tab.
4. "Book on WhatsApp" opens WhatsApp with the chamber message. "Call" dials. "Book online →" opens Quickobook in a new tab.
5. View the page source and search for `openingHoursSpecification`: Mon–Sat 14:30–21:00. Paste the URL into the Rich Results Test once deployed.
