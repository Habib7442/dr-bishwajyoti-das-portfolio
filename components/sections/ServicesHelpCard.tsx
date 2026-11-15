"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Ear, SendHorizontal, ThumbsUp } from "lucide-react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { WhatsApp } from "@/components/icons/WhatsApp";

export type ChatMessage = { from: "patient" | "clinic"; text: string; time: string; thumbsUp?: boolean };

export type ServicesHelp = {
  eyebrow: string;
  title: string;
  text: string;
  whatsappLabel: string;
  /** WhatsApp chat link, or the online-booking page while the number is TODO */
  whatsappHref: string;
  quickLabel: string;
  /** "Tap to ask" pills: WhatsApp links with the question prefilled (empty while the number is TODO) */
  quick: { label: string; href: string }[];
  /** tel: link + visible number, or null while the phone is TODO */
  call: { href: string; label: string } | null;
  chat: { name: string; status: string; messages: ChatMessage[]; inputPlaceholder: string; caption: string };
};

const pill = "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[13px] font-medium transition-colors";
const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

const STAGGER = 0.35; // s between bubbles
const TYPING = 0.6; // s of "typing…" before the clinic's reply

/**
 * Navy "Not sure what you need?" card at the end of the /services grid.
 * `wide` (the card spans 2+ columns at lg): text left, example chat right. Otherwise everything stacks.
 */
export function ServicesHelpCard({ help, wide }: { help: ServicesHelp; wide: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-10", wide && "lg:grid-cols-2 lg:items-center")}>
      <div>
        <p className="text-[11px] font-medium tracking-[0.08em] text-accent uppercase">{help.eyebrow}</p>
        <h2
          id="services-help-title"
          className="mt-3 font-heading text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.02em] text-white"
        >
          {help.title}
        </h2>
        <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.65] text-white/75">{help.text}</p>

        {help.quick.length > 0 && (
          <div className="mt-7">
            <p id="services-help-quick" className="text-[11px] tracking-[0.08em] text-white/50 uppercase">
              {help.quickLabel}
            </p>
            <ul aria-labelledby="services-help-quick" className="mt-3 flex flex-wrap gap-2">
              {help.quick.map((q) => (
                <li key={q.label}>
                  <a
                    href={q.href}
                    {...newTab}
                    aria-label={`${help.whatsappLabel}: ${q.label}`}
                    // min-h, not h: a long question can wrap on narrow phones and the pill grows with it
                    className="inline-flex min-h-10 items-center rounded-full border border-white/25 px-4 py-2 text-[13px] leading-snug text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-accent"
                  >
                    {q.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={help.whatsappHref} {...newTab} className={cn(pill, "bg-accent text-primary hover:bg-accent-dark focus-visible:outline-accent [&_svg]:size-4")}>
            <WhatsApp aria-hidden />
            {help.whatsappLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {help.call && (
            <a href={help.call.href} className={cn(pill, "border border-white/30 text-white hover:bg-white/10 focus-visible:outline-accent")}>
              {help.call.label}
            </a>
          )}
        </div>
      </div>

      {/* example chat: decorative, so hidden below sm (too long on small phones) */}
      <div className={cn("hidden sm:block", wide ? "lg:ml-auto" : "")}>
        <ChatPreview chat={help.chat} inputHref={help.whatsappHref} />
      </div>
    </div>
  );
}

/** Code-built WhatsApp-style chat. Bubbles appear one by one on first view; reduced motion: all shown, no typing dots. */
function ChatPreview({ chat, inputHref }: { chat: ServicesHelp["chat"]; inputHref: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // the typing dots show only between the first bubble and the clinic's reply
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const on = window.setTimeout(() => setTyping(true), STAGGER * 1000);
    const off = window.setTimeout(() => setTyping(false), (STAGGER + TYPING) * 1000);
    return () => {
      window.clearTimeout(on);
      window.clearTimeout(off);
    };
  }, [inView, reduce]);

  // bubble i appears at: 0, then after the typing pause, then one stagger later
  const delays = chat.messages.map((_, i) => (i === 0 ? 0 : STAGGER + TYPING + (i - 1) * STAGGER));
  const shown = inView || reduce;

  return (
    <div ref={ref} className="w-full max-w-[360px]">
      <div className="rounded-[28px] border border-white/15 bg-white/8 p-5">
        {/* everything except the input-bar link is decoration */}
        <div aria-hidden>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-dark text-white">
              <Ear className="size-5" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              {/* wraps rather than truncating: the card is only one column wide on tablets */}
              <p className="text-sm leading-snug font-semibold text-white">{chat.name}</p>
              <p className="text-xs text-white/60">{chat.status}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {chat.messages.map((m, i) => (
              <div key={m.time + i} className="contents">
                {/* typing dots sit where the clinic's reply will appear */}
                {m.from === "clinic" && (
                  <AnimatePresence>
                    {typing && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.25, ease }}
                        className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3"
                      >
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="size-1.5 animate-pulse rounded-full bg-ink/40" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease, delay: reduce ? 0 : delays[i] }}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-[1.45]",
                    m.from === "patient" ? "self-end rounded-br-md bg-accent text-primary" : "self-start rounded-bl-md bg-white text-ink",
                    // hidden (not just transparent) while the typing dots hold its place
                    m.from === "clinic" && typing && "hidden",
                  )}
                >
                  <span>
                    {m.text}
                    {m.thumbsUp && <ThumbsUp className="ml-1 inline size-3.5 -translate-y-px" strokeWidth={2} />}
                  </span>
                  <span className="mt-1 block text-right text-[10px] leading-none opacity-60">{m.time}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={inputHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message on WhatsApp"
          className="mt-4 flex h-11 items-center justify-between gap-3 rounded-full bg-white/10 pr-1.5 pl-4 transition-colors hover:bg-white/15 focus-visible:outline-accent"
        >
          <span className="truncate text-sm text-white/50">{chat.inputPlaceholder}</span>
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-primary">
            <SendHorizontal className="size-4" strokeWidth={2} />
          </span>
        </a>
      </div>
      <p className="mt-2 text-right text-[11px] text-white/40">{chat.caption}</p>
    </div>
  );
}
