"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { formatTime, zonedNow, type ScheduleDay, type Weekday } from "@/lib/chamber-hours";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";

/* ── Title ────────────────────────────────────────────────── */

/** Two lines slide up (0.1s stagger); line 2 turns white → accent after it lands (CSS class toggle) */
export function ChamberTitle({
  id,
  line1,
  line2,
  className,
  as: Heading = "h2",
}: {
  id: string;
  line1: string;
  line2: string;
  className?: string;
  /** h1 on /chamber */
  as?: "h1" | "h2";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useReveal(ref);
  const line = (text: string, i: number, extra?: string) => (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={cn("block", extra)}
        initial={{ y: "100%", opacity: 0 }}
        animate={shown ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 0.8, ease, delay: i * 0.1 }}
      >
        {text}
      </motion.span>
    </span>
  );
  return (
    <Heading ref={ref} id={id} className={className}>
      {line(line1, 0)}{" "}
      {line(
        line2,
        1,
        cn("transition-colors duration-[400ms] motion-reduce:transition-none", shown ? "text-accent delay-[900ms]" : "text-white"),
      )}
    </Heading>
  );
}

/* ── Schedule ─────────────────────────────────────────────── */

/** Today's weekday in the chamber's time zone; null on the server and first client render */
function useToday(timeZone: string) {
  const [today, setToday] = useState<Weekday | null>(null);
  useEffect(() => {
    const tick = () => setToday(zonedNow(timeZone).day);
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [timeZone]);
  return today;
}

/** Weekly hours as a <dl>; rows fade in (0.05s stagger), dividers draw left → right, today in accent */
export function ScheduleList({ schedule, timeZone, className }: { schedule: ScheduleDay[]; timeZone: string; className?: string }) {
  const ref = useRef<HTMLDListElement>(null);
  const shown = useReveal(ref);
  const today = useToday(timeZone);
  return (
    <dl ref={ref} className={className}>
      {schedule.map((d, i) => {
        const isToday = d.day === today;
        const closed = !d.open || !d.close;
        return (
          <motion.div
            key={d.day}
            className={cn("relative flex justify-between gap-4 py-3 text-[15px]", isToday ? "font-medium text-accent" : "text-white/90")}
            initial={{ opacity: 0 }}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.5, ease, delay: i * 0.05 }}
          >
            {i > 0 && (
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/15"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: shown ? 1 : 0 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              />
            )}
            <dt>
              {d.day}
              {isToday && <span className="ml-2 text-[11px] tracking-[0.08em] uppercase">Today</span>}
            </dt>
            <dd className={cn("tabular-nums", closed && !isToday && "text-white/50")}>
              {closed ? "Closed" : `${formatTime(d.open!)} – ${formatTime(d.close!)}`}
            </dd>
          </motion.div>
        );
      })}
    </dl>
  );
}

/* ── Map card ─────────────────────────────────────────────── */

const LG = "(min-width: 1024px)";
const subscribeLg = (cb: () => void) => {
  const mq = window.matchMedia(LG);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsDesktop = () => useSyncExternalStore(subscribeLg, () => window.matchMedia(LG).matches, () => false);

/**
 * Rounded map card. Desktop (lg+): the iframe loads when the card is within 300px of the viewport.
 * Below lg: it loads only after a tap (saves mobile data). Card fades + rises 32px on reveal.
 */
export function MapCard({ src, title, placeName, className }: { src: string; title: string; placeName: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);
  const desktop = useIsDesktop();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (load || !desktop || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setLoad(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [desktop, load]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease }}
    >
      {load ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 saturate-[0.9]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
          <p className="font-heading text-lg font-medium text-primary">{placeName}</p>
          <button
            type="button"
            onClick={() => setLoad(true)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[13px] font-medium text-white transition duration-200 ease-out hover:bg-primary-dark"
          >
            {desktop ? "Load map" : "Tap to load map"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
