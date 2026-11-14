"use client";

import { bookNow, type PrefillProblem } from "@/lib/scroll-to-booking";

/**
 * "Book for … →" link (Services, Who We Help): scrolls to the hero form, pre-selects the
 * matching problem chip and focuses the name field. A plain #home jump without JS.
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
    <a
      href="#home"
      aria-label={label}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        bookNow(problem);
      }}
    >
      {children}
    </a>
  );
}
