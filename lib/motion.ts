import type { Transition, Variants } from "motion/react";

/** House easing from DESIGN.md §9 */
export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } }),
};

export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** For a word wrapped in an overflow-hidden span */
export const wordReveal: Variants = {
  hidden: { y: "100%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease } },
};

export const transition = (duration: number, delay = 0): Transition => ({ duration, delay, ease });
