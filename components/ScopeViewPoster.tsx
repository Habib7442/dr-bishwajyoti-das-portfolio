"use client";

import { useId, useRef } from "react";
import { motion, type Variants } from "motion/react";
import { ScopePhoto } from "@/components/ScopePhoto";
import type { ScopeView } from "@/data/scopeViews";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";

const circleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
};

/** "What the doctor sees" poster: a real scope photo cropped to a circle beside a short explanation (no labels on the photo). */
export function ScopeViewPoster({
  view,
  compact = false,
  headingLevel = "h2",
  preload = false,
}: {
  view: ScopeView;
  compact?: boolean;
  headingLevel?: "h1" | "h2" | "h3";
  /** the poster is above the fold (gallery detail page) */
  preload?: boolean;
}) {
  const titleId = `${useId()}-title`;
  const circleRef = useRef<HTMLDivElement>(null);
  const shown = useReveal(circleRef);
  const Heading = headingLevel;

  return (
    <section aria-labelledby={titleId}>
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[32px] bg-primary p-6 md:grid-cols-12 md:gap-12",
          compact ? "md:p-8" : "md:p-12 lg:p-16",
        )}
      >
        <div className="md:col-span-5">
          <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">What the doctor sees</p>
          <Heading
            id={titleId}
            className={cn(
              "mt-3 font-heading font-semibold tracking-[-0.02em] text-white",
              compact ? "text-[clamp(2rem,3vw,3rem)]" : "text-[clamp(2.5rem,4vw,4rem)]",
              // after the size class: cn/tailwind-merge drops a line-height that comes before a font-size
              "leading-[1.05]",
            )}
          >
            {view.title}
          </Heading>
          <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.6] text-white/80">{view.text}</p>
        </div>

        <div className="md:col-span-7">
          <motion.div
            ref={circleRef}
            variants={circleIn}
            initial="hidden"
            animate={shown ? "show" : "hidden"}
            className={cn(
              "relative mx-auto aspect-square w-full p-3",
              compact ? "max-w-[340px] md:max-w-[400px]" : "max-w-[340px] md:mr-0 md:ml-auto md:max-w-[520px]",
            )}
          >
            <ScopePhoto
              view={view}
              sizes={compact ? "(min-width: 768px) 400px, 340px" : "(min-width: 768px) 520px, 340px"}
              className="size-full"
              preload={preload}
            />
          </motion.div>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-ink/60">{view.caption}</p>
    </section>
  );
}
