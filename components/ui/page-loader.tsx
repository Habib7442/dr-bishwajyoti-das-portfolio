import { Ear } from "lucide-react";

// three arcs to the right of the ear, growing outward (24×24 grid)
const WAVES = ["M4 9a4 4 0 0 1 0 6", "M8 6.5a7.5 7.5 0 0 1 0 11", "M12 4a11 11 0 0 1 0 16"];

/**
 * Branded page loader for loading.tsx: ear line icon + sky sound waves pulsing outward.
 * CSS-only (server component). Invisible for the first 250ms (animate-loader-in), so fast loads never flash it.
 * Reduced motion: waves shown static.
 */
export function PageLoader() {
  return (
    // data-route-loader: RouteProgress keeps the top bar running until this fallback is gone
    <div data-route-loader role="status" aria-live="polite" className="grid min-h-[70svh] animate-loader-in place-items-center bg-base px-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center" aria-hidden>
          <Ear className="size-14 text-primary" strokeWidth={2} />
          <svg viewBox="0 0 24 24" className="-ml-1 size-14 overflow-visible" fill="none">
            {WAVES.map((d, i) => (
              <path
                key={d}
                d={d}
                className="origin-left animate-wave stroke-accent [transform-box:fill-box] motion-reduce:animate-none motion-reduce:opacity-60"
                style={{ animationDelay: `${i * 0.2}s` }}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>
        <p className="mt-4 text-[13px] text-ink/60">Loading…</p>
      </div>
    </div>
  );
}
