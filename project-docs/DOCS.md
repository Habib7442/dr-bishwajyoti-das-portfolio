# Claude Code Prompt — Dr. Biswajyoti Das, ENT & Allergy Specialist (Silchar)

Paste everything below the line into Claude Code. Put the reference image in the project as `/reference/design.png` first so Claude Code can look at it.

---

Build a single-doctor personal portfolio website for **Dr. Biswajyoti Das — ENT & Allergy Specialist, Silchar, Assam**.

## Tech stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion for scroll-reveal and hover animations
- `next/font` (Google Fonts), `next/image` for all images
- Lucide React for icons
- No backend. The appointment form opens WhatsApp / a phone call (no database).
- Deploy target: Vercel

## Design reference
Look at `/reference/design.png` and follow its layout rhythm, color blocking, big headlines and pill buttons closely. Change the content from dental to ENT. Don't copy its text.

### Color palette (taken from the reference)
```
--rust:      #8B3A16   /* main brand: hero band, consult band, buttons, headings on light bg */
--cream:     #FBF3DC   /* services section bg */
--lime:      #E3EA55   /* accent: highlighted words, pill buttons, CTA band, badge */
--lavender:  #A9A0F0   /* specialist/about band */
--lilac:     #E8CCF6   /* "who we help" band */
--peach:     #F4A97C   /* image blob backgrounds */
--butter:    #F6D77B   /* image blob backgrounds */
--ink:       #2A1408   /* body text on light bg */
--white:     #FFFFFF   /* cards */
```
Rules:
- Every section is a full-width colored band, like the reference (rust → cream → lavender → rust → lilac → cream → lime).
- Headings on rust use white with key words in lime ("Ear, Nose & Throat **Care**").
- Buttons: rounded-full pills, lime with rust text on dark bands, rust with white text on light bands.
- Use the curved divider between the cream and lavender sections (big ellipse), as in the reference.
- Section dividers inside lists: thin rust lines (1px, 30% opacity).

### Typography
- Headings: **Bricolage Grotesque** (500–600), very large, tight letter-spacing (-0.03em). Section titles 64–120px on desktop.
- Body: **Inter** 14–16px.
- Review quotes: **Instrument Serif** (the reference uses a serif in review cards).
- Use the ✳ asterisk glyph in lime as a decorative accent, like the reference.

## Page sections (one-page site, smooth scroll)

1. **Navbar** — "Dr. Biswajyoti Das" wordmark on the left; links Home / Services / About / Reviews / Contact on the right; turns rust with blur when scrolled. Hamburger menu on mobile.

2. **Hero** (full-bleed photo, dark gradient overlay)
   - Headline: "Clear Ears. Easy Breathing. Healthy Throat."
   - Subline: "ENT & Allergy Specialist in Silchar"
   - Rotating circular lime badge (SVG text on a path): "ENT • ALLERGY • SILCHAR •" with an ear icon in the center — copy the badge style from the reference.
   - Small text on the right: one line about the doctor.

3. **Intro statement** (rust band)
   - Big text: "Expert care for your ✳ ear, nose, throat and **allergy** problems" with lime highlight.
   - Short paragraph + "Book Appointment" label + clickable phone number (underlined in lime).

4. **Services** (cream band) — big title "Our Services ✳" running off the right edge, like the reference.
   Accordion/hover list. The first item is open with a large image; the others show a small thumbnail on the right. On hover/click an item expands to show its description and image.
   - Ear Problems & Hearing Loss
   - Sinusitis & Nasal Blockage
   - Allergy Testing & Treatment
   - Tonsils, Throat & Voice Problems
   - Vertigo & Dizziness
   - Snoring & Sleep Problems
   - Ear Wax Removal & Ear Infections
   - Endoscopic ENT Procedures
   Then the round lime "See All" button sitting on the curved divider.

5. **About the Doctor** (lavender band) — replaces the reference's "Our Specialist" carousel, since this is one doctor.
   - Doctor photo in a rounded blob with a peach background (same shape style as the reference).
   - Name, qualifications, years of experience, registration number.
   - A horizontal carousel of "highlight" cards (education, experience, memberships), with prev/next lime arrow buttons like the reference.

6. **Chamber & Timings** (rust band) — replaces "Free Doctor Consultations".
   - Title: "Visit the **Chamber**" (lime on the second word).
   - Nightingale Hospital, Meherpur, Silchar
   - Monday–Saturday, 2:30 PM – 9:00 PM
   - Consultation fee: ₹500
   - "Book on WhatsApp" lime pill + "Call Now" outline pill.
   - Arch-shaped photo with the rotating badge on its corner, copying the reference.

7. **Who We Help** (lilac band) — three white cards with blob-shaped images on peach/butter backgrounds:
   - Children: ear infections, tonsils, adenoids
   - Adults: sinus, allergy, hearing, voice
   - Senior Citizens: hearing loss, vertigo, balance

8. **Reviews** (cream band) — "Patient Reviews" title, slider with prev/next arrows. Cards have a small colored tag pill (Ear / Nose / Throat / Allergy), a serif quote, the patient's name and stars.
   ⚠️ Use ONLY real reviews copied from the doctor's Google/Justdial listing (with permission). Store them in `data/reviews.ts`. If there are none yet, hide this section. Don't make up reviews.

9. **FAQ** (cream band, accordion) — fee, timings, how to book, whether to bring old reports, whether children are seen. Add FAQPage JSON-LD.

10. **CTA band** (lime) — "Book your appointment today" + rust pill button.

11. **Footer** (lime band continues) — wordmark, Menu links, Services links, chamber address, Google Maps embed, phone, WhatsApp, "© Dr. Biswajyoti Das", plus "Website by Locallify".

## Content setup
Put ALL content in `/data/site.ts` (doctor info, services, timings, reviews, FAQs) so it can be edited without touching components. Use these values; anything marked TODO stays as a clearly visible placeholder:
```ts
name: "Dr. Biswajyoti Das",
title: "ENT & Allergy Specialist",
qualifications: "TODO (e.g. MBBS, MS ENT)",
experienceYears: "TODO",
registrationNo: "TODO",
chamber: "Nightingale Hospital, Meherpur, Silchar, Assam",
days: "Monday – Saturday",
hours: "2:30 PM – 9:00 PM",
fee: "₹500",
phone: "TODO",
whatsapp: "TODO",
onlineBooking: "https://www.quickobook.com/chamber?doctorId=226615",
mapEmbed: "TODO",
```

## Images
Use Unsplash placeholder images (ENT exam, otoscope, doctor-patient, smiling families) through `next/image` with `remotePatterns`. Keep every image path in `/data/site.ts` so they can be swapped for the doctor's real photos later. Blob/arch masks are done with CSS `border-radius` or SVG `clipPath`, not baked into the images.

## Animation
- Headline words slide up and fade in on load (staggered).
- Each section fades up on scroll (Framer Motion `whileInView`, once).
- Circular badges rotate slowly (CSS keyframes, 20s linear infinite).
- Service rows: image scales up and the row expands on hover.
- Respect `prefers-reduced-motion`.

## SEO (important — local search)
- Metadata title: "Dr. Biswajyoti Das | ENT & Allergy Specialist in Silchar"
- Description that mentions ENT doctor in Silchar, Meherpur, allergy, sinus, hearing.
- JSON-LD: `Physician` + `MedicalClinic` with address, hours, priceRange, and a `sameAs` link to the Quickobook page.
- `sitemap.ts`, `robots.ts`, Open Graph image, semantic headings (one `h1`).

## Quality bar
- Fully responsive: mobile first, test at 375 / 768 / 1280 / 1536.
- Lighthouse 90+ on all four scores; the hero image uses `priority`.
- Accessible: color contrast AA (lime text only on rust/dark backgrounds, never on white), focus rings, alt text, aria labels on icon buttons.
- Sticky floating WhatsApp button at the bottom right on mobile.

Build it section by section. After each section, run the dev server and compare it with `/reference/design.png` before you move on.