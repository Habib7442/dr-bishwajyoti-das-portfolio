import { cn } from "@/lib/utils";

type Token = "base" | "section" | "primary" | "soft" | "accent";

// literal class names so Tailwind generates them
const fill: Record<Token, string> = {
  base: "fill-base",
  section: "fill-section",
  primary: "fill-primary",
  soft: "fill-soft",
  accent: "fill-accent",
};

/**
 * Full-width band transition: the `top` colour bulges down into the `bottom` colour as one large
 * smooth ellipse. The bulge's lowest point is the exact bottom centre of the SVG, so whatever sits
 * below in `bottom`'s colour joins it with no seam.
 */
export function CurveDivider({ top, bottom, className }: { top: Token; bottom: Token; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      className={cn("block h-[clamp(120px,16vw,240px)] w-full", className)}
    >
      <rect width="1440" height="240" className={fill[bottom]} />
      {/* half-ellipse: full width at the top edge, lowest point at (720, 240) */}
      <path d="M0 0 H1440 V0 C1440 132.5 1117.6 240 720 240 C322.4 240 0 132.5 0 0 Z" className={fill[top]} />
    </svg>
  );
}
