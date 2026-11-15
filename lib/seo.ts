import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata, Viewport } from "next";
import { chamber, faq, site } from "@/data/site";
import { openingHoursSpec } from "@/lib/chamber-hours";
import { isTodo } from "@/lib/site-helpers";

/**
 * All SEO config in one place: page metadata, viewport and JSON-LD.
 * Values come from data/site.ts; TODO values are never emitted.
 *
 * Social share image: app/opengraph-image.jpg + app/twitter-image.jpg (1200×630, with .alt.txt).
 * Next.js adds those og:image / twitter:image tags automatically, so they are not repeated here.
 */

const title = `${site.name} | ${site.title} in ${site.city}`;

const description =
  "Dr. Biswajyoti Das is an ENT doctor in Silchar treating ear, nose, throat, sinus, allergy and hearing problems at Nightingale Hospital, Meherpur. Mon–Sat, 2:30–9 PM. Book on WhatsApp.";

const keywords = [
  "ENT doctor in Silchar",
  "ENT specialist Silchar",
  "allergy specialist Silchar",
  "ENT doctor Meherpur",
  "sinus doctor Silchar",
  "hearing loss treatment Silchar",
  "ear specialist Silchar",
  "throat specialist Silchar",
  "Nightingale Hospital Silchar",
  "Dr. Biswajyoti Das",
];

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  keywords,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  category: "health",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  // phone numbers are real links already; stop iOS from auto-linking other digits (fees, timings)
  formatDetection: { telephone: false, address: false, email: false },
};

// same image + alt the app/opengraph-image.jpg / twitter-image.jpg file convention serves
const shareAlt = readFileSync(join(process.cwd(), "app", "opengraph-image.alt.txt"), "utf8").trim();
const shareImage = (src: string) => ({ url: src, width: 1200, height: 630, type: "image/jpeg", alt: shareAlt });

/**
 * Metadata for a page other than home. A page that sets openGraph/twitter replaces the layout's
 * objects AND drops the file-convention share image, so both are set again here.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      url: path,
      title: full,
      description,
      images: [shareImage("/opengraph-image.jpg")],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [shareImage("/twitter-image.jpg")] },
  };
}

export const siteViewport: Viewport = {
  themeColor: "#13315C", // primary (navy), same as the manifest theme_color
  colorScheme: "light",
};

/* ---------------- JSON-LD (local SEO) ---------------- */

const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(typeof v === "string" && isTodo(v)))) as T;

const telephone = isTodo(site.phone) ? undefined : site.phone.replace(/\s/g, "");

const address = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.hospital}, ${site.address.street}, ${site.address.area}`,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

// generated from the chamber schedule (grouped days, closed days omitted)
const openingHoursSpecification = openingHoursSpec(chamber.schedule);

const ids = {
  physician: `${site.url}/#physician`,
  clinic: `${site.url}/#clinic`,
  website: `${site.url}/#website`,
  faq: `${site.url}/#faq`,
};

// same strings the FAQ section shows, so markup always matches visible content; TODO answers are skipped
const faqEntities = faq.items
  .filter((f) => !/TODO/i.test(f.q) && !/TODO/i.test(f.a))
  .map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }));

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      clean({
        "@type": "Physician",
        "@id": ids.physician,
        name: site.name,
        description,
        url: site.url,
        image: `${site.url}/opengraph-image.jpg`,
        logo: `${site.url}/icons/android-chrome-512x512.png`,
        medicalSpecialty: "Otolaryngologic",
        knowsAbout: ["Ear problems", "Hearing loss", "Sinusitis", "Allergy", "Tonsils", "Voice problems", "Vertigo", "Snoring"],
        telephone,
        priceRange: site.fee,
        currenciesAccepted: "INR",
        address,
        openingHoursSpecification,
        areaServed: { "@type": "City", name: "Silchar" },
        location: { "@id": ids.clinic },
        sameAs: [site.onlineBooking],
      }),
      clean({
        "@type": "MedicalClinic",
        "@id": ids.clinic,
        name: `${site.name}, ENT & Allergy Chamber (${site.address.hospital})`,
        url: site.url,
        image: `${site.url}/opengraph-image.jpg`,
        telephone,
        priceRange: site.fee,
        address,
        openingHoursSpecification,
        hasMap: site.mapLink,
        medicalSpecialty: "Otolaryngologic",
        employee: { "@id": ids.physician },
      }),
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: site.url,
        name: site.name,
        inLanguage: "en-IN",
        publisher: { "@id": ids.physician },
      },
    ],
  };
}

/** FAQPage: only on the home page, the one page that shows the FAQ (markup must match visible content) */
export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": ids.faq,
    inLanguage: "en-IN",
    about: { "@id": ids.physician },
    mainEntity: faqEntities,
  };
}

/** Serialize for <script type="application/ld+json">, escaping "<" as the Next.js JSON-LD guide recommends */
export const jsonLdString = (data: object = buildJsonLd()) => JSON.stringify(data).replace(/</g, "\\u003c");
