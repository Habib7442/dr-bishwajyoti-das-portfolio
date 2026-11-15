import { cn } from "@/lib/utils";

/** Skeleton block: faint navy tint + shimmer sweep (static with reduced motion) */
function Block({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-xl bg-primary/8", className)} />;
}

/** Shared wrapper: invisible for 250ms (fast loads never flash it), announced once as "Loading…" */
function Skeleton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    // data-route-loader: RouteProgress keeps the top bar running until this fallback is gone
    <div data-route-loader role="status" aria-live="polite" className={cn("min-h-[70svh] animate-loader-in", className)}>
      <span className="sr-only">Loading…</span>
      <div aria-hidden className="mx-auto max-w-[1200px] px-6 lg:px-16">
        {children}
      </div>
    </div>
  );
}

/** /services: title bar + 4 rows (title bar, thumbnail block on the right) with dividers */
export function ServicesSkeleton() {
  return (
    <Skeleton className="bg-base pt-36 pb-24">
      <Block className="h-3 w-28" />
      <Block className="mt-6 h-14 w-[min(420px,80%)] md:h-16" />
      <Block className="mt-6 h-4 w-[min(360px,90%)]" />
      <ul className="mt-12 md:mt-16">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center justify-between gap-6 border-t border-primary/10 py-6 md:py-8">
            <Block className={cn("h-8 md:h-10", ["w-[60%]", "w-[45%]", "w-[55%]", "w-[40%]"][i])} />
            <Block className="h-14 w-24 shrink-0 rounded-2xl md:h-[72px] md:w-[140px]" />
          </li>
        ))}
      </ul>
    </Skeleton>
  );
}

/** /reviews: title + 3 card outlines in a row */
export function ReviewsSkeleton() {
  return (
    <Skeleton className="bg-primary pt-36 pb-24">
      <div className="[&_.skeleton-shimmer]:bg-white/10">
        <Block className="h-3 w-32" />
        <Block className="mt-4 h-14 w-[min(440px,85%)] md:h-16" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-[24px] border border-white/15 p-6 md:p-8">
              <Block className="h-6 w-16 rounded-full" />
              <Block className="mt-6 h-4 w-full" />
              <Block className="mt-3 h-4 w-[90%]" />
              <Block className="mt-3 h-4 w-[70%]" />
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <Block className="h-4 w-24" />
                <Block className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Skeleton>
  );
}
