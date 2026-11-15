import { cn } from "@/lib/utils";
import { isExternal } from "@/lib/site-helpers";

const variants = {
  /** primary on dark bands */
  accent: "bg-accent text-primary hover:bg-accent-dark focus-visible:outline-accent",
  /** primary on light bands */
  primary: "bg-primary text-white hover:bg-primary-dark",
  /** outline on dark bands */
  "outline-light": "border border-white/60 text-white hover:bg-white/10 focus-visible:outline-accent",
  /** outline on light bands */
  "outline-dark": "border border-primary text-primary hover:bg-primary/5",
};

type PillProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  "aria-label"?: string;
};

/** Rounded-full pill link (DESIGN.md §6 Buttons) */
export function Pill({ href, children, variant = "primary", className, ...rest }: PillProps) {
  return (
    <a
      href={href}
      {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[13px] font-medium transition duration-200 ease-out hover:-translate-y-px motion-reduce:hover:translate-y-0 [&_svg]:size-4",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
