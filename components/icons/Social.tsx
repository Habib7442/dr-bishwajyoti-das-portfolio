import type { SVGProps } from "react";

/** Single-stroke brand glyphs in Lucide's style (Lucide ships no brand icons). */
function Glyph({ strokeWidth = 1.5, children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const Facebook = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H7" />
  </Glyph>
);

export const Instagram = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5v.01" />
  </Glyph>
);

export const YouTube = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9l5 3-5 3z" />
  </Glyph>
);

export const Google = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M20.94 11A9 9 0 1 1 18.3 5.6" />
    <path d="M21 11h-9" />
  </Glyph>
);
