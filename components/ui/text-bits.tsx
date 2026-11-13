import { cn } from "@/lib/utils";
import { isTodo } from "@/lib/site-helpers";

/** Decorative ✳ accent */
export function Asterisk({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-block text-lime", className)}>
      ✳
    </span>
  );
}

/** Renders a site.ts value; anything still starting with TODO gets a visible striped outline */
export function Field({ value, className }: { value: string; className?: string }) {
  return <span className={cn(isTodo(value) && "todo", className)}>{value}</span>;
}
