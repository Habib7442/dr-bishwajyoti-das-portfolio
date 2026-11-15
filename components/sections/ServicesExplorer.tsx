"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { serviceFilters, type ServiceFilterKey } from "@/data/site";
import { ease } from "@/lib/motion";
import { bookingPageHref } from "@/lib/scroll-to-booking";
import { cn } from "@/lib/utils";
import { Fallback, type ServiceRow } from "./ServicesMotion";
import { ServicesHelpCard, type ServicesHelp } from "./ServicesHelpCard";

export type { ServicesHelp };

type GridProps = { rows: ServiceRow[]; help: ServicesHelp; filterLabel: string };

const FILTER_PARAM = "type";
const isFilterKey = (v: string | null): v is ServiceFilterKey => serviceFilters.some((f) => f.key === v);

// help card fills whatever the last row leaves free (literal classes so Tailwind generates them)
const lgSpan = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3" } as const;
const mdSpan = { 1: "md:col-span-1", 2: "md:col-span-2" } as const;

const fade = { duration: 0.2, ease };

/**
 * Chips + cards. `active` comes from ?type=… (see ServicesFilterable); the Suspense fallback renders it with
 * "all" and no handler, so the prerendered HTML always lists every service.
 */
export function ServicesGrid({ rows, help, filterLabel, active = "all", onSelect }: GridProps & { active?: ServiceFilterKey; onSelect?: (key: ServiceFilterKey) => void }) {
  const problem = serviceFilters.find((f) => f.key === active)?.problem ?? null;
  const visible = problem ? rows.filter((r) => r.problem === problem) : rows;
  const lg = (visible.length % 3 === 0 ? 3 : 3 - (visible.length % 3)) as 1 | 2 | 3;
  const md = (visible.length % 2 === 0 ? 2 : 1) as 1 | 2;

  return (
    <>
      <div role="group" aria-label={filterLabel} className="mt-8 flex flex-wrap gap-2">
        {serviceFilters.map((f) => {
          const on = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect?.(f.key)}
              className={cn(
                "h-10 cursor-pointer rounded-full px-5 text-[13px] font-medium transition-colors",
                on ? "bg-primary text-white" : "border border-primary/15 bg-white text-primary hover:border-primary/40",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((s, i) => (
            <motion.article
              key={s.slug}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={fade}
              className="group relative flex flex-col rounded-[28px] bg-white p-6 md:p-8"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                {s.hasImage ? (
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <Fallback s={s} index={i} />
                )}
              </div>
              <h2 className="mt-6 font-heading text-[26px] leading-[1.15] font-medium tracking-[-0.01em] text-primary">
                {/* stretched link: the whole card (image + title) opens the detail page */}
                <Link
                  href={`/services/${s.slug}`}
                  className="rounded-sm after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-primary"
                >
                  {s.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[15px] leading-[1.65] text-ink/80">{s.short}</p>
              {/* above the stretched link, so it keeps its own action */}
              <Link
                href={bookingPageHref(s.problem)}
                aria-label={`Book an appointment for ${s.title}`}
                className="group/link relative z-10 mt-6 inline-flex h-11 items-center gap-1.5 self-start text-sm font-medium text-primary"
              >
                <span className="underline-offset-4 group-hover/link:underline">Book for this</span>
                <ArrowRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 transition-transform duration-200 ease-out group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-focus-visible/link:translate-x-0"
                />
              </Link>
            </motion.article>
          ))}

          {/* always last; spans the columns the last row leaves free */}
          <motion.aside
            key="help"
            layout
            transition={fade}
            aria-labelledby="services-help-title"
            className={cn("flex flex-col justify-center rounded-[28px] bg-primary p-8 lg:p-12", mdSpan[md], lgSpan[lg])}
          >
            {/* text + example chat side by side only when the card spans 2+ columns at lg */}
            <ServicesHelpCard help={help} wide={lg >= 2} />
          </motion.aside>
        </AnimatePresence>
      </div>
    </>
  );
}

/**
 * Reads/writes the filter in the URL (?type=ear) so a filtered list can be shared. Uses history.replaceState,
 * which Next syncs with useSearchParams: no server round-trip. Needs a <Suspense> parent (static prerender).
 */
export function ServicesFilterable(props: GridProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const raw = params.get(FILTER_PARAM);
  const active: ServiceFilterKey = isFilterKey(raw) ? raw : "all";

  const select = (key: ServiceFilterKey) => {
    const next = new URLSearchParams(params.toString());
    if (key === "all") next.delete(FILTER_PARAM);
    else next.set(FILTER_PARAM, key);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  return <ServicesGrid {...props} active={active} onSelect={select} />;
}
