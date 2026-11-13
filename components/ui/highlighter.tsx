"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Lime highlighter stroke behind a word (hero "Throat.", about "listening.").
 * Place inside a `relative z-0 inline-block` wrapper around the word.
 * trigger "load" plays on mount; "parent" follows the parent motion element's "hidden" → "show" variants
 * (the bar starts at scaleX 0 = zero area, so it can't detect being in view itself).
 */
export function Highlighter({ delay = 0, trigger = "load" }: { delay?: number; trigger?: "load" | "parent" }) {
  const transition = { duration: 0.5, ease, delay };
  const play =
    trigger === "load"
      ? { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition }
      : { variants: { hidden: { scaleX: 0 }, show: { scaleX: 1, transition } } };
  return (
    <motion.span
      aria-hidden
      className="absolute inset-x-[-0.06em] bottom-[0.08em] -z-10 h-[40%] origin-left -skew-x-2 rounded-[2px] bg-lime"
      {...play}
    />
  );
}
