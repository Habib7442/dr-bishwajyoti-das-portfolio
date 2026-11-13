"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";
import { bookNow } from "@/lib/scroll-to-booking";
import { cn } from "@/lib/utils";

const VIEWPORT = { once: true, amount: 0.3 } as const;
const LINE_STAGGER = 0.12;
const LINE_DURATION = 0.8;

/** One statement line: rise 40px + fade, staggered by index */
export function StatementLine({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: LINE_DURATION, ease, delay: index * LINE_STAGGER }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Accent word: white → lime (0.4s CSS transition) after its line (index) lands.
 * Plain class toggle, not a motion colour tween: motion writes inline styles React can't clean up,
 * which left the word white when reduced motion flipped after hydration.
 */
export function AccentWord({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  return (
    <span
      ref={ref}
      className={cn("transition-colors duration-[400ms] motion-reduce:transition-none", inView ? "text-lime" : "text-white")}
      style={{ transitionDelay: `${index * LINE_STAGGER + LINE_DURATION}s`, transitionTimingFunction: `cubic-bezier(${ease.join(",")})` }}
    >
      {children}
    </span>
  );
}

/** Image pill: springs 0 → 1 after the last line (index) lands */
export function PillPop({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={VIEWPORT}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: index * LINE_STAGGER + LINE_DURATION }}
    >
      {children}
    </motion.span>
  );
}

/** Fade up 24px on view */
export function FadeUp({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Lime pill that scrolls to the hero form; plain #home jump without JS */
export function BookScrollPill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        bookNow();
      }}
      className={className}
    >
      {children}
    </a>
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
  const inView = useInView(ref, VIEWPORT);
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
        <motion.div
          key={s.label}
          className="flex flex-col-reverse gap-2 py-6 first:pt-0 md:py-0"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease, delay: i * 0.1 }}
        >
          <dt className="text-[13px] text-white/70">{s.label}</dt>
          <dd className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-medium tracking-[-0.03em] text-lime">
            <StatValue value={s.value} />
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}
