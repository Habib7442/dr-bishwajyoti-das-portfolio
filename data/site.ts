/**
 * ALL editable site content lives here.
 * Any value starting with "TODO" renders as a clearly visible placeholder on the site.
 * Swap image URLs for the doctor's real photos (put them in /public and use "/photo.jpg").
 */

import { formatTime } from "@/lib/chamber-hours";

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
    street: "Meherpur Road, Birbal Bazar",
    area: "Meherpur",
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

/** Cream "Our Services" accordion. `problem` pre-selects the hero form's chip from "Book for this →". */
export type ServiceIcon = "Ear" | "Wind" | "Flower2" | "Mic" | "RotateCw" | "BedDouble" | "ScanEye";
export type Service = {
  slug: string;
  title: string;
  short: string;
  image: string;
  imageAlt: string;
  icon: ServiceIcon;
  problem: (typeof booking.problems)[number];
};

// TODO (not shown on the page): the doctor must confirm this list before launch; remove anything he doesn't offer
export const services: Service[] = [
  {
    slug: "ear",
    title: "Ear Problems & Hearing Loss",
    short: "Ear pain, discharge, ringing in the ears, blocked ears and hearing loss in children and adults.",
    image: "/images/services/ear.webp",
    imageAlt: "Illustration of a woman cupping her ear, struggling to hear",
    icon: "Ear",
    problem: "Ear",
  },
  {
    slug: "sinus",
    title: "Sinus & Nasal Blockage",
    short: "Sinusitis, blocked nose, frequent colds, nasal polyps and a bent nasal septum.",
    image: "/images/services/sinus.webp",
    imageAlt: "Illustration of a man pressing the sides of his nose from sinus pressure",
    icon: "Wind",
    problem: "Nose",
  },
  {
    slug: "allergy",
    title: "Allergy Testing & Treatment",
    short: "Sneezing, runny nose, itchy eyes and dust or seasonal allergies. The cause is traced through testing, then treated.",
    image: "/images/services/allergy.webp",
    imageAlt: "Illustration of a woman sneezing into a tissue near flowers",
    icon: "Flower2",
    problem: "Allergy",
  },
  {
    slug: "throat",
    title: "Tonsils, Throat & Voice",
    short: "Sore throat, tonsillitis, adenoids in children, hoarse voice and swallowing problems.",
    image: "/images/services/throat.webp",
    imageAlt: "Illustration of a man holding his sore throat with a cup of warm tea",
    icon: "Mic",
    problem: "Throat",
  },
  {
    slug: "vertigo",
    title: "Vertigo & Dizziness",
    short: "Spinning sensation, imbalance and dizziness linked to the inner ear.",
    image: "/images/services/vertigo.webp",
    imageAlt: "Illustration of a woman feeling dizzy and steadying herself on a chair",
    icon: "RotateCw",
    problem: "Ear",
  },
  {
    slug: "snoring",
    title: "Snoring & Sleep Problems",
    short: "Loud snoring, mouth breathing and disturbed sleep caused by nose or throat blockage.",
    image: "/images/services/snoring.webp",
    imageAlt: "Illustration of a man snoring while his wife covers her ear",
    icon: "BedDouble",
    problem: "Nose",
  },
  {
    slug: "endoscopy",
    title: "Endoscopic ENT Check-ups",
    short: "A quick camera check of the nose and throat, done in the chamber, for a clear diagnosis.",
    image: "/images/services/endoscopy.webp",
    imageAlt: "Illustration of a calm patient having a nasal endoscopy check-up",
    icon: "ScanEye",
    problem: "Other",
  },
];

/** Rows shown before "See All" */
export const servicesVisible = 4;


/** White FAQ band. Answers are built from the data above so facts stay in sync; also the source of the FAQPage JSON-LD. */
export type FaqItem = { id: string; q: string; a: string };

const closedDays = chamber.schedule.filter((d) => d.open === null).map((d) => d.day);
const sameDayCutoff = formatTime(`${String(booking.sameDayCutoffHour).padStart(2, "0")}:00`);
const fullAddress = `${site.address.hospital}, ${site.address.street}, ${site.address.area}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

export const faq = {
  eyebrow: "Good to know",
  titleLead: "Questions patients",
  titleAccent: "ask",
  intro: "Can't find your answer? Message us on WhatsApp and we'll help.",
  whatsappMessage: "Hello, I have a question about an appointment.",
  items: [
    {
      id: "timings",
      q: "What are the consultation timings?",
      a: `${site.name} sees patients ${site.days}, ${site.hours}, at ${site.address.hospital}, ${site.address.area}, ${site.address.locality}.${
        closedDays.length ? ` The chamber is closed on ${closedDays.join(" and ")}s.` : ""
      }`,
    },
    {
      id: "fee",
      q: "What is the consultation fee?",
      a: `The consultation fee is ${site.fee}, ${chamber.feeNote.charAt(0).toLowerCase()}${chamber.feeNote.slice(1)}.`,
    },
    {
      id: "booking",
      q: "How do I book an appointment?",
      a: "Fill in the booking form at the top of this page and send it on WhatsApp, call us, or book online through Quickobook. Online booking has a small confirmation fee charged by the booking platform.",
    },
    {
      id: "same-day",
      q: "Can I book for the same day?",
      a: `Yes. For same-day online booking, please book before ${sameDayCutoff}. You can also call or message us on WhatsApp.`,
    },
    {
      id: "children",
      q: "Does the doctor see children?",
      a: "Yes. Dr. Das treats children, adults and senior citizens, including ear infections, tonsils, adenoids and blocked noses in children.",
    },
    {
      id: "bring",
      q: "What should I bring to my appointment?",
      a: "Please bring your old prescriptions, any test reports (hearing tests, X-ray or CT scans) and a list of the medicines you are taking now.",
    },
    {
      id: "location",
      q: "Where exactly is the chamber?",
      a: `At ${fullAddress}. Use the map above for directions.`,
    },
  ] as FaqItem[],
};
