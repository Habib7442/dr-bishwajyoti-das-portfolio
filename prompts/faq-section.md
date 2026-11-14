# Prompt: FAQ section (white band) — Step 8

## Goal
Build `#faq` right after Reviews (and before the future lime CTA band). On the left there is a sticky header: eyebrow, "Questions patients **ask**", intro, and a WhatsApp pill plus a call link. On the right there is a clean accordion with round +/× icons. Several items can be open at once, and the first one is open by default. Add FAQPage JSON-LD generated from the same data. No badges, blobs, circles or outline frames. Build only this section.

## Docs read
- `AGENTS.md` (§3 UI, §4 content, §8 band order, §10 SEO, §11 traps)
- `DESIGN.md` (§2 tokens and section table, §3 type, §4 spacing, §6 buttons, §9 motion, §11 a11y)
- `project-docs/DOCS.md` §9 (FAQ)
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
- `@base-ui/react/accordion` types (`multiple`, `hiddenUntilFound`)
- your "Step 8" spec

## Existing code inspected
- `data/site.ts`
  - An unused `faqs` array exists (5 items, older copy, including "Walk-ins are seen as time allows", which nobody has confirmed). Nothing imports it.
  - Facts available: `site.days`, `site.hours`, `site.fee`, `site.phone`, `site.address.*`, `chamber.schedule` (Sunday is closed), `chamber.feeNote` ("Paid at the clinic"), `booking.sameDayCutoffHour` (9).
- `lib/seo.ts`: `buildJsonLd()` returns one `@graph` (Physician, MedicalClinic, WebSite). `layout.tsx` renders it through `jsonLdString()`, which already escapes `<`.
- `lib/site-helpers.ts`: `whatsappUrl(msg)` (null while TODO) and `telHref` (null while TODO).
- `components/sections/ServicesMotion.tsx`: uses the Base UI `AccordionPrimitive` with a CSS height transition on `--accordion-panel-height`. I'll use the same pattern here.
- `components/sections/ReviewsMotion.tsx`: `RevealHeader` and `AccentWord` (lime `Highlighter trigger="parent"`), driven by `lib/use-reveal.ts` (10% visible, the scrolled-past check, and the 2.5s instant fallback).
- `components/ui/pill.tsx`: the `lime` variant.
- `data/reviews.ts`: there are no real reviews and no listing URLs, so **Reviews is hidden today**. FAQ will sit directly after the lilac Who We Help band until reviews arrive.

## Decisions and assumptions (⚠️ = please check)

1. ⚠️ **Band colour conflict.** DESIGN.md §2 and AGENTS.md §8 say FAQ is **cream**. Your spec says **white**, as a clean break before the lime CTA. White is also a clear break from lilac today (Reviews is hidden) and from cream later. I'll follow the spec and update the FAQ row in both tables to "white". Say if you'd rather stay cream.

2. ⚠️ **Spacing snapped to the DESIGN.md scale:**

   | Spec | Snapped to |
   |---|---|
   | `md:py-32` (128) | `md:py-36` (144) |
   | `lg:top-28` (112) | `lg:top-24` (96; the scrolled navbar is 64px) |
   | intro `mt-5` (20) | `mt-6` (24) |
   | panel `pr-14` (56) | `pr-12` (48) |
   | icon `size-9` (36) | `size-10` (40, the DESIGN.md icon circle) |

   Already on the scale: `py-24`, `gap-12`, `lg:gap-16`, `py-6`, `gap-6`, `pb-6`, `mt-8`.

3. **Accordion primitive.** I'll use the Base UI Accordion (as in Services) instead of a hand-built `AnimatePresence` one:
   - It gives `aria-expanded`, `aria-controls`, and a panel with `role="region"` and `aria-labelledby` for free.
   - Keyboard arrow, Home and End navigation between headers comes with it.
   - It sets `multiple` and `defaultValue={[firstId]}` (arrays, per the Base UI trap).
   - `hiddenUntilFound` keeps collapsed answers in the DOM as `hidden="until-found"`. Ctrl+F then finds text inside **closed** items and opens them in Chrome and Edge, which is better than the spec's `inert`. Other browsers simply treat them as hidden.
   - The height animates through a CSS transition on `--accordion-panel-height`: 0.35s, `cubic-bezier(0.22,1,0.36,1)`. It looks the same as the spec's motion.
   - Headers render inside an `h3` (`AccordionPrimitive.Header render={<h3 />}`).

4. **Facts come from data, not literals.** Answers are template strings:
   - Timings: `${site.days}, ${site.hours}`, plus the closed day(s) taken from `chamber.schedule` (where `open === null`, so "Sunday").
   - Fee: `${site.fee}`, plus the lower-cased `chamber.feeNote`.
   - Same-day cutoff: from `booking.sameDayCutoffHour`, formatted as "9:00 AM".
   - Address: built from `site.address` (see ⚠️5).
   - Name: `site.name`.
   - Note that `site.days` reads "Monday – Saturday", so the first answer will say "Monday – Saturday, 2:30 PM – 9:00 PM" rather than "Monday to Saturday". This keeps it in sync with the rest of the site.

5. ⚠️ **New address detail.** Your spec's answer uses "Meherpur Road, Birbal Bazar". The data today only has `street: "Meherpur"`, and `chamber.address` is still marked as needing the full street address. I'll set `site.address.street = "Meherpur Road, Birbal Bazar"` and add `area: "Meherpur"`. JSON-LD `streetAddress` then becomes "Nightingale Hospital, Meherpur Road, Birbal Bazar, Meherpur". I won't touch the Chamber section text (out of scope). Please confirm this address is correct, because it goes into Google's structured data.

6. ⚠️ **Quickobook "small confirmation fee".** This fact isn't anywhere in the repo docs. I'll keep it because it's in your spec, so please confirm it's true.

7. **Old `faqs` array:** deleted and replaced by `faq` (eyebrow, title parts, intro, `whatsappMessage`, `items`). Each item gets a stable `id` (for example `timings`) for the accordion value and the DOM ids.

8. **CTA fallbacks** (so there are never broken links):
   - The lime pill says "Ask on WhatsApp" and links to `whatsappUrl(faq.whatsappMessage)`. While WhatsApp is TODO, it says "Book Online" and links to Quickobook.
   - "Call {site.phone}" uses `telHref`. It's hidden while the phone is TODO.

9. **JSON-LD.** I'll add a `FAQPage` node (with `@id` `#faq`) to the existing `@graph` in `lib/seo.ts`:
   - It's built from `faq.items`, as `Question` → `acceptedAnswer: Answer` with the plain-text `text`. That's the same strings the page shows, so markup and visible content always match.
   - Items whose text contains a TODO are skipped.
   - It's rendered by the existing script in `layout.tsx`, so there's no second `<script>`.
   - Note: Google only shows FAQ rich results for some authoritative health or government sites. The markup is valid and still helps Google and AI search understand the page, but the visual rich result isn't guaranteed.

10. **Heading.** The `h2` is ink, with "ask" in **rust** on the lime highlighter (the `AccentWord` pattern). There are no lime-coloured letters on white.

## Files likely to change
- `data/site.ts`: add `faq` and delete `faqs`; set `address.street` and `address.area` (⚠️5).
- `components/sections/Faq.tsx`: new server component (layout, CTA links).
- `components/sections/FaqMotion.tsx`: new client component (header reveal, accordion with staggered items).
- `lib/seo.ts`: FAQPage node; `streetAddress` includes `area`.
- `app/page.tsx`: `<Faq />` after `<Reviews />`.
- `DESIGN.md` §2 and `AGENTS.md` §8: FAQ row cream → white (only if you agree with ⚠️1).

## Implementation requirements

**Section**
- `<section id="faq" aria-labelledby="faq-title" className="relative bg-white py-24 md:py-36">`
- Container: `mx-auto max-w-[1200px] px-6 lg:px-16`
- Grid: `grid gap-12 lg:grid-cols-12 lg:gap-16`

**Left column** (`lg:col-span-5 lg:sticky lg:top-24 self-start`), wrapped in `RevealHeader`:
- Eyebrow: `flex items-center gap-3`, a `h-px w-6 bg-rust/40` line (`aria-hidden`), then the text. Inter 12px, 500, uppercase, tracking 0.08em, ink/60.
- `h2#faq-title`, `mt-4`: Bricolage 500, `text-[clamp(2.5rem,5vw,4rem)]`, `leading-none`, `tracking-[-0.03em]`, ink. "ask" is rust inside `AccentWord`.
- Intro, `mt-6`: Inter 15px, line-height 1.65, ink/75, `max-w-[34ch]`.
- CTA row, `mt-8`, `flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6`:
  - `<Pill variant="lime" className="w-full sm:w-auto">` with the WhatsApp icon and the label.
  - The call link: `inline-flex h-11 items-center justify-center text-sm font-medium text-rust underline underline-offset-4 hover:text-rust-dark`.

**Right column** (`lg:col-span-7`): `Accordion.Root multiple hiddenUntilFound defaultValue={[items[0].id]}`, rendered as a list with `divide-y divide-rust/15 border-y border-rust/15`.
- Item: `motion` wrapper (fade up 16px, stagger 0.05s).
- Header: `<h3>`. Trigger: `group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left`, with a focus ring `focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm`.
  - Question: Bricolage 500, `text-[clamp(1.125rem,1.6vw,1.375rem)]`, `leading-[1.3]`, ink. On fine-pointer hover it turns rust (`transition-colors duration-200`).
  - Icon: `grid size-10 shrink-0 place-items-center rounded-full transition duration-300`.
    - Closed: `bg-cream text-rust`.
    - Open (`group-data-[panel-open]`): `bg-rust text-white`, with the Lucide `Plus` (20px, stroke 1.5) rotated 45°.
    - `aria-hidden`.
- Panel: `h-(--accordion-panel-height) overflow-hidden transition-[height] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none`.
  - Inner `<p>`: `pb-6 pr-12`, Inter 15px, `leading-[1.7]`, ink/75, `max-w-[58ch]`.

## Accessibility requirements
- One `h2`. Questions are `h3 > button` with `aria-expanded` and `aria-controls` (from Base UI). Panels have `role="region"` and `aria-labelledby`.
- Visible rust focus ring on the triggers, the pill and the call link.
- Tap targets: the trigger covers the full row (at least 72px tall); the pill and call link are 44px.
- Collapsed answers stay in the DOM (`hidden="until-found"`).
- Reduced motion: opacity fades only (through `MotionConfig`), no height transition and no icon rotation transition (the state still changes).
- Contrast: rust on white, ink/75 on white, and rust on the lime pill. There is no lime text.

## Motion
- Header: the `RevealHeader` fade up, then the highlighter sweep on "ask" (0.5s delay).
- Items: a staggered container with `staggerChildren: 0.05`; each item goes opacity 0→1 and y 16→0 over 0.6s with the house ease.
- Both use `useReveal` (10%, `once`, the 2.5s safety net).

## Behaviour by width
- **375:** the header stacks on top (not sticky), then the accordion. The pill is full width with the call link below it, centred. Questions wrap, and the icon stays top-aligned. No horizontal scroll.
- **768:** same stack; the CTAs sit side by side (`sm:`).
- **1280 / 1536:** a 5/7 split. The header sticks at 96px while the accordion scrolls, and the container is capped at 1200px.

## Acceptance criteria
- [ ] At 1440: a white band, the sticky title and WhatsApp CTA on the left, the accordion with round +/× icons on the right.
- [ ] The first question is open on load. Others open and close smoothly, and several can be open at once.
- [ ] Fee, timings, closed day, same-day cutoff, address, phone and name come from data; nothing is hard-coded.
- [ ] At 375: the title first, then the accordion; easy to tap; no overflow.
- [ ] FAQPage JSON-LD is present in the page's `@graph`, its answers match the visible text, and it parses as valid JSON.
- [ ] `tsc`, `lint` and `build` pass, with no console errors.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run dev`, then check the browser at 375 / 768 / 1280 / 1536 and take screenshots at 1440 and 375.
- Extract the JSON-LD from the built HTML, `JSON.parse` it, and confirm the FAQPage has 7 `Question` entries.

## Manual test steps
1. Run `npm run dev` and open `http://localhost:3000/#faq`.
2. The first question ("What are the consultation timings?") is open, and its icon is a rust circle with a white ×.
3. Click "What is the consultation fee?". It opens while the first stays open. Click it again and it closes smoothly.
4. Tab into the accordion. Each question shows a rust focus ring. Press Enter or Space to toggle, and ↓/↑ to move between questions.
5. With everything closed, press Ctrl+F and search "Birbal". In Chrome or Edge, the address item opens.
6. "Ask on WhatsApp" opens wa.me with "Hello, I have a question about an appointment.", and "Call +91 98643 71333" opens the dialer.
7. At 375px, the header is above the accordion, the pill is full width and there is no sideways scroll.
8. Turn on reduced motion in the OS. Items only fade, and panels open with no height animation.
9. View the page source, find the `application/ld+json` script, and paste it into the Rich Results Test or validator.schema.org. Check that FAQPage shows 7 questions with no errors.
