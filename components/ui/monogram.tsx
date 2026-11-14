import { cn } from "@/lib/utils";

/** "BD" brand mark: rust rounded square, lime letters (matches the favicon) */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-[12px] bg-rust font-heading text-[17px] font-semibold tracking-[-0.04em] text-lime",
        className,
      )}
    >
      BD
    </span>
  );
}
