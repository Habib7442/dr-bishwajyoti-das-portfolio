"use client";

import { useEffect, useState, type RefObject } from "react";
import { MotionGlobalConfig, useInView } from "motion/react";
import { REVEAL_FALLBACK_MS, VIEWPORT } from "@/lib/motion";

/* ── Page-wide 2.5s fallback ──────────────────────────────────
 * One timer for the whole page, measured from page load (performance.now() = ms since navigation
 * start). When it fires, every element not yet revealed is revealed INSTANTLY (no duration, no
 * delay), so a full-page screenshot a moment later shows final states, not half-played animations.
 * Animations already running on screen are not touched.
 */
const listeners = new Set<() => void>();
let fallbackFired = false;
let fallbackTimer: number | undefined;

function fireFallback() {
  fallbackFired = true;
  if (!listeners.size) return;
  const root = document.documentElement;
  MotionGlobalConfig.instantAnimations = true; // motion: jump to final values, skip delays
  root.dataset.revealInstant = ""; // CSS: no transitions (see globals.css)
  listeners.forEach((reveal) => reveal());
  // long enough for React to re-render and motion to start (and finish) the snapped animations
  window.setTimeout(() => {
    MotionGlobalConfig.instantAnimations = false;
    delete root.dataset.revealInstant;
  }, 300);
}

function onFallback(reveal: () => void) {
  if (fallbackFired) {
    reveal();
    return () => {};
  }
  listeners.add(reveal);
  fallbackTimer ??= window.setTimeout(fireFallback, Math.max(0, REVEAL_FALLBACK_MS - performance.now()));
  return () => {
    listeners.delete(reveal);
  };
}

/**
 * Scroll-reveal trigger that can't get stuck at opacity 0.
 *
 * `whileInView` alone misses elements that a fast scroll or an anchor jump carries past the
 * viewport between two IntersectionObserver checks, and elements that start with zero visible
 * area (clip-path inset(100%), scaleX 0). This returns true (once) when ANY of:
 *  - IntersectionObserver sees `VIEWPORT.amount` (10%) of the element,
 *  - the element's top edge is above 90% of the viewport height, i.e. it has been reached or
 *    passed (checked on mount, scroll and resize),
 *  - the page-wide fallback fires REVEAL_FALLBACK_MS (2.5s) after page load (instant reveal).
 */
export function useReveal(ref: RefObject<Element | null>) {
  const inView = useInView(ref, VIEWPORT);
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (reached || inView) return;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) setReached(true);
      });
    };
    check();
    const stopFallback = onFallback(() => setReached(true));
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      stopFallback();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reached, inView, ref]);

  return inView || reached;
}
