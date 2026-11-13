# DESIGN.md — Dr. Biswajyoti Das, ENT & Allergy Specialist

The design system for this site. Read it before you build or change any component. If a choice isn't covered here, follow `/reference/design.png`.

---

## 1. Design direction

**Mood:** warm, friendly, confident. It should feel like a modern boutique clinic, not a cold hospital.
**Feel:** big type, bold blocks of color, soft organic shapes, lots of breathing room.
**Key idea:** every section is a full-width **colored band**. The page reads as a stack of colored slabs, and the color changes from one section to the next.

Do:
- Very large headlines that are allowed to run off the edge
- Round blob, arch and circle image masks
- One lime accent word per heading
- Pill-shaped buttons only

Don't:
- No gradients on backgrounds (the only exception is the dark overlay on the hero photo)
- No drop shadows on cards; use flat color only
- No sharp-cornered images
- No stock "medical blue"
- No more than 2 band colors in a row that look alike

---

## 2. Color tokens

```css
:root {
  --rust:      #8B3A16;  /* primary brand */
  --rust-dark: #6E2C10;  /* hover on rust buttons */
  --cream:     #FBF3DC;  /* light section bg */
  --lime:      #E3EA55;  /* accent */
  --lime-dark: #CDD43C;  /* hover on lime buttons */
  --lavender:  #A9A0F0;  /* about band */
  --lilac:     #E8CCF6;  /* who-we-help band */
  --peach:     #F4A97C;  /* blob bg */
  --butter:    #F6D77B;  /* blob bg */
  --sky:       #C9D6FF;  /* blob bg (4th option) */
  --ink:       #2A1408;  /* body text on light */
  --white:     #FFFFFF;
  --line:      rgb(139 58 22 / 0.3); /* dividers */
}
```

Register them in the Tailwind v4 `@theme` block, so classes like `bg-rust`, `text-lime` and so on work.

### Section order
| # | Section | Background | Heading color | Body color | Accent |
|---|---|---|---|---|---|
| 1 | Hero | ear illustration + cream overlay (left→right fade; `cream/85` on mobile) | rust | ink/80 | lime highlighter behind "Throat." + lime badge |
| 2 | Intro statement | rust | white | white/80 | lime |
| 3 | Services | cream | rust | ink | lime ✳ |
| 4 | About doctor | lavender | white | white/90 | lime arrows |
| 5 | Chamber & timings | rust | white | white/80 | lime |
| 6 | Who we help | lilac | rust | ink | — |
| 7 | Reviews | cream | rust | ink | tag pills |
| 8 | FAQ | cream (continued) | rust | ink | — |
| 9 | CTA + Footer | lime | rust | rust | rust button |

### Contrast rules (WCAG AA)
- Lime text only on **rust**. Never put lime text on white, cream or lilac (the light hero uses lime only as a highlighter *behind* rust text).
- Use white text on lavender only at 24px+ (large text). Small body text on lavender uses `--ink`.
- Rust on cream, lime or lilac passes, so use it freely.

---

## 3. Typography

| Role | Font | Weight | Desktop | Mobile | Tracking | Line-height |
|---|---|---|---|---|---|---|
| Display (hero h1) | Bricolage Grotesque | 500 | 96px | 48px | -0.04em | 0.95 |
| Mega title ("Our Services ✳") | Bricolage Grotesque | 600 | 128px | 56px | -0.04em | 0.9 |
| H2 | Bricolage Grotesque | 500 | 64px | 36px | -0.03em | 1.0 |
| H3 (service rows) | Bricolage Grotesque | 400 | 48px | 28px | -0.02em | 1.1 |
| H4 (card titles) | Bricolage Grotesque | 500 | 22px | 20px | -0.01em | 1.2 |
| Body | Inter | 400 | 15px | 14px | 0 | 1.6 |
| Small / meta | Inter | 400 | 12px | 12px | 0.01em | 1.5 |
| Nav links | Inter | 500 | 11px uppercase | — | 0.08em | 1 |
| Review quote | Instrument Serif | 400 | 17px | 16px | 0 | 1.5 |
| Review headline | Bricolage Grotesque | 500 | 18px | 17px | -0.01em | 1.25 |

- Load the fonts with `next/font/google` and expose them as CSS variables: `--font-display`, `--font-body`, `--font-serif`.
- Use `clamp()` for every display size, e.g. `font-size: clamp(3rem, 8vw, 6rem)`.
- Keep body text blocks narrow: `max-width: 34ch` for intro paragraphs (as in the reference), `60ch` elsewhere.
- Accent word pattern: `<span className="text-lime">Care</span>`. Use one accent per heading at most.

---

## 4. Layout & spacing

- **Container:** `max-width: 1200px`, side padding `24px` (mobile) / `64px` (desktop).
- **Section padding:** `py-24 md:py-36`.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144 px. Don't use other values.
- **Grid:** 12 columns, 24px gutter. Text usually sits on columns 1–7 and images on 8–12.
- Mega titles may break out of the container to the right (`mr-[-20vw]`, `whitespace-nowrap`, `overflow-hidden` on the section).
- **Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`.

---

## 5. Shapes & radii

| Element | Radius / shape |
|---|---|
| Buttons, tags, nav pill | `rounded-full` |
| Cards (who-we-help, reviews) | `24px` |
| Service large image | `16px` |
| Service thumbnail | `8px` |
| Doctor portrait (about) | full circle on a colored disc |
| Chamber photo | **arch**: `border-radius: 999px 999px 999px 999px / 50% 50% 50% 50%`, or a tall pill shape with a thin lime outline offset by 8px |
| Who-we-help images | **blob**: SVG `clipPath` made of 2–3 overlapping circles (see the reference's kids/teen cards) |
| Services → About transition | full-width SVG ellipse; the cream band curves down into lavender |

Keep the reusable shapes in `components/shapes/`: `BlobMask.tsx`, `ArchFrame.tsx`, `CurveDivider.tsx`.

---

## 6. Components

### Buttons
```
Primary (on dark):  bg-lime text-rust  h-11 px-6 rounded-full text-[13px] font-medium
                    hover: bg-lime-dark, translate-y-[-1px]
Primary (on light): bg-rust text-white  same sizing   hover: bg-rust-dark
Outline (on dark):  border border-white/60 text-white   hover: bg-white/10
Icon circle:        size-10 rounded-full  (prev = outline, next = filled lime)
Big round CTA:      size-24 rounded-full bg-lime text-rust ring-8 ring-lime/30 ("See All")
```
Every button needs a visible focus ring: `focus-visible:ring-2 ring-offset-2 ring-rust` (or ring-lime on dark).

### Rotating badge
- An SVG circle with text along a path: "ENT • ALLERGY • SILCHAR • ENT • ALLERGY •"
- Size 112px (desktop) / 80px (mobile), lime fill, rust text, ear icon in the center.
- `animation: spin 20s linear infinite`; stop it when `prefers-reduced-motion` is on.

### Service row
- Thin `--line` borders top and bottom, row height ~96px.
- Title on the left (H3, rust), thumbnail on the right (120×64, 8px radius).
- **Open state:** grows to show a short description (Inter 13px, max 40ch) and a large image (320×200).
- Only one row is open at a time; the first one is open by default.

### Doctor highlight card (About carousel)
- 220px wide, white/15 bg on lavender, 24px radius, 24px padding.
- Icon in a lime circle on top, H4 title, then 1–2 lines of small text.
- Scroll-snap horizontal track, prev/next controls on the top right.

### Who-we-help card
- White bg, 24px radius, 16px padding.
- Blob image on top (aspect 4/3) with a peach / butter / sky background behind it.
- Centered H4 rust title + 2 lines of small ink text.

### Review card
- White bg, 24px radius, 24px padding.
- Tag pill on top: Ear = butter, Nose = lilac, Throat = sky, Allergy = peach; 11px text.
- Headline (Bricolage), quote (Instrument Serif), then a footer with the name on the left and ★★★★★ in rust on the right.

### Navbar
- Transparent over the (light) hero; rust wordmark and links (Inter 11px uppercase, 0.08em). Hover: `rust-dark` + 2px lime underline.
- After 80px of scroll: `bg-cream/85 backdrop-blur-md border-b border-rust/10`, text stays rust, height shrinks from 80px to 64px.
- Mobile: rust hamburger icon; full-screen rust overlay menu with white links in Bricolage 40px, staggered in.

### Hero booking card
- `components/sections/BookingCard.tsx`: white, 28px radius, `border-rust/10`, no shadow, max 440px, right-aligned in cols 8–12.
- Inputs `h-12 rounded-2xl bg-cream border-rust/15`, 16px text (no iOS zoom); labels Inter 12px/500 rust; errors 12px rust under the field.
- Problem chips are a radiogroup (arrow keys); submit is a full-width rust pill "Book on WhatsApp" that opens wa.me with a prefilled message.

### Floating WhatsApp button
- Mobile only, bottom-right, 56px lime circle, rust icon, hidden while the CTA band is in view.

---

## 7. Iconography
- Lucide React, stroke width 1.5, size 20 (24 inside lime circles).
- Custom ENT glyphs (ear, nose, throat, allergy leaf) go in `components/icons/` as simple single-stroke SVGs that match Lucide's style.
- Decorative ✳: the Unicode `✳` character in lime, set at the heading's font size.

---

## 8. Imagery
- **Tone:** warm, bright, natural light, real people smiling. Avoid cold blue hospital shots.
- **Subjects:** ENT exams (otoscope, endoscope), the doctor talking to patients, children with parents, older adults.
- Don't use photos with visible blood, needles or surgery.
- Hero: light pastel anatomical ear illustration (`public/images/hero-ear.webp`, 2400×1350 recommended), `object-position: 55% 50%`, with a 4% grain overlay.
- Every image goes through `next/image` with `sizes` set; the hero uses `priority`.
- Swap in the doctor's real photos before launch (all image paths live in `data/site.ts`).

---

## 9. Motion

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Hero background | fade + scale 1.06 → 1 | 1.6s | same |
| Hero headline | each word slides up 100% + fade in, 0.08s stagger | 0.8s | `[0.22, 1, 0.36, 1]` |
| Hero highlighter | lime bar scaleX 0 → 1 after the last word | 0.5s | same |
| Booking card | fade + rise 32px, delay 0.5s | 0.8s | same |
| Section content | fade + rise 32px on view (once, 20% visible) | 0.7s | same |
| Cards in a row | stagger 0.1s | 0.6s | same |
| Service row open | height auto + image scale 0.95 → 1 | 0.5s | same |
| Buttons hover | translateY -1px, bg shift | 0.2s | ease-out |
| Badge | rotate 360° | 20s | linear, infinite |
| Navbar shrink | height + bg | 0.3s | ease-out |

Put shared variants in `lib/motion.ts` (`fadeUp`, `stagger`, `wordReveal`).
When `prefers-reduced-motion: reduce` is on, turn off translate/rotate and keep only the opacity fades.

---

## 10. File structure
```
app/
  layout.tsx        fonts, metadata, JSON-LD
  page.tsx          assembles the sections
  globals.css       @theme tokens, base styles
  sitemap.ts  robots.ts  opengraph-image.tsx
components/
  sections/         Hero, Intro, Services, About, Chamber, WhoWeHelp, Reviews, Faq, Cta, Footer
  ui/               Button, Pill, RotatingBadge, IconButton, Carousel
  shapes/           BlobMask, ArchFrame, CurveDivider
  icons/            Ear, Nose, Throat, Allergy
data/
  site.ts           all content + image paths
lib/
  motion.ts
reference/
  design.png
```

---

## 11. Accessibility checklist
- One `h1` (in the hero); section titles are `h2`.
- All images have meaningful `alt` text; decorative shapes use `aria-hidden`.
- Carousels: buttons have `aria-label`s, the track can be scrolled with the keyboard, and nothing autoplays.
- The service accordion uses `button` + `aria-expanded` + `aria-controls`.
- Tap targets are at least 44×44px.
- Text never sits directly on a photo without the overlay.