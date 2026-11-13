import { booking } from "@/data/site";

export type Problem = (typeof booking.problems)[number];
export type TimeSlot = (typeof booking.timeSlots)[number];

export type BookingForm = {
  name: string;
  phone: string; // 10 digits, no +91
  problem: Problem | "";
  date: string; // YYYY-MM-DD
  slot: TimeSlot | "";
  note: string;
};

export type BookingErrors = Partial<Record<keyof BookingForm, string>>;

export const emptyForm: BookingForm = { name: "", phone: "", problem: "", date: "", slot: "", note: "" };

export const PHONE_RE = /^[6-9]\d{9}$/;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Current date (YYYY-MM-DD) and hour in the chamber's time zone. Call only in the browser / at submit time. */
export function nowInChamberTz(now: Date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: booking.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { today: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

const weekday = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).getUTCDay();

/** "18 Nov 2026, Wed" */
export function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}, ${DAYS[weekday(isoDate)]}`;
}

export function validateField<K extends keyof BookingForm>(key: K, form: BookingForm, now = new Date()): string | undefined {
  switch (key) {
    case "name":
      return form.name.trim().length < 2 ? "Please enter your full name" : undefined;
    case "phone":
      if (!form.phone) return "Please enter your mobile number";
      return PHONE_RE.test(form.phone) ? undefined : "Enter a valid 10-digit mobile number";
    case "problem":
      return form.problem ? undefined : "Please choose what the problem is about";
    case "date": {
      if (!form.date) return "Please pick a date";
      const { today, hour } = nowInChamberTz(now);
      if (form.date < today) return "Date can't be in the past";
      if (booking.closedWeekdays.includes(weekday(form.date))) return "Chamber is closed on Sundays";
      if (form.date === today && hour >= booking.sameDayCutoffHour)
        return "Same-day booking closes at 9 AM, please pick tomorrow or later";
      return undefined;
    }
    case "slot":
      return form.slot ? undefined : "Please choose a time slot";
    case "note":
      return form.note.length > booking.noteMax ? `Note must be ${booking.noteMax} characters or fewer` : undefined;
  }
  return undefined;
}

export const FIELD_ORDER: (keyof BookingForm)[] = ["name", "phone", "problem", "date", "slot", "note"];

export function validateAll(form: BookingForm, now = new Date()): BookingErrors {
  const errors: BookingErrors = {};
  for (const k of FIELD_ORDER) {
    const e = validateField(k, form, now);
    if (e) errors[k] = e;
  }
  return errors;
}

export function buildMessage(form: BookingForm) {
  return [
    "Hello Doctor, I'd like to book an appointment.",
    `Name: ${form.name.trim()}`,
    `Phone: +91 ${form.phone}`,
    `Problem: ${form.problem}`,
    `Date: ${formatDate(form.date)}`,
    `Time: ${form.slot}`,
    `Note: ${form.note.trim() || "-"}`,
  ].join("\n");
}
