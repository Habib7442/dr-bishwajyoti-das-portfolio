"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ease, wordReveal } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";

/**
 * Lime CTA: title words slide up (stagger 0.06s), then the line + buttons fade up.
 * Reduced motion: MotionConfig drops the translate, opacity fades stay.
 */
export function CtaReveal({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  const words = title.split(" ");
  const after = 0.3 + words.length * 0.06;

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={shown ? "show" : "hidden"}>
      <motion.h2
        id={id}
        className="mx-auto max-w-[14ch] font-heading text-[clamp(2.5rem,6vw,4.75rem)] leading-none font-medium tracking-[-0.03em] text-rust"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        <span className="sr-only">{title}</span>
        <span aria-hidden>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
              <motion.span className="inline-block" variants={wordReveal}>
                {w}
              </motion.span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </span>
      </motion.h2>
      <motion.div
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: after } } }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
