"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Fired by code that navigates without a plain link click (e.g. SectionLink's router.push) */
export const ROUTE_PROGRESS_START = "route-progress:start";
export const startRouteProgress = () => window.dispatchEvent(new Event(ROUTE_PROGRESS_START));
/** Fired by a link whose click turned out NOT to navigate (in-page booking scroll on the home page) */
export const ROUTE_PROGRESS_CANCEL = "route-progress:cancel";
export const cancelRouteProgress = () => window.dispatchEvent(new Event(ROUTE_PROGRESS_CANCEL));

const SHOW_DELAY = 150; // fast navigations never show the bar
const SAFETY = 10_000; // auto-finish if the route never changes
const FADE = 300;

/**
 * Internal link to another page (or other search params)? Hash-only changes count as the same page.
 * Runs in the capture phase, before next/link's own handler calls preventDefault() to route client-side,
 * so defaultPrevented can't be used here; links that only scroll in-page send cancelRouteProgress() instead.
 */
function isPageChange(a: HTMLAnchorElement, e: MouseEvent) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false; // external, wa.me, maps…; tel:/mailto: have no matching origin
  return url.pathname !== location.pathname || url.search !== location.search;
}

/**
 * Thin sky bar at the very top on every page change (mounted once in the root layout, inside <Suspense>
 * because of useSearchParams). Starts on internal link clicks and back/forward; finishes when the route has
 * changed and no loading.tsx fallback ([data-route-loader]: PageLoader / skeletons) is left on screen.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const reduce = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [announce, setAnnounce] = useState("");

  const active = useRef(false);
  const timers = useRef<number[]>([]);
  const tick = useRef<number | undefined>(undefined);
  const shown = useRef(false);
  const lastPath = useRef(pathname);

  const clearAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    window.clearInterval(tick.current);
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    clearAll();
    setAnnounce("");
    if (!shown.current) return; // finished before the show delay: nothing was ever visible
    shown.current = false;
    setProgress(100);
    later(() => setFading(true), 120);
    later(() => {
      setVisible(false);
      setFading(false);
      setProgress(0);
    }, 120 + FADE);
  }, []);

  /** the click didn't navigate after all: drop the pending/visible bar without the 100% finish */
  const cancel = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    shown.current = false;
    clearAll();
    setAnnounce("");
    setVisible(false);
    setFading(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (active.current) return;
    clearAll(); // also drops a previous finish's pending hide, so reset the bar here
    active.current = true;
    shown.current = false;
    setVisible(false);
    setProgress(0);
    setFading(false);
    later(() => {
      shown.current = true;
      setVisible(true);
      setAnnounce("Loading page");
      setProgress(20);
      // creep toward 85%, slowing down as it gets closer
      tick.current = window.setInterval(() => setProgress((p) => p + (85 - p) * 0.08), 200);
    }, SHOW_DELAY);
    later(finish, SAFETY);
  }, [finish]);

  // finish once the route (path or search params) has changed AND the new page has replaced its loading.tsx
  // fallback. With loading.tsx, Next switches the URL immediately and streams the page in afterwards, so the
  // URL change alone would end the bar before anything has loaded.
  useEffect(() => {
    lastPath.current = pathname;
    const loading = () => document.querySelector("[data-route-loader]") !== null;
    if (!loading()) {
      finish();
      return;
    }
    const mo = new MutationObserver(() => {
      if (!loading()) {
        mo.disconnect();
        finish();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [pathname, search, finish]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (a instanceof HTMLAnchorElement && isPageChange(a, e)) start();
    };
    // back/forward: the URL has already changed when popstate fires
    const onPop = () => {
      if (location.pathname !== lastPath.current) start();
    };
    // capture phase: see the click before next/link (and React) handle it
    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener(ROUTE_PROGRESS_START, start);
    window.addEventListener(ROUTE_PROGRESS_CANCEL, cancel);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener(ROUTE_PROGRESS_START, start);
      window.removeEventListener(ROUTE_PROGRESS_CANCEL, cancel);
      clearAll();
    };
  }, [start, cancel]);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-300",
          visible && !fading ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={cn("relative h-full bg-accent", !reduce && "transition-[width] duration-200 ease-out")}
          style={{ width: reduce ? (visible ? "100%" : "0%") : `${progress}%` }}
        >
          {/* leading edge: soft 2px navy glow (blur only, no spread, so it doesn't read as a box) */}
          <span className="absolute top-0 right-0 h-full w-2 rounded-full shadow-[0_0_2px_var(--color-primary)]" />
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </>
  );
}
