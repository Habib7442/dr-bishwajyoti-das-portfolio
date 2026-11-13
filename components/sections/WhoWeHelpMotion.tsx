"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { bookNow, type PrefillProblem } from "@/lib/scroll-to-booking";
import { useReveal } from "@/lib/use-reveal";
import { Highlighter } from "@/components/ui/highlighter";

/** h2 fades up; the lime highlighter sweeps under the accent word 0.5s later */
export function WhoTitle({ id, lead, accent, className }: { id: string; lead: string; accent: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.h2
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
    >
      {lead}{" "}
      <span className="relative z-0 inline-block">
        {accent}
        <Highlighter trigger="parent" delay={0.5} />
      </span>
    </motion.h2>
  );
}

/** Generic fade-up block on reveal (header eyebrow + intro) */
export function FadeUpBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Card grid: cards fade up 32px, staggered 0.12s */
export function CardsGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {children}
    </motion.div>
  );
}

export function CardItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.article
      className={className}
      variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
    >
      {children}
    </motion.article>
  );
}

/** Image layer inside a card: scales 1.08 → 1 as its card reveals (follows the CardsGrid variants) */
export function ImageSettle({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      variants={{ hidden: { scale: 1.08 }, show: { scale: 1, transition: { duration: 1, ease } } }}
    >
      {children}
    </motion.div>
  );
}

/** "Book for Children →": scrolls to the hero form with the matching chip selected; plain #home jump without JS */
export function BookForLink({ problem, className, label, children }: { problem: PrefillProblem; className?: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href="#home"
      aria-label={label}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        bookNow(problem);
      }}
    >
      {children}
    </a>
  );
}
