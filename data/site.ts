/**
 * ALL editable site content lives here.
 * Any value starting with "TODO" renders as a clearly visible placeholder on the site.
 * Swap image URLs for the doctor's real photos (put them in /public and use "/photo.jpg").
 */

import { formatTime } from "@/lib/chamber-hours";

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const site = {
  // Canonical origin for metadata, og:image, JSON-LD, sitemap and robots (server-side only).
  // 1. NEXT_PUBLIC_SITE_URL: set it in Vercel once the custom domain is connected (e.g. https://example.com)
  // 2. VERCEL_PROJECT_PRODUCTION_URL: Vercel's own production domain, set automatically on every Vercel build
  // 3. fallback for local builds: the current production address
  // (A wrong origin here breaks link previews: og:image pointed at a domain that doesn't exist.)
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://dr-bishwajyoti-das-portfolio.vercel.app"),

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
    hero: { src: "/images/hero-ear-cool.webp", alt: "" },
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

/** Section "Meet Your Doctor" band. Anything still starting with TODO is hidden on the page. */
export type AboutInfo = { label: string; value: string };
export type ApproachIcon = "Ear" | "MessagesSquare" | "HandHeart";

const languages = "TODO: confirm with the doctor — Bengali, English, Hindi?";

export const about = {
  eyebrow: "Meet your doctor",
  // headline, not a quote: no quotation marks, not attributed to the doctor
  statement: { lead: "Good treatment starts with", accent: "listening." },
  name: site.name,
  role: site.title,
  // shown on a base arch, no filters. A background-removed /images/doctor/portrait.png looks best: change this path when it arrives.
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

/** Primary "Visit the Chamber" band. `schedule` is also the source for the JSON-LD opening hours. */
export type ChamberDay = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string | null; // "HH:MM" 24h, Asia/Kolkata; null = closed
  close: string | null;
};

export const chamber = {
  eyebrow: "Chamber & timings",
  titleLine1: "Visit the",
  titleLine2: "Chamber", // accent
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

/** Soft "Who We Help" band. `problem` pre-selects the hero form's chip from the card link. */
export type WhoGroup = {
  key: "children" | "adults" | "seniors";
  title: string;
  text: string;
  conditions: string[];
  image: string;
  imageAlt: string;
  bg: "tint-1" | "tint-2" | "tint-3";
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
      bg: "tint-1",
      problem: "Ear",
    },
    {
      key: "adults",
      title: "Adults",
      text: "Sinus trouble, allergies, throat infections, voice problems and hearing changes from work or daily life.",
      conditions: ["Sinusitis", "Allergies", "Throat & voice"],
      image: "/images/who/adults.webp",
      imageAlt: "Smiling woman breathing easily through her nose",
      bg: "tint-2",
      problem: "Nose",
    },
    {
      key: "seniors",
      title: "Senior Citizens",
      text: "Hearing loss, ringing in the ears, dizziness and balance problems. Unhurried care with clear explanations.",
      conditions: ["Hearing loss", "Vertigo", "Tinnitus"],
      image: "/images/who/seniors.webp",
      imageAlt: "Smiling older man cupping his hand to his ear to listen",
      bg: "tint-3",
      problem: "Ear",
    },
  ] as WhoGroup[],
};


/** Primary intro band under the hero. Stats whose value starts with TODO are hidden. */
export type IntroLine = { text: string; indent: 0 | 1; asterisk?: boolean; accent?: boolean; pill?: string };
export type IntroStat = { value: string; label: string };

export const intro = {
  statementLines: [
    { text: "Expert care for your", indent: 0 },
    { text: "ear, nose & throat", indent: 1, asterisk: true },
    { text: "and every", indent: 0 },
    // accent word + small round image after it; file lives in /public (ear-icon fallback while missing)
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

/** Every link is its own page. "/reviews" is dropped while there are no reviews (see reviewsState()). */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/chamber" },
];

/** Standalone pages next to the one-page home. Copy only restates facts already on the site. */
export const pages = {
  book: {
    title: "Book an Appointment",
    eyebrow: "Appointments",
    heading: "Book an appointment",
    intro: "Choose your problem, a day and a time slot, then send the request on WhatsApp. You can also call or book online.",
    altHeading: "Prefer another way?",
    description:
      "Book an appointment with Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar, at Nightingale Hospital, Meherpur. Mon–Sat, 2:30–9 PM.",
  },
  services: {
    title: "ENT Services in Silchar", // → "ENT Services in Silchar | Dr. Biswajyoti Das"
    eyebrow: "What we treat",
    heading: "Our Services",
    description:
      "Treatment for ear problems, hearing loss, sinus, allergy, tonsils, throat and voice, vertigo and snoring by Dr. Biswajyoti Das, ENT & Allergy Specialist at Nightingale Hospital, Meherpur, Silchar.",
    filterLabel: "Filter services",
    // "Not sure?" card that fills the last row of the grid
    help: {
      eyebrow: "Need help choosing?",
      title: "Not sure what you need?",
      text: "Tell us your problem on WhatsApp and we'll guide you to the right appointment.",
      whatsappLabel: "Ask on WhatsApp",
      whatsappMessage: "Hello, I'm not sure which appointment I need. Can you help?",
      // pills that open WhatsApp with the text prefilled (hidden while the WhatsApp number is TODO)
      quickLabel: "Tap to ask",
      quickQuestions: ["I have ear pain or blocked ears", "My nose is always blocked", "My child snores at night", "I keep sneezing / allergy"],
      // illustrative WhatsApp-style chat (labelled "Example conversation" on the page; not a real chat)
      chat: {
        name: "Dr. Biswajyoti Das' Chamber",
        // TODO (not shown as TODO): confirm with the clinic that this is true before launch
        status: "Usually replies during chamber hours",
        messages: [
          { from: "patient", text: "Hi, my son snores a lot at night. Can I book a check-up?", time: "6:42 PM" },
          {
            from: "clinic",
            text: `Yes, of course. Please share a convenient day. Chamber is ${quickFactsShort.hours.replace(" · ", ", ")} at ${site.address.hospital}.`,
            time: "6:44 PM",
          },
          { from: "patient", text: "Tomorrow evening works", time: "6:45 PM", thumbsUp: true },
        ] as { from: "patient" | "clinic"; text: string; time: string; thumbsUp?: boolean }[],
        inputPlaceholder: "Type your problem…",
        caption: "Example conversation",
      },
    },
  },
  chamber: {
    title: "Chamber, Timings & Fee",
    description:
      "Visit Dr. Biswajyoti Das, ENT & Allergy Specialist, at Nightingale Hospital, Meherpur, Silchar. Mon–Sat, 2:30–9 PM. Consultation fee ₹500. Map and directions.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers about booking, timings, fees and visiting Dr. Biswajyoti Das, ENT & Allergy Specialist at Nightingale Hospital, Meherpur, Silchar.",
  },
  blog: {
    title: "ENT & Allergy Health Blog",
    eyebrow: "Health tips",
    heading: "Blog",
    intro: "Simple, plain-language guides on ear, nose, throat and allergy care are on the way.",
    description:
      "Plain-language guides on ear, nose, throat and allergy care from Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar. New articles coming soon.",
    comingSoon: "Coming soon",
    askTitle: "Have a question you'd like answered?",
    askText: "Send it on WhatsApp. Common questions help decide what we write about next.",
    askLabel: "Ask on WhatsApp",
    askMessage: "Hello, I have a question I'd like to see answered on the blog.",
  },
  notFound: {
    title: "Page not found",
    eyebrow: "Error 404",
    heading: "We couldn't find that page",
    text: "The page you're looking for doesn't exist or may have moved. Try one of these instead.",
    homeLabel: "Back to home",
    bookLabel: "Book an appointment",
    linksLabel: "Popular pages",
  },
  reviews: {
    title: "Patient Reviews",
    description: "Reviews from patients of Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar.",
  },
  about: {
    title: "About the Doctor",
    description:
      "Meet Dr. Biswajyoti Das, ENT & Allergy Specialist in Silchar, seeing children, adults and senior citizens at Nightingale Hospital, Meherpur.",
  },
};

/** Base "Our Services" accordion. `problem` pre-selects the hero form's chip from "Book for this →". */
export type ServiceIcon = "Ear" | "Wind" | "Flower2" | "Mic" | "RotateCw" | "BedDouble" | "ScanEye";
export type Service = {
  slug: string;
  title: string;
  /** label used in the footer "Treatments" column */
  shortTitle?: string;
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
    shortTitle: "Ear & Hearing",
    title: "Ear Problems & Hearing Loss",
    short: "Ear pain, discharge, ringing in the ears, blocked ears and hearing loss in children and adults.",
    image: "/images/services/ear.webp",
    imageAlt: "Illustration of a woman cupping her ear, struggling to hear",
    icon: "Ear",
    problem: "Ear",
  },
  {
    slug: "sinus",
    shortTitle: "Sinus",
    title: "Sinus & Nasal Blockage",
    short: "Sinusitis, blocked nose, frequent colds, nasal polyps and a bent nasal septum.",
    image: "/images/services/sinus.webp",
    imageAlt: "Illustration of a man pressing the sides of his nose from sinus pressure",
    icon: "Wind",
    problem: "Nose",
  },
  {
    slug: "allergy",
    shortTitle: "Allergy",
    title: "Allergy Testing & Treatment",
    short: "Sneezing, runny nose, itchy eyes and dust or seasonal allergies. The cause is traced through testing, then treated.",
    image: "/images/services/allergy.webp",
    imageAlt: "Illustration of a woman sneezing into a tissue near flowers",
    icon: "Flower2",
    problem: "Allergy",
  },
  {
    slug: "throat",
    shortTitle: "Throat & Voice",
    title: "Tonsils, Throat & Voice",
    short: "Sore throat, tonsillitis, adenoids in children, hoarse voice and swallowing problems.",
    image: "/images/services/throat.webp",
    imageAlt: "Illustration of a man holding his sore throat with a cup of warm tea",
    icon: "Mic",
    problem: "Throat",
  },
  {
    slug: "vertigo",
    shortTitle: "Vertigo",
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

/**
 * Upcoming blog articles, listed on /blog as "Coming soon" (not clickable yet).
 * TODO (not shown on the page): the doctor should review these topics; titles promise no results or cures.
 */
export type BlogTopic = "Ear" | "Nose" | "Throat" | "Allergy" | "Children";
export const upcomingPosts: { slug: string; topic: BlogTopic; title: string; excerpt: string }[] = [
  {
    slug: "blocked-ears",
    topic: "Ear",
    title: "Blocked ears: common causes and when to see an ENT doctor",
    excerpt: "Wax, colds, water and pressure changes can all make an ear feel blocked. What each one feels like, and when a check-up helps.",
  },
  {
    slug: "sinusitis-or-cold",
    topic: "Nose",
    title: "Sinusitis or a common cold? How to tell the difference",
    excerpt: "Both cause a blocked, runny nose. How long it lasts and where you feel the pressure are often the clues.",
  },
  {
    slug: "snoring-in-children",
    topic: "Children",
    title: "Snoring in children: why it's worth a check-up",
    excerpt: "Regular snoring or mouth breathing in children can be linked to tonsils or adenoids. What parents can look out for at night.",
  },
  {
    slug: "dust-allergy",
    topic: "Allergy",
    title: "Dust and seasonal allergies: understanding your triggers",
    excerpt: "Sneezing every morning or every season? How allergy triggers are found, and why knowing them makes treatment easier.",
  },
  {
    slug: "tonsillitis",
    topic: "Throat",
    title: "Tonsillitis in children and adults: what to expect at your visit",
    excerpt: "What the doctor checks during a sore-throat visit, and the questions it helps to have answers ready for.",
  },
  {
    slug: "hearing-loss-older-adults",
    topic: "Ear",
    title: "Hearing changes in older adults: signs families often miss",
    excerpt: "Turning the TV up or asking people to repeat themselves can be early signs. How a hearing check works.",
  },
];

/** Rows shown before "See All" */
export const servicesVisible = 4;

export const servicesIntro = "Treatment for common and long-standing ear, nose, throat and allergy problems, for all ages.";

/**
 * Filter chips on /services (?type=ear …). Each matches services by their booking `problem`;
 * "Procedures" covers problem "Other" (the in-chamber endoscopy check-up).
 */
export const serviceFilters = [
  { key: "all", label: "All", problem: null },
  { key: "ear", label: "Ear", problem: "Ear" },
  { key: "nose", label: "Nose", problem: "Nose" },
  { key: "throat", label: "Throat", problem: "Throat" },
  { key: "allergy", label: "Allergy", problem: "Allergy" },
  { key: "procedures", label: "Procedures", problem: "Other" },
] as const satisfies readonly { key: string; label: string; problem: (typeof booking.problems)[number] | null }[];
export type ServiceFilterKey = (typeof serviceFilters)[number]["key"];


/** White FAQ band. Answers are built from the data above so facts stay in sync; also the source of the FAQPage JSON-LD. */
export type FaqItem = { id: string; q: string; a: string };

const closedDays = chamber.schedule.filter((d) => d.open === null).map((d) => d.day);
const sameDayCutoff = formatTime(`${String(booking.sameDayCutoffHour).padStart(2, "0")}:00`);
export const fullAddress = `${site.address.hospital}, ${site.address.street}, ${site.address.area}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

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

/** Directions from the visitor's location (Google Maps, new tab) */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(chamber.mapsQuery)}`;

/** Accent CTA band + footer. Social links still starting with TODO are hidden (the whole "Follow" block if all are). */
export type SocialKey = "facebook" | "instagram" | "youtube" | "google";

export const footer = {
  ctaTitle: "Book your appointment today",
  ctaText: `${quickFacts.hours} · ${quickFacts.place}`,
  whatsappMessage: site.whatsappMessage,
  tagline: "ENT & Allergy Specialist in Silchar. Caring treatment for ear, nose, throat and allergy problems.",
  social: {
    facebook: "TODO",
    instagram: "TODO",
    youtube: "TODO",
    google: "TODO", // Google Business Profile link
  } as Record<SocialKey, string>,
  credit: { label: "Website by Locallify", href: "https://locallifyagency.com" },
  disclaimer: "Information on this website is for general awareness and is not a substitute for a medical consultation.",
  closedNote: closedDays.length ? `${closedDays.join(" & ")} closed` : "",
};

/** /privacy page. TODO (not shown on the page): review with the doctor before launch. */
export const privacy = {
  title: "Privacy Policy",
  lastUpdated: "14 November 2026", // change when the text below changes
  sections: [
    {
      heading: "What the booking form collects",
      body: [
        "The booking form on the home page asks for your name, phone number, the problem you want to see the doctor about, a preferred date and time, and an optional note.",
      ],
    },
    {
      heading: "How your details are used",
      body: [
        "Nothing you type into the form is stored on this website or sent to our server. When you tap “Book on WhatsApp”, WhatsApp opens with your details written into a message. The message is only sent if you choose to send it from WhatsApp.",
        "We use the details you send only to arrange your appointment.",
      ],
    },
    {
      heading: "Third-party services",
      body: [
        "This website links to or embeds services run by other companies: WhatsApp (messages), Google Maps (the map and directions) and Quickobook (online booking). When you use them, their own privacy policies apply.",
      ],
    },
    {
      heading: "Cookies and tracking",
      body: ["This website does not use analytics or tracking cookies."],
    },
  ],
  contactLead: "Questions about your information? Call",
};
