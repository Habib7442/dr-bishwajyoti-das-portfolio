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

/** Lavender "Meet Your Doctor" band. Anything still starting with TODO is hidden on the page. */
export type AboutInfo = { label: string; value: string };
export type ApproachIcon = "Ear" | "MessagesSquare" | "HandHeart";

const languages = "TODO: confirm with the doctor — Bengali, English, Hindi?";

export const about = {
  eyebrow: "Meet your doctor",
  // headline, not a quote: no quotation marks, not attributed to the doctor
  statement: { lead: "Good treatment starts with", accent: "listening." },
  name: site.name,
  role: site.title,
  // shown on a cream arch, no filters. A background-removed /images/doctor/portrait.png looks best: change this path when it arrives.
  portrait: "/images/doctor/portrait.webp",
  portraitAlt: "Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar",
  qualifications: site.qualifications,
  experienceYears: site.experienceYears,
  registration: site.registrationNo,
  languages,
  bio: [
    "TODO: 2–3 short sentences in the doctor's own words about his training, experience and how he treats patients.",
  ],
  approach: [
    { icon: "Ear", title: "Listens first", text: "Takes time to understand your problem before suggesting any treatment." },
    { icon: "MessagesSquare", title: "Explains clearly", text: "Tells you what is wrong and what the options are, in simple words." },
    { icon: "HandHeart", title: "Treats gently", text: "Careful, comfortable check-ups, especially for children and older patients." },
  ] as { icon: ApproachIcon; title: string; text: string }[],
  // info bar, in this order; each item is shown only once its value is filled in
  info: [
    { label: "Practices at", value: quickFacts.place },
    { label: "Available", value: quickFacts.hours },
    { label: "Fee", value: site.fee },
    { label: "Qualification", value: site.qualifications },
    { label: "Experience", value: site.experienceYears },
    { label: "Speaks", value: languages },
    { label: "Registration", value: site.registrationNo },
  ] as AboutInfo[],
  marquee: ["Ear", "Nose", "Throat", "Allergy", "Hearing", "Sinus", "Voice"],
};

/** Rust "Visit the Chamber" band. `schedule` is also the source for the JSON-LD opening hours. */
export type ChamberDay = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string | null; // "HH:MM" 24h, Asia/Kolkata; null = closed
  close: string | null;
};

export const chamber = {
  eyebrow: "Chamber & timings",
  titleLine1: "Visit the",
  titleLine2: "Chamber", // lime
  intro: "Consultations run every afternoon and evening except Sunday at Nightingale Hospital, Meherpur.",
  hospital: "Nightingale Hospital",
  address: "Meherpur, Silchar, Assam", // TODO (not shown as TODO): full street address + PIN from the doctor
  mapsQuery: "Nightingale Hospital Meherpur Silchar",
  timeZone: "Asia/Kolkata",
  schedule: [
    { day: "Monday", open: "14:30", close: "21:00" },
    { day: "Tuesday", open: "14:30", close: "21:00" },
    { day: "Wednesday", open: "14:30", close: "21:00" },
    { day: "Thursday", open: "14:30", close: "21:00" },
    { day: "Friday", open: "14:30", close: "21:00" },
    { day: "Saturday", open: "14:30", close: "21:00" },
    { day: "Sunday", open: null, close: null },
  ] as ChamberDay[],
  fee: site.fee,
  feeNote: "Paid at the clinic",
  bringList: ["Old prescriptions and test reports", "List of medicines you take now", "Hearing test or X-ray/CT reports, if any"],
  whatsappMessage: "Hello Doctor, I'd like to book an appointment at Nightingale Hospital, Meherpur.",
};

/** Lilac "Who We Help" band. `problem` pre-selects the hero form's chip from the card link. */
export type WhoGroup = {
  key: "children" | "adults" | "seniors";
  title: string;
  text: string;
  conditions: string[];
  image: string;
  imageAlt: string;
  bg: "peach" | "butter" | "sky";
  problem: (typeof booking.problems)[number];
};

export const whoWeHelp = {
  eyebrow: "Care for every age",
  titleLead: "Who We",
  titleAccent: "Help?",
  intro: "ENT problems look different at every age. Dr. Das adjusts each check-up to the patient in front of him.",
  groups: [
    {
      key: "children",
      title: "Children",
      text: "Ear infections, blocked nose, tonsils, adenoids and mouth breathing. Gentle check-ups that don't scare little ones.",
      conditions: ["Ear infections", "Tonsils", "Adenoids"],
      image: "/images/who/children.webp",
      imageAlt: "Child smiling during a gentle ear check-up",
      bg: "peach",
      problem: "Ear",
    },
    {
      key: "adults",
      title: "Adults",
      text: "Sinus trouble, allergies, throat infections, voice problems and hearing changes from work or daily life.",
      conditions: ["Sinusitis", "Allergies", "Throat & voice"],
      image: "/images/who/adults.webp",
      imageAlt: "Smiling woman breathing easily through her nose",
      bg: "butter",
      problem: "Nose",
    },
    {
      key: "seniors",
      title: "Senior Citizens",
      text: "Hearing loss, ringing in the ears, dizziness and balance problems. Unhurried care with clear explanations.",
      conditions: ["Hearing loss", "Vertigo", "Tinnitus"],
      image: "/images/who/seniors.webp",
      imageAlt: "Smiling older man cupping his hand to his ear to listen",
      bg: "sky",
      problem: "Ear",
    },
  ] as WhoGroup[],
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
