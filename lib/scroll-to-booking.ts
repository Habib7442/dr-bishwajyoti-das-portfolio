import type { booking } from "@/data/site";

export type PrefillProblem = (typeof booking.problems)[number];

/** Window event the BookingCard listens for to pre-select a problem chip */
export const PREFILL_EVENT = "booking:prefill";
export type PrefillDetail = { problem: PrefillProblem };

/** Query param /book reads to pre-select a problem chip (e.g. /book?problem=Nose) */
export const PROBLEM_PARAM = "problem";

/** The /book page, optionally with a problem pre-selected */
export const bookingPageHref = (problem?: PrefillProblem) =>
  problem ? `/book?${PROBLEM_PARAM}=${encodeURIComponent(problem)}` : "/book";

/**
 * Scroll to the booking card on this page and put the cursor in the name field (client only).
 * With `problem`, the matching chip is selected first (e.g. "Book for Children →" → Ear).
 * Returns false when this page has no booking card (/services, /about): the caller's
 * next/link then navigates to /book?problem=… instead.
 */
export function bookNow(problem?: PrefillProblem): boolean {
  if (!document.getElementById("bk-name")) return false;
  if (problem) window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { problem } }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = document.getElementById("home") ?? document.getElementById("book-form");
  target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  document.getElementById("bk-name")?.focus({ preventScroll: true });
  return true;
}
