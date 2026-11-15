"use client";

import Link from "next/link";
import { bookNow, bookingPageHref, isPlainClick, type PrefillProblem } from "@/lib/scroll-to-booking";
import { cancelRouteProgress } from "@/components/ui/route-progress";

/**
 * "Book for … →" link (Services, Who We Help). On a page with the booking form (home): scrolls to it,
 * pre-selects the matching problem chip and focuses the name field, URL unchanged.
 * Elsewhere: next/link to /book?problem=…
 */
export function BookForLink({
  problem,
  className,
  label,
  children,
}: {
  problem: PrefillProblem;
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={bookingPageHref(problem)}
      aria-label={label}
      className={className}
      onClick={(e) => {
        if (isPlainClick(e) && bookNow(problem)) {
          e.preventDefault();
          cancelRouteProgress(); // scrolled to the form on this page: no page change
        }
      }}
    >
      {children}
    </Link>
  );
}
