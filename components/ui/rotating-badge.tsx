import { Ear } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { id: string; text?: string; className?: string; variant?: "filled" | "outline" };

/**
 * Accent circular badge with text on a circular path, spinning 20s linear (DESIGN.md §6).
 * 80px mobile / 112px desktop by default; override size via className.
 * `outline`: decorative text ring only (no fill, no icon, faint white text), always aria-hidden.
 */
export function RotatingBadge({ id, text = "ENT • ALLERGY • SILCHAR • ", className, variant = "filled" }: Props) {
  const pathId = `badge-path-${id}`;
  const outline = variant === "outline";
  return (
    <div
      aria-hidden={outline || undefined}
      className={cn(
        "relative grid size-20 place-items-center rounded-full md:size-28",
        outline ? "text-white/10" : "bg-accent text-primary",
        className,
      )}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-spin-slow motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={pathId} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        {outline && <circle cx="100" cy="100" r="96" className="fill-none stroke-current" strokeWidth="1" />}
        <text className="fill-current font-heading text-[21px] font-semibold uppercase">
          <textPath href={`#${pathId}`} textLength={458} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      {!outline && (
        <>
          <span className="sr-only">ENT, Allergy, Silchar</span>
          <Ear className="size-7 md:size-9" strokeWidth={1.5} aria-hidden />
        </>
      )}
    </div>
  );
}
