"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { ease, transition } from "@/lib/motion";
import { Highlighter } from "@/components/ui/highlighter";

const WORD_STAGGER = 0.08;
const WORD_START = 0.2;
const WORD_DURATION = 0.8;

/*
 * Load animations here run while React is still hydrating, so they must not depend on the main thread.
 * Motion hands `opacity` and a `transform` *string* to the browser (WAAPI, compositor thread); independent
 * `x` / `y` / `scale` values are driven by JS every frame and stutter during hydration. Keep it that way.
 *
 * Reduced motion: MotionConfig reducedMotion="user" only strips independent transforms, not a `transform`
 * string. `initial` must stay the same on server and client (useReducedMotion is already true on the first
 * client render, so changing `initial` would mismatch the prerendered HTML), so only the *transition*
 * changes: the transform snaps instantly and just the opacity fades.
 */
function withReducedTransform(base: Transition, reduce: boolean | null): Transition {
  return reduce ? { ...base, transform: { duration: 0, delay: 0 } } : base;
}

/** Background layer: fade + gentle zoom 1.03 → 1 over 1.2s (compositor-only) */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 -z-20 will-change-transform"
      initial={{ opacity: 0, transform: "scale(1.03)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={withReducedTransform(transition(1.2), reduce)}
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
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: `translateY(${y}px)` }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={withReducedTransform(transition(duration, delay), reduce)}
    >
      {children}
    </motion.div>
  );
}

/** H1: words slide up (stagger 0.08s); the last line's word gets a accent highlighter sweep afterwards */
export function HeroHeadline({ lines, highlight }: { lines: string[]; highlight: string }) {
  const words = lines.map((l) => l.split(" "));
  const total = words.flat().length;
  const highlightDelay = WORD_START + (total - 1) * WORD_STAGGER + WORD_DURATION * 0.6;
  const reduce = useReducedMotion();
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
                    initial={{ transform: "translateY(100%)", opacity: 0 }}
                    animate={{ transform: "translateY(0%)", opacity: 1 }}
                    transition={withReducedTransform({ duration: WORD_DURATION, ease, delay }, reduce)}
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
