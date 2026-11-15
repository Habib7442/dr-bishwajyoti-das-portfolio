"use client";

import { motion } from "motion/react";
import { ease, transition } from "@/lib/motion";
import { Highlighter } from "@/components/ui/highlighter";

const WORD_STAGGER = 0.08;
const WORD_START = 0.2;
const WORD_DURATION = 0.8;

/** Background layer: fade + scale 1.06 → 1 over 1.6s */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 -z-20"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition(1.6)}
    >
      {children}
    </motion.div>
  );
}

/** Generic fade-up with explicit delay (load sequence, not scroll) */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  duration = 0.7,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} animate={{ opacity: 1, y: 0 }} transition={transition(duration, delay)}>
      {children}
    </motion.div>
  );
}

/** H1: words slide up (stagger 0.08s); the last line's word gets a accent highlighter sweep afterwards */
export function HeroHeadline({ lines, highlight }: { lines: string[]; highlight: string }) {
  const words = lines.map((l) => l.split(" "));
  const total = words.flat().length;
  const highlightDelay = WORD_START + (total - 1) * WORD_STAGGER + WORD_DURATION * 0.6;
  let i = 0;

  return (
    <h1 className="font-heading text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.04em] text-primary">
      {words.map((line, li) => (
        <span key={li} className="block">
          {line.map((word, wi) => {
            const delay = WORD_START + i++ * WORD_STAGGER;
            const isHighlight = word === highlight;
            return (
              <span key={wi}>
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span
                    className={isHighlight ? "relative isolate z-0 inline-block" : "inline-block"}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: WORD_DURATION, ease, delay }}
                  >
                    {word}
                    {isHighlight && <Highlighter delay={highlightDelay} />}
                  </motion.span>
                </span>
                {wi < line.length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
