"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";

/** Fade + rise 32px when revealed (see lib/use-reveal.ts for the trigger + safety net) */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div ref={ref} className={className} variants={fadeUp} custom={delay} initial="hidden" animate={shown ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}
