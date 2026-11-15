/**
 * "What the doctor sees" posters (components/ScopeViewPoster.tsx).
 * The photos are real scope images: never filter or recolour them; they are only cropped to a circle
 * (and, where noted, turned to the standard viewing orientation).
 * No anatomy labels on the photos (client request).
 */
export type ScopeView = {
  slug: string;
  title: string;
  text: string;
  image: string;
  /** intrinsic size of the photo (for next/image) */
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** object-position for the circle crop, in % of the original photo */
  focus: { x: number; y: number };
  /**
   * Turn the photo to the standard view. The laryngoscopy photo was captured upside down
   * (cords meeting at the bottom), so it is shown turned 180° with the epiglottis at the top.
   */
  rotate?: 180;
  /** extra crop (1 = none) so the black scope edge never shows inside the circle */
  zoom?: number;
  /** service slugs (data/site.ts) whose detail page shows this poster in compact mode */
  services: string[];
  /**
   * "scope" (default) = endoscopy camera view. "scan" = imaging (CT etc.), "photo" = clinical photo.
   * Only scope views appear in the endoscopy page's "What the doctor sees" section; all show in the gallery.
   */
  kind?: "scope" | "scan" | "photo";
};

export const scopeViews: ScopeView[] = [
  {
    slug: "laryngoscopy",
    title: "Laryngoscopy",
    text: "A camera view of the voice box. It helps check hoarse voice, throat pain and swallowing problems.",
    image: "/images/practice/laryngoscopy-raw.jpg",
    width: 1057,
    height: 752,
    alt: "Laryngoscopy view of the voice box showing the vocal cords, airway and epiglottis",
    caption: "Laryngoscopy: a camera view of the voice box",
    focus: { x: 40, y: 50 },
    rotate: 180,
    zoom: 1.1,
    services: ["throat"],
  },
  {
    slug: "otoendoscopy",
    title: "Otoendoscopy",
    text: "A camera view inside the ear. It helps check ear pain, discharge, blocked ears and hearing problems.",
    image: "/images/practice/otoendoscopy-raw.jpg",
    width: 930,
    height: 748,
    alt: "Otoendoscopy view inside the ear showing the eardrum, ear bone and ear canal",
    caption: "Otoendoscopy: a camera view of the eardrum",
    focus: { x: 64, y: 50 },
    zoom: 1.1,
    services: ["ear"],
  },
  {
    slug: "normal-eardrum",
    title: "A Normal Eardrum",
    text: "An otoendoscopy view of a normal-looking eardrum. It helps to compare with ear problems such as an infection or a hole in the eardrum.",
    image: "/images/practice/normal-eardrum-raw.jpg",
    width: 960,
    height: 1280,
    alt: "Otoendoscopy view of a normal-looking eardrum at the end of the ear canal",
    caption: "A normal-looking eardrum, seen on otoendoscopy",
    // portrait photo of the scope monitor: square crop centred on the eardrum, screen edges left out
    focus: { x: 50, y: 50 },
    zoom: 1.1,
    services: ["ear"],
  },
  {
    slug: "nasal-endoscopy",
    title: "Nasal Endoscopy",
    text: "A camera view inside the nose. It helps check a blocked nose, sinus problems, nasal polyps and a bent nasal septum.",
    image: "/images/practice/nasal-endoscopy-raw.jpg",
    width: 1280,
    height: 1161,
    alt: "Diagnostic nasal endoscopy view of the inside of the nasal cavity",
    caption: "Diagnostic nasal endoscopy: a camera view inside the nose",
    // photo of the scope monitor: the circle is centred on the scope image, leaving out the screen text and dark edges
    focus: { x: 63, y: 50 },
    zoom: 1.08,
    services: ["sinus"],
  },
  {
    slug: "adenoids",
    title: "Adenoids in a Child",
    text: "A nasal endoscopy view in a child, showing enlarged adenoid tissue at the back of the nose. Enlarged adenoids can cause a blocked nose, mouth breathing and snoring.",
    // cropped from a phone screenshot to the scope circle only (no date, time or app screen on the site)
    image: "/images/practice/adenoids-raw.jpg",
    width: 544,
    height: 544,
    alt: "Diagnostic nasal endoscopy view in a child showing enlarged adenoid tissue at the back of the nose",
    caption: "Enlarged adenoid tissue in a child, seen on diagnostic nasal endoscopy",
    focus: { x: 50, y: 50 },
    zoom: 1.12,
    services: ["throat", "snoring"],
  },
  {
    slug: "faciomaxillary-fracture",
    title: "Facial Bone Fracture on CT",
    text: "A 3D CT scan of the face after an injury, showing a faciomaxillary fracture: a break in the bones of the face and jaw. The scan helps plan treatment.",
    // cropped from the front view of a printed CT report: no name, ID, dates or scan text are inside the crop
    image: "/images/practice/faciomaxillary-fracture-ct.jpg",
    width: 392,
    height: 392,
    alt: "3D CT scan of the facial bones seen from the front, showing a faciomaxillary fracture",
    caption: "Faciomaxillary fracture seen on a 3D CT scan",
    focus: { x: 50, y: 50 },
    services: [],
    kind: "scan",
  },
  {
    slug: "otitis-externa-perichondritis",
    title: "Otitis Externa with Perichondritis",
    text: "A red, swollen outer ear from an infection of the ear canal skin (diffuse otitis externa) that has spread to the ear cartilage (perichondritis). A painful, swollen ear like this should be checked early.",
    // cropped to the ear only from a patient photo (no face, beard or clothing in the circle)
    image: "/images/practice/otitis-externa-perichondritis.jpg",
    width: 680,
    height: 680,
    alt: "Side view of a patient's outer ear that is red and swollen from otitis externa with perichondritis",
    caption: "Diffuse otitis externa with perichondritis of the outer ear",
    focus: { x: 50, y: 50 },
    services: [],
    kind: "photo",
  },
  {
    slug: "oral-cavity-tumor",
    title: "Oral Cavity Tumor",
    text: "An examination view of the mouth showing a tumor (an abnormal growth) inside the oral cavity. A lump, sore or patch in the mouth that does not heal should be checked by a doctor.",
    // cropped to the mouth only from a patient photo (no nose or eyes in the circle)
    image: "/images/practice/oral-cavity-tumor.jpg",
    width: 700,
    height: 700,
    alt: "Examination view of an open mouth, with the tongue held down, showing a tumor inside the oral cavity",
    caption: "A tumor in the oral cavity, seen on examination",
    focus: { x: 50, y: 50 },
    services: [],
    kind: "photo",
  },
];

/** camera (endoscopy) views only, for the endoscopy service page */
export const cameraViews = scopeViews.filter((v) => (v.kind ?? "scope") === "scope");

export const scopeViewsFor =(serviceSlug: string) => scopeViews.filter((v) => v.services.includes(serviceSlug));
