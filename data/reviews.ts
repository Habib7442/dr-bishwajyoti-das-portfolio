/**
 * REAL REVIEWS ONLY.
 * - Copy each review word for word from a public review of Dr. Biswajyoti Das (Google, Justdial, Practo…).
 *   It may be trimmed with "…", but never reworded, "improved" or written from scratch.
 * - Use the patient's name exactly as it appears publicly.
 * - `headline` only if the original review has its own title.
 * - Never invent reviews, ratings or review counts. Leave things empty/null until verified.
 * - No Review / AggregateRating JSON-LD: Google doesn't allow self-serving review markup.
 */

export type Review = {
  name: string; // exactly as shown publicly (e.g. "Rahul D.")
  rating: 1 | 2 | 3 | 4 | 5;
  text: string; // word for word; may be trimmed with "…" but never reworded
  headline?: string; // ONLY if the review itself has a title
  tag?: "Ear" | "Nose" | "Throat" | "Allergy" | "General";
  source: "Google" | "Justdial" | "Practo" | "Other";
  sourceUrl?: string; // link to the original review or listing
  date?: string; // as shown, e.g. "March 2026"
};

export const reviews: Review[] = [
  // Paste real reviews here. Leave empty until you have them.
];

export const reviewSummary = {
  // ONLY fill these from the real listing; leave null until verified.
  rating: null as number | null, // e.g. 4.8
  count: null as number | null, // e.g. 126
  source: "Google",
  listingUrl: "", // the doctor's Google / Justdial listing URL
  writeReviewUrl: "", // Google "write a review" link (g.page/r/…/review)
};

/**
 * Which version of the Reviews band to show:
 * - "full": 2+ real reviews → carousel
 * - "fallback": fewer than 2, but a review/listing URL exists → "Your feedback matters"
 * - "hidden": fewer than 2 and no URLs → no section, and no "Reviews" nav link
 */
export function reviewsState(): "full" | "fallback" | "hidden" {
  if (reviews.length >= 2) return "full";
  if (reviewSummary.writeReviewUrl || reviewSummary.listingUrl) return "fallback";
  return "hidden";
}
