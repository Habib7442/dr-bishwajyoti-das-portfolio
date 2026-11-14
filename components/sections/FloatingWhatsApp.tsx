"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { bookingHref, isExternal, whatsappNumber } from "@/lib/site-helpers";
import { ease } from "@/lib/motion";

/**
 * Phones only (below md): lime WhatsApp button, bottom-right.
 * Hidden while the hero (and its booking card) is on screen; slides + fades in once you've scrolled past it.
 * Hidden again while the lime CTA band (#book) or the footer is on screen, so it never covers them.
 *
 * Observes the whole hero, not the card: the hero is always intersecting on load, so leaving it always fires a
 * callback. The card can start below the fold, and a fast fling / anchor jump past it never changes its
 * intersection state, so observing the card alone could leave the button hidden.
 */
export function FloatingWhatsApp() {
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const show = pastHero && !atEnd;

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const heroIo = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    heroIo.observe(hero);

    const ends = ["book", "site-footer"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Set<Element>();
    const endIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setAtEnd(visible.size > 0);
    });
    ends.forEach((el) => endIo.observe(el));

    return () => {
      heroIo.disconnect();
      endIo.disconnect();
    };
  }, []);

  const label = whatsappNumber ? "Book on WhatsApp" : "Book online";

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="fab"
          href={bookingHref}
          {...(isExternal(bookingHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease }}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full bg-lime text-rust ring-4 ring-rust/10 transition-colors hover:bg-lime-dark md:hidden"
        >
          <WhatsApp className="size-[26px]" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
