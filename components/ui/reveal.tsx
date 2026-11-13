"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

/** Fade + rise 32px when 20% visible, once (DESIGN.md §9) */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {children}
    </motion.div>
  );
}
