"use client";

import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

/* ── Reveal helpers ───────────────────────────────────────── */

/** Header block: fades up; a <Highlighter trigger="parent"> inside sweeps after it */
export function RevealHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Highlighted heading word. `onDark` (navy band): navy word on a full-height accent-light bar,
 * since a navy word over the navy band would be unreadable outside a 40% bar.
 */
export function AccentWord({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <span className={cn("relative isolate z-0 inline-block", onDark && "px-[0.08em] text-primary")}>
      {children}
      <Highlighter
        trigger="parent"
        delay={0.5}
        className={onDark ? "inset-x-0 top-[0.06em] bottom-[0.02em] h-auto bg-accent-light" : undefined}
      />
    </span>
  );
}

/** Card wrapper: fades up 24px as part of a staggered group */
export function CardReveal({ className, label, children }: { className?: string; label: string; children: React.ReactNode }) {
  return (
    <motion.article
      aria-label={label}
      className={className}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
    >
      {children}
    </motion.article>
  );
}

/* ── Read more ────────────────────────────────────────────── */

const CLAMP_LINES = 6;

/** Serif quote clamped to 6 lines; "Read more" (only when it overflows) animates the height open */
export function ReviewQuote({ text, className }: { text: string; className?: string }) {
  const id = useId();
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);
  const [heights, setHeights] = useState<{ clamped: number; full: number } | null>(null);

  // measure the clamped vs full height after layout (and on resize)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      const clamped = Math.round(lh * CLAMP_LINES);
      const full = el.scrollHeight;
      setHeights({ clamped, full });
      setOverflows(full > clamped + 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className={className}>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: !overflows || !heights ? "auto" : open ? heights.full : heights.clamped }}
        transition={{ duration: reduce ? 0 : 0.4, ease }}
      >
        {/* CSS clamp until measured (server render + first paint), then the wrapper height takes over */}
        <p ref={ref} id={id} className={cn("font-serif text-[17px] leading-[1.55] text-ink/85", !heights && "line-clamp-6")}>
          {text}
        </p>
      </motion.div>
      {overflows && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="mt-2 text-[13px] font-medium text-primary underline-offset-4 hover:underline"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/* ── Track + arrows ───────────────────────────────────────── */

type TrackState = {
  trackRef: React.RefObject<HTMLDivElement | null>;
  canPrev: boolean;
  canNext: boolean;
  overflows: boolean;
  scrollByCard: (dir: -1 | 1) => void;
  update: () => void;
};
const TrackContext = createContext<TrackState | null>(null);
const useTrack = () => {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error("Reviews track parts must be inside <ReviewsCarousel>");
  return ctx;
};

/** Shares the track's scroll state between the header arrows and the track */
export function ReviewsCarousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setOverflows(el.scrollWidth > el.clientWidth + 4);
  }, []);

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }, []);

  return <TrackContext.Provider value={{ trackRef, canPrev, canNext, overflows, scrollByCard, update }}>{children}</TrackContext.Provider>;
}

export const TRACK_ID = "reviews-track";

/** Horizontal scroll-snap track; cards stagger in on reveal; ←/→ on the focused track scroll by one card */
export function ReviewsTrack({ className, children }: { className?: string; children: React.ReactNode }) {
  const { trackRef, update, scrollByCard } = useTrack();
  const shown = useReveal(trackRef);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [trackRef, update]);

  return (
    <motion.div
      ref={trackRef}
      id={TRACK_ID}
      tabIndex={0}
      aria-label="Patient reviews, scrollable"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          scrollByCard(e.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  );
}

/** On the navy band: prev = white outline circle, next = filled accent circle; disabled at each end; hidden (space kept) when all cards fit */
export function ReviewsArrows({ className }: { className?: string }) {
  const { canPrev, canNext, overflows, scrollByCard } = useTrack();
  const base =
    "grid size-11 cursor-pointer place-items-center rounded-full transition duration-200 ease-out focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-5";
  return (
    <div className={cn("gap-3", !overflows && "invisible", className)} aria-hidden={!overflows || undefined}>
      <button
        type="button"
        aria-label="Previous review"
        aria-controls={TRACK_ID}
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        className={cn(base, "border border-white/50 text-white enabled:hover:bg-white/10")}
      >
        <ArrowLeft strokeWidth={1.5} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next review"
        aria-controls={TRACK_ID}
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        className={cn(base, "bg-accent text-primary enabled:hover:bg-accent-dark")}
      >
        <ArrowRight strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
