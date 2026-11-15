"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { bookNow, bookingPageHref, isPlainClick } from "@/lib/scroll-to-booking";
import { cancelRouteProgress } from "@/components/ui/route-progress";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/use-reveal";

const LINE_STAGGER = 0.12;
const LINE_DURATION = 0.8;

/** One statement line: rise 40px + fade, staggered by index */
export function StatementLine({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: LINE_DURATION, ease, delay: index * LINE_STAGGER }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Accent word: white → accent (0.4s CSS transition) after its line (index) lands.
 * Plain class toggle, not a motion colour tween: motion writes inline styles React can't clean up,
 * which left the word white when reduced motion flipped after hydration.
 */
export function AccentWord({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useReveal(ref);
  return (
    <span
      ref={ref}
      className={cn("transition-colors duration-[400ms] motion-reduce:transition-none", inView ? "text-accent" : "text-white")}
      style={{ transitionDelay: `${index * LINE_STAGGER + LINE_DURATION}s`, transitionTimingFunction: `cubic-bezier(${ease.join(",")})` }}
    >
      {children}
    </span>
  );
}

/** Image pill: springs 0 → 1 after the last line (index) lands */
export function PillPop({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.span
      ref={ref}
      aria-hidden
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: shown ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: index * LINE_STAGGER + LINE_DURATION }}
    >
      {children}
    </motion.span>
  );
}

/** Fade up 24px on view */
export function FadeUp({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pill that scrolls to the booking form on this page (URL unchanged); next/link to /book where there is none */
export function BookScrollPill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={bookingPageHref()}
      onClick={(e) => {
        if (isPlainClick(e) && bookNow()) {
          e.preventDefault();
          cancelRouteProgress(); // scrolled to the form on this page: no page change
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

/** "15+" → { n: 15, prefix: "", suffix: "+" }; null when the value has no leading number */
function parseNumeric(value: string) {
  const m = value.match(/^(\D*?)(\d[\d,]*)(.*)$/);
  if (!m || /[a-z]/i.test(m[3])) return null;
  return { prefix: m[1], n: Number(m[2].replace(/,/g, "")), suffix: m[3], grouped: m[2].includes(",") };
}

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useReveal(ref);
  const reduce = useReducedMotion();
  const parsed = parseNumeric(value);
  const [shown, setShown] = useState(parsed && !reduce ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!parsed || reduce || !inView) return;
    const fmt = (v: number) => {
      const r = Math.round(v);
      return `${parsed.prefix}${parsed.grouped ? r.toLocaleString("en-IN") : r}${parsed.suffix}`;
    };
    const controls = animate(0, parsed.n, { duration: 1.6, ease, onUpdate: (v) => setShown(fmt(v)) });
    return () => controls.stop();
    // parsed is derived from value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <>
      <span ref={ref} aria-hidden>
        {reduce ? value : shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

/** Stats grid: stagger 0.1s, numeric values count up over 1.6s */
export function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="mt-24 grid divide-y divide-white/15 border-t border-white/15 pt-12 md:grid-cols-3 md:gap-6 md:divide-y-0">
      {stats.map((s, i) => (
        <StatItem key={s.label} stat={s} index={i} />
      ))}
    </dl>
  );
}

function StatItem({ stat, index }: { stat: { value: string; label: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      className="flex flex-col-reverse gap-2 py-6 first:pt-0 md:py-0"
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease, delay: index * 0.1 }}
    >
      <dt className="text-[13px] text-white/70">{stat.label}</dt>
      <dd className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-medium tracking-[-0.03em] text-accent">
        <StatValue value={stat.value} />
      </dd>
    </motion.div>
  );
}
