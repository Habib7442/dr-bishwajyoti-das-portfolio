/**
 * ALL editable site content lives here.
 * Any value starting with "TODO" renders as a clearly visible placeholder on the site.
 * Swap image URLs for the doctor's real photos (put them in /public and use "/photo.jpg").
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const site = {
  // TODO: replace with the final domain once it's bought / connected on Vercel
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dr-biswajyoti-das.vercel.app",

  name: "Dr. Biswajyoti Das",
  title: "ENT & Allergy Specialist",
  city: "Silchar",
  tagline: "ENT & Allergy Specialist in Silchar",
  heroEyebrow: "ENT & Allergy Specialist · Silchar",
  heroSub: "Dr. Biswajyoti Das treats ear, nose, throat and allergy problems for children, adults and seniors.",
  shortBio:
    "Personal, unhurried ENT and allergy care for children, adults and senior citizens at Nightingale Hospital, Meherpur.",
  qualifications: "TODO (e.g. MBBS, MS ENT)",
  experienceYears: "TODO",
  registrationNo: "TODO",

  chamber: "Nightingale Hospital, Meherpur, Silchar, Assam",
  address: {
    hospital: "Nightingale Hospital",
    street: "Meherpur",
    locality: "Silchar",
    region: "Assam",
    postalCode: "788015", // verify Meherpur PIN

    country: "IN",
  },
  days: "Monday – Saturday",
  hours: "2:30 PM – 9:00 PM",
  // machine-readable hours for JSON-LD
  openingHours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "14:30", closes: "21:00" },
  fee: "₹500",

  phone: "+91 98643 71333", // e.g. "+91 98XXXXXXXX"
  whatsapp: "9864371333", // 10-digit Indian mobile number, no +91 (e.g. "98XXXXXXXX"); links add 91 automatically
  whatsappMessage: "Hello Doctor, I'd like to book an appointment.",
  onlineBooking: "https://www.quickobook.com/chamber?doctorId=226615",
  mapEmbed: "TODO", // Google Maps → Share → Embed a map → copy the src="..." URL
  mapLink: "https://www.google.com/maps/search/?api=1&query=Nightingale+Hospital+Meherpur+Silchar",

  images: {
    // decorative background illustration (2400×1350 recommended); alt is empty on purpose
    hero: { src: "/images/hero-ear.webp", alt: "" },
    doctor: { src: unsplash("1612349317150-e413f6a5b16d"), alt: "Portrait of Dr. Biswajyoti Das (placeholder photo)" },
    chamber: { src: unsplash("1519494026892-80bbd2d6fd0d"), alt: "Hospital reception desk (placeholder for Nightingale Hospital)" },
  },
};

/** Short facts shown as pills in the hero */
export const quickFacts = {
  place: "Nightingale Hospital, Meherpur",
  hours: "Mon–Sat · 2:30–9:00 PM",
  fee: "Fee ₹500",
};

/** Shorter quick-fact labels for phones (below md) */
export const quickFactsShort: Record<keyof typeof quickFacts, string> = {
  place: "Nightingale Hospital",
  hours: "Mon–Sat · 2:30–9 PM",
  fee: "₹500",
};

/** Rust intro band under the hero. Stats whose value starts with TODO are hidden. */
export type IntroLine = { text: string; indent: 0 | 1; asterisk?: boolean; accent?: boolean; pill?: string };
export type IntroStat = { value: string; label: string };

export const intro = {
  statementLines: [
    { text: "Expert care for your", indent: 0 },
    { text: "ear, nose & throat", indent: 1, asterisk: true },
    { text: "and every", indent: 0 },
    // lime word + small round image after it; file lives in /public (ear-icon fallback while missing)
    { text: "allergy", indent: 0, accent: true, pill: "/images/intro-pill.webp" },
  ] as IntroLine[],
  paragraph:
    "From blocked ears and sinus trouble to throat infections and allergies, Dr. Biswajyoti Das listens carefully, explains clearly and treats gently — for children, adults and seniors.",
  ctaLabel: "Book Appointment",
  stats: [
    { value: site.experienceYears, label: "Years of experience" },
    { value: "TODO", label: "Patients treated" },
    { value: "6 days", label: "Open every week" },
  ] as IntroStat[],
};

/** Booking form options (WhatsApp booking card in the hero) */
export const booking = {
  problems: ["Ear", "Nose", "Throat", "Allergy", "Other"] as const,
  timeSlots: ["2:30–4:00 PM", "4:00–6:00 PM", "6:00–7:30 PM", "7:30–9:00 PM"] as const,
  /** labels shown in the select on phones; the WhatsApp message always uses the full slot */
  timeSlotsShort: ["2:30–4", "4–6", "6–7:30", "7:30–9"] as const,
  /** same-day bookings allowed only before this hour (24h, Asia/Kolkata) */
  sameDayCutoffHour: 9,
  /** 0 = Sunday */
  closedWeekdays: [0] as number[],
  timeZone: "Asia/Kolkata",
  noteMax: 200,
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export type Service = { slug: string; title: string; description: string; image: { src: string; alt: string } };

export const services: Service[] = [
  {
    slug: "ear-hearing",
    title: "Ear Problems & Hearing Loss",
    description:
      "Ear pain, discharge, ringing in the ears (tinnitus) and gradual or sudden hearing loss are examined in detail, with hearing tests arranged when needed and a clear plan for treatment or hearing aids.",
    image: { src: unsplash("1631815588090-d4bfec5b1ccb"), alt: "Doctor examining a patient" },
  },
  {
    slug: "sinus-nasal",
    title: "Sinusitis & Nasal Blockage",
    description:
      "Long-standing blocked nose, sinus headaches, facial pressure, nasal polyps and a deviated septum are assessed and treated with medicines first, and with endoscopic procedures when they are truly needed.",
    image: { src: unsplash("1588776814546-1ffcf47267a5"), alt: "Doctor reviewing scan images" },
  },
  {
    slug: "allergy",
    title: "Allergy Testing & Treatment",
    description:
      "Sneezing, runny nose, itchy eyes and seasonal allergies are traced to their triggers through allergy testing, followed by a practical plan covering avoidance, medication and immunotherapy where suitable.",
    image: { src: unsplash("1576091160550-2173dba999ef"), alt: "Stethoscope on a desk beside a laptop" },
  },
  {
    slug: "throat-voice",
    title: "Tonsils, Throat & Voice Problems",
    description:
      "Recurrent sore throat, tonsillitis, hoarseness, voice strain and difficulty swallowing are evaluated, including scope examination of the voice box for teachers, singers and anyone with a persistent change in voice.",
    image: { src: unsplash("1666214280557-f1b5022eb634"), alt: "Doctor explaining a scan on a screen" },
  },
  {
    slug: "vertigo",
    title: "Vertigo & Dizziness",
    description:
      "Spinning sensations, imbalance and dizziness often start in the inner ear. Bedside tests find the cause, and treatments such as repositioning manoeuvres and balance exercises help bring steadiness back.",
    image: { src: unsplash("1559757148-5c350d0d3c56"), alt: "Anatomical model used to explain the inner ear and brain" },
  },
  {
    slug: "snoring",
    title: "Snoring & Sleep Problems",
    description:
      "Loud snoring, mouth breathing and daytime tiredness can point to a blocked airway. The nose, throat and palate are checked to find where the blockage is and how best to open it up.",
    image: { src: unsplash("1666214280391-8ff5bd3c0bf0"), alt: "Doctors discussing results at a computer" },
  },
  {
    slug: "ear-wax-infection",
    title: "Ear Wax Removal & Ear Infections",
    description:
      "Impacted wax is removed safely under direct vision, never with cotton buds, and outer and middle ear infections in children and adults are treated quickly to protect hearing.",
    image: { src: unsplash("1505751172876-fa1923c5c528"), alt: "Close-up of a stethoscope" },
  },
  {
    slug: "endoscopic",
    title: "Endoscopic ENT Procedures",
    description:
      "Diagnostic nasal and throat endoscopy in the chamber, plus minimally invasive endoscopic sinus and ENT surgery when it is needed, with smaller cuts, less pain and a quicker recovery.",
    image: { src: unsplash("1551601651-2a8555f1a136"), alt: "Surgical team performing a procedure" },
  },
];

export type Highlight = { kind: "education" | "experience" | "practice" | "membership" | "interest"; label: string; text: string };

export const highlights: Highlight[] = [
  { kind: "education", label: "Education", text: "TODO: degrees, college and year (e.g. MBBS — …, MS ENT — …)" },
  { kind: "experience", label: "Experience", text: "TODO: years in practice and previous hospitals" },
  { kind: "practice", label: "Current Practice", text: "ENT & Allergy Specialist at Nightingale Hospital, Meherpur, Silchar" },
  { kind: "membership", label: "Memberships", text: "TODO: professional bodies (e.g. Association of Otolaryngologists of India)" },
  { kind: "interest", label: "Special Interests", text: "Allergy care, endoscopic sinus treatment, hearing and vertigo" },
];

export const audiences = [
  {
    title: "Children",
    points: ["Ear infections", "Tonsils", "Adenoids"],
    image: { src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80", alt: "Smiling young child" },
    blob: "peach" as const,
  },
  {
    title: "Adults",
    points: ["Sinus", "Allergy", "Hearing", "Voice"],
    image: { src: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=900&q=80", alt: "Smiling adult man with glasses" },
    blob: "butter" as const,
  },
  {
    title: "Senior Citizens",
    points: ["Hearing loss", "Vertigo", "Balance"],
    image: { src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=900&q=80", alt: "Doctor speaking with an older patient" },
    blob: "peach" as const,
  },
];

export const faqs = [
  { q: "What is the consultation fee?", a: `The consultation fee is ${site.fee}, payable at the chamber.` },
  { q: "What are the chamber timings?", a: `${site.days}, ${site.hours}, at ${site.chamber}.` },
  {
    q: "How do I book an appointment?",
    a: "Send a message on WhatsApp, call the chamber, or book online through Quickobook. Walk-ins are seen as time allows, but booking ahead reduces waiting time.",
  },
  {
    q: "Should I bring my old reports and prescriptions?",
    a: "Yes. Please bring previous prescriptions, hearing test reports, X-rays, CT scans and a list of the medicines you currently take. They help avoid repeat tests.",
  },
  {
    q: "Are children seen at the chamber?",
    a: "Yes. Children of all ages are seen for ear infections, tonsils, adenoids, blocked nose and hearing concerns. Please come with a parent or guardian.",
  },
];
