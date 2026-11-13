/** Scroll to the hero booking card and put the cursor in the name field (client only) */
export function bookNow() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("home")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  document.getElementById("bk-name")?.focus({ preventScroll: true });
}
