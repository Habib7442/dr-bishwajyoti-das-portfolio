import type { booking } from "@/data/site";

export type PrefillProblem = (typeof booking.problems)[number];

/** Window event the hero BookingCard listens for to pre-select a problem chip */
export const PREFILL_EVENT = "booking:prefill";
export type PrefillDetail = { problem: PrefillProblem };

/**
 * Scroll to the hero booking card and put the cursor in the name field (client only).
 * With `problem`, the matching chip is selected first (e.g. "Book for Children →" → Ear).
 */
export function bookNow(problem?: PrefillProblem) {
  if (problem) window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { problem } }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("home")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  document.getElementById("bk-name")?.focus({ preventScroll: true });
}
