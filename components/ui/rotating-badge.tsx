import { Ear } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { id: string; text?: string; className?: string };

/**
 * Lime circular badge with text on a circular path, spinning 20s linear (DESIGN.md §6).
 * 80px mobile / 112px desktop by default; override size via className.
 */
export function RotatingBadge({ id, text = "ENT • ALLERGY • SILCHAR • ", className }: Props) {
  const pathId = `badge-path-${id}`;
  return (
    <div className={cn("relative grid size-20 place-items-center rounded-full bg-lime text-rust md:size-28", className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-spin-slow motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id={pathId} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-current font-heading text-[21px] font-semibold uppercase">
          <textPath href={`#${pathId}`} textLength={458} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">ENT, Allergy, Silchar</span>
      <Ear className="size-7 md:size-9" strokeWidth={1.5} aria-hidden />
    </div>
  );
}
