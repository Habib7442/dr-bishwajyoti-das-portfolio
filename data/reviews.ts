/**
 * ONLY add real reviews copied from the doctor's Google / Justdial listing, with permission.
 * Never invent reviews. While this array is empty, the Reviews section (and its nav link) stays hidden.
 */
export type Review = {
  name: string;
  tag: "Ear" | "Nose" | "Throat" | "Allergy";
  quote: string;
  stars: 1 | 2 | 3 | 4 | 5;
  source: "Google" | "Justdial";
};

export const reviews: Review[] = [];
