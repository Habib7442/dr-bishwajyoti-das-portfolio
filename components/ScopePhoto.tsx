import Image from "next/image";
import type { ScopeView } from "@/data/scopeViews";
import { cn } from "@/lib/utils";

/** A scope photo cropped to a circle with the sky ring (used by the poster and the gallery cards). Never alters the photo itself. */
export function ScopePhoto({
  view,
  sizes,
  className,
  preload = false,
}: {
  view: ScopeView;
  sizes: string;
  className?: string;
  /** above-the-fold photo (it's the page's LCP) */
  preload?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-full ring-4 ring-accent ring-offset-8 ring-offset-primary", className)}>
      <Image
        src={view.image}
        alt={view.alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={80}
        className="object-cover"
        style={{
          objectPosition: `${view.focus.x}% ${view.focus.y}%`,
          transform: `rotate(${view.rotate ?? 0}deg) scale(${view.zoom ?? 1})`,
        }}
      />
    </div>
  );
}
