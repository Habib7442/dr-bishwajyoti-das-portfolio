"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

// false until the first page has mounted in this browser tab. The server render and the first client
// render use initial={false}, so the prerendered page is never hidden behind opacity 0 (LCP, no-JS).
let navigated = false;

/**
 * Remounts on every page change (Next templates are keyed per segment): the new page's content fades in
 * and rises 12px. No exit animation. Reduced motion: MotionConfig reducedMotion="user" drops the rise.
 * Scrolling: Next scrolls to the top; <HashScroll /> handles "#section" targets.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const animate = navigated;

  useEffect(() => {
    navigated = true;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
