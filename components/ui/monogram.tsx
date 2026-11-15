import { cn } from "@/lib/utils";

/** "BD" brand mark: primary rounded square, accent letters (matches the favicon) */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-[12px] bg-primary font-heading text-[17px] font-semibold tracking-[-0.04em] text-accent",
        className,
      )}
    >
      BD
    </span>
  );
}
