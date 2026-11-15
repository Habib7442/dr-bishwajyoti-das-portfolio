"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

/* ── Generic reveal group / item ──────────────────────────── */

type GroupTag = "div" | "dl";
const groupTags = { div: motion.div, dl: motion.dl };

/**
 * One reveal trigger for a block; children animate through "hidden" → "show" variants.
 * `fade` also fades the group itself (info bar).
 */
export function RevealGroup({
  as = "div",
  stagger = 0,
  fade = false,
  className,
  children,
  ...rest
}: {
  as?: GroupTag;
  stagger?: number;
  fade?: boolean;
  className?: string;
  children: React.ReactNode;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement & HTMLDListElement>(null);
  const shown = useReveal(ref);
  const M = groupTags[as];
  return (
    <M
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{
        hidden: { opacity: fade ? 0 : 1 },
        show: { opacity: 1, transition: { duration: 0.7, ease, staggerChildren: stagger } },
      }}
      {...rest}
    >
      {children}
    </M>
  );
}

type ItemTag = "div" | "article";
const itemTags = { div: motion.div, article: motion.article };

/** Fades up `y` px when its RevealGroup is revealed */
export function RevealItem({
  as = "div",
  y = 20,
  className,
  children,
  role,
  id,
}: {
  as?: ItemTag;
  y?: number;
  className?: string;
  children: React.ReactNode;
  role?: string;
  id?: string;
}) {
  const M = itemTags[as];
  return (
    <M
      id={id}
      className={className}
      role={role}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
    >
      {children}
    </M>
  );
}

/* ── Arch portrait ────────────────────────────────────────── */

const LG = "(min-width: 1024px)";
const subscribeLg = (cb: () => void) => {
  const mq = window.matchMedia(LG);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** true from the lg breakpoint up; false on the server (mobile-first) */
const useIsDesktop = () => useSyncExternalStore(subscribeLg, () => window.matchMedia(LG).matches, () => false);

/**
 * lg+: arch reveals from the bottom (clip-path) and the photo rises 24px inside it.
 * Below lg: the whole arch fades + rises 24px (no clip-path). Reduced motion: opacity only.
 * The trigger sits on the unclipped outer wrapper: a fully clipped element never counts as "in view".
 */
export function ArchReveal({ className, archClassName, children }: { className?: string; archClassName?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  // every variant sets opacity, y AND clipPath: the server renders the mobile variant, and after
  // hydration on desktop a variant that skipped opacity would leave the arch stuck at opacity 0
  const OPEN = "inset(0% 0% 0% 0%)";
  const arch: Variants = reduce
    ? { hidden: { opacity: 0, y: 0, clipPath: OPEN }, show: { opacity: 1, y: 0, clipPath: OPEN, transition: { duration: 1, ease } } }
    : desktop
      ? {
          hidden: { opacity: 1, y: 0, clipPath: "inset(100% 0% 0% 0%)" },
          show: { opacity: 1, y: 0, clipPath: OPEN, transition: { duration: 1, ease } },
        }
      : { hidden: { opacity: 0, y: 24, clipPath: OPEN }, show: { opacity: 1, y: 0, clipPath: OPEN, transition: { duration: 0.8, ease } } };
  const photo: Variants =
    desktop && !reduce
      ? { hidden: { y: 24 }, show: { y: 0, transition: { duration: 0.9, ease, delay: 0.35 } } }
      : { hidden: { y: 0 }, show: { y: 0 } };
  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={shown ? "show" : "hidden"}>
      <motion.div className={archClassName} variants={arch}>
        <motion.div className="absolute inset-0" variants={photo}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Statement ────────────────────────────────────────────── */

const WORD_STAGGER = 0.06;
const WORD_DURATION = 0.8;

const word: Variants = {
  hidden: { y: "100%", opacity: 0 },
  show: (i: number) => ({ y: 0, opacity: 1, transition: { duration: WORD_DURATION, ease, delay: i * WORD_STAGGER } }),
};

/** h2 (h1 on /about): words slide up (0.06s stagger); the accent highlighter sweeps under the accent word 0.3s after the last word lands */
export function StatementHeading({
  id,
  lead,
  accent,
  className,
  as = "h2",
}: {
  id: string;
  lead: string;
  accent: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useReveal(ref);
  const words = lead.split(" ");
  const highlightDelay = words.length * WORD_STAGGER + WORD_DURATION + 0.3;
  const slot = (content: React.ReactNode, i: number, inner?: string) => (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span className={cn("inline-block", inner)} variants={word} custom={i}>
        {content}
      </motion.span>
    </span>
  );
  return (
    <Heading ref={ref} id={id} className={className} initial="hidden" animate={shown ? "show" : "hidden"}>
      {words.map((w, i) => (
        <span key={i}>
          {slot(w, i)}{" "}
        </span>
      ))}
      {slot(
        <>
          {accent}
          <Highlighter trigger="parent" delay={highlightDelay} />
        </>,
        words.length,
        "relative isolate z-0 text-primary",
      )}
    </Heading>
  );
}
