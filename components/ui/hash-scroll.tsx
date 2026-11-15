"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection, stripHash, takePendingSection } from "@/lib/section-scroll";

/**
 * Mounted once in the root layout (after the page, so the page's own effects run first).
 * - after a <SectionLink> navigation to another page: scrolls to the remembered section
 * - on a direct visit to a "#…" URL (shared link, no-JS link): scrolls there and removes the hash
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = takePendingSection();
    let fromHash: string | null = null;
    try {
      fromHash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : null;
    } catch {
      // malformed fragment (e.g. "#%E0"): treat as no hash
    }
    const id = pending ?? fromHash;
    stripHash();
    if (!id) return;
    // two frames: let Next finish its own scroll-to-top and the new page lay out first
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id, Boolean(fromHash && !pending))));
  }, [pathname]);

  return null;
}
