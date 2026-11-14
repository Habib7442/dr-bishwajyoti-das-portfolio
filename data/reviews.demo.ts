import type { Review } from "./reviews";

/**
 * DEMO REVIEWS — NOT REAL PATIENT REVIEWS.
 * Used only to preview the Reviews layout during `npm run dev` with NEXT_PUBLIC_DEMO_REVIEWS=1
 * (see displayReviews() in data/reviews.ts). Production builds never include or render these.
 * Never copy them into `reviews`, and never present them as real.
 */
export const demoReviews: Review[] = [
  {
    name: "Demo Patient A",
    rating: 5,
    tag: "Ear",
    text: "Demo text. Visited for a blocked ear and some discomfort. The doctor examined both ears carefully, explained what he found and what to do next.",
    source: "Other",
    date: "Demo",
  },
  {
    name: "Demo Patient B",
    rating: 5,
    tag: "Nose",
    headline: "Demo headline",
    text: "Demo text. I had a blocked nose for a long time and was worried about it. The doctor listened to the whole history first, checked my nose properly and explained the options in simple words. He told me which medicines to take, how long to take them and what to watch out for, and asked me to come back for a follow-up visit. The chamber was easy to find and the waiting time was reasonable for an evening appointment. This longer review is here to show the Read more button.",
    source: "Other",
    date: "Demo",
  },
  {
    name: "Demo Patient C",
    rating: 4,
    tag: "Throat",
    text: "Demo text. Took my father for a hoarse voice. The check-up was unhurried and everything was explained clearly to both of us.",
    source: "Other",
    date: "Demo",
  },
  {
    name: "Demo Patient D",
    rating: 5,
    tag: "Allergy",
    text: "Demo text. Came in for sneezing and a runny nose every morning. Got clear advice on what might be triggering it and a plan to follow.",
    source: "Other",
    date: "Demo",
  },
  {
    name: "Demo Patient E",
    rating: 5,
    tag: "General",
    text: "Demo text. Booked on WhatsApp the same day. Polite staff and a calm, patient doctor.",
    source: "Other",
    date: "Demo",
  },
];
