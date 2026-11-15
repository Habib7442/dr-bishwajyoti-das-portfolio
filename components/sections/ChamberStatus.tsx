"use client";

import { useEffect, useState } from "react";
import { getChamberStatus, type ChamberStatus as Status, type ScheduleDay } from "@/lib/chamber-hours";
import { cn } from "@/lib/utils";

const label = (s: Status) =>
  s.kind === "open"
    ? `Open now · until ${s.closes}`
    : s.kind === "later"
      ? `Opens today at ${s.opens}`
      : `Closed now · opens ${s.nextDay} at ${s.opens}`;

/**
 * Live open/closed pill in the chamber's time zone (never the visitor's).
 * Server + first client render show a neutral placeholder (no hydration mismatch); filled on mount, refreshed every 60s.
 */
export function ChamberStatus({ schedule, timeZone, className }: { schedule: ScheduleDay[]; timeZone: string; className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getChamberStatus(schedule, timeZone));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [schedule, timeZone]);

  const open = status?.kind === "open";
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors",
        open ? "bg-accent text-primary" : "bg-white/10 text-white",
        className,
      )}
    >
      {open && (
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
          <span className="relative size-2 rounded-full bg-primary" />
        </span>
      )}
      {status ? label(status) : "Checking today's hours…"}
    </p>
  );
}
