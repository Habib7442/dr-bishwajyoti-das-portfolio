/**
 * Section scrolling without "#" in the URL (client only).
 * Links are written as "#contact", "/#contact" or "/services#ear"; the hash is only used to find the
 * target, never left in the address bar.
 */

const PENDING_KEY = "section-scroll:pending";

/** "#contact" → { path: "/", id: "contact" }; "/services#ear" → { path: "/services", id: "ear" }; "/about" → no id */
export function parseSectionHref(href: string): { path: string; id?: string } {
  const [rawPath, id] = href.split("#");
  return { path: rawPath || "/", id: id || undefined };
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth-scroll to a section (instant with reduced motion). The fixed-navbar offset comes from html's scroll-padding-top. */
export function scrollToSection(id: string, instant = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: instant || reducedMotion() ? "auto" : "smooth", block: "start" });
  return true;
}

/** Remove "#…" from the address bar without a navigation */
export function stripHash() {
  if (!window.location.hash) return;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

/** Remember a section to scroll to after the next client-side navigation */
export function setPendingSection(id: string) {
  try {
    sessionStorage.setItem(PENDING_KEY, id);
  } catch {
    /* storage blocked: the page still opens, just at the top */
  }
}

export function takePendingSection(): string | null {
  try {
    const id = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    return id;
  } catch {
    return null;
  }
}

/**
 * Run `cb` once open dialogs (the mobile menu sheet) have closed, so its scroll lock
 * releasing doesn't cancel the scroll. Gives up waiting after 1s.
 */
export function afterDialogsClose(cb: () => void) {
  const start = performance.now();
  const tick = () => {
    if (!document.querySelector('[role="dialog"]') || performance.now() - start > 1000) requestAnimationFrame(cb);
    else requestAnimationFrame(tick);
  };
  tick();
}
