import { cn } from "@/lib/utils";
import { isExternal } from "@/lib/site-helpers";

const variants = {
  /** primary on dark bands */
  lime: "bg-lime text-rust hover:bg-lime-dark focus-visible:outline-lime",
  /** primary on light bands */
  rust: "bg-rust text-white hover:bg-rust-dark",
  /** outline on dark bands */
  "outline-light": "border border-white/60 text-white hover:bg-white/10 focus-visible:outline-lime",
  /** outline on light bands */
  "outline-dark": "border border-rust text-rust hover:bg-rust/5",
};

type PillProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  "aria-label"?: string;
};

/** Rounded-full pill link (DESIGN.md §6 Buttons) */
export function Pill({ href, children, variant = "rust", className, ...rest }: PillProps) {
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
