/**
 * Chamber opening-hours logic. Pure and dependency-free (no "@/" imports) so it can run in
 * the browser, on the server (JSON-LD) and in a plain Node check.
 * All "now" calculations use the chamber's time zone, never the visitor's.
 */

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type ScheduleDay = { day: Weekday; open: string | null; close: string | null };

export type ChamberStatus =
  | { kind: "open"; closes: string }
  | { kind: "later"; opens: string }
  | { kind: "closed"; nextDay: Weekday; opens: string };

const WEEK: Weekday[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "14:30" → "2:30 PM", "21:00" → "9:00 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Weekday + minutes since midnight in `timeZone` */
export function zonedNow(timeZone: string, now: Date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { day: parts.weekday as Weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function getChamberStatus(schedule: ScheduleDay[], timeZone: string, now: Date = new Date()): ChamberStatus {
  const { day, minutes } = zonedNow(timeZone, now);
  const byDay = new Map(schedule.map((d) => [d.day, d]));
  const today = byDay.get(day);

  if (today?.open && today.close) {
    if (minutes < toMinutes(today.open)) return { kind: "later", opens: formatTime(today.open) };
    if (minutes < toMinutes(today.close)) return { kind: "open", closes: formatTime(today.close) };
  }
  // closed now: find the next day with hours
  const start = WEEK.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const next = byDay.get(WEEK[(start + i) % 7]);
    if (next?.open) return { kind: "closed", nextDay: next.day, opens: formatTime(next.open) };
  }
  return { kind: "closed", nextDay: day, opens: "" };
}

/** schema.org OpeningHoursSpecification: days with identical hours grouped, closed days left out */
export function openingHoursSpec(schedule: ScheduleDay[]) {
  const groups = new Map<string, Weekday[]>();
  for (const d of schedule) {
    if (!d.open || !d.close) continue;
    const key = `${d.open}-${d.close}`;
    groups.set(key, [...(groups.get(key) ?? []), d.day]);
  }
  return [...groups].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}
