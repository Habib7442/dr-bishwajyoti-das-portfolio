"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, MessageCircle } from "lucide-react";
import { booking, site } from "@/data/site";
import {
  FIELD_ORDER,
  buildMessage,
  emptyForm,
  nowInChamberTz,
  validateAll,
  validateField,
  type BookingErrors,
  type BookingForm,
  type Problem,
} from "@/lib/booking";
import { isTodo, telHref, whatsappUrl } from "@/lib/site-helpers";
import { cn } from "@/lib/utils";

const inputBase =
  "h-11 w-full rounded-2xl border border-rust/15 bg-white/85 px-4 text-base text-ink placeholder:text-ink/45 transition-colors focus-visible:border-rust focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none aria-invalid:border-rust";
const labelBase = "mb-1.5 block text-xs font-medium text-rust";

const noopSubscribe = () => () => {};

/** below md: short time-slot labels in the select */
const PHONE_MQ = "(max-width: 767.98px)";
const subscribePhone = (cb: () => void) => {
  const mq = window.matchMedia(PHONE_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const fieldId = (k: keyof BookingForm) => `bk-${k}`;
const errorId = (k: keyof BookingForm) => `bk-${k}-error`;

export function BookingCard() {
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [touched, setTouched] = useState<Partial<Record<keyof BookingForm, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [done, setDone] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const waReady = whatsappUrl("") !== null;
  const isPhone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_MQ).matches, () => false);

  // "today" is read only on the client: undefined during prerender (cacheComponents), real value after hydration
  const minDate = useSyncExternalStore(noopSubscribe, () => nowInChamberTz().today, () => undefined);

  useEffect(() => {
    if (!waReady) console.warn("[BookingCard] site.whatsapp is still TODO: booking submit is disabled.");
  }, [waReady]);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const show = (k: keyof BookingForm) => (attempted || touched[k] ? errors[k] : undefined);

  function update<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (attempted || touched[key] || key === "date" || key === "problem") {
      setErrors((e) => ({ ...e, [key]: validateField(key, next) }));
      if (key === "date" || key === "problem") setTouched((t) => ({ ...t, [key]: true }));
    }
  }

  function blur(key: keyof BookingForm) {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateField(key, form) }));
  }

  function focusField(k: keyof BookingForm) {
    if (k === "problem") {
      const idx = Math.max(0, booking.problems.indexOf(form.problem as Problem));
      chipRefs.current[idx]?.focus();
    } else {
      document.getElementById(fieldId(k))?.focus();
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!waReady) return;
    setAttempted(true);
    const all = validateAll(form);
    setErrors(all);
    const first = FIELD_ORDER.find((k) => all[k]);
    if (first) return focusField(first);

    const url = whatsappUrl(buildMessage(form));
    if (url) window.open(url, "_blank", "noopener");
    setDone(true);
  }

  function reset() {
    setForm(emptyForm);
    setTouched({});
    setErrors({});
    setAttempted(false);
    setDone(false);
    setNoteOpen(false);
    requestAnimationFrame(() => document.getElementById(fieldId("name"))?.focus());
  }

  function onChipKey(e: React.KeyboardEvent, idx: number) {
    const n = booking.problems.length;
    const map: Record<string, number> = { ArrowRight: idx + 1, ArrowDown: idx + 1, ArrowLeft: idx - 1, ArrowUp: idx - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    update("problem", booking.problems[next]);
    chipRefs.current[next]?.focus();
  }

  // plain render helper (not a component) so the live region keeps its DOM node between renders
  const errorText = (k: keyof BookingForm) => (
    <p id={errorId(k)} className="mt-1.5 min-h-0 text-xs text-rust empty:hidden" aria-live="polite">
      {show(k) ?? ""}
    </p>
  );

  const a11y = (k: keyof BookingForm) => ({
    id: fieldId(k),
    "aria-invalid": show(k) ? true : undefined,
    "aria-describedby": show(k) ? errorId(k) : undefined,
    onBlur: () => blur(k),
  });

  const selectedIdx = booking.problems.indexOf(form.problem as Problem);

  return (
    <div className="w-full max-w-[440px] rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl md:p-6 lg:p-7">
      {done ? (
        <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
          <span className="grid size-16 place-items-center rounded-full bg-lime text-rust">
            <Check className="size-7" strokeWidth={2} aria-hidden />
          </span>
          <h2 ref={successRef} tabIndex={-1} className="mt-6 font-heading text-[28px] leading-tight font-medium tracking-[-0.02em] text-rust outline-none">
            Almost done!
          </h2>
          <p className="mt-2 max-w-[28ch] text-sm text-ink/80">Send the message on WhatsApp to confirm.</p>
          <button type="button" onClick={reset} className="mt-6 min-h-11 px-2 text-sm font-medium text-rust underline decoration-rust/40 underline-offset-4 hover:decoration-rust">
            Book another
          </button>
        </div>
      ) : (
        <>
          <span className="inline-flex h-7 items-center rounded-full bg-lime px-3 text-[11px] font-medium tracking-[0.04em] text-rust uppercase">
            Book Appointment
          </span>
          <h2 className="mt-3 font-heading text-2xl leading-tight font-medium tracking-[-0.02em] text-rust">Get an appointment</h2>

          <form noValidate onSubmit={onSubmit} className="mt-4 flex flex-col gap-3.5">
            <div className="grid gap-3.5 lg:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor={fieldId("name")} className={labelBase}>
                Full name
              </label>
              <input
                {...a11y("name")}
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputBase}
              />
              {errorText("name")}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor={fieldId("phone")} className={labelBase}>
                Phone number
              </label>
              <div className="relative">
                <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-ink/60">
                  +91
                </span>
                <input
                  {...a11y("phone")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={10}
                  placeholder="98XXXXXXXX"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={cn(inputBase, "pl-14")}
                />
              </div>
              {errorText("phone")}
            </div>

            </div>

            {/* Problem chips */}
            <div>
              <span id="bk-problem-label" className={labelBase}>
                Problem
              </span>
              <div
                role="radiogroup"
                aria-labelledby="bk-problem-label"
                aria-required="true"
                aria-invalid={show("problem") ? true : undefined}
                aria-describedby={show("problem") ? errorId("problem") : undefined}
                className="flex flex-wrap gap-1.5"
              >
                {booking.problems.map((p, idx) => {
                  const checked = form.problem === p;
                  return (
                    <button
                      key={p}
                      ref={(el) => {
                        chipRefs.current[idx] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      tabIndex={checked || (selectedIdx === -1 && idx === 0) ? 0 : -1}
                      onClick={() => update("problem", p)}
                      onKeyDown={(e) => onChipKey(e, idx)}
                      className={cn(
                        // phones: 32px chips, px-2 so all 5 fit on one line at 375 (px-3 needed 313px of 285px);
                        // the ::after hit area adds 8px above and below for a 48px touch target
                        "relative h-8 rounded-full px-2 text-[12px] font-medium transition-colors after:absolute after:inset-x-0 after:-inset-y-2 md:h-11 md:px-3.5 md:text-[13px] md:after:hidden focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-rust",
                        checked ? "bg-rust text-white" : "border border-rust/20 bg-white/85 text-rust hover:border-rust/50",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              {errorText("problem")}
            </div>

            {/* Date + time */}
            <div className="grid grid-cols-2 gap-3 md:gap-3.5">
              <div>
                <label htmlFor={fieldId("date")} className={labelBase}>
                  Preferred date
                </label>
                <input
                  {...a11y("date")}
                  type="date"
                  required
                  min={minDate}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={cn(inputBase, "appearance-none max-md:px-3 max-md:text-[14px] max-md:[&::-webkit-calendar-picker-indicator]:size-[18px] max-md:[&::-webkit-calendar-picker-indicator]:m-0 max-md:[&::-webkit-calendar-picker-indicator]:p-0 md:[&::-webkit-calendar-picker-indicator]:ml-1 [&::-webkit-date-and-time-value]:text-left")}
                />
                {errorText("date")}
              </div>
              <div>
                <label htmlFor={fieldId("slot")} className={labelBase}>
                  Preferred time
                </label>
                <div className="relative">
                  <select
                    {...a11y("slot")}
                    required
                    value={form.slot}
                    onChange={(e) => update("slot", e.target.value as BookingForm["slot"])}
                    className={cn(inputBase, "appearance-none pr-10 max-md:pl-3 max-md:text-[14px]", !form.slot && "text-ink/45")}
                  >
                    <option value="" disabled>
                      Pick a slot
                    </option>
                    {booking.timeSlots.map((s, idx) => (
                      <option key={s} value={s} className="text-ink">
                        {isPhone ? booking.timeSlotsShort[idx] : s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-rust" strokeWidth={1.5} />
                </div>
                {errorText("slot")}
              </div>
            </div>

            {/* Note (collapsed behind a text button) */}
            {noteOpen ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={fieldId("note")} className={labelBase}>
                    Note <span className="font-normal text-ink/60">(optional)</span>
                  </label>
                  <span className="text-xs text-ink/60" aria-hidden>
                    {form.note.length}/{booking.noteMax}
                  </span>
                </div>
                <textarea
                  {...a11y("note")}
                  rows={2}
                  maxLength={booking.noteMax}
                  placeholder="Anything the doctor should know"
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  className={cn(inputBase, "h-auto resize-none py-2.5")}
                />
                {errorText("note")}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNoteOpen(true);
                  requestAnimationFrame(() => document.getElementById(fieldId("note"))?.focus());
                }}
                aria-expanded={false}
                className="-my-1 inline-flex min-h-8 items-center self-start text-[13px] font-medium text-rust underline-offset-4 hover:underline"
              >
                + Add a note
              </button>
            )}

            <span title={waReady ? undefined : "WhatsApp number not set"} className="block">
              <button
                type="submit"
                disabled={!waReady}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rust text-sm font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-rust-dark focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-rust disabled:cursor-not-allowed disabled:bg-rust/40 disabled:text-white/90 disabled:hover:translate-y-0 disabled:hover:bg-rust/40 motion-reduce:hover:translate-y-0"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden />
                Book on WhatsApp
              </button>
            </span>
            {!waReady && (
              <p className="text-center text-xs text-ink/70">
                <span className="todo">TODO: set site.whatsapp in data/site.ts</span>
              </p>
            )}
          </form>

          <p className="mt-3 text-center text-xs text-ink/70">
            Prefer to call?{" "}
            {telHref ? (
              <a href={telHref} className="font-semibold text-rust underline-offset-4 hover:underline">
                {site.phone}
              </a>
            ) : (
              <strong className={cn("font-semibold text-rust", isTodo(site.phone) && "todo")}>{site.phone}</strong>
            )}{" "}
            · or{" "}
            <a href={site.onlineBooking} target="_blank" rel="noopener noreferrer" className="font-medium text-rust underline underline-offset-4">
              book online
            </a>
          </p>
        </>
      )}
    </div>
  );
}
